// The scrolling landing page (route #/). A transparent hero over the live
// Mandelbrot zoom, then three sections: History teaser, Gallery (thumbnails), and
// Formulas (verified famous-coordinate deep-links + a formula reference).
import { FRACTALS } from '../fractals/registry';
import { PRESETS, FORMULAS, presetHref, kindHref, type FractalPreset, type PresetGroup } from '../data/presets';
import { HISTORY_HREF, exploreHref } from '../app/router';
import { SPIRAL_MARK } from './icons';

let built = false;

const nf = (x: number): string => {
  const s = x.toFixed(Math.abs(x) < 1 ? 4 : 3);
  return s.replace(/\.?0+$/, '') || '0';
};

const coordLabel = (p: FractalPreset): string => {
  if (p.kind === 'julia') {
    const im = p.juliaC ? p.juliaC[1] : 0;
    return `c = ${nf(p.juliaC ? p.juliaC[0] : 0)} ${im >= 0 ? '+' : '−'} ${nf(Math.abs(im))}i`;
  }
  if (p.kind === 'multibrot') return `power ${p.power}`;
  const mag = p.magnification >= 1000 ? `${(p.magnification / 1000).toFixed(p.magnification % 1000 ? 1 : 0)}k` : `${p.magnification}`;
  return `(${nf(p.center[0])}, ${nf(p.center[1])}) · ×${mag}`;
};

export const buildHome = (): void => {
  if (built) return;
  built = true;
  const root = document.getElementById('home') as HTMLElement;

  const galleryCards = FRACTALS.map(
    (f) => `
      <a class="gcard" href="${kindHref(f.kind)}" aria-label="${f.name}">
        <span class="gthumb" style="background-image:url('thumbnails/${f.kind}.jpg')"></span>
        <span class="gmeta"><span class="gname">${f.name}</span><span class="ggroup">${f.group}</span></span>
      </a>`,
  ).join('');

  const groups: PresetGroup[] = ['Mandelbrot', 'Julia', 'Multibrot'];
  const presetGroups = groups
    .map((g) => {
      const items = PRESETS.filter((p) => p.group === g)
        .map(
          (p) => `
          <a class="formula-link" href="${presetHref(p)}">
            <span class="fl-head"><span class="fl-name">${p.name}</span><span class="fl-coord">${coordLabel(p)}</span></span>
            <span class="fl-formula">${p.formula}</span>
            <span class="fl-blurb">${p.blurb}</span>
          </a>`,
        )
        .join('');
      return `<div class="formula-group"><h3>${g}</h3><div class="formula-list">${items}</div></div>`;
    })
    .join('');

  const formulaRef = FORMULAS.map(
    (f) => `<div class="fref"><b>${f.name}</b><code>${f.formula}</code><span>${f.note}</span></div>`,
  ).join('');

  root.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-logo">${SPIRAL_MARK}</div>
        <h1 class="hero-title">Fractal <em>Explorer</em></h1>
        <p class="hero-tag">An interactive journey into the Mandelbrot set, Julia sets, and the
          geometry of infinite detail — animated and color-cycled in your browser.</p>
        <div class="hero-actions">
          <a class="hero-cta" href="${exploreHref('')}">Enter the explorer</a>
          <a class="hero-link" href="${HISTORY_HREF}">Read the history →</a>
        </div>
      </div>
      <div class="scroll-cue" aria-hidden="true"><span>scroll</span></div>
    </section>

    <div class="home-content">
      <section class="home-section" id="home-history">
        <p class="eyebrow">History</p>
        <blockquote class="pullquote">"Clouds are not spheres, mountains are not cones, coastlines are
          not circles … nature exhibits not simply a higher degree but an altogether different level of
          complexity."<cite>— Benoît Mandelbrot</cite></blockquote>
        <p class="section-lede">From the 19th-century "monsters" of Weierstrass, Koch and Sierpiński,
          through Julia and Fatou, to Mandelbrot at IBM — fractals became a language for the irregular
          and the very shape of chaos.</p>
        <a class="section-more" href="${HISTORY_HREF}">Read the full history →</a>
      </section>

      <section class="home-section" id="home-gallery">
        <p class="eyebrow">Gallery</p>
        <h2 class="section-title">Common fractal types</h2>
        <p class="section-lede">Eleven families, from escape-time sets to L-systems and the chaos game.
          Open any of them live.</p>
        <div class="gallery-grid">${galleryCards}</div>
      </section>

      <section class="home-section" id="home-formulas">
        <p class="eyebrow">Formulas</p>
        <h2 class="section-title">Famous coordinates &amp; formulas</h2>
        <p class="section-lede">Each link opens the explorer at a known formula, coordinate, and zoom
          depth — landmarks named and charted over a century of fractal cartography.</p>
        ${presetGroups}
        <h3 class="ref-title">Formula reference</h3>
        <div class="formula-ref">${formulaRef}</div>
      </section>

      <footer class="home-footer">
        <span>${SPIRAL_MARK}</span>
        <p>Built with TypeScript &amp; WebGL2. <a href="${exploreHref('')}">Open the explorer →</a></p>
      </footer>
    </div>`;
};
