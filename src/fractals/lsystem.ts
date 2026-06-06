// L-system engine: string rewriting -> turtle interpretation -> screen-width
// line mesh. Output coordinates are normalized to a centered ~[-1.3, 1.3] box so
// the default camera (center 0,0, zoom 0) frames any curve.
import type { Vec2 } from '../util/math';

export interface LSystemDef {
  axiom: string;
  rules: Record<string, string>;
  angleDeg: number;
  /** Symbols that move the turtle forward AND draw. Others: + - turn, [ ] branch. */
  draw: string;
  depth: number;
}

export interface Segment {
  a: Vec2;
  b: Vec2;
}

/** Expand the axiom `depth` times. Uses an array accumulator (no quadratic concat). */
export const rewrite = (def: LSystemDef): string => {
  let current = def.axiom;
  for (let d = 0; d < def.depth; d++) {
    const out: string[] = [];
    for (const ch of current) out.push(def.rules[ch] ?? ch);
    current = out.join('');
  }
  return current;
};

/** Interpret a rewritten string into independent line segments. */
export const turtle = (str: string, def: LSystemDef): Segment[] => {
  const angle = (def.angleDeg * Math.PI) / 180;
  const drawSet = new Set(def.draw);
  const segs: Segment[] = [];
  let x = 0;
  let y = 0;
  let heading = Math.PI / 2; // start pointing up
  const stack: Array<{ x: number; y: number; h: number }> = [];
  const step = 1;
  for (const ch of str) {
    if (drawSet.has(ch)) {
      const nx = x + step * Math.cos(heading);
      const ny = y + step * Math.sin(heading);
      segs.push({ a: [x, y], b: [nx, ny] });
      x = nx;
      y = ny;
    } else if (ch === '+') {
      heading += angle;
    } else if (ch === '-') {
      heading -= angle;
    } else if (ch === '[') {
      stack.push({ x, y, h: heading });
    } else if (ch === ']') {
      const s = stack.pop();
      if (s) {
        x = s.x;
        y = s.y;
        heading = s.h;
      }
    }
    // any other symbol is a no-op placeholder (e.g. X, Y in the dragon curve)
  }
  return segs;
};

/** Center segments on the origin and scale so the larger extent fits ~2.6 units. */
export const normalize = (segs: Segment[]): Segment[] => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const s of segs) {
    for (const p of [s.a, s.b]) {
      if (p[0] < minX) minX = p[0];
      if (p[1] < minY) minY = p[1];
      if (p[0] > maxX) maxX = p[0];
      if (p[1] > maxY) maxY = p[1];
    }
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const extent = Math.max(maxX - minX, maxY - minY) || 1;
  const scale = 2.6 / extent;
  const map = (p: Vec2): Vec2 => [(p[0] - cx) * scale, (p[1] - cy) * scale];
  return segs.map((s) => ({ a: map(s.a), b: map(s.b) }));
};

export interface LineMesh {
  /** Interleaved [posX, posY, normX, normY, t] per vertex; 6 verts per segment. */
  data: Float32Array;
  vertexCount: number;
  segmentCount: number;
}

/**
 * Build a triangle-list mesh from segments. Each vertex stores a unit normal
 * (the shader offsets along it by a fixed pixel width) and a normalized
 * arc-length `t` (cumulative across all segments, in draw order) for coloring.
 */
export const buildLineMesh = (segs: Segment[]): LineMesh => {
  // First pass: cumulative arc length for t.
  const lens: number[] = [];
  let total = 0;
  for (const s of segs) {
    const l = Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]);
    lens.push(l);
    total += l;
  }
  total = total || 1;

  const data = new Float32Array(segs.length * 6 * 5);
  let o = 0;
  let acc = 0;
  const push = (p: Vec2, n: Vec2, t: number) => {
    data[o++] = p[0];
    data[o++] = p[1];
    data[o++] = n[0];
    data[o++] = n[1];
    data[o++] = t;
  };
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    const ta = acc / total;
    acc += lens[i];
    const tb = acc / total;
    const dx = s.b[0] - s.a[0];
    const dy = s.b[1] - s.a[1];
    const dl = Math.hypot(dx, dy) || 1;
    const nx = -dy / dl;
    const ny = dx / dl;
    const nPos: Vec2 = [nx, ny];
    const nNeg: Vec2 = [-nx, -ny];
    // two triangles forming the segment quad
    push(s.a, nPos, ta);
    push(s.a, nNeg, ta);
    push(s.b, nPos, tb);
    push(s.b, nPos, tb);
    push(s.a, nNeg, ta);
    push(s.b, nNeg, tb);
  }
  return { data, vertexCount: segs.length * 6, segmentCount: segs.length };
};
