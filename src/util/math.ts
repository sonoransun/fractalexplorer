// Small numeric helpers shared across CPU-side code (camera, L-systems, IFS, tests).
// GPU-side math lives in the GLSL/WGSL shader sources.

export type Vec2 = [number, number];

export const TAU = Math.PI * 2;

export const clamp = (x: number, lo: number, hi: number): number =>
  x < lo ? lo : x > hi ? hi : x;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const smoothstep = (t: number): number => {
  const u = clamp(t, 0, 1);
  return u * u * (3 - 2 * u);
};

/** Wrap into [0, 1). */
export const fract = (x: number): number => x - Math.floor(x);

/** Complex multiply. */
export const cmul = (a: Vec2, b: Vec2): Vec2 => [
  a[0] * b[0] - a[1] * b[1],
  a[0] * b[1] + a[1] * b[0],
];

export const cadd = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]];

export const clen = (a: Vec2): number => Math.hypot(a[0], a[1]);

/** round-trip-safe number formatting for URL state (enough mantissa for deep centers). */
export const fmt = (x: number): string => {
  if (!Number.isFinite(x)) return '0';
  // Integers and short decimals stay readable; everything else keeps 12 sig-figs.
  if (Number.isInteger(x) && Math.abs(x) < 1e6) return String(x);
  return x.toExponential(12);
};
