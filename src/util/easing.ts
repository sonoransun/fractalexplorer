// Easing + frame-rate-independent smoothing. Used for camera motion and
// cinematic keyframes. Avoid bouncy/elastic easings on the camera — they read
// as nausea-inducing on full-screen zoom.
import { clamp } from './math';

export const smoothstep = (u: number): number => {
  const t = clamp(u, 0, 1);
  return t * t * (3 - 2 * t);
};

/** C2-continuous — best for chained keyframe segments (no acceleration jerk). */
export const smootherstep = (u: number): number => {
  const t = clamp(u, 0, 1);
  return t * t * t * (t * (6 * t - 15) + 10);
};

export const easeInExpo = (u: number): number => (u <= 0 ? 0 : Math.pow(2, 10 * (u - 1)));

export const easeInOutSine = (u: number): number => -(Math.cos(Math.PI * clamp(u, 0, 1)) - 1) / 2;

/**
 * Critically-damped exponential approach toward `target`. Frame-rate independent:
 * the result is identical at 30/60/144 Hz for a given elapsed `dt`. `tau` is the
 * time-constant in seconds (~0.12–0.2 snappy, ~0.4 lazy/cinematic).
 */
export const damp = (x: number, target: number, tau: number, dt: number): number =>
  x + (target - x) * (1 - Math.exp(-dt / Math.max(tau, 1e-4)));
