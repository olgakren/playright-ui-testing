import { defineConfig, devices } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, process.env.TEST_ENV ? `.env.${process.env.TEST_ENV}` : '.env') });

export default defineConfig({
  testDir: './tests',
/*   timeout: 10000,
  globalTimeout: 60000,
  expect: {
    timeout: 5000
  }, */
  fullyParallel: true,
  retries: 1,
  reporter: 'html',

  use: {
    baseURL: process.env.URL,
    trace: 'on-first-retry',
    video: 'off'
  },

  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),

  projects: [
    {
      name: 'mobile-test',
      use: {
        ...devices['iPhone 16e']
      }
    },
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {name: 'teardown', testMatch: /.*\.teardown\.ts/ },
    {
      name: 'smoke-test',
      testMatch: 'smoke.spec.ts',
      teardown: 'teardown'
    },
    {
      name: 'regression',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup', 'smoke-test'],
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
