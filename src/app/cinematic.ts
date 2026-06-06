// Cinematic auto-tour: on load (when there's no deep-link and motion is allowed)
// the camera flies a guided loop through famous Mandelbrot locations, breathing
// out to the whole set between stops and diving back in. Color cycling continues
// throughout (driven by the Clock). Any user interaction cancels it.
//
// Zoom is interpolated in log space (camera.zoomLevel IS log2 magnification) for
// constant perceived velocity; the center settles before the deepest part of the
// dive so we never pan at high magnification (precision + comfort).
import type { CameraState } from './scene';
import { smootherstep } from '../util/easing';

export interface TourStop {
  center: [number, number];
  zoom: number;
  dwell: number;
}

interface Keyframe {
  cx: number;
  cy: number;
  zoom: number;
  hold: number; // seconds to dwell after arriving
}

// Curated, recognizable destinations on the Mandelbrot boundary.
const STOPS: TourStop[] = [
  { center: [-0.743643887037151, 0.13182590420533], zoom: 11, dwell: 2.6 }, // Seahorse Valley
  { center: [0.2925755, 0.0149977], zoom: 10, dwell: 2.6 }, // Elephant Valley
  { center: [-0.722, 0.2467], zoom: 9.5, dwell: 2.6 }, // scepter / triple-spiral region
  { center: [-1.2568, 0.3801], zoom: 10.5, dwell: 2.6 }, // a satellite mini-brot neighborhood
  { center: [-0.16070135, 1.0375665], zoom: 9, dwell: 2.6 }, // northern filament spiral
];

const GLOBAL_OVERVIEW: Keyframe = { cx: -0.6, cy: 0, zoom: -0.4, hold: 0.9 };
const ZOOM_RATE = 1.6; // log2 units per second
const MIN_SEGMENT = 1.2; // seconds

const KEYFRAMES: Keyframe[] = STOPS.flatMap((s) => [
  { ...GLOBAL_OVERVIEW },
  { cx: s.center[0], cy: s.center[1], zoom: s.zoom, hold: s.dwell },
]);

/** Pure interpolation of one segment a->b at parameter u in [0,1]. Exported for tests. */
export const sampleSegment = (a: Keyframe, b: Keyframe, u: number): { cx: number; cy: number; zoom: number } => {
  const ez = smootherstep(u);
  const ec = smootherstep(Math.min(1, u / 0.7)); // center settles by 70% of the segment
  return {
    cx: a.cx + (b.cx - a.cx) * ec,
    cy: a.cy + (b.cy - a.cy) * ec,
    zoom: a.zoom + (b.zoom - a.zoom) * ez,
  };
};

const segmentDuration = (a: Keyframe, b: Keyframe): number =>
  Math.max(MIN_SEGMENT, Math.abs(b.zoom - a.zoom) / ZOOM_RATE);

export class Cinematic {
  active = false;
  private kf = KEYFRAMES;
  private i = 0; // current segment index: kf[i] -> kf[i+1]
  private t = 0; // seconds elapsed in current segment (travel + hold)

  start(cam: CameraState): void {
    this.active = true;
    this.i = 0;
    this.t = 0;
    this.apply(cam, this.kf[0]);
  }

  stop(): void {
    this.active = false;
  }

  private apply(cam: CameraState, k: Keyframe): void {
    cam.centerX = k.cx;
    cam.centerY = k.cy;
    cam.zoomLevel = k.zoom;
    cam.rotation = 0;
  }

  /** Advance the tour by dt seconds, mutating the camera. No-op when inactive. */
  update(dt: number, cam: CameraState): void {
    if (!this.active) return;
    const n = this.kf.length;
    const a = this.kf[this.i];
    const b = this.kf[(this.i + 1) % n];
    const travel = segmentDuration(a, b);
    const total = travel + b.hold;
    this.t += dt;
    if (this.t >= total) {
      this.t -= total;
      this.i = (this.i + 1) % n;
      this.apply(cam, b);
      return;
    }
    const u = Math.min(1, this.t / travel);
    const s = sampleSegment(a, b, u);
    cam.centerX = s.cx;
    cam.centerY = s.cy;
    cam.zoomLevel = s.zoom;
    cam.rotation = 0;
  }
}
