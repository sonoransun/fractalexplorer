import { describe, it, expect } from 'vitest';
import { defaultScene } from '../src/app/scene';
import { encodeScene, decodeScene } from '../src/state/urlstate';

describe('URL state', () => {
  it('round-trips a deep-zoom Julia scene', () => {
    const s = defaultScene();
    s.kind = 'julia';
    s.camera.centerX = -0.743643887037151;
    s.camera.centerY = 0.13182590420533;
    s.camera.zoomLevel = 12.5;
    s.escape.maxIter = 800;
    s.escape.juliaC = [-0.7269, 0.1889];
    s.coloring.paletteId = 'magma';
    s.coloring.cycles = 5;
    s.coloring.remap = 'log';
    s.anim.juliaOrbit = true;

    const back = decodeScene('#' + encodeScene(s))!;
    expect(back).not.toBeNull();
    expect(back.kind).toBe('julia');
    expect(back.camera.centerX).toBeCloseTo(s.camera.centerX, 9);
    expect(back.camera.centerY).toBeCloseTo(s.camera.centerY, 9);
    expect(back.camera.zoomLevel).toBeCloseTo(12.5, 6);
    expect(back.escape.maxIter).toBe(800);
    expect(back.escape.juliaC[0]).toBeCloseTo(-0.7269, 9);
    expect(back.coloring.paletteId).toBe('magma');
    expect(back.coloring.remap).toBe('log');
    expect(back.anim.juliaOrbit).toBe(true);
  });

  it('returns null for an empty hash and ignores unknown kinds', () => {
    expect(decodeScene('')).toBeNull();
    expect(decodeScene('#')).toBeNull();
    expect(decodeScene('#k=notathing')!.kind).toBe('mandelbrot');
  });
});
