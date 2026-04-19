/**
 * Pair-review for /my-work/fundbox-partnerships vs live Webflow.
 * Live file: orly-website.webflow/my-work/untitled-extending-fundbox-
 * through-strategic-partnerships.html
 */
import { test } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const liveHtmlPath = path.resolve(
  __dirname,
  '../../orly-website.webflow/my-work/untitled-extending-fundbox-through-strategic-partnerships.html',
);
const liveUrl = `file://${liveHtmlPath}`;
const localUrl = 'http://localhost:4321/my-work/fundbox-partnerships';

const sizes = [
  { name: '375', width: 375, height: 812 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 1366 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

async function scrollAll(page: any) {
  // Trigger lazy-loaded images by scrolling the full page.
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = window.innerHeight;
      const iv = setInterval(() => {
        window.scrollTo(0, y);
        y += step;
        if (y >= document.body.scrollHeight) {
          clearInterval(iv);
          resolve();
        }
      }, 150);
    });
    window.scrollTo(0, 0);
  });
  await page.evaluate(async () => {
    const imgs = [...document.images];
    await Promise.all(
      imgs.map((img) => {
        if (img.complete && img.naturalWidth > 0) return null;
        return new Promise<void>((r) => {
          img.addEventListener('load', () => r(), { once: true });
          img.addEventListener('error', () => r(), { once: true });
          setTimeout(() => r(), 5000);
        });
      }),
    );
  });
  await page.waitForTimeout(500);
}

test.describe('partnerships pair-review', () => {
  test.describe.configure({ mode: 'serial' });

  for (const { name, width, height } of sizes) {
    test(`local @ ${name}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width, height } });
      const page = await ctx.newPage();
      await page.goto(localUrl, { waitUntil: 'networkidle' });
      await scrollAll(page);
      await page.screenshot({
        path: `screenshots/pair-review/partnerships-local-${name}.png`,
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
      await scrollAll(page);
      await page.screenshot({
        path: `screenshots/pair-review/partnerships-live-${name}.png`,
        fullPage: true,
      });
      await ctx.close();
    });
  }
});
