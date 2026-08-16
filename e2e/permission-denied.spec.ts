import { expect, test } from '@playwright/test';

test('位置情報の利用を拒否すると案内メッセージが表示される', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#status')).toContainText('許可されていません');
  await expect(page.locator('#status button')).toBeVisible();
});
