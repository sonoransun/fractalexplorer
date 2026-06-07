import { describe, it, expect } from 'vitest';
import { PRESETS, presetToScene, presetHref, kindHref, FORMULAS } from '../src/data/presets';
import { decodeScene } from '../src/state/urlstate';
import { FRACTALS } from '../src/fractals/registry';

describe('presets', () => {
  it('presetToScene maps coordinate / zoom / constant correctly', () => {
    const rabbit = PRESETS.find((p) => p.name === 'Douady Rabbit')!;
    const s = presetToScene(rabbit);
    expect(s.kind).toBe('julia');
    expect(s.escape.juliaC[0]).toBeCloseTo(-0.123, 9);
    expect(s.escape.juliaC[1]).toBeCloseTo(0.745, 9);
    expect(s.camera.zoomLevel).toBeCloseTo(Math.log2(1.4), 9);

    const sea = PRESETS.find((p) => p.name === 'Seahorse Valley')!;
    const ss = presetToScene(sea);
    expect(ss.camera.centerX).toBeCloseTo(-0.75, 9);
    expect(ss.camera.centerY).toBeCloseTo(0.1, 9);
    expect(ss.camera.zoomLevel).toBeCloseTo(Math.log2(250), 9);

    const multi = PRESETS.find((p) => p.kind === 'multibrot')!;
    expect(presetToScene(multi).escape.power).toBe(multi.power);
  });

  it('preset and gallery hrefs are explore deep-links that round-trip the kind', () => {
    for (const p of PRESETS) {
      const href = presetHref(p);
      expect(href.startsWith('#/explore?')).toBe(true);
      const back = decodeScene(href);
      expect(back).not.toBeNull();
      expect(back!.kind).toBe(p.kind);
    }
    for (const f of FRACTALS) {
      expect(decodeScene(kindHref(f.kind))!.kind).toBe(f.kind);
    }
  });

  it('provides a formula reference for every family', () => {
    expect(FORMULAS.length).toBeGreaterThanOrEqual(10);
    for (const f of FORMULAS) expect(f.formula.length).toBeGreaterThan(0);
  });
});
