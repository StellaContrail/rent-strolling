import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    environmentMatchGlobs: [['src/render.test.ts', 'jsdom']],
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**'],
  },
});
