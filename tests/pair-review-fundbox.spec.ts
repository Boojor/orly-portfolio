/**
 * Pair-review for /my-work/fundbox-pay-checkout.
 * Screenshots local Astro + live Webflow at 5 breakpoints, writes to
 * screenshots/pair-review/ prefixed `fundbox-`. Fed into visual-diff.mjs
 * for per-pixel heatmap comparison.
 */
import { test } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const liveHtmlPath = path.resolve(
  __dirname,
  '../../orly-website.webflow/my-work/fundbox-pay-checkout.html',
);
const liveUrl = `file://${liveHtmlPath}`;
const localUrl = 'http://localhost:4321/my-work/fundbox-pay-checkout';

const sizes = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 1366 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

test.describe('fundbox pair-review', () => {
  test.describe.configure({ mode: 'serial' });

  for (const { name, width, height } of sizes) {
    test(`local @ ${name}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height } });
      const page = await ctx.newPage();
      await page.goto(localUrl, { waitUntil: 'networkidle' });
      await page.screenshot({
        path: `screenshots/pair-review/fundbox-local-${name}.png`,
        fullPage: true,
      });
      await ctx.close();
    });

    test(`live @ ${name}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height } });
      const page = await ctx.newPage();
      await page.goto(liveUrl, { waitUntil: 'networkidle' }).catch(() => {
        return page.goto(liveUrl);
      });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: `screenshots/pair-review/fundbox-live-${name}.png`,
        fullPage: true,
      });
      await ctx.close();
    });
  }
});
