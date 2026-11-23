import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: process.env.PLAYWRIGHT_CHANNEL } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: process.env.PLAYWRIGHT_CHANNEL } },
  ],
  use: { baseURL: 'http://127.0.0.1:4193' },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4193 --strictPort',
    url: 'http://127.0.0.1:4193',
  },
})
