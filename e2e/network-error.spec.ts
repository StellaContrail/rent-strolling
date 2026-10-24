import { expect, test, REVERSE_GEOCODE_URL } from './fixtures/app.js';
import { CHIYODA, grantAndSetGeolocation } from './fixtures/geolocation.js';

test('逆ジオコーディングの通信失敗時は待機表示からエラー表示に変わる', async ({ page, context }) => {
  await grantAndSetGeolocation(context, CHIYODA);
  await context.route(`${REVERSE_GEOCODE_URL}?*`, (route) => route.abort('failed'));
  await page.goto('./');

  await expect(page.locator('#status')).toContainText('逆ジオコーディングに失敗しました');
  await expect(page.locator('.rent-card')).toHaveCount(0);
});

test('逆ジオコーディングが応答しない場合もタイムアウトでエラー表示になる', async ({ page, context }) => {
  await grantAndSetGeolocation(context, CHIYODA);
  let requested!: () => void;
  const requestStarted = new Promise<void>((resolve) => { requested = resolve; });
  await context.route(`${REVERSE_GEOCODE_URL}?*`, () => { requested(); });
  await page.clock.install();
  await page.goto('./');
  await requestStarted;
  await page.clock.fastForward(10_000);

  await expect(page.locator('#status')).toContainText('逆ジオコーディングに失敗しました');
});
