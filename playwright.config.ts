import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    // Production mode, not `next dev`: dev mode is single-process and has shown genuine
    // concurrency issues under Playwright's parallel workers (intermittent MissingCSRF /
    // auth timeouts on simultaneous signup+auto-login flows, unrelated to app correctness).
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
