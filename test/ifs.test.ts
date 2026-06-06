import { describe, it, expect } from 'vitest';
import { IFS_PRESETS, isContractive, chaosGame } from '../src/fractals/ifs';

describe('IFS', () => {
  it('fern and Sierpinski maps are all contractions', () => {
    expect(isContractive(IFS_PRESETS.fern!)).toBe(true);
    expect(isContractive(IFS_PRESETS['sierpinski-ifs']!)).toBe(true);
  });

  it('chaos game emits the requested number of finite points', () => {
    const cloud = chaosGame(IFS_PRESETS.fern!, 5000);
    expect(cloud.count).toBe(5000);
    expect(cloud.data.length).toBe(15000);
    for (let i = 0; i < cloud.data.length; i++) {
      expect(Number.isFinite(cloud.data[i])).toBe(true);
    }
  });

  it('normalizes points into a bounded box', () => {
    const cloud = chaosGame(IFS_PRESETS.fern!, 4000);
    for (let i = 0; i < cloud.count; i++) {
      expect(Math.abs(cloud.data[i * 3])).toBeLessThan(3);
      expect(Math.abs(cloud.data[i * 3 + 1])).toBeLessThan(3);
    }
  });
});
