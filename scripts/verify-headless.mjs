// Headless smoke test (Chromium/SwiftShader): verifies WebGL2 + shader compilation,
// the auto-tour (zoom changes over time, then stops on interaction), the About
// modal, PNG export, and renders at desktop + mobile breakpoints.
import { chromium } from 'playwright';

const URL = process.env.URL || 'http://localhost:4173/';
const errors = [];

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});

const mkPage = async (viewport) => {
  const p = await browser.newPage({ viewport, acceptDownloads: true });
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  p.on('pageerror', (e) => errors.push('pageerror: ' + (e.stack || e.message)));
  return p;
};

const page = await mkPage({ width: 1280, height: 800 });
await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(900);

const env = await page.evaluate(() => {
  const c = document.getElementById('view');
  const gl = c.getContext('webgl2');
  return { hasWebGL2: !!gl, floatExt: gl ? !!gl.getExtension('EXT_color_buffer_float') : false, backing: [c.width, c.height] };
});

// Self-hosted fonts load with no network; the panel no longer duplicates the brand.
const fontsOk = await page.evaluate(async () => {
  await document.fonts.ready;
  return document.fonts.check('16px "Instrument Serif"') && document.fonts.check('16px "Hanken Grotesk"');
});
const panelDuplicatesBrand = await page.evaluate(() =>
  (document.getElementById('panel')?.textContent || '').includes('Fractal Explorer'),
);

// Magnification is shown in the HUD as "×<n>"; parse it to observe the camera.
const mag = () =>
  page.evaluate(() => {
    const t = document.getElementById('hud').textContent || '';
    const m = t.match(/×([0-9.eE+\-]+)/);
    return m ? parseFloat(m[1]) : NaN;
  });

// 1) Auto-tour running: magnification changes over time.
const m1 = await mag();
await page.waitForTimeout(1600);
const m2 = await mag();
const tourRunning = Number.isFinite(m1) && Number.isFinite(m2) && Math.abs(m2 - m1) > 1e-3;

// 2) Interaction cancels the tour: after a wheel zoom, magnification holds steady.
await page.mouse.move(620, 400);
await page.mouse.wheel(0, -150);
await page.waitForTimeout(900);
const m3 = await mag();
await page.waitForTimeout(1200);
const m4 = await mag();
const tourStopped = Number.isFinite(m3) && Math.abs(m4 - m3) < 1e-6;

// 3) About modal opens and closes (Esc).
await page.click('[aria-label="About fractals"]');
await page.waitForTimeout(300);
const aboutOpen = await page.evaluate(() => !!document.querySelector('.modal-scrim'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
const aboutClosed = await page.evaluate(() => !document.querySelector('.modal-scrim'));

// 4) PNG export triggers a download.
let downloadName = null;
try {
  const [dl] = await Promise.all([
    page.waitForEvent('download', { timeout: 6000 }),
    page.click('[aria-label="Save image"]'),
  ]);
  downloadName = dl.suggestedFilename();
} catch (e) {
  errors.push('download: ' + e.message);
}

await page.screenshot({ path: '/tmp/shot-desktop.png' });

// 5) Mobile + landscape breakpoints render (bottom-sheet panel).
const mob = await mkPage({ width: 390, height: 844 });
await mob.goto(URL, { waitUntil: 'load' });
await mob.waitForTimeout(1100);
await mob.screenshot({ path: '/tmp/shot-mobile.png' });

const land = await mkPage({ width: 844, height: 390 });
await land.goto(URL, { waitUntil: 'load' });
await land.waitForTimeout(1000);
await land.screenshot({ path: '/tmp/shot-landscape.png' });

console.log(
  JSON.stringify(
    { env, fontsOk, panelDuplicatesBrand, tour: { m1, m2, m3, m4, tourRunning, tourStopped }, aboutOpen, aboutClosed, downloadName, errors },
    null,
    2,
  ),
);
await browser.close();

const ok =
  env.hasWebGL2 && fontsOk && !panelDuplicatesBrand && tourRunning && tourStopped && aboutOpen && aboutClosed && !!downloadName && errors.length === 0;
console.log(ok ? 'OK: fonts, tour, About, export, and rendering all verified.' : 'FAIL: see JSON above.');
process.exit(ok ? 0 : 1);
