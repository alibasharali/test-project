import { defineConfig } from 'vitest/config'

// separate from vite.config.ts: the Cloudflare plugin breaks vitest
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: { include: ['src/**/*.test.ts'] },
})
