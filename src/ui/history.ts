// The dedicated, long-form history page (route #/history). Content mirrors
// docs/fractals.md. Built once and shown/hidden by the router.
import { HOME_HREF } from '../app/router';

let built = false;

export const buildHistory = (): void => {
  if (built) return;
  built = true;
  const root = document.getElementById('history') as HTMLElement;
  root.innerHTML = `
    <div class="history-page">
      <a class="history-back" href="${HOME_HREF}">← Back</a>
      <article class="history-article">
        <p class="eyebrow">A short history</p>
        <h1>Fractals — <em>the geometry of roughness</em></h1>
        <p class="lede">Fractals are shapes that repeat their structure across scales. Zoom into a
          coastline, a fern, or the boundary of the Mandelbrot set and you keep finding detail —
          often echoes of the whole — no matter how far in you go. That single idea, self-similarity
          across scale, became one of the most quietly revolutionary concepts in modern mathematics.</p>

        <h2>Before the word existed <span class="years">1870s – 1920s</span></h2>
        <p>Long before anyone said "fractal," mathematicians kept meeting objects that broke their
          intuitions — curves with no tangents, sets with no length, dimensions that weren't whole
          numbers. They were called "monsters."</p>
        <p><strong>Weierstrass</strong> (1872) exhibited a function continuous <em>everywhere</em> yet
          differentiable <em>nowhere</em> — wrinkled at every scale. <strong>Cantor</strong> (1883)
          described a dust of zero length but uncountably many points. <strong>Peano</strong> and
          <strong>Hilbert</strong> (1890–91) built space-filling curves. <strong>von Koch</strong>
          (1904) drew an infinitely long boundary around a finite area. <strong>Sierpiński</strong>
          (1915–16) riddled triangles and carpets with holes at every scale. <strong>Hausdorff</strong>
          (1918) gave them the decisive tool — a dimension that need not be a whole number (the Koch
          curve's is ≈ 1.262). And <strong>Julia</strong> and <strong>Fatou</strong> (1917–19) studied
          iterating <em>z → z² + c</em>, finding sets too intricate to picture without computers.</p>

        <h2>Mandelbrot names it <span class="years">1960s – 1980s</span></h2>
        <p><strong>Benoît Mandelbrot</strong>, at IBM, saw these scattered "pathologies" as facets of
          one idea with enormous reach. His 1967 paper <em>"How Long Is the Coast of Britain?"</em> made
          the point unforgettable: a coastline has no single length — the closer you measure, the longer
          it gets — and its roughness has a fractional dimension. In 1975 he coined the word
          <strong>fractal</strong> (Latin <em>fractus</em>, "broken"), and <em>The Fractal Geometry of
          Nature</em> (1982) reframed fractals as a language for the irregular.</p>
        <p>The emblem of the field, the <strong>Mandelbrot set</strong>, emerged with the computers that
          could draw it: an early plot by <strong>Brooks and Matelski</strong> (1978), detailed images by
          Mandelbrot (~1980), and the deep theory of <strong>Douady and Hubbard</strong>, who proved it
          connected and gave it Mandelbrot's name.</p>

        <h2>Why fractals matter</h2>
        <p>Euclid's geometry describes smooth, ideal shapes; almost nothing in nature is smooth. Fractal
          dimension quantifies roughness — coastlines, mountains, lungs, lightning, river networks.
          Fractals are the <strong>shape of chaos</strong> (the strange attractors of dynamical systems
          such as <strong>Lorenz's</strong> 1963 weather model), the basis of <strong>image
          compression</strong> (Barnsley's IFS and his collage theorem, <em>Fractals Everywhere</em>,
          1988), of procedural <strong>plants and terrain</strong> in graphics (Lindenmayer's L-systems,
          1968), of <strong>fractal antennas</strong>, and of models of <strong>rough markets</strong>.
          Simple recursive rules, iterated to the limit, generate unbounded complexity — and that is
          often exactly what reality looks like.</p>

        <h2>The fractals in this explorer</h2>
        <div class="history-table">
          <div><b>Mandelbrot / Julia</b><span>Iterate z → z² + c; color by how fast each point escapes. The Mandelbrot set is the map of every Julia set at once.</span></div>
          <div><b>Multibrot</b><span>The same idea with a higher power, z → zⁿ + c — more lobes.</span></div>
          <div><b>Koch · Sierpiński · dragon · Hilbert · plant</b><span>L-systems: a string-rewriting rule drawn by a "turtle," producing curves of fractional dimension.</span></div>
          <div><b>Barnsley fern</b><span>An Iterated Function System — four random affine maps whose visit-density traces the fern.</span></div>
        </div>

        <p class="credit">Smooth coloring uses the continuous (Douady–Hubbard) iteration count through
          Inigo Quilez cosine palettes. Further reading: Mandelbrot, <em>The Fractal Geometry of
          Nature</em> (1982); Barnsley, <em>Fractals Everywhere</em> (1988); Peitgen, Jürgens &amp;
          Saupe, <em>Chaos and Fractals</em> (1992); Prusinkiewicz &amp; Lindenmayer, <em>The
          Algorithmic Beauty of Plants</em> (1990).</p>

        <a class="history-back bottom" href="${HOME_HREF}">← Back to the explorer</a>
      </article>
    </div>`;
};
