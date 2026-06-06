import { defineConfig } from 'vite';

// Minimal config: vanilla TS, no framework. Workers are referenced with
// `new Worker(new URL('...', import.meta.url), { type: 'module' })`, which Vite
// bundles automatically. `base: './'` keeps the build deployable from any subpath
// (e.g. GitHub Pages) without rewriting asset URLs.
export default defineConfig({
  base: './',
  build: {
    target: 'es2021',
    sourcemap: true,
  },
});
