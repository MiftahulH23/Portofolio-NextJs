import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    launchOptions: { args: ["--use-gl=angle", "--enable-unsafe-swiftshader"] },
  },
  webServer: {
    command: "npm run build && npx next start -p 3100",
    url: "http://localhost:3100",
    timeout: 300_000,
    reuseExistingServer: false,
    env: { ...(process.env as Record<string, string>), CONTACT_DRY_RUN: "1", NEXT_PUBLIC_E2E: "1" },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
