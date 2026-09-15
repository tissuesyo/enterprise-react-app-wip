import { defineConfig, devices } from '@playwright/test';

/**
 * E2E 一律使用 mock auth + MSW，不依賴真實 Keycloak 或後端，
 * 這樣才能在 CI／任何人的本機穩定重現，不受外部服務狀態影響。
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // dev:e2e 用 --mode e2e 讓 Vite 讀取 .env.e2e（強制 mock auth + MSW），
    // 不會受開發者本機 .env 裡可能設定的 keycloak 模式影響。
    command: 'npm run dev:e2e',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
