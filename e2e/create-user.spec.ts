import { expect, test } from '@playwright/test';

test('creating a user shows a success message and appears in the list', async ({ page }) => {
  // 用時間戳確保 email 在同一次測試執行中一定是唯一的，
  // 避免測試資料因為重複執行而跟 mock「資料庫」裡既有的資料衝突。
  const uniqueEmail = `e2e.${Date.now()}@example.com`;

  await page.goto('/users/new');

  await page.getByLabel('Name', { exact: true }).fill('Playwright E2E User');
  await page.getByLabel('Email', { exact: true }).fill(uniqueEmail);
  await page.getByLabel('Role', { exact: true }).click();
  await page.getByRole('option', { name: 'Editor' }).click();
  await page.getByLabel('Age', { exact: true }).fill('29');

  await page.getByRole('button', { name: 'Create User' }).click();

  await expect(page).toHaveURL(/\/users$/);
  await expect(page.getByText('使用者建立成功')).toBeVisible();
  await expect(page.getByText('Playwright E2E User')).toBeVisible();
});
