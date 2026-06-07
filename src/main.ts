// Bootstrap + hash router. Three views share one persistent canvas/engine/loop:
//   #/  Home (landing)   ·   #/explore?<scene>  Explorer   ·   #/history  History
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
import { createPanel, type PanelHandle } from './ui/panel';
import { createTopbar, type TopbarHandle } from './ui/topbar';
import { attachShortcuts } from './ui/shortcuts';
import { toast } from './ui/toast';
import { saveCanvasPng, shareCanvas } from './export/image';
import { SPIRAL_MARK } from './ui/icons';
import { buildHome } from './ui/home';
import { buildHistory } from './ui/history';
import { defaultScene } from './app/scene';
import { makeURLWriter, decodeScene, encodeScene } from './state/urlstate';
import { parseRoute, navigate, HOME_HREF, HISTORY_HREF, exploreHref, type RouteName } from './app/router';

// The app booted, so it's being served correctly — drop the file:// fallback note.
document.getElementById('boot-fallback')?.remove();

const canvas = document.getElementById('view') as HTMLCanvasElement;
const hud = document.getElementById('hud') as HTMLElement;
const panelEl = document.getElementById('panel') as HTMLElement;
const toggle = document.getElementById('panel-toggle') as HTMLButtonElement;

// Brand: logomark + click/Enter returns to Home (works regardless of WebGL support).
const brand = document.querySelector('.brand') as HTMLElement | null;
if (brand) {
  brand.insertAdjacentHTML('afterbegin', `<span class="brand-logo" aria-hidden="true">${SPIRAL_MARK}</span>`);
  brand.setAttribute('role', 'button');
  brand.setAttribute('tabindex', '0');
  brand.setAttribute('aria-label', 'Home');
  brand.addEventListener('click', () => navigate(HOME_HREF));
  brand.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(HOME_HREF);
    }
  });
}

// Static views render even if the renderer fails (so the main page is never blank).
buildHome();
buildHistory();

const engine = new Engine(canvas, defaultScene());
const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentRoute: RouteName = 'home';
let panel: PanelHandle | null = null;
let topbar: TopbarHandle | null = null;

if (!engine.ok) {
  hud.style.display = 'none';
  toast('WebGL2 is unavailable — the live explorer is disabled, but you can still browse.', 5000);
} else {
  const applyReducedMotion = () => {
    if (reduceMq.matches) {
      engine.scene.anim.motionScale = 0;
      engine.scene.anim.juliaOrbit = false;
    }
  };
  applyReducedMotion();
  reduceMq.addEventListener('change', applyReducedMotion);

  const writeURL = makeURLWriter();
  const onChange = () => {
    if (currentRoute === 'explore') writeURL(engine.scene);
  };

  const drawNow = () => engine.render();
  const showHistory = () => navigate(HISTORY_HREF);
  const copyLink = () => {
    const url = location.origin + location.pathname + exploreHref(encodeScene(engine.scene));
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

  panel = createPanel(engine, onChange);
  const toggleTour = () => {
    if (engine.tourActive) engine.stopTour();
    else {
      engine.startTour();
      panel?.rebuild();
    }
    topbar?.setTourActive(engine.tourActive);
  };

  topbar = createTopbar({
    onTour: toggleTour,
    onAbout: showHistory,
    onSave: doSave,
    onShare: doShare,
    onFullscreen: doFullscreen,
  });

  attachInput(canvas, engine, onChange);

  attachShortcuts({
    tour: () => {
      if (currentRoute === 'explore') toggleTour();
    },
    about: showHistory,
    fullscreen: () => {
      if (currentRoute === 'explore') doFullscreen();
    },
    reset: () => {
      if (currentRoute === 'explore') {
        engine.resetView();
        onChange();
      }
    },
    copy: () => {
      if (currentRoute === 'explore') copyLink();
    },
    save: () => {
      if (currentRoute === 'explore') doSave();
    },
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

  // Panel show/hide (Tab, or the floating toggle on mobile / when hidden).
  const setPanelHidden = (hidden: boolean) => {
    panelEl.classList.toggle('hidden', hidden);
    toggle.classList.toggle('show', hidden);
    toggle.setAttribute('aria-label', hidden ? 'Show controls' : 'Hide controls');
  };
  toggle.addEventListener('click', () => setPanelHidden(!panelEl.classList.contains('hidden')));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && currentRoute === 'explore' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLSelectElement)) {
      e.preventDefault();
      setPanelHidden(!panelEl.classList.contains('hidden'));
    }
  });

  // HUD readout + keep the Tour button in sync (interaction can cancel the tour).
  const updateHud = () => {
    if (currentRoute !== 'explore') return;
    const [bw, bh] = engine.backingSize;
    const mag = engine.magnification;
    const magStr = mag >= 1e4 ? mag.toExponential(1) : mag.toFixed(mag < 10 ? 2 : 0);
    const warn = engine.precisionWarn ? '   <span class="warn">⚠ precision limit</span>' : '';
    hud.innerHTML = `${engine.fps.toFixed(0)} fps   ×${magStr}   ${bw}×${bh}${warn}`;
    topbar?.setTourActive(engine.tourActive);
  };
  window.setInterval(updateHud, 200);

  new Loop(engine).start();
}

// ---- routing --------------------------------------------------------------
const applyRoute = () => {
  const r = parseRoute(location.hash);
  currentRoute = r.name;
  document.body.classList.toggle('route-home', r.name === 'home');
  document.body.classList.toggle('route-explore', r.name === 'explore');
  document.body.classList.toggle('route-history', r.name === 'history');

  if (engine.ok) {
    if (r.name === 'explore') {
      if (r.query) {
        const s = decodeScene(r.query);
        if (s) engine.adoptScene(s);
      }
      panel?.rebuild();
      topbar?.setTourActive(engine.tourActive);
    } else if (r.name === 'home') {
      if (!engine.tourActive && !reduceMq.matches) {
        engine.startTour();
        topbar?.setTourActive(true);
      }
    }
  }
  if (r.name === 'home') document.getElementById('home')?.scrollTo({ top: 0 });
  if (r.name === 'history') document.getElementById('history')?.scrollTo({ top: 0 });
};

window.addEventListener('hashchange', applyRoute);
applyRoute();
