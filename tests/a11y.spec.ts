import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { harness, pages } from './routes';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const targets = [...pages, { name: 'lazy-scene harness', path: harness.lazyScene }];

for (const { name, path } of targets) {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    test(`${name} has no axe violations (motion: ${reducedMotion})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
}

for (const { name, path } of pages) {
  test(`${name}: skip link is first in tab order and moves focus to main`, async ({ page }) => {
    await page.goto(path);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main#main')).toBeFocused();
  });

  test(`${name}: has exactly one h1 and a lang attribute`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', /.+/);
  });
}
