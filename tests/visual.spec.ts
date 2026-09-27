import { expect, test } from '@playwright/test';
import { pages } from './routes';

// Visual projects run with reducedMotion: 'reduce' so animated pages settle
// into a deterministic final state before capture.
for (const { name, path } of pages) {
  test(`${name} matches visual baseline`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
