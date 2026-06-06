// Iterated Function System attractors via the chaos game. Generates a point
// cloud (centered + normalized) for additive HDR splatting. Each point carries a
// normalized map index so the resolve shader can color by which affine map drew it.
import type { FractalKind } from '../app/scene';

export interface AffineMap {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  /** selection probability (need not be normalized) */
  p: number;
}

export interface IFSDef {
  maps: AffineMap[];
}

const SQRT3_4 = Math.sqrt(3) / 4;

export const IFS_PRESETS: Partial<Record<FractalKind, IFSDef>> = {
  fern: {
    maps: [
      { a: 0.0, b: 0.0, c: 0.0, d: 0.16, e: 0.0, f: 0.0, p: 0.01 },
      { a: 0.85, b: 0.04, c: -0.04, d: 0.85, e: 0.0, f: 1.6, p: 0.85 },
      { a: 0.2, b: -0.26, c: 0.23, d: 0.22, e: 0.0, f: 1.6, p: 0.07 },
      { a: -0.15, b: 0.28, c: 0.26, d: 0.24, e: 0.0, f: 0.44, p: 0.07 },
    ],
  },
  'sierpinski-ifs': {
    maps: [
      { a: 0.5, b: 0, c: 0, d: 0.5, e: 0.0, f: 0.0, p: 1 },
      { a: 0.5, b: 0, c: 0, d: 0.5, e: 0.5, f: 0.0, p: 1 },
      { a: 0.5, b: 0, c: 0, d: 0.5, e: 0.25, f: SQRT3_4, p: 1 },
    ],
  },
};

export interface PointCloud {
  /** Interleaved [x, y, mapIndex01] per point. */
  data: Float32Array;
  count: number;
}

/**
 * Run the chaos game. After a short warm-up to settle onto the attractor, every
 * subsequent point is emitted. Coordinates are centered and scaled to a ~2.4-unit box.
 */
export const chaosGame = (def: IFSDef, count: number, warmup = 25): PointCloud => {
  const maps = def.maps;
  const cum: number[] = [];
  let total = 0;
  for (const m of maps) {
    total += m.p;
    cum.push(total);
  }

  const pts = new Float32Array(count * 3);
  let x = 0;
  let y = 0;
  let o = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const denom = maps.length > 1 ? maps.length - 1 : 1;

  for (let i = 0; i < count + warmup; i++) {
    const r = Math.random() * total;
    let mi = 0;
    while (mi < cum.length - 1 && r > cum[mi]) mi++;
    const m = maps[mi];
    const nx = m.a * x + m.b * y + m.e;
    const ny = m.c * x + m.d * y + m.f;
    x = nx;
    y = ny;
    if (i >= warmup) {
      pts[o++] = x;
      pts[o++] = y;
      pts[o++] = mi / denom;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const extent = Math.max(maxX - minX, maxY - minY) || 1;
  const scale = 2.4 / extent;
  for (let i = 0; i < count; i++) {
    pts[i * 3] = (pts[i * 3] - cx) * scale;
    pts[i * 3 + 1] = (pts[i * 3 + 1] - cy) * scale;
  }
  return { data: pts, count };
};

/** Largest singular-value-ish check that every map is a contraction (‖A‖ < 1). */
export const isContractive = (def: IFSDef): boolean =>
  def.maps.every((m) => {
    // 2x2 operator norm via largest eigenvalue of AᵀA.
    const m00 = m.a * m.a + m.c * m.c;
    const m11 = m.b * m.b + m.d * m.d;
    const m01 = m.a * m.b + m.c * m.d;
    const tr = m00 + m11;
    const det = m00 * m11 - m01 * m01;
    const lambda = tr / 2 + Math.sqrt(Math.max(0, (tr * tr) / 4 - det));
    return Math.sqrt(lambda) < 1;
  });
