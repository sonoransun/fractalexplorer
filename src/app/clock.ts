// Animation clock. Advanced by the fixed-timestep loop; produces the cheap
// per-frame animated values (palette phase, Julia c orbit, light direction).
// Everything here is a uniform — none of it triggers a field recompute except
// the Julia c-orbit (handled by the engine's dirty logic).
import { TAU, type Vec2 } from '../util/math';
import type { FractalScene } from './scene';

export class Clock {
  /** Accumulated palette phase -> drives color cycling. */
  paletteShift = 0;
  /** Global animation time in (motion-scaled) seconds. */
  t = 0;

  advance(dt: number, scene: FractalScene): void {
    const m = scene.anim.motionScale;
    this.t += dt * m;
    this.paletteShift += dt * m * scene.anim.cycleSpeed;
  }

  /** Julia constant for this frame. Lissajous skim along the Mandelbrot boundary. */
  juliaC(scene: FractalScene): Vec2 {
    if (!scene.anim.juliaOrbit) return scene.escape.juliaC;
    const p = this.t * scene.anim.orbitSpeed;
    const ox = -0.5;
    const oy = 0.0;
    const Rx = 0.55;
    const Ry = 0.18;
    // Incommensurate frequencies (0.7 : 1.3) read as organic, non-repeating motion.
    return [ox + Rx * Math.sin(0.7 * p + Math.PI / 2), oy + Ry * Math.sin(1.3 * p)];
  }

  /** Embossing light direction (unit vector). */
  lightDir(scene: FractalScene): Vec2 {
    if (!scene.anim.lightOrbit) return [0.7071, 0.7071];
    const a = this.t * 0.5 * TAU * 0.08; // slow sweep
    return [Math.cos(a), Math.sin(a)];
  }

  reset(): void {
    this.paletteShift = 0;
    this.t = 0;
  }
}
