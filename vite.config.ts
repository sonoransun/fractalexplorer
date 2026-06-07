import { defineConfig } from 'vite';

// Minimal config: vanilla TS, no framework. `base: './'` (relative asset paths)
// keeps the build deployable from any subpath. We build into `docs/` and commit it
// so GitHub Pages can serve it directly via "Deploy from a branch → main /docs".
export default defineConfig({
  base: './',
  build: {
    target: 'es2021',
    outDir: 'docs',
    emptyOutDir: true,
    sourcemap: false, // keep the committed build lean and low-churn
  },
});
