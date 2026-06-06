// Bootstrap: pick backend -> build engine -> wire input, panel, topbar, About,
// onboarding, shortcuts, export, URL state, resize/DPR, reduced-motion, HUD, and
// the cinematic auto-tour -> start the loop.

// Self-hosted fonts (latin subset) — bundled so the look is reliable offline.
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/hanken-grotesk/latin-400.css';
import '@fontsource/hanken-grotesk/latin-500.css';
import '@fontsource/hanken-grotesk/latin-600.css';
import '@fontsource/hanken-grotesk/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import './styles.css';
import { Engine } from './app/engine';
import { Loop } from './app/loop';
import { attachInput } from './app/input';
import { createPanel } from './ui/panel';
import { createTopbar, type TopbarHandle } from './ui/topbar';
import { openAbout } from './ui/about';
import { createHint } from './ui/hint';
import { attachShortcuts } from './ui/shortcuts';
import { toast } from './ui/toast';
import { saveCanvasPng, shareCanvas } from './export/image';
import { SPIRAL_MARK } from './ui/icons';
import { defaultScene } from './app/scene';
import { readSceneFromURL, makeURLWriter, encodeScene } from './state/urlstate';

const canvas = document.getElementById('view') as HTMLCanvasElement;
const hud = document.getElementById('hud') as HTMLElement;
const panelEl = document.getElementById('panel') as HTMLElement;
const toggle = document.getElementById('panel-toggle') as HTMLButtonElement;

// Brand logomark (always present, even if the renderer fails to start).
document
  .querySelector('.brand')
  ?.insertAdjacentHTML('afterbegin', `<span class="brand-logo" aria-hidden="true">${SPIRAL_MARK}</span>`);

const urlScene = readSceneFromURL();
const hadDeepLink = urlScene !== null;
const engine = new Engine(canvas, urlScene ?? defaultScene());

if (!engine.ok) {
  panelEl.innerHTML =
    '<h1 style="font-family:var(--font-display);font-size:28px;margin:8px 0">Fractal Explorer</h1><p style="color:var(--ink-dim)">WebGL2 is unavailable in this browser, so the renderer could not start. Try a recent Chrome, Edge, Firefox, or Safari.</p>';
  hud.style.display = 'none';
} else {
  // Reduced-motion: freeze camera/structural motion at startup; the user can
  // re-enable via the Motion slider. We never auto-play a zoom under this setting.
  const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyReducedMotion = () => {
    if (reduceMq.matches) {
      engine.scene.anim.motionScale = 0;
      engine.scene.anim.juliaOrbit = false;
    }
  };
  applyReducedMotion();
  reduceMq.addEventListener('change', applyReducedMotion);

  const writeURL = makeURLWriter();
  const onChange = () => writeURL(engine.scene);

  const drawNow = () => engine.render();
  const copyLink = () => {
    const url = location.origin + location.pathname + '#' + encodeScene(engine.scene);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => toast('Link copied')).catch(() => toast('Copy failed'));
    } else {
      toast('Copy not supported');
    }
  };
  const doSave = () => {
    saveCanvasPng(canvas, drawNow);
    toast('Image saved');
  };
  const doShare = () => {
    void shareCanvas(canvas, drawNow).then((shared) => {
      if (!shared) doSave();
    });
  };
  const doFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void document.documentElement.requestFullscreen();
  };

  const panel = createPanel(engine, onChange);
  let topbar: TopbarHandle;
  const toggleTour = () => {
    if (engine.tourActive) {
      engine.stopTour();
    } else {
      engine.startTour();
      panel.rebuild(); // tour forces Mandelbrot; reflect it in the controls
    }
    topbar.setTourActive(engine.tourActive);
  };

  topbar = createTopbar({
    onTour: toggleTour,
    onAbout: openAbout,
    onSave: doSave,
    onShare: doShare,
    onFullscreen: doFullscreen,
  });

  attachInput(canvas, engine, onChange);

  const hint = createHint(() => {
    engine.startTour();
    panel.rebuild();
    topbar.setTourActive(true);
  });

  attachShortcuts({
    tour: toggleTour,
    about: openAbout,
    fullscreen: doFullscreen,
    reset: () => {
      engine.resetView();
      onChange();
    },
    copy: copyLink,
    save: doSave,
  });

  // Resize + device-pixel-ratio changes.
  const doResize = () => {
    const cssW = canvas.clientWidth || window.innerWidth;
    const cssH = canvas.clientHeight || window.innerHeight;
    engine.resize(cssW, cssH, window.devicePixelRatio || 1);
  };
  let dprMq: MediaQueryList | null = null;
  const onDpr = () => {
    doResize();
    watchDpr();
  };
  const watchDpr = () => {
    dprMq?.removeEventListener('change', onDpr);
    dprMq = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    dprMq.addEventListener('change', onDpr);
  };
  window.addEventListener('resize', doResize);
  watchDpr();
  doResize();

  // Adopt a pasted/edited deep-link (replaceState from our own writer won't fire this).
  window.addEventListener('hashchange', () => {
    const s = readSceneFromURL();
    if (!s) return;
    engine.adoptScene(s);
    panel.rebuild();
    topbar.setTourActive(false);
  });

  // Panel show/hide (Tab, or the floating toggle on mobile / when hidden).
  const setPanelHidden = (hidden: boolean) => {
    panelEl.classList.toggle('hidden', hidden);
    // On phones the FAB is always available (to reopen the bottom sheet); on
    // desktop it only appears once the panel is hidden — CSS handles visibility.
    toggle.classList.toggle('show', hidden);
    toggle.setAttribute('aria-label', hidden ? 'Show controls' : 'Hide controls');
  };
  toggle.addEventListener('click', () => setPanelHidden(!panelEl.classList.contains('hidden')));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLSelectElement)) {
      e.preventDefault();
      setPanelHidden(!panelEl.classList.contains('hidden'));
    }
  });

  // HUD readout + keep the Tour button in sync (interaction can cancel the tour).
  const updateHud = () => {
    const [bw, bh] = engine.backingSize;
    const mag = engine.magnification;
    const magStr = mag >= 1e4 ? mag.toExponential(1) : mag.toFixed(mag < 10 ? 2 : 0);
    const warn = engine.precisionWarn ? '   <span class="warn">⚠ precision limit</span>' : '';
    hud.innerHTML = `${engine.fps.toFixed(0)} fps   ×${magStr}   ${bw}×${bh}${warn}`;
    topbar.setTourActive(engine.tourActive);
  };
  window.setInterval(updateHud, 200);

  // Begin: cinematic auto-tour unless the user arrived via a deep-link or prefers
  // reduced motion. Otherwise show the onboarding hint.
  if (!hadDeepLink && !reduceMq.matches) {
    engine.startTour();
    topbar.setTourActive(true);
  }
  hint.maybeShow();

  new Loop(engine).start();
}
