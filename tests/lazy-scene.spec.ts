import { expect, test, type Page } from '@playwright/test';
import { harness } from './routes';

const scene = (page: Page) => page.locator('[data-lazy-scene="harness"]');

test('fallback is visible and no 3D code loads before the scene nears the viewport', async ({
  page,
}) => {
  const sceneRequests: string[] = [];
  page.on('request', (request) => {
    if (/harness-scene|three/i.test(request.url())) sceneRequests.push(request.url());
  });

  await page.goto(harness.lazyScene);
  await page.waitForLoadState('networkidle');

  await expect(scene(page)).toHaveAttribute('data-scene-state', 'idle');
  await expect(scene(page).locator('img')).toHaveAttribute('alt', /.+/);
  expect(sceneRequests).toEqual([]);
});

test('scene loads and becomes ready once scrolled into view', async ({ page }) => {
  await page.goto(harness.lazyScene);
  await scene(page).scrollIntoViewIfNeeded();
  await expect(scene(page)).toHaveAttribute('data-scene-state', 'ready', { timeout: 15_000 });
  await expect(scene(page)).toHaveAttribute('data-reduced-motion', 'false');
});

test('scene receives reduced-motion preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(harness.lazyScene);
  await scene(page).scrollIntoViewIfNeeded();
  await expect(scene(page)).toHaveAttribute('data-scene-state', 'ready', { timeout: 15_000 });
  await expect(scene(page)).toHaveAttribute('data-reduced-motion', 'true');
});

test('static fallback stays when WebGL is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type.startsWith('webgl')) return null;
      return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof original;
  });
  await page.goto(harness.lazyScene);
  await expect(scene(page)).toHaveAttribute('data-scene-state', 'fallback');
  await expect(scene(page)).toHaveAttribute('data-scene-fallback-reason', 'no-webgl');
  await scene(page).scrollIntoViewIfNeeded();
  await expect(scene(page).locator('img')).toBeVisible();
});

test('static fallback stays when Save-Data is on', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', { value: { saveData: true } });
  });
  await page.goto(harness.lazyScene);
  await expect(scene(page)).toHaveAttribute('data-scene-fallback-reason', 'save-data');
});
