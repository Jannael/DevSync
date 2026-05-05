import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './apps/cli'),
      '@devsync': resolve(__dirname, './apps/devsync'),
    },
  },
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.spec.ts'],
  },
})
