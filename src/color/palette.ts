// Inigo Quilez cosine palettes: color(t) = a + b * cos(2π·(c·t + d)), per RGB channel.
//   a = DC/center color, b = amplitude (contrast), c = frequency, d = phase.
// Coefficients are LINEAR-light amplitudes (the shader applies sRGB at output).
// Keep `c` integer so fract(t) cycling has no seam.
//
// Reference: https://iquilezles.org/articles/palettes/
import { TAU } from '../util/math';

export type RGB = [number, number, number];

export interface CosinePalette {
  a: RGB;
  b: RGB;
  c: RGB;
  d: RGB;
}

export interface PalettePreset {
  id: string;
  name: string;
  palette: CosinePalette;
}

/** Evaluate a cosine palette at t (CPU side — for swatch previews and LUT baking). */
export const evalPalette = (p: CosinePalette, t: number): RGB => {
  const out = [0, 0, 0] as RGB;
  for (let i = 0; i < 3; i++) {
    out[i] = p.a[i] + p.b[i] * Math.cos(TAU * (p.c[i] * t + p.d[i]));
  }
  return out;
};

// Curated presets. The first batch are IQ's canonical sets; the rest are tuned
// for fractal exteriors (deep, saturated, high dynamic range in the bright tail).
export const PALETTE_PRESETS: PalettePreset[] = [
  {
    id: 'rainbow',
    name: 'Rainbow',
    palette: { a: [0.5, 0.5, 0.5], b: [0.5, 0.5, 0.5], c: [1, 1, 1], d: [0.0, 0.33, 0.67] },
  },
  {
    id: 'ember',
    name: 'Ember',
    palette: { a: [0.5, 0.5, 0.5], b: [0.5, 0.5, 0.5], c: [1, 1, 1], d: [0.0, 0.1, 0.2] },
  },
  {
    id: 'ice',
    name: 'Ice',
    palette: { a: [0.5, 0.5, 0.5], b: [0.5, 0.5, 0.5], c: [1, 1, 0.5], d: [0.8, 0.9, 0.3] },
  },
  {
    id: 'gold',
    name: 'Gold',
    palette: { a: [0.5, 0.5, 0.5], b: [0.5, 0.5, 0.5], c: [1, 0.7, 0.4], d: [0.0, 0.15, 0.2] },
  },
  {
    id: 'candy',
    name: 'Candy',
    palette: { a: [0.5, 0.5, 0.5], b: [0.5, 0.5, 0.5], c: [2, 1, 0], d: [0.5, 0.2, 0.25] },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    palette: { a: [0.5, 0.5, 0.5], b: [0.5, 0.5, 0.5], c: [1, 1, 1], d: [0.3, 0.2, 0.2] },
  },
  {
    id: 'magma',
    name: 'Magma',
    palette: { a: [0.8, 0.5, 0.4], b: [0.2, 0.4, 0.2], c: [2, 1, 1], d: [0.0, 0.25, 0.25] },
  },
  {
    id: 'twilight',
    name: 'Twilight',
    palette: { a: [0.5, 0.5, 0.55], b: [0.45, 0.4, 0.5], c: [1, 1, 2], d: [0.6, 0.55, 0.35] },
  },
];

export const PRESET_BY_ID: Record<string, PalettePreset> = Object.fromEntries(
  PALETTE_PRESETS.map((p) => [p.id, p]),
);

export const defaultPalette = (): PalettePreset => PALETTE_PRESETS[1]; // Ember
