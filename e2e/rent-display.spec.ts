import { expect, test } from '@playwright/test';
import { CHIYODA, grantAndSetGeolocation } from './fixtures/geolocation.js';

test('現在地の家賃相場が表示される', async ({ page, context }) => {
  await grantAndSetGeolocation(context, CHIYODA);

  await page.goto('./');

  await expect(page.locator('#status')).toContainText('東京都千代田区');
  await expect(page.locator('.rent-card')).toBeVisible();
  await expect(page.locator('.rent-card')).toContainText('円');
  await expect(page.locator('.rent-card')).toContainText('目安');
});

test('320px幅の極小画面でも横スクロールが発生しない', async ({ page, context }) => {
  await grantAndSetGeolocation(context, CHIYODA);
  await page.setViewportSize({ width: 320, height: 568 });

  await page.goto('./');

  await expect(page.locator('.rent-card')).toBeVisible();
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});
