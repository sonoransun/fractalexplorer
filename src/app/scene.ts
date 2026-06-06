// FractalScene is the single source of truth for everything that affects a
// rendered frame. The UI store, URL-hash codec, and both renderer backends all
// read/write this one object. Keep it plain-data and serializable.
import type { CosinePalette, RGB } from '../color/palette';
import type { Vec2 } from '../util/math';

export type FractalKind =
  | 'mandelbrot'
  | 'julia'
  | 'multibrot'
  | 'koch'
  | 'snowflake'
  | 'sierpinski'
  | 'dragon'
  | 'hilbert'
  | 'plant'
  | 'fern'
  | 'sierpinski-ifs';

/** How a fractal kind is rendered. Drives render-graph dispatch in the engine. */
export type RenderMode = 'escape' | 'lines' | 'points';

export type DensityRemap = 'sqrt' | 'log' | 'linear';
export type TrapKind = 'none' | 'stalk' | 'point' | 'circle';

export interface CameraState {
  centerX: number;
  centerY: number;
  /** log2 magnification. worldHeight = BASE_SPAN / 2^zoomLevel. */
  zoomLevel: number;
  rotation: number;
}

export interface EscapeParams {
  maxIter: number;
  /** 2 = Mandelbrot/Julia (fast squaring path); other values = Multibrot via cpow. */
  power: number;
  /** Julia constant c. */
  juliaC: Vec2;
  /** Escape radius; >= 256 for accurate smooth coloring. Stored as the radius, not squared. */
  bailout: number;
}

export interface ColoringState {
  paletteId: string;
  /** When set, overrides the preset coefficients (live-edited palette). */
  custom: CosinePalette | null;
  /** Palette repeats across the value range. */
  cycles: number;
  remap: DensityRemap;
  /** Static phase offset (animation adds to this). */
  phase: number;
  /** DE-based Lambert lighting mix, 0..1. */
  shade: number;
  /** Exterior glow intensity. */
  glow: number;
  /** Bloom add-back, ~0..0.2. */
  bloom: number;
  trap: TrapKind;
  interior: RGB;
}

export interface AnimationState {
  /** Palette cycling speed, cycles/second. */
  cycleSpeed: number;
  /** Global motion multiplier 0..1 (reduced-motion forces toward 0). */
  motionScale: number;
  /** Animate Julia c along a Lissajous orbit near the Mandelbrot boundary. */
  juliaOrbit: boolean;
  orbitSpeed: number;
  /** Animate an embossing light direction. */
  lightOrbit: boolean;
}

export interface QualityState {
  /** Internal render resolution factor (interaction drops this; idle ramps to 1). */
  renderScale: number;
  /** Device-pixel-ratio cap. */
  dprCap: number;
}

export interface FractalScene {
  kind: FractalKind;
  camera: CameraState;
  escape: EscapeParams;
  coloring: ColoringState;
  anim: AnimationState;
  quality: QualityState;
}

/** Vertical world-height span at zoomLevel 0. */
export const BASE_SPAN = 2.8;

export const defaultScene = (): FractalScene => ({
  kind: 'mandelbrot',
  camera: { centerX: -0.6, centerY: 0, zoomLevel: 0, rotation: 0 },
  escape: { maxIter: 256, power: 2, juliaC: [-0.8, 0.156], bailout: 256 },
  coloring: {
    paletteId: 'ember',
    custom: null,
    cycles: 3,
    remap: 'sqrt',
    phase: 0,
    shade: 0.35,
    glow: 0.0,
    bloom: 0.06,
    trap: 'none',
    interior: [0, 0, 0],
  },
  anim: {
    cycleSpeed: 0.08,
    motionScale: 1,
    juliaOrbit: false,
    orbitSpeed: 0.15,
    lightOrbit: true,
  },
  quality: { renderScale: 1, dprCap: 2 },
});

/** Structured-clone-equivalent deep copy (plain data only). */
export const cloneScene = (s: FractalScene): FractalScene => ({
  kind: s.kind,
  camera: { ...s.camera },
  escape: { ...s.escape, juliaC: [...s.escape.juliaC] as Vec2 },
  coloring: { ...s.coloring, custom: s.coloring.custom ? { ...s.coloring.custom } : null, interior: [...s.coloring.interior] as RGB },
  anim: { ...s.anim },
  quality: { ...s.quality },
});
