// Inline SVG icons (currentColor), so there's no icon dependency or font.
const stroke = (body: string): string =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

// Brand logomark: a sampled logarithmic spiral (the signature of self-similar growth).
const spiralPoints = (() => {
  const pts: string[] = [];
  const turns = 3.4;
  const steps = 130;
  const b = 0.13;
  const r0 = 0.6;
  for (let i = 0; i <= steps; i++) {
    const th = (i / steps) * turns * 2 * Math.PI;
    const r = r0 * Math.exp(b * th);
    pts.push(`${(12 + r * Math.cos(th)).toFixed(2)},${(12 + r * Math.sin(th)).toFixed(2)}`);
  }
  return pts.join(' ');
})();

export const SPIRAL_MARK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="${spiralPoints}"/></svg>`;

export const ICONS = {
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.2v13.6L19 12 8 5.2z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5" width="3.6" height="14" rx="1.1"/><rect x="13.9" y="5" width="3.6" height="14" rx="1.1"/></svg>`,
  info: stroke('<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.6" r="0.9" fill="currentColor" stroke="none"/>'),
  save: stroke('<path d="M12 3.5v10.5"/><path d="M8 10.5l4 4 4-4"/><path d="M5 19.5h14"/>'),
  share: stroke('<circle cx="6.5" cy="12" r="2.3"/><circle cx="17.5" cy="6" r="2.3"/><circle cx="17.5" cy="18" r="2.3"/><line x1="8.5" y1="10.9" x2="15.5" y2="7"/><line x1="8.5" y1="13.1" x2="15.5" y2="17"/>'),
  fullscreen: stroke('<path d="M4 9V4.5h5"/><path d="M20 9V4.5h-5"/><path d="M4 15v4.5h5"/><path d="M20 15v4.5h-5"/>'),
  minimize: stroke('<path d="M6 9.5l6 6 6-6"/>'),
};
