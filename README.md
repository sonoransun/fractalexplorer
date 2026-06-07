# Fractal Explorer

A browser-based, hardware-accelerated exploration of Mandelbrot, Julia sets, Koch
snowflakes and other self-similar structures — animated and color-cycled with
notable offsets and parameters to explore the popular visual aspects of these
structures.

Built with vanilla **TypeScript + Vite** and hand-written **WebGL2** shaders; no
rendering framework. The bundle is ~14 kB gzipped.

<a href="https://fractalexplorer.org/"><b>Begin your journey at FractalExplorer.org!</b></a>
<br />
<br />

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
- **Landing page** — the home view (`#/`) is a scrolling page over a live
  Mandelbrot hero, with three sections: a **history** teaser (→ a dedicated
  in-app history page, long-form in [`docs/fractals.md`](docs/fractals.md)), a
  **gallery** of all fractal types (pre-rendered thumbnails → the live explorer),
  and **famous formulas** — verified deep-links that open the explorer at a known
  coordinate and depth (Seahorse Valley, the Douady Rabbit, the Feigenbaum point…).
- **Hash routing** — `#/` home · `#/explore?…` the explorer (deep-linkable) ·
  `#/history` the history page. No server rewrites needed.
- **Polished, responsive UI** — an immersive dark "observatory" design; the
  control panel becomes a bottom sheet on phones; keyboard shortcuts throughout.

## Develop

```bash
npm install
npm run dev        # Vite dev server
npm run build      # typecheck + production build to docs/ (committed for Pages)
npm run preview    # serve the production build
npm test           # Vitest unit tests
npm run typecheck  # tsc --noEmit
npm run e2e        # headless WebGL2 smoke test (requires Playwright + chromium)
```

> Node 18 is supported via Vite 5. The headless `e2e` check uses Playwright
> (`npx playwright install chromium`) and is optional.
>
> **Serve it — don't open the file directly.** This is an ES-module app, so a
> `file://` open can't load its scripts (you'll get a black screen). Always use a
> server (`npm run dev` / `npm run preview`) or a static host.

## Deploy (GitHub Pages)

The build is plain static files: Vite outputs to **`docs/`** (committed) with
**relative asset paths** (`base: './'`) and **hash routing**, so GitHub Pages serves
it directly from a branch — no Action or server config needed.

1. `npm run build` (writes/refreshes `docs/`), then commit `docs/`.
2. In your repo: **Settings → Pages → Build and deployment → Source: Deploy from a
   branch → Branch: `main` `/docs`**.
3. The site loads at `https://<user>.github.io/<repo>/`.

Gallery thumbnails (`public/thumbnails/`) are committed, so no GPU is needed at build
time. Pages serves a committed build only from the repo root or `/docs` — never a
`/dist` subfolder — which is why the output dir is `docs/`.

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
| Welcome / About | `?` (or click the title) |
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
