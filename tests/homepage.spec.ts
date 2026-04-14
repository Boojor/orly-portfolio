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
});
