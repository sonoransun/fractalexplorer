// Transient bottom-center toast for confirmations ("Link copied", "Image saved").
export const toast = (message: string, ms = 1800): void => {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  root.appendChild(el);
  window.setTimeout(() => {
    el.classList.add('out');
    window.setTimeout(() => el.remove(), 300);
  }, ms);
};
