import { defineConfig, devices } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";
const webServerPort = new URL(webBaseUrl).port || "3100";

export default defineConfig({
  testDir: "./tests/e2e",
  webServer: {
    command: `pnpm exec next dev --hostname 127.0.0.1 --port ${webServerPort}`,
    url: webBaseUrl,
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      CRM_E2E_AUTH_BYPASS: "true",
    },
  },
  use: {
    baseURL: webBaseUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
