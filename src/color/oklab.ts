// OKLab conversions for perceptually-even multi-stop gradient interpolation.
// Interpolating hand-authored gradients in linear RGB gives dark, desaturated
// midpoints; OKLab keeps lightness/hue even. We author/interpolate in OKLab and
// bake to LINEAR-RGB texels (the shader applies the sRGB OETF at the very end).
//
// Reference: https://bottosson.github.io/posts/oklab/
import type { RGB } from './palette';
import { clamp } from '../util/math';

export const srgbToLinear = (c: number): number =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

export const linearToSrgb = (c: number): number => {
  const x = clamp(c, 0, 1);
  return x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
};

/** linear sRGB -> OKLab */
export const linearToOklab = ([r, g, b]: RGB): RGB => {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
};

/** OKLab -> linear sRGB */
export const oklabToLinear = ([L, a, b]: RGB): RGB => {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};

/** Hex/sRGB color (0..255 or "#rrggbb") -> linear RGB. */
export const hexToLinear = (hex: string): RGB => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
};

/**
 * Bake a list of sRGB hex stops into a linear-RGB LUT of `size` entries,
 * interpolating in OKLab for even perceptual spacing. Returns Float32 RGBA.
 */
export const bakeStopsToLinearLUT = (hexStops: string[], size = 1024): Float32Array => {
  const stops = hexStops.map(hexToLinear).map(linearToOklab);
  const out = new Float32Array(size * 4);
  const n = stops.length;
  for (let i = 0; i < size; i++) {
    const t = (i / (size - 1)) * (n - 1);
    const i0 = Math.min(n - 1, Math.floor(t));
    const i1 = Math.min(n - 1, i0 + 1);
    const f = t - i0;
    const lab: RGB = [
      stops[i0][0] + (stops[i1][0] - stops[i0][0]) * f,
      stops[i0][1] + (stops[i1][1] - stops[i0][1]) * f,
      stops[i0][2] + (stops[i1][2] - stops[i0][2]) * f,
    ];
    const lin = oklabToLinear(lab);
    out[i * 4 + 0] = lin[0];
    out[i * 4 + 1] = lin[1];
    out[i * 4 + 2] = lin[2];
    out[i * 4 + 3] = 1;
  }
  return out;
};
