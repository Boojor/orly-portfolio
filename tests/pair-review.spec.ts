/**
 * Pair-review screenshot generator.
 *
 * NOT a real test — this spec exists solely to produce full-page screenshots
 * of the local Astro build and the live Webflow HTML snapshot at three
 * breakpoints, for side-by-side visual comparison during Task 2.9.
 *
 * Run explicitly:
 *   npx playwright test tests/pair-review.spec.ts --project chromium-desktop
 *
 * Screenshots land in `screenshots/pair-review/` (git-ignored).
 */
import { test } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const liveHtmlPath = path.resolve(
  __dirname,
  '../../orly-website.webflow/index.html',
);
const liveUrl = `file://${liveHtmlPath}`;
const localUrl = 'http://localhost:4321/';

const sizes = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 1024, height: 1366 },
  { name: 'desktop', width: 1440, height: 900 },
];

test.describe('pair-review screenshots', () => {
  test.describe.configure({ mode: 'serial' });

  for (const { name, width, height } of sizes) {
    test(`local @ ${name}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height } });
      const page = await ctx.newPage();
      await page.goto(localUrl, { waitUntil: 'networkidle' });
      await page.screenshot({
        path: `screenshots/pair-review/local-${name}.png`,
        fullPage: true,
      });
      await ctx.close();
    });

    test(`live @ ${name}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height } });
      const page = await ctx.newPage();
      await page.goto(liveUrl, { waitUntil: 'networkidle' }).catch(() => {
        // networkidle can hang on file:// with CDN scripts — fall back
        return page.goto(liveUrl);
      });
      await page.waitForTimeout(1500); // let swiper/webflow JS settle
      await page.screenshot({
        path: `screenshots/pair-review/live-${name}.png`,
        fullPage: true,
      });
      await ctx.close();
    });
  }
});
