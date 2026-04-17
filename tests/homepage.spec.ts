import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      // Ignore Vite dev-server artifacts: when the optimizer is
      // re-bundling a dep (e.g. GSAP) on a cold request it returns
      // 504 Outdated Optimize Dep. This is a dev-only race, not a
      // real bug — the resource loads fine on the automatic retry.
      if (text.includes('504 (Outdated Optimize Dep)')) return;
      errors.push(text);
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
    const email = page.locator('#contact').getByRole('link', { name: 'boojor.orly@gmail.com' });
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
      // fixed nav. Upper bound is generous (500) because the last section
      // (#contact) may not be able to scroll fully if the page can't scroll
      // further — in that case the section lands wherever the document
      // maxes out. Still catches regressions where a section lands below
      // the fold or off-viewport.
      const topPx = await target.evaluate((el) => el.getBoundingClientRect().top);
      expect(topPx).toBeGreaterThanOrEqual(0);
      expect(topPx).toBeLessThan(500);
    }
  });
});
