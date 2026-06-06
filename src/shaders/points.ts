// Strategy B: chaos-game point splatting for IFS attractors (Barnsley fern,
// Sierpinski-by-points). Points are additively accumulated into an HDR float
// buffer so visit density becomes luminance (the invariant measure). A resolve
// pass log-tone-maps the density and colors via the shared cosine palette,
// blended by which affine map produced each point.
import { GLSL_VERSION, GLSL_PALETTE, GLSL_ENCODE } from './common';

// Accumulation: transform world point -> clip, carry the map index.
export const POINT_VERT = `${GLSL_VERSION}
in vec2  aPos;
in float aMap;          // normalized map index 0..1
uniform vec2  uCenter;
uniform float uPixelSize;
uniform vec2  uResolution;
uniform float uRotation;
out float vMap;
void main() {
  vec2 d = aPos - uCenter;
  float cr = cos(-uRotation), sr = sin(-uRotation);
  vec2 rd = vec2(d.x*cr - d.y*sr, d.x*sr + d.y*cr);
  vec2 px = rd / uPixelSize;
  vec2 clip = px / (0.5 * uResolution);
  vMap = aMap;
  gl_PointSize = 1.0;
  gl_Position = vec4(clip, 0.0, 1.0);
}
`;

// Additive: accumulate map-weighted value in .r and a unit count in .a.
export const POINT_FRAG = `${GLSL_VERSION}
in float vMap;
out vec4 outAcc;
uniform float uIntensity;
void main() {
  outAcc = vec4(vMap * uIntensity, 0.0, 0.0, uIntensity);
}
`;

// Resolve: density -> luminance via log/exp tone-map, colored by the palette.
export const POINT_RESOLVE_FRAG = `${GLSL_VERSION}
${GLSL_PALETTE}
${GLSL_ENCODE}
in vec2 vUV;
out vec4 fragColor;
uniform sampler2D uAcc;
uniform float uExposure;
uniform float uCycles;
uniform float uPhase;
uniform float uMapSpread;
uniform vec3  uInterior;
void main() {
  vec4 a = texture(uAcc, vUV);
  float dens = a.a;
  if (dens <= 0.0) {
    fragColor = vec4(encodeColor(uInterior, gl_FragCoord.xy), 1.0);
    return;
  }
  float lum = 1.0 - exp(-dens * uExposure);
  float mapAvg = a.r / dens;
  float coord = fract(lum * uCycles + mapAvg * uMapSpread + uPhase);
  vec3 col = cosPalette(coord) * (0.15 + 0.85 * lum);
  fragColor = vec4(encodeColor(col, gl_FragCoord.xy), 1.0);
}
`;
