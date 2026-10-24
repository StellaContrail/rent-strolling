import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildReverseGeocodeUrl, fetchMuniCd } from './reverseGeocodeClient.js';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

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

describe('逆ジオコーディングの通信障害', () => {
  it('ネットワークエラーの場合はnullを返す', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(fetchMuniCd(35.6812, 139.7671)).resolves.toBeNull();
  });

  it('不正なJSONの場合はnullを返す', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true, json: () => Promise.reject(new SyntaxError('Invalid JSON')),
    }));
    await expect(fetchMuniCd(35.6812, 139.7671)).resolves.toBeNull();
  });

  it('応答しない場合は10秒で中断してnullを返す', async () => {
    vi.useFakeTimers();
    let signal: AbortSignal;
    vi.stubGlobal('fetch', vi.fn((_url, options) => {
      signal = options.signal;
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason));
      });
    }));
    const result = fetchMuniCd(35.6812, 139.7671);
    await vi.advanceTimersByTimeAsync(10_000);
    await expect(result).resolves.toBeNull();
    expect(signal!.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });
});
