// Strategy A: screen-constant-width line geometry for L-system curves.
// Each vertex carries a world position, a unit normal (perpendicular to the
// stroke), and a normalized arc-length `t`. The vertex shader offsets along the
// normal by a fixed number of *pixels* (independent of zoom), and the fragment
// shader colors by `t` through the SAME cosine palette + cycle phase as the
// escape-time renderer — so strokes color-cycle identically.
import { GLSL_VERSION, GLSL_PALETTE, GLSL_ENCODE } from './common';

export const LINE_VERT = `${GLSL_VERSION}
in vec2  aPos;
in vec2  aNorm;
in float aT;
uniform vec2  uCenter;
uniform float uPixelSize;
uniform vec2  uResolution;
uniform float uRotation;
uniform float uHalfWidthPx;
out float vT;
void main() {
  // Offset in world units; dividing by uPixelSize below cancels it to a constant
  // pixel width at any zoom.
  vec2 world = aPos + aNorm * (uHalfWidthPx * uPixelSize);
  vec2 d = world - uCenter;
  float cr = cos(-uRotation), sr = sin(-uRotation);
  vec2 rd = vec2(d.x*cr - d.y*sr, d.x*sr + d.y*cr);
  vec2 px = rd / uPixelSize;            // pixel offset from center
  vec2 clip = px / (0.5 * uResolution); // -> clip space
  vT = aT;
  gl_Position = vec4(clip, 0.0, 1.0);
}
`;

export const LINE_FRAG = `${GLSL_VERSION}
${GLSL_PALETTE}
${GLSL_ENCODE}
in float vT;
out vec4 fragColor;
uniform float uCycles;
uniform float uPhase;
void main() {
  vec3 col = cosPalette(fract(vT * uCycles + uPhase));
  fragColor = vec4(encodeColor(col, gl_FragCoord.xy), 1.0);
}
`;
