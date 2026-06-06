// URL hash <-> FractalScene codec. The hash is the single source of truth for a
// view, giving free shareable deep-links and presets-as-strings. Centers use
// toExponential(12) (via fmt) to preserve enough mantissa for deep zooms.
import { defaultScene, type DensityRemap, type FractalKind, type FractalScene, type TrapKind } from '../app/scene';
import { META_BY_KIND } from '../fractals/registry';
import { PRESET_BY_ID } from '../color/palette';
import { fmt, clamp } from '../util/math';

const KINDS = new Set(Object.keys(META_BY_KIND));
const REMAPS = new Set<DensityRemap>(['sqrt', 'log', 'linear']);
const TRAPS = new Set<TrapKind>(['none', 'stalk', 'point', 'circle']);

export const encodeScene = (s: FractalScene): string => {
  const p = new URLSearchParams();
  p.set('k', s.kind);
  p.set('cx', fmt(s.camera.centerX));
  p.set('cy', fmt(s.camera.centerY));
  p.set('z', fmt(s.camera.zoomLevel));
  if (s.camera.rotation) p.set('rot', fmt(s.camera.rotation));
  p.set('it', String(s.escape.maxIter));
  if (s.escape.power !== 2) p.set('pw', fmt(s.escape.power));
  p.set('jx', fmt(s.escape.juliaC[0]));
  p.set('jy', fmt(s.escape.juliaC[1]));
  p.set('bl', fmt(s.escape.bailout));
  p.set('pal', s.coloring.paletteId);
  p.set('cyc', fmt(s.coloring.cycles));
  p.set('rm', s.coloring.remap);
  p.set('ph', fmt(s.coloring.phase));
  p.set('sh', fmt(s.coloring.shade));
  p.set('gl', fmt(s.coloring.glow));
  p.set('bm', fmt(s.coloring.bloom));
  p.set('tr', s.coloring.trap);
  p.set('cs', fmt(s.anim.cycleSpeed));
  p.set('jo', s.anim.juliaOrbit ? '1' : '0');
  p.set('os', fmt(s.anim.orbitSpeed));
  p.set('lo', s.anim.lightOrbit ? '1' : '0');
  return p.toString();
};

const num = (p: URLSearchParams, key: string, fallback: number): number => {
  const v = p.get(key);
  if (v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/** Decode a hash (with or without leading '#') into a full scene, merged with defaults. */
export const decodeScene = (hash: string): FractalScene | null => {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return null;
  const p = new URLSearchParams(raw);
  if (![...p.keys()].length) return null;

  const s = defaultScene();
  const k = p.get('k');
  if (k && KINDS.has(k)) s.kind = k as FractalKind;

  s.camera.centerX = num(p, 'cx', s.camera.centerX);
  s.camera.centerY = num(p, 'cy', s.camera.centerY);
  s.camera.zoomLevel = clamp(num(p, 'z', s.camera.zoomLevel), -3, 40);
  s.camera.rotation = num(p, 'rot', 0);

  s.escape.maxIter = clamp(Math.round(num(p, 'it', s.escape.maxIter)), 16, 4000);
  s.escape.power = num(p, 'pw', s.escape.power);
  s.escape.juliaC = [num(p, 'jx', s.escape.juliaC[0]), num(p, 'jy', s.escape.juliaC[1])];
  s.escape.bailout = Math.max(4, num(p, 'bl', s.escape.bailout));

  const pal = p.get('pal');
  if (pal && PRESET_BY_ID[pal]) s.coloring.paletteId = pal;
  s.coloring.cycles = clamp(num(p, 'cyc', s.coloring.cycles), 0.1, 32);
  const rm = p.get('rm') as DensityRemap | null;
  if (rm && REMAPS.has(rm)) s.coloring.remap = rm;
  s.coloring.phase = num(p, 'ph', s.coloring.phase);
  s.coloring.shade = clamp(num(p, 'sh', s.coloring.shade), 0, 1);
  s.coloring.glow = clamp(num(p, 'gl', s.coloring.glow), 0, 4);
  s.coloring.bloom = clamp(num(p, 'bm', s.coloring.bloom), 0, 1);
  const tr = p.get('tr') as TrapKind | null;
  if (tr && TRAPS.has(tr)) s.coloring.trap = tr;

  s.anim.cycleSpeed = clamp(num(p, 'cs', s.anim.cycleSpeed), 0, 2);
  s.anim.juliaOrbit = p.get('jo') === '1';
  s.anim.orbitSpeed = clamp(num(p, 'os', s.anim.orbitSpeed), 0, 2);
  s.anim.lightOrbit = p.get('lo') !== '0';
  return s;
};

export const readSceneFromURL = (): FractalScene | null => {
  try {
    return decodeScene(window.location.hash);
  } catch {
    return null;
  }
};

/** Debounced writer — replaceState avoids flooding history during pan/zoom. */
export const makeURLWriter = (delayMs = 220): ((s: FractalScene) => void) => {
  let timer = 0;
  return (s: FractalScene) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      const hash = '#' + encodeScene(s);
      history.replaceState(null, '', hash);
    }, delayMs);
  };
};
