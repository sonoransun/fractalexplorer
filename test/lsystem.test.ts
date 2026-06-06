import { describe, it, expect } from 'vitest';
import { rewrite, turtle } from '../src/fractals/lsystem';
import { LSYSTEMS, lineMeshFor } from '../src/fractals/lsystem-presets';

describe('L-system', () => {
  it('Koch curve has 4^depth segments (axiom F, rule F->F+F--F+F)', () => {
    const def = { ...LSYSTEMS.koch!, depth: 4 };
    const segs = turtle(rewrite(def), def);
    expect(segs.length).toBe(4 ** 4); // 256
  });

  it('Sierpinski arrowhead draws on both A and B symbols', () => {
    const def = { ...LSYSTEMS.sierpinski!, depth: 3 };
    const str = rewrite(def);
    const drawCount = [...str].filter((c) => c === 'A' || c === 'B').length;
    const segs = turtle(str, def);
    expect(segs.length).toBe(drawCount);
  });

  it('mesh has 6 vertices per segment and normalized arc-length t in [0,1]', () => {
    const m = lineMeshFor('koch', 3);
    expect(m.segmentCount).toBe(4 ** 3); // 64
    expect(m.vertexCount).toBe(m.segmentCount * 6);
    // t is the 5th float of each vertex (stride 5)
    for (let i = 4; i < m.data.length; i += 5) {
      expect(m.data[i]).toBeGreaterThanOrEqual(0);
      expect(m.data[i]).toBeLessThanOrEqual(1.0000001);
    }
  });
});
