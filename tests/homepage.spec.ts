import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    await expect(page).toHaveTitle(/Orly Boojor/);
    expect(errors).toEqual([]);
  });

  test('nav is visible', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('[data-nav="absolute"]');
    await expect(nav).toBeVisible();
  });

  test('footer contains contact email', async ({ page }) => {
    await page.goto('/');
    const email = page.getByText('boojor.orly@gmail.com');
    await expect(email).toBeVisible();
  });

  test('nav anchors jump to sections (all breakpoints)', async ({ page }) => {
    // Force instant scroll (bypasses CSS smooth-scroll) so measurement is
    // deterministic. Our CSS only applies `scroll-behavior: smooth` when
    // prefers-reduced-motion is "no-preference".
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const targets = ['#services', '#my-work', '#contact'];

    for (const selector of targets) {
      await page.goto(`/${selector}`);

      const target = page.locator(selector);
      await expect(target).toBeInViewport({ ratio: 0.05 });

      // scroll-padding-top: 6rem should leave the target offset below the
      // fixed nav (top >= 0, ~96–250px depending on breakpoint/layout).
      // Upper bound guards against regressions where a section lands below
      // the fold or in the middle of the page.
      const topPx = await target.evaluate((el) => el.getBoundingClientRect().top);
      expect(topPx).toBeGreaterThanOrEqual(0);
      expect(topPx).toBeLessThan(300);
    }
  });
});
