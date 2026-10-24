import { test as base, expect } from '@playwright/test';
import { CHIYODA, SHIBUYA } from './geolocation.js';

export const REVERSE_GEOCODE_URL = 'https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress';

// ブラウザの位置情報と実際の静的JSONはそのまま使い、外部APIだけ固定する。
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route(`${REVERSE_GEOCODE_URL}?*`, async (route) => {
      const url = new URL(route.request().url());
      const coords = { latitude: Number(url.searchParams.get('lat')), longitude: Number(url.searchParams.get('lon')) };
      const muniCd = coords.latitude === CHIYODA.latitude && coords.longitude === CHIYODA.longitude
        ? '13101'
        : coords.latitude === SHIBUYA.latitude && coords.longitude === SHIBUYA.longitude ? '13113' : null;
      expect(muniCd, '想定した位置情報が逆ジオコーディングに渡されること').not.toBeNull();
      await route.fulfill({ json: { results: { muniCd } } });
    });
    await use(context);
  },
});
export { expect };
