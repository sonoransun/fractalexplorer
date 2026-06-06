// Camera math in the complex plane. Zoom is stored as log2 magnification so that
// exponential (constant-perceived-velocity) zoom is just linear interpolation of
// zoomLevel. Pixel<->complex mapping flips Y (screen-down -> imaginary-up) and
// supports an optional rotation.
import { BASE_SPAN, type CameraState } from './scene';
import type { Vec2 } from '../util/math';

export const worldHeight = (cam: CameraState): number => BASE_SPAN / Math.pow(2, cam.zoomLevel);

export const worldPerPixel = (cam: CameraState, viewportH: number): number =>
  worldHeight(cam) / Math.max(1, viewportH);

/** Rotated world-space offset (in complex units) for a screen pixel relative to center. */
const pixelOffset = (cam: CameraState, px: number, py: number, W: number, H: number): Vec2 => {
  const wpp = worldPerPixel(cam, H);
  const ox = (px - W / 2) * wpp;
  const oy = -(py - H / 2) * wpp; // flip Y
  const cr = Math.cos(cam.rotation);
  const sr = Math.sin(cam.rotation);
  return [ox * cr - oy * sr, ox * sr + oy * cr];
};

export const screenToComplex = (
  cam: CameraState,
  px: number,
  py: number,
  W: number,
  H: number,
): Vec2 => {
  const [dx, dy] = pixelOffset(cam, px, py, W, H);
  return [cam.centerX + dx, cam.centerY + dy];
};

/**
 * Zoom by `deltaZoom` (in log2 units) while keeping the complex point currently
 * under (px,py) fixed on screen. Mutates and returns the camera.
 */
export const zoomAt = (
  cam: CameraState,
  px: number,
  py: number,
  W: number,
  H: number,
  deltaZoom: number,
): CameraState => {
  const before = screenToComplex(cam, px, py, W, H);
  cam.zoomLevel += deltaZoom;
  const [dx, dy] = pixelOffset(cam, px, py, W, H);
  cam.centerX = before[0] - dx;
  cam.centerY = before[1] - dy;
  return cam;
};

/** Pan by a screen-space delta (pixels). Mutates and returns the camera. */
export const panByPixels = (
  cam: CameraState,
  dxPx: number,
  dyPx: number,
  H: number,
): CameraState => {
  const wpp = worldPerPixel(cam, H);
  const cr = Math.cos(cam.rotation);
  const sr = Math.sin(cam.rotation);
  const wx = -dxPx * wpp;
  const wy = dyPx * wpp; // screen drag down -> move view up
  cam.centerX += wx * cr - wy * sr;
  cam.centerY += wx * sr + wy * cr;
  return cam;
};

/** Magnification factor (2^zoomLevel). */
export const magnification = (cam: CameraState): number => Math.pow(2, cam.zoomLevel);
