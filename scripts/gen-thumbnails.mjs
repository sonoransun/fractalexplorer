// Generate gallery thumbnails by rendering each fractal kind in the real explorer
// (headless WebGL via SwiftShader) and saving a cropped canvas screenshot to
// public/thumbnails/<kind>.jpg. Run against a served build:
//   npm run build && npm run preview -- --port 4173 & node scripts/gen-thumbnails.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.URL || 'http://localhost:4173/';
const OUT = 'public/thumbnails';
mkdirSync(OUT, { recursive: true });

// Default framing per kind (matches data/presets.ts sceneForKind); others center at origin.
const framing = { mandelbrot: [-0.6, 0, 0], julia: [0, 0, -0.15], multibrot: [0, 0, -0.15] };
const kinds = ['mandelbrot', 'julia', 'multibrot', 'koch', 'snowflake', 'sierpinski', 'dragon', 'hilbert', 'plant', 'fern', 'sierpinski-ifs'];
const q = (k) => {
  const [cx, cy, z] = framing[k] || [0, 0, -0.1];
  return `k=${k}&cx=${cx}&cy=${cy}&z=${z}`;
};

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 680, height: 510 } });
const canvas = () => page.locator('#view');
// Hide all chrome so the screenshot is pure fractal (element screenshots include
// any overlapping DOM like the control panel / topbar).
const HIDE_CHROME = '#topbar,#panel,#hud,#panel-toggle,#toast-root{display:none!important}';

for (const k of kinds) {
  await page.goto(`${URL}#/explore?${q(k)}`, { waitUntil: 'load' });
  await page.waitForTimeout(2600); // let the field compute + render-scale ramp to full res
  await page.addStyleTag({ content: HIDE_CHROME });
  await canvas().screenshot({ path: `${OUT}/${k}.jpg`, type: 'jpeg', quality: 86 });
  console.log(`✓ ${k}.jpg`);
}

await browser.close();
console.log(`Wrote ${kinds.length} thumbnails to ${OUT}/`);
