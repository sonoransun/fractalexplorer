// Headless smoke test for the routed app (Chromium/SwiftShader): Home landing
// (live hero, gallery, formulas), navigation into the Explorer via the hero CTA /
// a gallery card / a formula deep-link (lands on the right magnification), the
// History page, brand→Home, favicon, fonts, and the removed boot-fallback.
import { chromium } from 'playwright';

const BASE = process.env.URL || 'http://localhost:4173/';
const errors = [];

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});
const wire = (p) => {
  p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  p.on('pageerror', (e) => errors.push('pageerror: ' + (e.stack || e.message)));
  return p;
};

const page = wire(await browser.newPage({ viewport: { width: 1280, height: 800 } }));
const count = (sel) => page.locator(sel).count();
const has = (sel) => page.evaluate((s) => !!document.querySelector(s), sel);
const route = () => page.evaluate(() => [...document.body.classList].find((c) => c.startsWith('route-')) || '');
const mag = () => page.evaluate(() => {
  const t = document.getElementById('hud').textContent || '';
  const m = t.match(/×([0-9.eE+\-]+)/);
  return m ? parseFloat(m[1]) : NaN;
});

await page.goto(`${BASE}#/`, { waitUntil: 'load' });
await page.waitForTimeout(900);

const env = await page.evaluate(() => {
  const c = document.getElementById('view');
  const gl = c.getContext('webgl2');
  return { hasWebGL2: !!gl, floatExt: gl ? !!gl.getExtension('EXT_color_buffer_float') : false };
});
const fontsOk = await page.evaluate(async () => {
  await document.fonts.ready;
  return document.fonts.check('16px "Instrument Serif"') && document.fonts.check('16px "Hanken Grotesk"');
});
const bootFallbackRemoved = !(await has('#boot-fallback'));
const faviconOk = (await page.request.get(new URL('favicon.svg', BASE).href)).ok();

// 1) Home: route, hero, gallery (11 kinds), formula links (16 presets), live hero.
const homeRoute = (await route()) === 'route-home';
const heroPresent = await has('.hero-title');
const galleryCount = await count('.gcard');
const formulaCount = await count('.formula-link');
const heroLive = await page.evaluate(() => new Promise((resolve) => {
  const c = document.getElementById('view');
  const gl = c.getContext('webgl2');
  let best = 0, n = 0;
  const tick = () => {
    const px = new Uint8Array(c.width * c.height * 4);
    gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, px);
    let col = 0;
    for (let i = 0; i < px.length; i += 4) if (px[i] > 8 || px[i + 1] > 8 || px[i + 2] > 8) col++;
    best = Math.max(best, col / (c.width * c.height));
    if (++n < 5) requestAnimationFrame(tick); else resolve(best > 0.02);
  };
  requestAnimationFrame(tick);
}));
await page.screenshot({ path: '/tmp/shot-home.png' });

// 2) Hero CTA -> Explorer (chrome appears, panel starts visible).
await page.click('.hero-cta');
const panelShownOnArrival = await page.evaluate(() => !document.getElementById('panel').classList.contains('hidden'));
await page.waitForTimeout(700);
const enteredExplorer = (await route()) === 'route-explore' && (await page.locator('#topbar').isVisible());
await page.screenshot({ path: '/tmp/shot-explorer.png' });

// 2b) Panel auto-minimizes ~3s after arrival (computed opacity, so a CSS
// fill-mode regression can't pin it visible); the floating toggle re-expands.
await page.waitForTimeout(3300); // 3s timer + 0.3s hide transition + slack
const panelAutoHid = await page.evaluate(() => {
  const p = document.getElementById('panel');
  return p.classList.contains('hidden') &&
    parseFloat(getComputedStyle(p).opacity) < 0.05 &&
    document.getElementById('panel-toggle').classList.contains('show');
});
await page.click('#panel-toggle');
await page.waitForTimeout(450);
const panelReExpanded = await page.evaluate(() => !document.getElementById('panel').classList.contains('hidden'));

// 3) Brand -> Home, then a formula deep-link lands on the right magnification.
await page.click('.brand');
await page.waitForTimeout(400);
const brandHome = (await route()) === 'route-home';
await page.click('.formula-link >> nth=0'); // Seahorse Valley, ×250
await page.waitForTimeout(1200);
const presetMag = await mag();
const presetOk = (await route()) === 'route-explore' && Math.abs(presetMag - 250) / 250 < 0.2;

// 4) Gallery card -> Explorer (a non-escape kind).
await page.click('.brand');
await page.waitForTimeout(300);
await page.click('.gcard[aria-label="Barnsley fern"]');
await page.waitForTimeout(900);
const galleryNavOk = (await route()) === 'route-explore';

// 5) History page.
await page.click('.brand');
await page.waitForTimeout(300);
await page.click('.section-more');
await page.waitForTimeout(500);
const historyOk = (await route()) === 'route-history' && (await has('.history-article'));
await page.screenshot({ path: '/tmp/shot-history.png' });

console.log(JSON.stringify({
  env, fontsOk, faviconOk, bootFallbackRemoved,
  home: { homeRoute, heroPresent, galleryCount, formulaCount, heroLive },
  nav: { enteredExplorer, panelShownOnArrival, panelAutoHid, panelReExpanded, brandHome, presetMag, presetOk, galleryNavOk, historyOk },
  errors,
}, null, 2));

// 6) Mobile Home screenshot (best-effort; not part of pass/fail).
try {
  const mob = wire(await browser.newPage({ viewport: { width: 390, height: 844 } }));
  await mob.goto(`${BASE}#/`, { waitUntil: 'load' });
  await mob.waitForTimeout(900);
  await mob.screenshot({ path: '/tmp/shot-home-mobile.png', animations: 'disabled', timeout: 15000 });
} catch (e) {
  console.log('(mobile screenshot skipped: ' + e.message.split('\n')[0] + ')');
}
await browser.close();

const ok =
  env.hasWebGL2 && fontsOk && faviconOk && bootFallbackRemoved &&
  homeRoute && heroPresent && galleryCount === 11 && formulaCount === 16 && heroLive &&
  enteredExplorer && panelShownOnArrival && panelAutoHid && panelReExpanded && brandHome && presetOk && galleryNavOk && historyOk && errors.length === 0;
console.log(ok ? 'OK: routing, home, gallery, formula deep-links, history, fonts all verified.' : 'FAIL: see JSON above.');
process.exit(ok ? 0 : 1);
