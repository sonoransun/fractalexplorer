// Maps each fractal kind to its render mode (which subsystem draws it) plus
// display metadata for the UI selector. The engine dispatches on `mode`.
import type { FractalKind, RenderMode } from '../app/scene';

export interface FractalMeta {
  kind: FractalKind;
  name: string;
  mode: RenderMode;
  group: 'Escape-time' | 'L-system' | 'IFS';
}

export const FRACTALS: FractalMeta[] = [
  { kind: 'mandelbrot', name: 'Mandelbrot', mode: 'escape', group: 'Escape-time' },
  { kind: 'julia', name: 'Julia', mode: 'escape', group: 'Escape-time' },
  { kind: 'multibrot', name: 'Multibrot', mode: 'escape', group: 'Escape-time' },
  { kind: 'koch', name: 'Koch curve', mode: 'lines', group: 'L-system' },
  { kind: 'snowflake', name: 'Koch snowflake', mode: 'lines', group: 'L-system' },
  { kind: 'sierpinski', name: 'Sierpinski arrowhead', mode: 'lines', group: 'L-system' },
  { kind: 'dragon', name: 'Dragon curve', mode: 'lines', group: 'L-system' },
  { kind: 'hilbert', name: 'Hilbert curve', mode: 'lines', group: 'L-system' },
  { kind: 'plant', name: 'Fractal plant', mode: 'lines', group: 'L-system' },
  { kind: 'fern', name: 'Barnsley fern', mode: 'points', group: 'IFS' },
  { kind: 'sierpinski-ifs', name: 'Sierpinski (points)', mode: 'points', group: 'IFS' },
];

export const META_BY_KIND: Record<FractalKind, FractalMeta> = Object.fromEntries(
  FRACTALS.map((m) => [m.kind, m]),
) as Record<FractalKind, FractalMeta>;

export const modeOf = (kind: FractalKind): RenderMode => META_BY_KIND[kind].mode;
