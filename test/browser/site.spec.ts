import { test, expect } from '@playwright/test';

for (const width of [1440, 768, 390]) {
  test(`navigation, responsive layout, models and refresh at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const failed: string[] = [];
    page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
    await page.goto('./');
    await expect(page.locator('[data-viewer]')).toHaveAttribute('data-state', 'ready');
    for (const [route, title] of [['architecture', '一套控制，'], ['applications', '从模型理解，'], ['experience', '从 Talon 开始'], ['docs', '从源码到运行'], ['home', '从仿真，']]) {
      if (width <= 900) await page.getByRole('button', { name: '菜单' }).click();
      await expect(page.locator('.nav-item.unavailable')).toHaveCount(2);
      for (const button of await page.locator('.nav-item.unavailable').all()) await expect(button).toBeDisabled();
      await page.locator(`[data-route="${route}"]`).click();
      await expect(page.locator('h1')).toContainText(title);
      if (width <= 900) await expect(page.getByRole('button', { name: '菜单' })).toHaveAttribute('aria-expanded', 'false');
      await page.reload();
      await expect(page.locator('h1')).toContainText(title);
      if (route === 'experience' || route === 'home') await expect(page.locator('[data-viewer]')).toHaveAttribute('data-state', 'ready');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const image of await page.locator('main img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      }
    }
    expect(errors).toEqual([]);
    expect(failed).toEqual([]);
  });
}

test('model rotates, zooms, drags and resets without claiming a simulation connection', async ({ page }) => {
  await page.goto('./#/experience');
  await expect(page.locator('[data-viewer]')).toHaveAttribute('data-state', 'ready');
  await expect(page.getByText('实时仿真暂未开放', { exact: true })).toBeVisible();
  const frame = () => page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
  const initial = await frame();
  for (const name of ['向左旋转', '向右旋转', '放大', '缩小']) {
    const before = await frame();
    await page.getByRole('button', { name, exact: true }).click();
    expect(await frame()).not.toBe(before);
  }
  await page.getByRole('button', { name: '复位视角' }).click();
  expect(await frame()).toBe(initial);
  const box = (await page.locator('canvas').boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down(); await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 + 20, { steps: 8 }); await page.mouse.up();
  expect(await frame()).not.toBe(initial);
  await page.getByRole('button', { name: '复位视角' }).click();
  expect(await frame()).toBe(initial);
});

test('unavailable model exposes a static fallback and disables controls', async ({ page }) => {
  await page.route('**/models/talon/source.urdf', route => route.fulfill({ status: 404, body: 'Not found' }));
  await page.goto('./#/experience');
  await expect(page.locator('[data-viewer]')).toHaveAttribute('data-state', 'error');
  await expect(page.locator('.model-fallback')).toBeVisible();
  await expect(page.getByRole('button', { name: '复位视角' })).toBeDisabled();
});

test('external service config adds an honest link and never auto-connects', async ({ page }) => {
  await page.route('**/config/simulation.json', route => route.fulfill({ json: { enabled: true, experienceUrl: 'https://example.com/sessions' } }));
  await page.goto('./#/experience');
  const link = page.getByRole('link', { name: '打开外部仿真服务' });
  await expect(link).toHaveAttribute('href', 'https://example.com/sessions');
  await expect(page.getByText('已配置外部仿真入口，服务可用性以该服务页面为准。')).toBeVisible();
});

test('mobile menu supports keyboard dismissal and return focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#/docs');
  const toggle = page.getByRole('button', { name: '菜单' });
  await toggle.click();
  await expect(page.locator('[data-route=docs]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('skip navigation preserves routes and old skip hashes remain readable', async ({ page }) => {
  await page.goto('./#main');
  await expect(page.locator('h1')).toContainText('从仿真，');
  await page.goto('./#/docs');
  await page.locator('.skip-link').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.reload();
  await expect(page.locator('h1')).toHaveText('从源码到运行');
});

test('opening a mobile menu then resizing clears the focus trap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./#/docs');
  await page.getByRole('button', { name: '菜单' }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  await page.locator('.sidebar-bottom a').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('.topbar a')).toBeFocused();
});

test('leaving a loading model releases observers immediately', async ({ page }) => {
  await page.addInitScript(() => {
    const Original = window.ResizeObserver;
    (window as any).activeObservers = 0;
    window.ResizeObserver = class extends Original {
      constructor(callback: ResizeObserverCallback) { super(callback); (window as any).activeObservers++; }
      disconnect() { (window as any).activeObservers--; super.disconnect(); }
    };
  });
  await page.route('**/models/talon/source.urdf', async route => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.abort().catch(() => {});
  });
  await page.goto('./#/experience');
  await expect.poll(() => page.evaluate(() => (window as any).activeObservers)).toBe(1);
  await page.locator('[data-route=docs]').click();
  await expect.poll(() => page.evaluate(() => (window as any).activeObservers)).toBe(0);
});

test('WebGL context loss switches to the static image', async ({ page }) => {
  await page.goto('./#/experience');
  await expect(page.locator('[data-viewer]')).toHaveAttribute('data-state', 'ready');
  await page.locator('canvas').evaluate((canvas: HTMLCanvasElement) => canvas.getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(page.locator('[data-viewer]')).toHaveAttribute('data-state', 'error');
  await expect(page.locator('.model-fallback')).toBeVisible();
  await expect(page.getByRole('button', { name: '复位视角' })).toBeDisabled();
});
