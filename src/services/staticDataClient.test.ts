import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadMuniTable, loadRentDataset } from './staticDataClient.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('loadRentDataset', () => {
  it('正常なJSONを取得できればデータセットを返す', async () => {
    const dataset = { surveyYear: 2023, generatedAt: '2023-01-01T00:00:00.000Z', records: [] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(dataset) }));

    await expect(loadRentDataset()).resolves.toEqual(dataset);
  });

  it('HTTPエラーの場合はnullを返す', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(loadRentDataset()).resolves.toBeNull();
  });

  it('不正な形式のJSONの場合はnullを返す', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ foo: 'bar' }) }));

    await expect(loadRentDataset()).resolves.toBeNull();
  });
});

describe('loadMuniTable', () => {
  it('正常なJSONを取得できればテーブルを返す', async () => {
    const table = { '13101': { prefName: '東京都', muniName: '千代田区' } };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(table) }));

    await expect(loadMuniTable()).resolves.toEqual(table);
  });

  it('HTTPエラーの場合はnullを返す', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await expect(loadMuniTable()).resolves.toBeNull();
  });

  it('JSONがオブジェクトでない場合はnullを返す', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(null) }));

    await expect(loadMuniTable()).resolves.toBeNull();
  });
});
