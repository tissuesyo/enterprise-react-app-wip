import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 集中設定 @/ 別名，讓 import 路徑與 tsconfig 保持一致，
// 避免「TypeScript 看得懂但 Vite 找不到檔案」這種常見錯誤。
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
