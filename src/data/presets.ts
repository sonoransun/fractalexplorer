// Curated, workflow-verified "famous fractal at a coordinate + depth" presets, and
// the canonical formula reference. Each preset builds a FractalScene and a deep-link
// into the explorer. Coordinates/constants are sourced & corrected (e.g. Seahorse
// Valley center -0.75+0.1i; Basilica Julia c=-1; Douady rabbit c≈-0.123+0.745i).
import { defaultScene, type FractalScene, type FractalKind } from '../app/scene';
import { encodeScene } from '../state/urlstate';
import { exploreHref } from '../app/router';

export type PresetGroup = 'Mandelbrot' | 'Julia' | 'Multibrot';

export interface FractalPreset {
  name: string;
  group: PresetGroup;
  kind: FractalKind;
  formula: string;
  center: [number, number];
  magnification: number;
  juliaC?: [number, number];
  power?: number;
  blurb: string;
}

export const PRESETS: FractalPreset[] = [
  // --- Mandelbrot landmarks (z → z² + c) ---
  { name: 'Seahorse Valley', group: 'Mandelbrot', kind: 'mandelbrot', formula: 'z → z² + c', center: [-0.75, 0.1], magnification: 250, blurb: 'The pinched neck between the cardioid and the period-2 bulb, where filaments coil into seahorse tails.' },
  { name: 'Elephant Valley', group: 'Mandelbrot', kind: 'mandelbrot', formula: 'z → z² + c', center: [0.2825, 0.01], magnification: 250, blurb: "The cardioid's eastern flank, where bulbs trail spiralling trunks nose-to-tail." },
  { name: 'Triple Spiral Valley', group: 'Mandelbrot', kind: 'mandelbrot', formula: 'z → z² + c', center: [-0.088, 0.654], magnification: 600, blurb: 'A three-armed pinwheel braiding filaments into nested spirals around a hidden minibrot.' },
  { name: 'Scepter Valley', group: 'Mandelbrot', kind: 'mandelbrot', formula: 'z → z² + c', center: [-1.36, 0], magnification: 800, blurb: 'A cusp on the western antenna where spiked scepters fuse to seahorses and double spirals.' },
  { name: 'Satellite Minibrot', group: 'Mandelbrot', kind: 'mandelbrot', formula: 'z → z² + c', center: [-1.75, 0], magnification: 4000, blurb: 'The largest mini-Mandelbrot on the western needle — a self-similar copy of the whole set.' },
  { name: 'Misiurewicz Point', group: 'Mandelbrot', kind: 'mandelbrot', formula: 'z → z² + c', center: [-0.77568377, 0.13646737], magnification: 30000, blurb: 'A pre-periodic branch point — the exact center of a two-armed spiral in the seahorse valley.' },
  { name: 'Feigenbaum Point', group: 'Mandelbrot', kind: 'mandelbrot', formula: 'z → z² + c', center: [-1.401155, 0], magnification: 5000, blurb: 'The period-doubling accumulation point where the cascade converges toward the needle.' },
  { name: 'Double Spiral', group: 'Mandelbrot', kind: 'mandelbrot', formula: 'z → z² + c', center: [-0.745428, 0.113009], magnification: 90000, blurb: 'A deep-zoom whirlpool of counter-rotating arms spinning out of the seahorse valley.' },

  // --- Julia sets (z → z² + c, c fixed) ---
  { name: 'Douady Rabbit', group: 'Julia', kind: 'julia', formula: 'z → z² + c', juliaC: [-0.123, 0.745], center: [0, 0], magnification: 1.4, blurb: 'A period-3 set whose every junction sprouts a fresh pair of ears — rabbits within rabbits.' },
  { name: 'Basilica (San Marco)', group: 'Julia', kind: 'julia', formula: 'z → z² + c', juliaC: [-1, 0], center: [0, 0], magnification: 1.2, blurb: 'The period-2 set: a chain of pinched disks like the domes and reflections of San Marco.' },
  { name: 'Dendrite', group: 'Julia', kind: 'julia', formula: 'z → z² + c', juliaC: [0, 1], center: [0, 0], magnification: 1.2, blurb: 'An interior-free filigree of nerve-like branches at the Misiurewicz point c = i.' },
  { name: 'Siegel Disk', group: 'Julia', kind: 'julia', formula: 'z → z² + c', juliaC: [-0.390541, -0.586788], center: [0, 0], magnification: 2, blurb: 'A neutral rotation domain with golden-mean rotation number, self-similar about its center.' },
  { name: 'Spiral', group: 'Julia', kind: 'julia', formula: 'z → z² + c', juliaC: [-0.7269, 0.1889], center: [0, 0], magnification: 3, blurb: 'A near-parabolic value whose orbits wind into delicate logarithmic spiral arms.' },
  { name: 'Airplane', group: 'Julia', kind: 'julia', formula: 'z → z² + c', juliaC: [-1.7549, 0], center: [0, 0], magnification: 1.1, blurb: 'A real period-3 set whose symmetric fuselage and swept-back wings read like an aircraft.' },

  // --- Multibrot (z → zⁿ + c) ---
  { name: 'Multibrot ³', group: 'Multibrot', kind: 'multibrot', formula: 'z → z³ + c', power: 3, center: [0, 0], magnification: 1, blurb: 'The cubic generalization — twofold symmetry, two main bulbs instead of one cardioid.' },
  { name: 'Multibrot ⁵', group: 'Multibrot', kind: 'multibrot', formula: 'z → z⁵ + c', power: 5, center: [0, 0], magnification: 1, blurb: 'The quintic multibrot — a four-lobed snowflake of ever finer decorative buds.' },
];

/** Build a full FractalScene from a preset. */
export const presetToScene = (p: FractalPreset): FractalScene => {
  const s = defaultScene();
  s.kind = p.kind;
  s.camera.centerX = p.center[0];
  s.camera.centerY = p.center[1];
  s.camera.zoomLevel = Math.log2(p.magnification);
  if (p.juliaC) s.escape.juliaC = [p.juliaC[0], p.juliaC[1]];
  if (p.power != null) s.escape.power = p.power;
  // deeper views need more iterations to resolve the boundary
  s.escape.maxIter = Math.max(s.escape.maxIter, Math.round(150 + 90 * Math.max(0, s.camera.zoomLevel)));
  return s;
};

export const presetHref = (p: FractalPreset): string => exploreHref(encodeScene(presetToScene(p)));

/** Default-framed scene for a fractal kind (mirrors Engine.resetCameraFor). */
export const sceneForKind = (kind: FractalKind): FractalScene => {
  const s = defaultScene();
  s.kind = kind;
  if (kind === 'mandelbrot') {
    s.camera.centerX = -0.6;
    s.camera.centerY = 0;
    s.camera.zoomLevel = 0;
  } else if (kind === 'julia' || kind === 'multibrot') {
    s.camera.centerX = 0;
    s.camera.centerY = 0;
    s.camera.zoomLevel = -0.15;
  } else {
    s.camera.centerX = 0;
    s.camera.centerY = 0;
    s.camera.zoomLevel = -0.1;
  }
  return s;
};

export const kindHref = (kind: FractalKind): string => exploreHref(encodeScene(sceneForKind(kind)));

// --- Canonical formula reference (for the Formulas section) ---
export interface FormulaRef {
  name: string;
  formula: string;
  note: string;
}

export const FORMULAS: FormulaRef[] = [
  { name: 'Mandelbrot', formula: 'zₙ₊₁ = zₙ² + c,  z₀ = 0;  c = pixel.  Escape when |z| > 2', note: 'Per-pixel escape-time set; points of c that never escape form the black interior.' },
  { name: 'Julia', formula: 'zₙ₊₁ = zₙ² + c,  c fixed;  z₀ = pixel', note: 'Same map, but c is constant and the start point varies — each c gives a different set.' },
  { name: 'Multibrot', formula: 'zₙ₊₁ = zₙⁿ + c,  z₀ = 0  (n = power)', note: 'Generalized exponent; an integer power n yields n − 1 lobes (n = 2 is the Mandelbrot set).' },
  { name: 'Koch curve', formula: 'F → F+F−−F+F   (axiom F, angle 60°)', note: 'Replaces each segment with a four-segment bump; dimension ≈ 1.262.' },
  { name: 'Koch snowflake', formula: 'F → F+F−−F+F   (axiom F−−F−−F, 60°)', note: 'Three Koch curves on a triangle — infinite perimeter, finite area.' },
  { name: 'Sierpiński arrowhead', formula: 'A → B−A−B,  B → A+B+A   (60°)', note: 'A space-traversing curve whose limit is the Sierpiński triangle.' },
  { name: 'Heighway dragon', formula: 'X → X+YF+,  Y → −FX−Y   (axiom FX, 90°)', note: 'The paper-folding curve — fold a strip repeatedly, unfold to right angles.' },
  { name: 'Hilbert curve', formula: 'A → +BF−AFA−FB+,  B → −AF+BFB+FA−   (90°)', note: 'A space-filling curve visiting every cell of a grid; preserves locality.' },
  { name: 'Fractal plant', formula: 'X → F+[[X]−X]−F[−FX]+X,  F → FF   (25°)', note: "Lindenmayer's branching L-system; the [ ] stack creates self-similar branches." },
  { name: 'Barnsley fern', formula: '4 affine maps wᵢ(x,y) chosen by probability (chaos game)', note: 'Visit density of the random orbit traces out the fern.' },
];
