import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

/**
 * ESLint Flat Config。
 * 規則集刻意保守：type-checked 規則只開對「不熟悉 React 的團隊」真正有幫助的幾條
 * （no-floating-promises 之類），不開滿整套 strict-type-checked，避免一開始就被大量規則淹沒。
 */
export default tseslint.config(
  { ignores: ['dist', 'coverage', 'playwright-report', 'test-results', 'public'] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // 型別安全相關規則：保留真正能抓到 bug 的規則，其餘關掉以降低對新手團隊的干擾。
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    // 設定檔本身用 Node 環境執行，不需要套用瀏覽器/React 規則。
    files: ['*.config.{ts,js}', 'playwright.config.ts', 'vitest.config.ts'],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/test/**', 'e2e/**'],
    rules: {
      // 測試檔案常常需要用 `as` 轉出最小範圍的假 params（見 ActionButtonsCellRenderer.test.tsx），
      // type-checked 規則在這裡容易產生偽陽性，予以放寬。
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
);
