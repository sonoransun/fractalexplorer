// L-system definitions for each line-mode fractal, plus a cached mesh builder.
import type { FractalKind } from '../app/scene';
import {
  type LSystemDef,
  type LineMesh,
  rewrite,
  turtle,
  normalize,
  buildLineMesh,
} from './lsystem';

export const LSYSTEMS: Partial<Record<FractalKind, LSystemDef>> = {
  koch: { axiom: 'F', rules: { F: 'F+F--F+F' }, angleDeg: 60, draw: 'F', depth: 4 },
  snowflake: { axiom: 'F--F--F', rules: { F: 'F+F--F+F' }, angleDeg: 60, draw: 'F', depth: 4 },
  sierpinski: { axiom: 'A', rules: { A: 'B-A-B', B: 'A+B+A' }, angleDeg: 60, draw: 'AB', depth: 6 },
  dragon: { axiom: 'FX', rules: { X: 'X+YF+', Y: '-FX-Y' }, angleDeg: 90, draw: 'F', depth: 11 },
  hilbert: {
    axiom: 'A',
    rules: { A: '+BF-AFA-FB+', B: '-AF+BFB+FA-' },
    angleDeg: 90,
    draw: 'F',
    depth: 5,
  },
  plant: {
    axiom: 'X',
    rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' },
    angleDeg: 25,
    draw: 'F',
    depth: 5,
  },
};

const meshCache = new Map<string, LineMesh>();

/** Build (and cache) the line mesh for a fractal kind at an optional depth override. */
export const lineMeshFor = (kind: FractalKind, depthOverride?: number): LineMesh => {
  const base = LSYSTEMS[kind];
  if (!base) throw new Error(`No L-system for kind: ${kind}`);
  const def: LSystemDef = depthOverride != null ? { ...base, depth: depthOverride } : base;
  const key = `${kind}:${def.depth}`;
  const cached = meshCache.get(key);
  if (cached) return cached;
  const mesh = buildLineMesh(normalize(turtle(rewrite(def), def)));
  meshCache.set(key, mesh);
  return mesh;
};

export const maxDepthFor = (kind: FractalKind): number => {
  // Cap depth so segment counts stay sane (Koch grows 4^n).
  switch (kind) {
    case 'koch':
    case 'snowflake':
      return 6;
    case 'sierpinski':
      return 8;
    case 'dragon':
      return 16;
    case 'hilbert':
      return 7;
    case 'plant':
      return 7;
    default:
      return 6;
  }
};
