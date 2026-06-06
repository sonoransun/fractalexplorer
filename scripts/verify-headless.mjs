// Headless smoke test (Chromium/SwiftShader): verifies WebGL2 + shader compilation,
// self-hosted fonts, the first-visit welcome overlay (over a live Mandelbrot zoom),
// Begin-exploring dismissal, reopen + history → About, tour cancel-on-interaction,
// PNG export, and renders at desktop / mobile / landscape.
import { chromium } from 'playwright';

const URL = process.env.URL || 'http://localhost:4173/';
const errors = [];

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});

const wire = (p) => {
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  p.on('pageerror', (e) => errors.push('pageerror: ' + (e.stack || e.message)));
  return p;
};

const page = wire(await browser.newPage({ viewport: { width: 1280, height: 800 }, acceptDownloads: true }));
const has = (sel) => page.evaluate((s) => !!document.querySelector(s), sel);
const mag = () =>
  page.evaluate(() => {
    const t = document.getElementById('hud').textContent || '';
    const m = t.match(/×([0-9.eE+\-]+)/);
    return m ? parseFloat(m[1]) : NaN;
  });

await page.goto(URL, { waitUntil: 'load' });
await page.waitForTimeout(900);

const env = await page.evaluate(() => {
  const c = document.getElementById('view');
  const gl = c.getContext('webgl2');
  return { hasWebGL2: !!gl, floatExt: gl ? !!gl.getExtension('EXT_color_buffer_float') : false, backing: [c.width, c.height] };
});
const fontsOk = await page.evaluate(async () => {
  await document.fonts.ready;
  return document.fonts.check('16px "Instrument Serif"') && document.fonts.check('16px "Hanken Grotesk"');
});
const panelDuplicatesBrand = await page.evaluate(() =>
  (document.getElementById('panel')?.textContent || '').includes('Fractal Explorer'),
);

// 1) First-visit welcome is shown over the live, zooming Mandelbrot.
const welcomeShown = await has('.welcome-scrim');
const m1 = await mag();
await page.waitForTimeout(2600);
const m2 = await mag();
const tourRunning = Number.isFinite(m1) && Number.isFinite(m2) && Math.abs(m2 - m1) > 1e-3;
await page.screenshot({ path: '/tmp/shot-desktop.png' }); // welcome over the live zoom

// 2) "Begin exploring" dismisses; the tour keeps going.
await page.click('.welcome-cta');
await page.waitForTimeout(300);
const welcomeDismissed = !(await has('.welcome-scrim'));
const m3 = await mag();
await page.waitForTimeout(1200);
const tourContinues = Math.abs((await mag()) - m3) > 1e-3;

// 3) Interaction cancels the tour.
await page.mouse.move(600, 400);
await page.mouse.wheel(0, -150);
await page.waitForTimeout(900);
const m4 = await mag();
await page.waitForTimeout(1000);
const tourStopped = Math.abs((await mag()) - m4) < 1e-6;

// 4) Reopen welcome from the topbar; its history link opens the deep About; Esc closes.
await page.click('[aria-label="About this explorer"]');
await page.waitForTimeout(300);
const welcomeReopened = await has('.welcome-scrim');
await page.click('.welcome-history');
await page.waitForTimeout(300);
const aboutFromWelcome = (await has('.modal-scrim')) && !(await has('.welcome-scrim'));
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
const aboutClosed = !(await has('.modal-scrim'));

// 5) PNG export (no overlay now).
let downloadName = null;
try {
  const [dl] = await Promise.all([
    page.waitForEvent('download', { timeout: 12000 }),
    page.click('[aria-label="Save image"]'),
  ]);
  downloadName = dl.suggestedFilename();
} catch (e) {
  errors.push('download: ' + e.message);
}

// 6) Mobile (fresh context → welcome shows, touch copy) + landscape screenshots.
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const mob = wire(await mctx.newPage());
await mob.goto(URL, { waitUntil: 'load' });
await mob.waitForTimeout(1100);
await mob.screenshot({ path: '/tmp/shot-mobile.png' });

const land = wire(await browser.newPage({ viewport: { width: 844, height: 390 } }));
await land.goto(URL, { waitUntil: 'load' });
await land.waitForTimeout(1000);
await land.screenshot({ path: '/tmp/shot-landscape.png' });

console.log(
  JSON.stringify(
    {
      env, fontsOk, panelDuplicatesBrand,
      welcome: { welcomeShown, welcomeDismissed, welcomeReopened, aboutFromWelcome, aboutClosed },
      tour: { m1, m2, m3, m4, tourRunning, tourContinues, tourStopped },
      downloadName, errors,
    },
    null,
    2,
  ),
);
await browser.close();

const ok =
  env.hasWebGL2 && fontsOk && !panelDuplicatesBrand &&
  welcomeShown && welcomeDismissed && welcomeReopened && aboutFromWelcome && aboutClosed &&
  tourRunning && tourContinues && tourStopped && !!downloadName && errors.length === 0;
console.log(ok ? 'OK: welcome, tour, About, export, fonts, and rendering all verified.' : 'FAIL: see JSON above.');
process.exit(ok ? 0 : 1);
