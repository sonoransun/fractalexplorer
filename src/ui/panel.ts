// Control panel. Native HTML controls wired by direct event handlers — no UI
// framework. Color-only controls just call onChange (the color pass picks them
// up next frame); field-affecting controls additionally mark the field dirty.
import type { Engine } from '../app/engine';
import type { FractalKind } from '../app/scene';
import { FRACTALS, META_BY_KIND, modeOf } from '../fractals/registry';
import { maxDepthFor, LSYSTEMS } from '../fractals/lsystem-presets';
import { PALETTE_PRESETS, PRESET_BY_ID, evalPalette, type CosinePalette } from '../color/palette';
import { linearToSrgb } from '../color/oklab';
import { encodeScene } from '../state/urlstate';
import { clamp } from '../util/math';
import { toast } from './toast';

const DESCRIPTORS: Record<FractalKind, string> = {
  mandelbrot: 'The map of every Julia set — z → z² + c.',
  julia: 'A fixed c; the plane of starting points.',
  multibrot: 'z → zⁿ + c — more lobes with higher power.',
  koch: 'Infinite length, finite area (≈1.26 dimensions).',
  snowflake: 'Three Koch curves closed into a flake.',
  sierpinski: 'An arrowhead curve filling the gasket.',
  dragon: 'The Heighway dragon — paper folded forever.',
  hilbert: 'A space-filling curve visiting every cell.',
  plant: "Lindenmayer's branching botany.",
  fern: "Barnsley's four-map chaos game.",
  'sierpinski-ifs': 'The gasket drawn by random points.',
};

const gradientCss = (pal: CosinePalette): string => {
  const N = 16;
  const stops: string[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const c = evalPalette(pal, t).map((v) => Math.round(clamp(linearToSrgb(v), 0, 1) * 255));
    stops.push(`rgb(${c[0]},${c[1]},${c[2]}) ${((t * 100) | 0)}%`);
  }
  return `linear-gradient(90deg, ${stops.join(',')})`;
};

export interface PanelHandle {
  rebuild(): void;
}

export const createPanel = (engine: Engine, onChange: () => void): PanelHandle => {
  const root = document.getElementById('panel') as HTMLElement;

  let sectionIndex = 0;
  const section = (title: string, open = true): HTMLDetailsElement => {
    sectionIndex++;
    const d = document.createElement('details');
    d.className = 'panel-section';
    d.open = open;
    const s = document.createElement('summary');
    s.innerHTML = `<span class="sec-no">${String(sectionIndex).padStart(2, '0')}</span><span class="sec-title">${title}</span>`;
    d.appendChild(s);
    root.appendChild(d);
    return d;
  };

  const rangeRow = (
    parent: HTMLElement,
    label: string,
    get: () => number,
    set: (v: number) => void,
    min: number,
    max: number,
    step: number,
    fieldDirty: boolean,
    fmt: (v: number) => string = (v) => v.toFixed(2),
  ): void => {
    const row = document.createElement('div');
    row.className = 'row';
    const lab = document.createElement('label');
    lab.textContent = label;
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(get());
    const val = document.createElement('span');
    val.className = 'val';
    val.textContent = fmt(get());
    const wrap = document.createElement('div');
    wrap.className = 'slider-wrap';
    const bubble = document.createElement('span');
    bubble.className = 'bubble';
    bubble.textContent = fmt(get());
    const setFill = (v: number) => {
      const pct = max > min ? ((v - min) / (max - min)) * 100 : 0;
      input.style.setProperty('--fill', `${pct}%`);
      // nudge the bubble inward at the extremes so it never clips the track ends
      bubble.style.left = `calc(${pct}% + ${(50 - pct) * 0.13}px)`;
    };
    setFill(get());
    input.addEventListener('input', () => {
      const v = Number(input.value);
      set(v);
      val.textContent = fmt(v);
      bubble.textContent = fmt(v);
      setFill(v);
      if (fieldDirty) engine.markFieldDirty();
      onChange();
    });
    wrap.append(input, bubble);
    row.append(lab, wrap, val);
    parent.appendChild(row);
  };

  const segmentedRow = (
    parent: HTMLElement,
    label: string,
    options: Array<{ value: string; label: string }>,
    get: () => string,
    set: (v: string) => void,
    fieldDirty: boolean,
  ): void => {
    const row = document.createElement('div');
    row.className = 'row';
    const lab = document.createElement('label');
    lab.textContent = label;
    const seg = document.createElement('div');
    seg.className = 'segmented';
    const sync = () =>
      seg.querySelectorAll('button').forEach((b) =>
        b.classList.toggle('active', (b as HTMLButtonElement).dataset.value === get()),
      );
    for (const o of options) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = o.label;
      b.dataset.value = o.value;
      b.addEventListener('click', () => {
        set(o.value);
        if (fieldDirty) engine.markFieldDirty();
        sync();
        onChange();
      });
      seg.appendChild(b);
    }
    sync();
    row.append(lab, seg);
    parent.appendChild(row);
  };

  const selectRow = (
    parent: HTMLElement,
    label: string,
    options: Array<{ value: string; label: string }>,
    get: () => string,
    set: (v: string) => void,
    fieldDirty: boolean,
  ): void => {
    const row = document.createElement('div');
    row.className = 'row wide';
    const lab = document.createElement('label');
    lab.textContent = label;
    const sel = document.createElement('select');
    for (const o of options) {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      sel.appendChild(opt);
    }
    sel.value = get();
    sel.addEventListener('change', () => {
      set(sel.value);
      if (fieldDirty) engine.markFieldDirty();
      onChange();
    });
    row.append(lab, sel);
    parent.appendChild(row);
  };

  const checkboxRow = (
    parent: HTMLElement,
    label: string,
    get: () => boolean,
    set: (v: boolean) => void,
  ): void => {
    const row = document.createElement('div');
    row.className = 'checkbox-row';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = get();
    const lab = document.createElement('label');
    lab.textContent = label;
    input.addEventListener('change', () => {
      set(input.checked);
      onChange();
    });
    row.append(input, lab);
    parent.appendChild(row);
  };

  const button = (parent: HTMLElement, label: string, fn: () => void): void => {
    const b = document.createElement('button');
    b.className = 'btn';
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', fn);
    parent.appendChild(b);
  };

  const rebuild = (): void => {
    const s = engine.scene;
    const mode = modeOf(s.kind);
    root.innerHTML = '';
    sectionIndex = 0;

    // Slim context line (the topbar already carries the wordmark).
    const ctx = document.createElement('div');
    ctx.className = 'panel-context';
    ctx.innerHTML = `<span class="ctx-name">${META_BY_KIND[s.kind].name}</span><span class="ctx-desc">${DESCRIPTORS[s.kind]}</span>`;
    root.appendChild(ctx);

    // --- Fractal ---
    const fSec = section('Fractal');
    const groups = ['Escape-time', 'L-system', 'IFS'] as const;
    const row = document.createElement('div');
    row.className = 'row wide';
    const sel = document.createElement('select');
    for (const g of groups) {
      const og = document.createElement('optgroup');
      og.label = g;
      for (const f of FRACTALS.filter((x) => x.group === g)) {
        const opt = document.createElement('option');
        opt.value = f.kind;
        opt.textContent = f.name;
        og.appendChild(opt);
      }
      sel.appendChild(og);
    }
    sel.value = s.kind;
    sel.addEventListener('change', () => {
      engine.setKind(sel.value as FractalKind);
      onChange();
      rebuild();
    });
    row.appendChild(sel);
    fSec.appendChild(row);

    // --- Palette ---
    const pSec = section('Palette');
    const strip = document.createElement('div');
    strip.className = 'palette-strip';
    const activePalette = s.coloring.custom ?? (PRESET_BY_ID[s.coloring.paletteId]?.palette ?? PALETTE_PRESETS[0].palette);
    strip.style.background = gradientCss(activePalette);
    pSec.appendChild(strip);
    const swatches = document.createElement('div');
    swatches.className = 'swatches';
    for (const preset of PALETTE_PRESETS) {
      const b = document.createElement('button');
      b.className = 'swatch' + (preset.id === s.coloring.paletteId && !s.coloring.custom ? ' active' : '');
      b.style.background = gradientCss(preset.palette);
      b.title = preset.name;
      b.addEventListener('click', () => {
        s.coloring.paletteId = preset.id;
        s.coloring.custom = null;
        onChange();
        rebuild();
      });
      swatches.appendChild(b);
    }
    pSec.appendChild(swatches);
    rangeRow(pSec, 'Cycles', () => s.coloring.cycles, (v) => (s.coloring.cycles = v), 0.25, 16, 0.25, false);
    segmentedRow(
      pSec,
      'Density',
      [
        { value: 'sqrt', label: '√' },
        { value: 'log', label: 'log' },
        { value: 'linear', label: 'lin' },
      ],
      () => s.coloring.remap,
      (v) => (s.coloring.remap = v as typeof s.coloring.remap),
      false,
    );
    rangeRow(pSec, 'Phase', () => s.coloring.phase, (v) => (s.coloring.phase = v), 0, 1, 0.001, false, (v) => v.toFixed(3));
    if (mode === 'escape') {
      rangeRow(pSec, 'Shade', () => s.coloring.shade, (v) => (s.coloring.shade = v), 0, 1, 0.01, false);
      rangeRow(pSec, 'Glow', () => s.coloring.glow, (v) => (s.coloring.glow = v), 0, 4, 0.05, false);
      rangeRow(pSec, 'Filmic', () => s.coloring.bloom, (v) => (s.coloring.bloom = v), 0, 1, 0.01, false);
      selectRow(
        pSec,
        'Orbit trap',
        [
          { value: 'none', label: 'None' },
          { value: 'stalk', label: 'Pickover stalk' },
          { value: 'point', label: 'Point' },
          { value: 'circle', label: 'Circle' },
        ],
        () => s.coloring.trap,
        (v) => (s.coloring.trap = v as typeof s.coloring.trap),
        true,
      );
    }

    // --- Parameters ---
    if (mode === 'escape') {
      const eSec = section('Parameters');
      rangeRow(eSec, 'Iterations', () => s.escape.maxIter, (v) => (s.escape.maxIter = Math.round(v)), 32, 2000, 1, true, (v) => String(Math.round(v)));
      rangeRow(eSec, 'Bailout', () => s.escape.bailout, (v) => (s.escape.bailout = v), 4, 1024, 4, true, (v) => String(Math.round(v)));
      if (s.kind === 'multibrot') {
        rangeRow(eSec, 'Power', () => s.escape.power, (v) => (s.escape.power = v), 2, 8, 0.01, true);
      }
      if (s.kind === 'julia') {
        rangeRow(eSec, 'Julia cₓ', () => s.escape.juliaC[0], (v) => (s.escape.juliaC[0] = v), -1, 1, 0.001, true, (v) => v.toFixed(3));
        rangeRow(eSec, 'Julia cᵧ', () => s.escape.juliaC[1], (v) => (s.escape.juliaC[1] = v), -1, 1, 0.001, true, (v) => v.toFixed(3));
      }
    }

    // --- L-system depth ---
    if (mode === 'lines' && LSYSTEMS[s.kind]) {
      const lSec = section('Geometry');
      const def = LSYSTEMS[s.kind]!;
      const current = engine.lineDepth(s.kind) ?? def.depth;
      rangeRow(
        lSec,
        'Depth',
        () => current,
        (v) => engine.setLineDepth(s.kind, Math.round(v)),
        1,
        maxDepthFor(s.kind),
        1,
        false,
        (v) => String(Math.round(v)),
      );
    }

    // --- Animation ---
    const aSec = section('Animation');
    rangeRow(aSec, 'Cycle speed', () => s.anim.cycleSpeed, (v) => (s.anim.cycleSpeed = v), 0, 1, 0.01, false);
    rangeRow(aSec, 'Motion', () => s.anim.motionScale, (v) => (s.anim.motionScale = v), 0, 1, 0.01, false);
    if (mode === 'escape') {
      checkboxRow(aSec, 'Animate light', () => s.anim.lightOrbit, (v) => (s.anim.lightOrbit = v));
    }
    if (s.kind === 'julia') {
      checkboxRow(aSec, 'Julia c-orbit', () => s.anim.juliaOrbit, (v) => (s.anim.juliaOrbit = v));
      rangeRow(aSec, 'Orbit speed', () => s.anim.orbitSpeed, (v) => (s.anim.orbitSpeed = v), 0, 1, 0.01, false);
    }

    // --- Actions ---
    const actSec = section('View', false);
    const brow = document.createElement('div');
    brow.className = 'btn-row';
    button(brow, 'Reset', () => {
      engine.resetView();
      onChange();
    });
    button(brow, 'Copy link', () => {
      const url = location.origin + location.pathname + '#' + encodeScene(engine.scene);
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(url)
          .then(() => toast('Link copied'))
          .catch(() => toast('Copy failed'));
      } else {
        toast('Copy not supported');
      }
    });
    actSec.appendChild(brow);
  };

  rebuild();
  return { rebuild };
};
