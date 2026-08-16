import { describe, expect, it, vi } from 'vitest';
import { buildReverseGeocodeUrl, fetchMuniCd } from './reverseGeocodeClient.js';

describe('buildReverseGeocodeUrl', () => {
  it('緯度経度をクエリパラメータに含んだURLを組み立てる', () => {
    const url = buildReverseGeocodeUrl(35.6812, 139.7671);
    expect(url).toBe(
      'https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat=35.6812&lon=139.7671',
    );
  });
});

describe('fetchMuniCd', () => {
  it('正常レスポンスからmuniCdを返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: { muniCd: '13101', lv01Nm: '丸の内一丁目' } }),
      }),
    );

    await expect(fetchMuniCd(35.6812, 139.7671)).resolves.toBe('13101');
    vi.unstubAllGlobals();
  });

  it('レスポンスが不正な場合はnullを返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) }),
    );

    await expect(fetchMuniCd(35.6812, 139.7671)).resolves.toBeNull();
    vi.unstubAllGlobals();
  });

  it('HTTPエラーの場合はnullを返す', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(fetchMuniCd(35.6812, 139.7671)).resolves.toBeNull();
    vi.unstubAllGlobals();
  });
});
