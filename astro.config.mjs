// @ts-check
import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl';

const isHarness = process.env['HARNESS'] === '1';

/**
 * Test harness routes live in tests/harness and are only injected for
 * Playwright builds (HARNESS=1). They never ship in the production build.
 * @type {import('astro').AstroIntegration}
 */
const testHarness = {
  name: 'test-harness',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      if (!isHarness) return;
      injectRoute({
        pattern: '/__harness/lazy-scene',
        entrypoint: './tests/harness/lazy-scene.astro',
      });
    },
  },
};

export default defineConfig({
  // Set the production origin before deploying (used for canonical URLs and sitemaps).
  site: 'https://example.com',
  outDir: isHarness ? './dist-harness' : './dist',
  trailingSlash: 'ignore',
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Sharp is Astro's default service; declared explicitly for clarity.
    service: { entrypoint: 'astro/assets/services/sharp' },
    layout: 'constrained',
    responsiveStyles: true,
  },
  integrations: [testHarness],
  vite: {
    plugins: [glsl({ minify: true })],
    build: {
      // Keep Three.js in its own chunk so it is only fetched when a scene is mounted.
      assetsInlineLimit: 4096,
    },
  },
});
