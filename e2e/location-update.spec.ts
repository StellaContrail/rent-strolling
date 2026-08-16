import { expect, test } from '@playwright/test';
import { CHIYODA, SHIBUYA, grantAndSetGeolocation } from './fixtures/geolocation.js';

test('移動すると家賃相場の表示が自動更新される', async ({ page, context }) => {
  await grantAndSetGeolocation(context, CHIYODA);
  await page.goto('/');

  await expect(page.locator('#status')).toContainText('東京都千代田区');

  await context.setGeolocation(SHIBUYA);

  await expect(page.locator('#status')).toContainText('東京都渋谷区');
  await expect(page.locator('.rent-card')).toContainText('東京都渋谷区');
});
