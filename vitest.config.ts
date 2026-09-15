import path from 'node:path';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// 測試環境使用獨立設定檔（而不是塞進 vite.config.ts），
// 這樣production build 不會意外把測試相關設定/型別打包進去。
export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      exclude: ['**/node_modules/**', '**/e2e/**', '**/dist/**'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: [
          'e2e/**',
          'src/test/**',
          'src/mocks/**',
          '**/*.d.ts',
          '**/*.config.*',
        ],
      },
    },
  }),
);
