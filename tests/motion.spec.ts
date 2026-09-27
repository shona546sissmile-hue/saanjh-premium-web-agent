import { expect, test } from '@playwright/test';
import { pages } from './routes';

const { path } = pages[0];

test('smooth scroll (Lenis) runs when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(path);
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
});

test('smooth scroll is disabled under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
});

test('smooth scroll stops live when the preference changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(path);
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
});

test('site-level override (data-motion="reduce") also disables smooth scroll', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(path);
  await page.evaluate(() => {
    document.documentElement.dataset['motion'] = 'reduce';
  });
  await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
});

test('CSS motion tokens collapse to zero under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(path);
  const duration = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--duration-slow').trim(),
  );
  expect(Number.parseFloat(duration)).toBe(0);
});
