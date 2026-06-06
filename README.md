# Fractal Explorer

A browser-based, hardware-accelerated exploration of Mandelbrot, Julia sets, Koch
snowflakes and other self-similar structures — animated and color-cycled with
notable offsets and parameters to explore the popular visual aspects of these
structures.

Built with vanilla **TypeScript + Vite** and hand-written **WebGL2** shaders; no
rendering framework. The bundle is ~14 kB gzipped.

## What's inside

- **Escape-time fractals** — Mandelbrot, Julia, and Multibrot, with continuous
  (smooth) iteration coloring, distance-estimation edges/glow, DE-based emboss
  lighting, and orbit traps (Pickover stalk / point / circle).
- **L-system curves** — Koch curve & snowflake, Sierpinski arrowhead, dragon
  curve, Hilbert curve, and a fractal plant, drawn as screen-constant-width lines.
- **IFS attractors** — Barnsley fern and a Sierpinski point cloud via the chaos
  game, additively splatted into an HDR buffer and log-density tone-mapped.
- **Animated color** — Inigo Quilez cosine palettes evaluated in linear light,
  with real-time palette cycling that runs on a *cached* iteration field (so it
  stays at 60 fps regardless of iteration count). 8 curated palette presets.
- **Cinematic motion** — Julia-constant Lissajous orbit (organic "blooming"),
  animated emboss light, exponential (log-space) zoom, all behind a single motion
  control that `prefers-reduced-motion` forces to zero.
- **Interaction** — drag to pan, scroll to zoom-to-cursor, pinch on touch,
  double-click to zoom in. Adaptive resolution while interacting + an FPS governor.
- **Cinematic auto-tour** — on load it flies a continuous guided loop through
  famous Mandelbrot locations (Seahorse Valley, Elephant Valley, …), breathing out
  to the whole set and diving back in, with color cycling throughout. Any
  interaction hands control back to you; `Space` toggles it.
- **Shareable state & export** — the URL hash is the single source of truth
  ("Copy link" deep-links the exact view); plus one-click **PNG export** and Web
  Share on mobile.
- **In-app About** — an overlay with the history of fractals and their
  significance (the long-form lives in [`docs/fractals.md`](docs/fractals.md)).
- **Polished, responsive UI** — an immersive dark "observatory" design; the
  control panel becomes a bottom sheet on phones; keyboard shortcuts throughout.

## Develop

```bash
npm install
npm run dev        # Vite dev server
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm test           # Vitest unit tests
npm run typecheck  # tsc --noEmit
npm run e2e        # headless WebGL2 smoke test (requires Playwright + chromium)
```

> Node 18 is supported via Vite 5. The headless `e2e` check uses Playwright
> (`npx playwright install chromium`) and is optional.

## Controls

| Action | Input |
| --- | --- |
| Pan | drag |
| Zoom to cursor | scroll wheel / pinch |
| Zoom in | double-click |
| Play / pause tour | `Space` |
| Fullscreen | `F` |
| Reset view | `R` |
| Copy deep-link | `C` |
| Save PNG | `S` |
| About | `?` |
| Toggle panel | `Tab` or the floating button |

## Mathematics & history

The story of fractals — from the 19th-century "monsters" through Mandelbrot, and
why fractal geometry matters across science and engineering — is in
[`docs/fractals.md`](docs/fractals.md) and the in-app **About** panel.

## Roadmap

Implemented: escape-time + L-system + IFS fractals, the two-pass animation cache,
adaptive performance, URL/deep-link state, the cinematic auto-tour, the responsive
"observatory" UI, About + docs, and PNG/share export. Deferred enhancements: a
WebGPU backend behind the existing renderer seam, true Kawase bloom + blue-noise
dithering + an in-shader multi-stop LUT palette mode (the OKLab LUT bake utility
already exists), Kaleidoscopic-IFS fold SDFs, video export (WebCodecs), and
emulated-precision / perturbation deep zoom.
