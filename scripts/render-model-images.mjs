import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('work', { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1000, height: 1100 }, deviceScaleFactor: 1 });
page.on('pageerror', error => console.log('PAGE ERROR', error.message));
await page.goto('http://127.0.0.1:4173/rocos-web/#/experience');
await page.locator('[data-viewer][data-state=ready]').waitFor({ timeout: 30000 });
await page.screenshot({ path: 'work/first-experience.png', fullPage: true });
await page.evaluate(() => {const host=document.querySelector('[data-viewer]'); host.style.width='900px';host.style.height='900px';});
await page.waitForTimeout(300);
async function save(name) {
  const data = await page.locator('canvas').evaluate(canvas => canvas.toDataURL('image/webp', .93).split(',')[1]);
  await writeFile(`public/images/${name}.webp`, Buffer.from(data, 'base64'));
}
await save('talon-front');
for(let i=0;i<5;i++) await page.getByRole('button',{name:'向左旋转'}).click();
await save('talon-side');
await page.getByRole('button',{name:'复位视角'}).click();
for(let i=0;i<4;i++) await page.getByRole('button',{name:'放大',exact:true}).click();
await save('talon-detail');
await browser.close();
