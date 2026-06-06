import { describe, it, expect } from 'vitest';
import { srgbToLinear, linearToSrgb, linearToOklab, oklabToLinear, bakeStopsToLinearLUT } from '../src/color/oklab';
import { PALETTE_PRESETS, evalPalette } from '../src/color/palette';

describe('color', () => {
  it('sRGB <-> linear round-trips', () => {
    for (const v of [0, 0.04, 0.1, 0.5, 0.9, 1]) {
      expect(linearToSrgb(srgbToLinear(v))).toBeCloseTo(v, 6);
    }
  });

  it('OKLab <-> linear round-trips', () => {
    const lin: [number, number, number] = [0.2, 0.5, 0.8];
    const back = oklabToLinear(linearToOklab(lin));
    for (let i = 0; i < 3; i++) expect(back[i]).toBeCloseTo(lin[i], 5);
  });

  it('every cosine palette stays roughly in gamut at the endpoints', () => {
    for (const p of PALETTE_PRESETS) {
      for (const t of [0, 0.25, 0.5, 0.75, 1]) {
        const c = evalPalette(p.palette, t);
        for (const ch of c) expect(ch).toBeGreaterThanOrEqual(-0.01);
      }
    }
  });

  it('bakes a LUT of the requested size', () => {
    const lut = bakeStopsToLinearLUT(['#000000', '#ff5500', '#ffffff'], 256);
    expect(lut.length).toBe(256 * 4);
    expect(lut[3]).toBe(1); // alpha
  });
});
