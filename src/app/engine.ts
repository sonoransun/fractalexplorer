// The engine ties the scene, renderer, and clock together. It owns the dirty
// model (the heart of cheap animation: color/palette changes never recompute the
// field), regenerates geometry on fractal-kind changes, and runs the adaptive
// performance loop (interactive render-scale + FPS governor).
import { type FractalScene, type FractalKind, cloneScene } from './scene';
import { Clock } from './clock';
import { Cinematic } from './cinematic';
import { worldHeight } from './camera';
import { modeOf } from '../fractals/registry';
import { lineMeshFor } from '../fractals/lsystem-presets';
import { IFS_PRESETS, chaosGame } from '../fractals/ifs';
import { PRESET_BY_ID, defaultPalette, type CosinePalette } from '../color/palette';
import { pickBackend, type Renderer, type RenderInputs, type BackendKind } from '../render/renderer';

export const MAX_ZOOM = 20; // f32 soft precision cap (~1e6 magnification)
const POINT_COUNT = 300_000;
const INTERACT_SCALE = 0.45;
const IDLE_DEBOUNCE = 0.15; // seconds of no input before refining to full res

const resolvePalette = (s: FractalScene): CosinePalette =>
  s.coloring.custom ?? (PRESET_BY_ID[s.coloring.paletteId] ?? defaultPalette()).palette;

export class Engine {
  scene: FractalScene;
  readonly clock = new Clock();
  private cinematic = new Cinematic();
  readonly backend: BackendKind;
  readonly backendNote: string;

  private renderer: Renderer | null;
  private canvas: HTMLCanvasElement;
  private backingW = 1;
  private backingH = 1;

  private geometryDirty = true;
  private lastInputT = -1e9;
  private nowSec = 0;
  private interacting = false;
  private renderScale = 1;
  private idleScaleCap = 1;
  private emaFrameMs = 16;
  private lineDepths = new Map<FractalKind, number>();

  constructor(canvas: HTMLCanvasElement, scene: FractalScene) {
    this.canvas = canvas;
    this.scene = scene;
    const picked = pickBackend(canvas);
    this.renderer = picked.renderer;
    this.backend = picked.kind;
    this.backendNote = picked.note;
    if (this.renderer) this.loadGeometryFor(scene.kind);
  }

  get ok(): boolean {
    return this.renderer !== null;
  }
  get floatTargets(): boolean {
    return this.renderer?.floatTargets ?? false;
  }

  // ---- sizing --------------------------------------------------------------
  resize(cssW: number, cssH: number, dpr: number): void {
    const cap = this.scene.quality.dprCap;
    const d = Math.min(dpr, cap);
    this.backingW = Math.max(1, Math.round(cssW * d));
    this.backingH = Math.max(1, Math.round(cssH * d));
    this.canvas.width = this.backingW;
    this.canvas.height = this.backingH;
    this.renderer?.resize(this.backingW, this.backingH);
    this.geometryDirty = true;
  }

  // ---- dirty / geometry ----------------------------------------------------
  /** Escape field / point accumulation must recompute (camera or escape params changed). */
  markFieldDirty(): void {
    this.geometryDirty = true;
  }

  notifyInteraction(): void {
    this.lastInputT = this.nowSec;
    this.geometryDirty = true;
    this.cinematic.stop(); // any pan/zoom/pinch hands control to the user
  }

  setKind(kind: FractalKind): void {
    this.cinematic.stop();
    this.scene.kind = kind;
    this.resetCameraFor(kind);
    this.loadGeometryFor(kind);
    this.geometryDirty = true;
  }

  /** Reset the camera to the framing default for the current fractal kind. */
  resetView(): void {
    this.resetCameraFor(this.scene.kind);
    this.geometryDirty = true;
  }

  /** Replace the whole scene (e.g. from a pasted deep-link) without resetting the camera. */
  adoptScene(scene: FractalScene): void {
    this.cinematic.stop();
    this.scene = scene;
    this.loadGeometryFor(scene.kind);
    this.geometryDirty = true;
  }

  /** Begin the cinematic auto-tour (continuous loop through curated Mandelbrot locations). */
  startTour(): void {
    if (this.scene.kind !== 'mandelbrot') this.setKind('mandelbrot');
    this.cinematic.start(this.scene.camera);
    this.geometryDirty = true;
  }
  stopTour(): void {
    this.cinematic.stop();
  }
  get tourActive(): boolean {
    return this.cinematic.active;
  }

  setLineDepth(kind: FractalKind, depth: number): void {
    this.lineDepths.set(kind, depth);
    if (this.scene.kind === kind) this.loadGeometryFor(kind);
    this.geometryDirty = true;
  }

  lineDepth(kind: FractalKind): number | undefined {
    return this.lineDepths.get(kind);
  }

  private loadGeometryFor(kind: FractalKind): void {
    if (!this.renderer) return;
    const mode = modeOf(kind);
    if (mode === 'lines') {
      this.renderer.setLineGeometry(lineMeshFor(kind, this.lineDepths.get(kind)));
    } else if (mode === 'points') {
      const def = IFS_PRESETS[kind];
      if (def) this.renderer.setPointGeometry(chaosGame(def, POINT_COUNT));
    }
  }

  private resetCameraFor(kind: FractalKind): void {
    const cam = this.scene.camera;
    cam.rotation = 0;
    switch (kind) {
      case 'mandelbrot':
        cam.centerX = -0.6;
        cam.centerY = 0;
        cam.zoomLevel = 0;
        break;
      case 'julia':
      case 'multibrot':
        cam.centerX = 0;
        cam.centerY = 0;
        cam.zoomLevel = -0.15;
        break;
      default: // lines / points are normalized around the origin
        cam.centerX = 0;
        cam.centerY = 0;
        cam.zoomLevel = -0.1;
    }
  }

  // ---- per-frame -----------------------------------------------------------
  /** Called once per rendered frame before advancing the simulation. */
  beginFrame(nowSec: number, frameMs: number): void {
    this.nowSec = nowSec;
    this.emaFrameMs += (frameMs - this.emaFrameMs) * 0.1;

    // The tour moves the camera every frame, so treat it like interaction:
    // render at the lower interactive resolution to keep the dive fluid.
    this.interacting = nowSec - this.lastInputT < IDLE_DEBOUNCE || this.cinematic.active;

    // FPS governor: nudge the idle resolution cap toward the frame-time target.
    if (!this.interacting) {
      if (this.emaFrameMs > 22 && this.idleScaleCap > 0.5) this.idleScaleCap = Math.max(0.5, this.idleScaleCap - 0.08);
      else if (this.emaFrameMs < 12 && this.idleScaleCap < 1) this.idleScaleCap = Math.min(1, this.idleScaleCap + 0.04);
    }

    const desired = this.interacting ? Math.min(INTERACT_SCALE, this.idleScaleCap) : this.idleScaleCap;
    if (Math.abs(desired - this.renderScale) > 1e-3) {
      this.renderScale = desired;
      this.geometryDirty = true; // resolution change -> field recompute
    }

    // Julia c-orbit reorganizes the whole set, so the field must recompute each frame.
    if (this.scene.kind === 'julia' && this.scene.anim.juliaOrbit && this.scene.anim.motionScale > 0) {
      this.geometryDirty = true;
    }
  }

  advance(stepSec: number): void {
    this.clock.advance(stepSec, this.scene);
    if (this.cinematic.active && this.scene.anim.motionScale > 0 && this.scene.kind === 'mandelbrot') {
      this.cinematic.update(stepSec, this.scene.camera);
      this.geometryDirty = true;
    }
  }

  render(): void {
    if (!this.renderer) return;
    const inputs: RenderInputs = {
      scene: this.scene,
      width: this.backingW,
      height: this.backingH,
      fieldScale: this.renderScale,
      palette: resolvePalette(this.scene),
      phase: this.scene.coloring.phase + this.clock.paletteShift,
      juliaC: this.clock.juliaC(this.scene),
      lightDir: this.clock.lightDir(this.scene),
      geometryDirty: this.geometryDirty,
    };
    this.renderer.render(inputs);
    this.geometryDirty = false;
  }

  // ---- HUD readouts --------------------------------------------------------
  get fps(): number {
    return this.emaFrameMs > 0 ? 1000 / this.emaFrameMs : 0;
  }
  get magnification(): number {
    return Math.pow(2, this.scene.camera.zoomLevel);
  }
  get precisionWarn(): boolean {
    return this.scene.camera.zoomLevel > 16;
  }
  get worldHeightNow(): number {
    return worldHeight(this.scene.camera);
  }
  get backingSize(): [number, number] {
    return [this.backingW, this.backingH];
  }

  snapshot(): FractalScene {
    return cloneScene(this.scene);
  }

  dispose(): void {
    this.renderer?.dispose();
  }
}
