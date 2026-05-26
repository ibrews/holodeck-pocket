import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'https://ibrews.github.io/holodeck-pocket/';
const OUT = 'capture/assets/scenes';

const shots = [
  { file: 'fs-golden-rounds.png',  scene: 'four-seasons', opts: { 'time-of-day': 'golden', 'layout': 'rounds' } },
  { file: 'fs-night-theater.png',  scene: 'four-seasons', opts: { 'time-of-day': 'night',  'layout': 'theater' } },
  { file: 'fs-noon-mingle.png',    scene: 'four-seasons', opts: { 'time-of-day': 'noon',   'layout': 'mingle' } },
  { file: 'carol-gas.png',         scene: 'carol',        opts: { 'lighting': 'gas' } },
  { file: 'carol-ghost.png',       scene: 'carol',        opts: { 'lighting': 'ghost' } },
  { file: 'carol-ember.png',       scene: 'carol',        opts: { 'lighting': 'ember' } },
  { file: 'dnd-tavern.png',        scene: 'dnd',          opts: { 'room': 'tavern',  'tokens': 'hidden' } },
  { file: 'dnd-dungeon-tokens.png',scene: 'dnd',          opts: { 'room': 'dungeon', 'tokens': 'visible' } },
];

await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: false,
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--window-size=1920,1080',
    '--window-position=4000,0',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
  ],
});

const page = await browser.newPage();
page.on('console', m => { if (m.type() === 'error') console.log('  page-error:', m.text().slice(0, 140)); });

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60_000 });
await page.waitForFunction(() => document.querySelectorAll('#scene-bar button').length > 0, { timeout: 30_000 })
  .catch(() => console.log('  scene-bar selector did not match — continuing with hash nav'));
await new Promise(r => setTimeout(r, 2000));

for (const s of shots) {
  console.log(`→ ${s.file}`);

  await page.evaluate((scene) => { window.location.hash = `scene=${scene}`; }, s.scene);
  await page.waitForFunction(
    () => !!document.querySelector('#options-panel select'),
    { timeout: 15_000 }
  ).catch(() => console.log('  options-panel select did not appear in time'));
  await new Promise(r => setTimeout(r, 1500));

  for (const [optId, val] of Object.entries(s.opts)) {
    const ok = await page.evaluate((id, v) => {
      const sel = document.getElementById(`opt-${id}`);
      if (!sel) return false;
      sel.value = v;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }, optId, val);
    if (!ok) console.log(`  ! missing select opt-${optId}`);
    await new Promise(r => setTimeout(r, 800));
  }

  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: `${OUT}/${s.file}`, type: 'png' });
}

await browser.close();
console.log('done');
