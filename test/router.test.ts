import { describe, it, expect } from 'vitest';
import { parseRoute, exploreHref } from '../src/app/router';

describe('router', () => {
  it('parses the three routes', () => {
    expect(parseRoute('').name).toBe('home');
    expect(parseRoute('#').name).toBe('home');
    expect(parseRoute('#/').name).toBe('home');
    expect(parseRoute('#/history').name).toBe('history');
    const e = parseRoute('#/explore?k=julia&cx=0');
    expect(e.name).toBe('explore');
    expect(e.query).toBe('k=julia&cx=0');
    expect(parseRoute('#/explore').query).toBe('');
  });

  it('treats legacy bare-scene hashes as explore (back-compat)', () => {
    const r = parseRoute('#k=mandelbrot&cx=-0.6&z=3');
    expect(r.name).toBe('explore');
    expect(r.query).toBe('k=mandelbrot&cx=-0.6&z=3');
  });

  it('builds explore hrefs', () => {
    expect(exploreHref('k=x')).toBe('#/explore?k=x');
    expect(exploreHref('')).toBe('#/explore');
  });
});
