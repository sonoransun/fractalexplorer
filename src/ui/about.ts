// About overlay: a focus-trapped, Esc/scrim-closable modal with a condensed
// history of fractals and their significance, a per-fractal key, and controls
// help. The full long-form lives in docs/fractals.md.
let isOpen = false;
let lastFocus: HTMLElement | null = null;

const CONTENT = `
  <button class="modal-close" type="button" aria-label="Close">×</button>
  <h1>What is a <em>fractal?</em></h1>
  <p class="lede">Shapes that repeat their structure across scales. Zoom into a coastline, a fern,
  or the boundary of the Mandelbrot set and you keep finding detail — often echoes of the whole —
  no matter how far in you go. This explorer is built to let you feel that directly.</p>

  <h2>A short history</h2>
  <p>In the 1870s–1920s mathematicians kept meeting "monsters": <strong>Weierstrass'</strong>
  curve (1872) that is continuous everywhere yet smooth nowhere, <strong>Cantor's</strong> dust
  (1883), the <strong>Koch</strong> curve (1904) of infinite length around finite area, and
  <strong>Sierpiński's</strong> holey triangle (1915). <strong>Hausdorff</strong> (1918) gave them
  a language — a dimension that need not be a whole number — and <strong>Julia</strong> and
  <strong>Fatou</strong> (1917–19) studied what happens when you iterate <em>z → z² + c</em>,
  though they couldn't yet picture it.</p>
  <p>Working at IBM, <strong>Benoît Mandelbrot</strong> saw these scattered curiosities as one
  idea with vast reach. He asked <em>"How Long Is the Coast of Britain?"</em> (1967), coined the
  word <strong>fractal</strong> in 1975 (from Latin <em>fractus</em>, "broken"), and published
  <em>The Fractal Geometry of Nature</em> (1982). The emblem of the field — the
  <strong>Mandelbrot set</strong> — was first plotted around 1978–80, then proved connected and
  named by <strong>Douady</strong> and <strong>Hubbard</strong>.</p>

  <h2>Why they matter</h2>
  <p>Euclid's geometry describes smooth, ideal shapes; almost nothing in nature is smooth.
  Fractal dimension quantifies roughness — coastlines, mountains, lungs, lightning. Fractals
  are the <strong>shape of chaos</strong> (the boundaries of dynamical systems), the basis of
  <strong>image compression</strong> (Barnsley's IFS), of procedural <strong>plants and
  terrain</strong> in graphics (Lindenmayer's L-systems), of <strong>fractal antennas</strong>,
  and of models of <strong>rough markets</strong>. Simple recursive rules, iterated to the limit,
  generate unbounded complexity — and that is often exactly what reality looks like.</p>

  <h2>In this explorer</h2>
  <div class="fractal-list">
    <div><b>Mandelbrot / Julia</b><span>Iterate <em>z → z² + c</em>; color by how fast each point escapes. The Mandelbrot set is the map of every Julia set at once.</span></div>
    <div><b>Multibrot</b><span>The same idea with a higher power <em>zⁿ + c</em> — more lobes.</span></div>
    <div><b>Koch · Sierpiński · dragon · Hilbert · plant</b><span>L-systems: a string-rewriting rule drawn by a "turtle", producing curves of fractional dimension.</span></div>
    <div><b>Barnsley fern</b><span>An Iterated Function System — four random affine maps whose visit-density traces the fern.</span></div>
  </div>

  <h2>Controls</h2>
  <div class="keys-help">
    <div><kbd>drag</kbd> pan</div>
    <div><kbd>scroll</kbd> / <kbd>pinch</kbd> zoom</div>
    <div><kbd>Space</kbd> play / pause tour</div>
    <div><kbd>F</kbd> fullscreen</div>
    <div><kbd>R</kbd> reset view</div>
    <div><kbd>C</kbd> copy deep-link</div>
    <div><kbd>S</kbd> save PNG</div>
    <div><kbd>Tab</kbd> hide controls</div>
    <div><kbd>?</kbd> this panel</div>
  </div>

  <p class="credit">Built with TypeScript + WebGL2. Smooth coloring via the continuous (Douady–Hubbard)
  iteration count through Inigo Quilez cosine palettes. Full history & references in
  <em>docs/fractals.md</em>.</p>
`;

const focusables = (el: HTMLElement): HTMLElement[] =>
  Array.from(el.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])'));

export const openAbout = (): void => {
  if (isOpen) return;
  isOpen = true;
  lastFocus = document.activeElement as HTMLElement;
  const root = document.getElementById('about-root') as HTMLElement;

  const scrim = document.createElement('div');
  scrim.className = 'modal-scrim';
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'About fractals');
  modal.innerHTML = CONTENT;
  scrim.appendChild(modal);
  root.appendChild(scrim);

  const close = (): void => {
    isOpen = false;
    scrim.remove();
    document.removeEventListener('keydown', onKey, true);
    lastFocus?.focus?.();
  };

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'Tab') {
      const items = focusables(modal);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', onKey, true);
  scrim.addEventListener('mousedown', (e) => {
    if (e.target === scrim) close();
  });
  const closeBtn = modal.querySelector<HTMLButtonElement>('.modal-close');
  closeBtn?.addEventListener('click', close);
  closeBtn?.focus();
};

export const aboutIsOpen = (): boolean => isOpen;
