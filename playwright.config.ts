import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium-mobile',
      use: { ...devices['iPhone 12'], defaultBrowserType: 'chromium' },
    },
    {
      name: 'chromium-tablet',
      use: { ...devices['iPad Pro'], defaultBrowserType: 'chromium' },
    },
    {
      name: 'chromium-desktop',
      use: { viewport: { width: 1440, height: 900 } },
    },
  ],
});
