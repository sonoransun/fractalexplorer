// Escape-time fractal shader sources (Mandelbrot / Julia / Multibrot).
//
// Architecture: a heavy "field" pass writes the continuous iteration value `mu`
// plus a distance estimate, a normal angle, and an orbit-trap distance into one
// RGBA16F texture. A cheap "color" pass samples that cached field every frame and
// only evaluates the palette — so palette cycling and DE-lighting run at 60fps
// without re-iterating. When float render targets are unavailable, a single-pass
// shader does both at once (correct, just costlier during cycling).
import {
  GLSL_VERSION,
  GLSL_COMPLEX,
  GLSL_PALETTE,
  GLSL_ENCODE,
} from './common';

const SHARED_UNIFORMS = `
uniform int   uMaxIter;
uniform float uPixelSize;
uniform int   uTrap;       // 0 none, 1 stalk, 2 point, 3 circle
`;

const FIELD_UNIFORMS = `
uniform vec2  uResolution;
uniform vec2  uCenter;
uniform float uRotation;
uniform int   uKind;       // 0 mandelbrot, 1 julia, 2 multibrot
uniform float uPower;
uniform vec2  uJuliaC;
uniform float uBailout2;   // escape radius squared
`;

const SHADE_UNIFORMS = `
uniform float uCycles;
uniform float uPhase;
uniform int   uRemap;      // 0 sqrt, 1 log, 2 linear
uniform float uShade;
uniform float uGlow;
uniform vec2  uLight;
uniform vec3  uInterior;
`;

// Maps this fragment to a complex coordinate. gl_FragCoord.y is bottom-left
// origin (Y up), matching the imaginary axis; rotation about the center.
const GLSL_COMPLEX_FROM_FRAG = `
vec2 complexFromFrag() {
  vec2 off = (gl_FragCoord.xy - 0.5 * uResolution) * uPixelSize;
  float cr = cos(uRotation), sr = sin(uRotation);
  vec2 rw = vec2(off.x * cr - off.y * sr, off.x * sr + off.y * cr);
  return uCenter + rw;
}
`;

// The shared ~40-line escape core. Carries dz for distance estimation + normal.
const GLSL_FIELD_CORE = `
const int ITER_CAP = 2048;
vec4 fractalField(vec2 c) {
  vec2 z, dz, cc;
  if (uKind == 1) { z = c; cc = uJuliaC; dz = vec2(1.0, 0.0); }   // Julia
  else            { z = vec2(0.0); cc = c; dz = vec2(0.0); }      // Mandelbrot/Multibrot
  float trap = 1e20;
  int n = 0;
  float m2 = 0.0;
  bool escaped = false;
  bool isP2 = (uPower == 2.0);
  for (int i = 0; i < ITER_CAP; i++) {
    if (i >= uMaxIter) break;
    if (isP2) {
      dz = 2.0 * cmul(z, dz) + vec2(1.0, 0.0);
      z  = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + cc;
    } else {
      dz = uPower * cmul(cpow(z, uPower - 1.0), dz) + vec2(1.0, 0.0);
      z  = cpow(z, uPower) + cc;
    }
    if      (uTrap == 1) trap = min(trap, min(abs(z.x), abs(z.y)));   // Pickover stalk
    else if (uTrap == 2) trap = min(trap, length(z));                // point
    else if (uTrap == 3) trap = min(trap, abs(length(z) - 1.0));     // unit circle
    m2 = dot(z, z);
    n = i;
    if (m2 > uBailout2) { escaped = true; break; }
  }
  if (!escaped) {
    float tr = (uTrap == 0) ? -1.0 : sqrt(max(trap, 0.0));
    return vec4(-1.0, 0.0, 0.0, tr);
  }
  float logz = 0.5 * log(m2);                       // log|z|
  float nu   = log2(logz / (0.5 * log(uBailout2))); // log2( log|z| / log R )
  float mu   = float(n) + 1.0 - nu;
  float adz  = max(length(dz), 1e-20);
  float de   = sqrt(m2) * logz / adz;               // |z|*log|z|/|dz|
  vec2  u    = cdiv(z, dz);
  float nAng = atan(u.y, u.x);
  float tr   = (uTrap == 0) ? 0.0 : sqrt(max(trap, 0.0));
  return vec4(mu, de, nAng, tr);
}
`;

// Turns one cached field sample into a linear-RGB color.
const GLSL_SHADE = `
float remapMu(float mu) {
  if (uRemap == 0) return sqrt(max(mu, 0.0)) * 0.1;
  if (uRemap == 1) return log(max(mu, 0.0) + 1.0) / log(float(uMaxIter) + 1.0);
  return mu / float(uMaxIter);
}
vec3 shadeField(vec4 f) {
  float mu = f.x;
  if (mu < 0.0) {                                   // interior
    if (uTrap != 0 && f.w >= 0.0) {
      float tt = pow(clamp(f.w * 3.0, 0.0, 1.0), 0.5);
      return cosPalette(fract(tt * uCycles + uPhase)) * 0.65;
    }
    return uInterior;
  }
  float t = remapMu(mu);
  vec3 col = cosPalette(fract(t * uCycles + uPhase));
  if (uTrap != 0) {
    float tt = pow(clamp(f.w * 3.0, 0.0, 1.0), 0.5);
    col = mix(col, cosPalette(fract(tt * uCycles + uPhase)), 0.5);
  }
  if (uShade > 0.0) {
    vec2 nrm = vec2(cos(f.z), sin(f.z));
    float diff = clamp(dot(nrm, normalize(uLight)) * 0.5 + 0.6, 0.0, 1.0);
    col = mix(col, col * diff, uShade);
  }
  if (uGlow > 0.0) {
    float d = f.y / max(uPixelSize, 1e-30);         // DE in pixels
    col += exp(-2.0 * d) * uGlow * (uA + uB);
  }
  return col;
}
`;

/** Heavy pass: iterate -> RGBA16F field texture. */
export const fieldFragmentSource = (): string =>
  GLSL_VERSION +
  GLSL_COMPLEX +
  SHARED_UNIFORMS +
  FIELD_UNIFORMS +
  GLSL_COMPLEX_FROM_FRAG +
  GLSL_FIELD_CORE +
  `
in vec2 vUV;
out vec4 outField;
void main() { outField = fractalField(complexFromFrag()); }
`;

/** Cheap pass: sample cached field -> screen with palette + post. */
export const colorFragmentSource = (): string =>
  GLSL_VERSION +
  GLSL_PALETTE +
  GLSL_ENCODE +
  SHARED_UNIFORMS +
  SHADE_UNIFORMS +
  GLSL_SHADE +
  `
in vec2 vUV;
out vec4 fragColor;
uniform sampler2D uField;
void main() {
  vec4 f = texture(uField, vUV);
  fragColor = vec4(encodeColor(shadeField(f), gl_FragCoord.xy), 1.0);
}
`;

/** Fallback: iterate AND color in one pass (no float-texture cache). */
export const singlePassFragmentSource = (): string =>
  GLSL_VERSION +
  GLSL_COMPLEX +
  GLSL_PALETTE +
  GLSL_ENCODE +
  SHARED_UNIFORMS +
  FIELD_UNIFORMS +
  SHADE_UNIFORMS +
  GLSL_COMPLEX_FROM_FRAG +
  GLSL_FIELD_CORE +
  GLSL_SHADE +
  `
in vec2 vUV;
out vec4 fragColor;
void main() {
  vec4 f = fractalField(complexFromFrag());
  fragColor = vec4(encodeColor(shadeField(f), gl_FragCoord.xy), 1.0);
}
`;
