// First-visit welcome overlay. Fades in over the already-zooming Mandelbrot and
// explains what you're looking at, with a "Begin exploring" call-to-action and a
// link to the deeper history (the About modal). Shown once (localStorage), and
// re-openable from the topbar / brand / "?" shortcut.
const KEY = 'fe.welcome.seen.v1';

const seen = (): boolean => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};
const markSeen = (): void => {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    /* private mode — ignore */
  }
};

let isOpen = false;
let lastFocus: HTMLElement | null = null;

const focusables = (el: HTMLElement): HTMLElement[] =>
  Array.from(el.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])'));

/** Open the welcome overlay. `onHistory` opens the deep About modal. */
export const openWelcome = (onHistory: () => void): void => {
  if (isOpen) return;
  isOpen = true;
  lastFocus = document.activeElement as HTMLElement;
  const root = document.getElementById('welcome-root') as HTMLElement;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const controls = coarse
    ? 'Drag to pan · pinch to zoom'
    : 'Drag to pan · scroll to zoom · <kbd>Tab</kbd> hides the controls';

  const scrim = document.createElement('div');
  scrim.className = 'welcome-scrim';
  const card = document.createElement('div');
  card.className = 'welcome-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  card.setAttribute('aria-label', 'Welcome to Fractal Explorer');
  card.innerHTML = `
    <p class="welcome-eyebrow">An interactive fractal explorer</p>
    <h1 class="welcome-title">The <em>Mandelbrot</em> Set</h1>
    <p class="welcome-lede">You're looking into the Mandelbrot set — the infinitely intricate
      shape born from a single equation, <span class="mono">z → z² + c</span>. Every edge you
      zoom into hides more detail, without end. The view is already diving in; take the wheel
      whenever you like.</p>
    <p class="welcome-controls">${controls}</p>
    <div class="welcome-actions">
      <button class="welcome-cta" type="button">Begin exploring</button>
      <button class="welcome-history" type="button">The history of fractals →</button>
    </div>`;
  scrim.appendChild(card);
  root.appendChild(scrim);

  const close = (): void => {
    if (!isOpen) return;
    isOpen = false;
    markSeen();
    document.removeEventListener('keydown', onKey, true);
    scrim.classList.add('out');
    window.setTimeout(() => scrim.remove(), 260);
    lastFocus?.focus?.();
  };

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'Tab') {
      const items = focusables(card);
      if (!items.length) return;
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

  scrim.addEventListener('mousedown', (e) => {
    if (e.target === scrim) close(); // click the dimmed canvas around the card
  });
  card.querySelector('.welcome-cta')?.addEventListener('click', close);
  card.querySelector('.welcome-history')?.addEventListener('click', () => {
    close();
    onHistory();
  });
  document.addEventListener('keydown', onKey, true);
  (card.querySelector('.welcome-cta') as HTMLElement | null)?.focus();
};

/** Open only on a visitor's first time. */
export const maybeOpenWelcome = (onHistory: () => void): void => {
  if (!seen()) openWelcome(onHistory);
};

export const welcomeIsOpen = (): boolean => isOpen;
