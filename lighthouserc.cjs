// Lighthouse CI: audits the production build (dist/) with performance budgets.
// Uses Playwright's pinned Chromium so no separate Chrome install is needed.
const { chromium } = require('@playwright/test');

const pages = ['/'];

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: pages.map((path) => `http://localhost${path}`),
      numberOfRuns: 3,
      chromePath: process.env.CHROME_PATH || chromium.executablePath(),
      settings: {
        preset: 'desktop',
        chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],

        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],
        interactive: ['warn', { maxNumericValue: 3800 }],

        // Resource budgets (bytes, transfer size). Lighthouse 12 removed budget.json
        // support, so these use LHCI's resource-summary assertions instead. 3D
        // chunks are lazy-loaded and therefore excluded from the initial load.
        'resource-summary:script:size': ['error', { maxNumericValue: 170_000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 50_000 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 150_000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 600_000 }],
        'resource-summary:document:size': ['error', { maxNumericValue: 60_000 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 1_200_000 }],
        'resource-summary:font:count': ['error', { maxNumericValue: 4 }],
        'resource-summary:script:count': ['error', { maxNumericValue: 12 }],
        'resource-summary:third-party:count': ['error', { maxNumericValue: 0 }],
        'unused-javascript': ['warn', { maxLength: 0 }],
        'render-blocking-resources': ['warn', { maxLength: 0 }],
        'uses-responsive-images': 'error',
        'modern-image-formats': 'error',
        'offscreen-images': 'error',
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
};
