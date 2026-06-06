// Fixed-timestep render loop. Decouples simulation (animation phases advanced at
// a fixed rate -> identical motion at 60/120/144 Hz and during export) from
// render. Delta-time is clamped to avoid the spiral-of-death after a tab switch,
// and the loop pauses while the tab is hidden.
import type { Engine } from './engine';

export class Loop {
  private last = 0;
  private acc = 0;
  private raf = 0;
  private running = false;
  private readonly STEP = 1 / 120; // simulation substep (s)

  constructor(private engine: Engine) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = 0;
    this.raf = requestAnimationFrame(this.frame);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private onVisibility = (): void => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf);
    } else if (this.running) {
      this.last = 0; // avoid a huge dt jump on resume
      this.raf = requestAnimationFrame(this.frame);
    }
  };

  private frame = (now: number): void => {
    if (!this.running) return;
    if (this.last === 0) this.last = now;
    let dt = (now - this.last) / 1000;
    this.last = now;
    dt = Math.min(dt, 0.1); // clamp: never simulate more than 100ms in one frame

    this.engine.beginFrame(now / 1000, dt * 1000);
    this.acc += dt;
    let steps = 0;
    while (this.acc >= this.STEP && steps < 8) {
      this.engine.advance(this.STEP);
      this.acc -= this.STEP;
      steps++;
    }
    this.engine.render();

    this.raf = requestAnimationFrame(this.frame);
  };
}
