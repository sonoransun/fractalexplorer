import { describe, it, expect } from 'vitest';
import { sampleSegment } from '../src/app/cinematic';

const A = { cx: -0.6, cy: 0, zoom: -0.4, hold: 0 };
const B = { cx: -0.743643887, cy: 0.13182590420533, zoom: 11, hold: 2 };

describe('cinematic tour', () => {
  it('sampleSegment hits both endpoints exactly', () => {
    const s0 = sampleSegment(A, B, 0);
    expect(s0.cx).toBeCloseTo(A.cx, 12);
    expect(s0.cy).toBeCloseTo(A.cy, 12);
    expect(s0.zoom).toBeCloseTo(A.zoom, 12);
    const s1 = sampleSegment(A, B, 1);
    expect(s1.cx).toBeCloseTo(B.cx, 12);
    expect(s1.cy).toBeCloseTo(B.cy, 12);
    expect(s1.zoom).toBeCloseTo(B.zoom, 12);
  });

  it('zoom rises monotonically across a dive segment', () => {
    let prev = -Infinity;
    for (let u = 0; u <= 1; u += 0.05) {
      const z = sampleSegment(A, B, u).zoom;
      expect(z).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = z;
    }
  });

  it('center settles before the deepest part of the dive', () => {
    const s = sampleSegment(A, B, 0.72); // center ease completes by u=0.7
    expect(s.cx).toBeCloseTo(B.cx, 6);
    expect(s.cy).toBeCloseTo(B.cy, 6);
    expect(s.zoom).toBeLessThan(B.zoom); // ...but zoom is still climbing
  });
});
