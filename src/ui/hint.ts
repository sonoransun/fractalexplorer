// First-visit onboarding pill. Shows once (persisted in localStorage), offers to
// start the tour, and auto-dismisses after a while or on first interaction.
const KEY = 'fe.hint.seen.v1';

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

export interface HintHandle {
  maybeShow(): void;
  dismiss(): void;
}

export const createHint = (onTour: () => void): HintHandle => {
  const el = document.getElementById('hint') as HTMLElement;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const tip = coarse
    ? 'Drag to pan · pinch to zoom'
    : 'Drag to pan · scroll to zoom · <span class="keys">Tab</span> hides controls';
  el.innerHTML = `
    <span>${tip}</span>
    <button class="hint-tour" type="button">Take the tour →</button>
    <button class="hint-x" type="button" aria-label="Dismiss hint">×</button>`;

  const dismiss = (): void => {
    el.classList.remove('show');
    markSeen();
  };
  el.querySelector('.hint-tour')?.addEventListener('click', () => {
    onTour();
    dismiss();
  });
  el.querySelector('.hint-x')?.addEventListener('click', dismiss);

  const maybeShow = (): void => {
    if (seen()) return;
    el.classList.add('show');
    window.setTimeout(() => {
      if (el.classList.contains('show')) dismiss();
    }, 13000);
  };

  return { maybeShow, dismiss };
};
