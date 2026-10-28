import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './test/browser',
  timeout: 45_000,
  workers: 1,
  use: {
    baseURL: process.env.SITE_URL || 'http://127.0.0.1:4173/rocos-web/',
    launchOptions: {
      executablePath: process.env.CHROME_PATH || undefined,
      args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
    },
  },
  webServer: process.env.SITE_URL ? undefined : {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/rocos-web/',
    reuseExistingServer: !process.env.CI,
  },
});
