// Shared GLSL ES 3.0 chunks. These strings are concatenated into full shader
// sources by the per-mode shader builders. Keeping the core tiny and isolated
// from app state is what makes the future WGSL/WebGPU port additive.

export const GLSL_VERSION = '#version 300 es\nprecision highp float;\nprecision highp int;\n';

/** One oversized triangle covers the viewport with no diagonal seam. */
export const FULLSCREEN_VERT = `${GLSL_VERSION}
out vec2 vUV;
void main() {
  vec2 p = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0);
  vUV = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}
`;

/** Complex arithmetic + integer power. */
export const GLSL_COMPLEX = `
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x); }
vec2 cdiv(vec2 a, vec2 b) { float d = max(dot(b,b), 1e-30); return vec2(a.x*b.x + a.y*b.y, a.y*b.x - a.x*b.y) / d; }
vec2 cpow(vec2 z, float p) {
  float r = length(z);
  if (r < 1e-30) return vec2(0.0);
  float a = atan(z.y, z.x);
  float rp = pow(r, p);
  return rp * vec2(cos(p*a), sin(p*a));
}
`;

/** Inigo Quilez cosine palette (linear-light output). */
export const GLSL_PALETTE = `
uniform vec3 uA, uB, uC, uD;
vec3 cosPalette(float t) { return uA + uB * cos(6.28318530718 * (uC * t + uD)); }
`;

/** Tone-map (optional) + true sRGB OETF + triangular-PDF dither at output. */
export const GLSL_ENCODE = `
uniform float uFilmic;   // 0 = linear clamp, 1 = full ACES filmic rolloff
vec3 acesFilmic(vec3 x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a*x + b)) / (x * (c*x + d) + e), 0.0, 1.0);
}
vec3 linearToSRGB(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c));
}
float tpdfDither(vec2 p) {
  float n1 = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  float n2 = fract(sin(dot(p + 1.0, vec2(12.9898, 78.233))) * 43758.5453);
  return (n1 + n2 - 1.0); // triangular PDF in [-1,1]
}
vec3 encodeColor(vec3 lin, vec2 frag) {
  vec3 tm = mix(lin, acesFilmic(lin), clamp(uFilmic, 0.0, 1.0));
  vec3 srgb = linearToSRGB(tm);
  srgb += tpdfDither(frag) * (1.0 / 255.0); // kill 8-bit banding in display space
  return srgb;
}
`;
