// Backend-agnostic renderer seam. The engine feeds a plain RenderInputs object;
// the concrete backend (WebGL2 now, WebGPU later) owns its pipeline. pickBackend
// probes capabilities and instantiates the best available renderer.
import type { FractalScene } from '../app/scene';
import type { CosinePalette } from '../color/palette';
import type { LineMesh } from '../fractals/lsystem';
import type { PointCloud } from '../fractals/ifs';
import type { Vec2 } from '../util/math';
import { Webgl2Renderer } from './webgl2/webgl2-renderer';

export type BackendKind = 'webgpu' | 'webgl2' | 'none';

export interface RenderInputs {
  scene: FractalScene;
  /** Canvas backing-store size in physical pixels. */
  width: number;
  height: number;
  /** Internal escape-field resolution factor (0..1). */
  fieldScale: number;
  /** Resolved palette coefficients (preset or live-edited). */
  palette: CosinePalette;
  /** coloring.phase + animated paletteShift. */
  phase: number;
  juliaC: Vec2;
  lightDir: Vec2;
  /** Escape: recompute the cached field. Points: re-run accumulation. */
  geometryDirty: boolean;
}

export interface Renderer {
  readonly kind: BackendKind;
  resize(width: number, height: number): void;
  setLineGeometry(mesh: LineMesh): void;
  setPointGeometry(cloud: PointCloud): void;
  render(inputs: RenderInputs): void;
  /** True when float render targets are available (enables the cheap two-pass cache). */
  readonly floatTargets: boolean;
  dispose(): void;
}

export interface BackendResult {
  kind: BackendKind;
  renderer: Renderer | null;
  /** Human-readable note for the HUD (e.g. fallback reason). */
  note: string;
}

/**
 * Select a rendering backend. WebGPU is the preferred path where available, but
 * WebGL2 is the load-bearing universal fallback. (The WebGPU backend is a later
 * phase; today this resolves to WebGL2, with the seam ready for WebGPU.)
 */
export const pickBackend = (canvas: HTMLCanvasElement): BackendResult => {
  // WebGPU backend not yet implemented — seam reserved for Phase 7.
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  });
  if (gl) {
    const renderer = new Webgl2Renderer(gl);
    return {
      kind: 'webgl2',
      renderer,
      note: renderer.floatTargets ? 'WebGL2' : 'WebGL2 (no float cache)',
    };
  }
  return { kind: 'none', renderer: null, note: 'WebGL2 unavailable' };
};
