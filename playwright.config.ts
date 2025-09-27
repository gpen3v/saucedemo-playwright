import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, 'playwright/.auth/.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 90 * 1000, // 90 seconds
  expect: {
    /* Maximum time for expect() */
    timeout: 5 * 1000, // 5 seconds
    toHaveScreenshot: {
      // This removes platform and project info from path
      pathTemplate: '{testDir}/{testFileDir}/{arg}{ext}',
      maxDiffPixelRatio: 0.01,
      scale: "css",
    }
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',
    actionTimeout: 7000, // 7 seconds
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    screenshot: 'on',
    testIdAttribute: 'data-test', // 👈 customize test id attribute
  },

  /* Configure projects for major browsers */
  projects: [
    {
      // Setup project
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: {
        baseURL: 'https://www.saucedemo.com',
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'SauceDemo',
      use: {
        baseURL: process.env.BASE_URL,
        ...devices['Desktop Chrome'],
        // Use prepared auth state.
      },
      dependencies: ['setup'],
    },
  ],
});
