// Minimal smoke: confirm the committed docs/ build serves over HTTP with working
// relative asset paths (favicon + a thumbnail return 200) and the Home view renders.
import { chromium } from 'playwright';

const BASE = process.env.URL || 'http://localhost:4191/';
const errors = [];
const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + (e.stack || e.message)));

await page.goto(BASE + '#/', { waitUntil: 'load' });
await page.waitForTimeout(1500);

const r = await page.evaluate(() => ({
  route: [...document.body.classList].find((c) => c.startsWith('route-')) || '',
  hasView: !!document.getElementById('view'),
  gallery: document.querySelectorAll('.gcard').length,
  formulas: document.querySelectorAll('.formula-link').length,
  bootGone: !document.getElementById('boot-fallback'),
}));
const favicon = (await page.request.get(new URL('favicon.svg', BASE).href)).status();
const thumb = (await page.request.get(new URL('thumbnails/mandelbrot.jpg', BASE).href)).status();
await page.screenshot({ path: '/tmp/shot-docs-home.png' });

console.log(JSON.stringify({ r, favicon, thumb, errors }, null, 2));
await browser.close();

const ok =
  r.route === 'route-home' && r.hasView && r.gallery === 11 && r.formulas === 16 &&
  r.bootGone && favicon === 200 && thumb === 200 && errors.length === 0;
console.log(ok ? 'OK: docs/ build serves correctly (relative paths resolve).' : 'FAIL: see JSON.');
process.exit(ok ? 0 : 1);
