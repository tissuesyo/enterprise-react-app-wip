import { expect, test } from '@playwright/test';

test('creating a user shows a success message and appears in the list', async ({ page }) => {
  // 用時間戳確保 email 在同一次測試執行中一定是唯一的，
  // 避免測試資料因為重複執行而跟 mock「資料庫」裡既有的資料衝突。
  const uniqueEmail = `e2e.${Date.now()}@example.com`;

  await page.goto('/users/new');

  // 必填欄位的 label 實際渲染出來是「Name *」這種帶星號的文字（MUI 的 required
  // label 慣例），accessible name 會包含那個星號，所以這裡不能用 `exact: true`
  // 去精準比對 "Name"——那樣永遠比對不到，用預設的部分比對即可。
  await page.getByLabel('Name').fill('Playwright E2E User');
  await page.getByLabel('Email').fill(uniqueEmail);
  await page.getByLabel('Role').click();
  await page.getByRole('option', { name: 'Editor' }).click();
  await page.getByLabel('Age').fill('29');

  await page.getByRole('button', { name: 'Create User' }).click();

  await expect(page).toHaveURL(/\/users$/);
  await expect(page.getByText('使用者建立成功')).toBeVisible();
  await expect(page.getByText('Playwright E2E User')).toBeVisible();
});
