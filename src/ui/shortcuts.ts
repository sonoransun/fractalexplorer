// Global keyboard shortcuts. Ignored while typing in a form control.
export interface ShortcutActions {
  tour: () => void;
  about: () => void;
  fullscreen: () => void;
  reset: () => void;
  copy: () => void;
  save: () => void;
}

export const attachShortcuts = (a: ShortcutActions): (() => void) => {
  const onKey = (e: KeyboardEvent): void => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        a.tour();
        break;
      case 'f':
      case 'F':
        a.fullscreen();
        break;
      case '?':
      case 'i':
      case 'I':
        a.about();
        break;
      case 'r':
      case 'R':
        a.reset();
        break;
      case 'c':
      case 'C':
        a.copy();
        break;
      case 's':
      case 'S':
        a.save();
        break;
    }
  };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
};
