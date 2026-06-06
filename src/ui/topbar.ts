// Top-bar action cluster: Tour (play/pause), About, Save PNG, Share (if supported),
// Fullscreen. Icons are inline SVG; the Tour button reflects live tour state.
import { ICONS } from './icons';

export interface TopbarActions {
  onTour: () => void;
  onAbout: () => void;
  onSave: () => void;
  onShare: () => void;
  onFullscreen: () => void;
}

export interface TopbarHandle {
  setTourActive(active: boolean): void;
}

export const createTopbar = (actions: TopbarActions): TopbarHandle => {
  const root = document.getElementById('topbar-actions') as HTMLElement;

  const mk = (icon: string, label: string, title: string, fn: () => void): HTMLButtonElement => {
    const b = document.createElement('button');
    b.className = 'icon-btn';
    b.type = 'button';
    b.innerHTML = icon;
    b.setAttribute('aria-label', label);
    b.title = title;
    b.addEventListener('click', fn);
    root.appendChild(b);
    return b;
  };

  const tourBtn = mk(ICONS.play, 'Toggle tour', 'Tour (Space)', actions.onTour);
  mk(ICONS.info, 'About this explorer', 'About (?)', actions.onAbout);
  mk(ICONS.save, 'Save image', 'Save PNG (S)', actions.onSave);
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    mk(ICONS.share, 'Share', 'Share image', actions.onShare);
  }
  mk(ICONS.fullscreen, 'Fullscreen', 'Fullscreen (F)', actions.onFullscreen);

  return {
    setTourActive(active: boolean) {
      tourBtn.classList.toggle('active', active);
      tourBtn.innerHTML = active ? ICONS.pause : ICONS.play;
      tourBtn.setAttribute('aria-pressed', String(active));
    },
  };
};
