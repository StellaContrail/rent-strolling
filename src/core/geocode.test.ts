import { describe, expect, it } from 'vitest';
import { parseReverseGeocodeResponse, resolveMuniInfo } from './geocode.js';

describe('parseReverseGeocodeResponse', () => {
  it('正常なレスポンスからmuniCdを取り出す', () => {
    const json = { results: { muniCd: '13101', lv01Nm: '丸の内一丁目' } };
    expect(parseReverseGeocodeResponse(json)).toEqual({ muniCd: '13101' });
  });

  it('resultsが無ければnullを返す', () => {
    expect(parseReverseGeocodeResponse({})).toBeNull();
  });

  it('muniCdが無ければnullを返す', () => {
    expect(parseReverseGeocodeResponse({ results: { lv01Nm: '丸の内一丁目' } })).toBeNull();
  });

  it('不正な形（null）ならnullを返す', () => {
    expect(parseReverseGeocodeResponse(null)).toBeNull();
  });
});

describe('resolveMuniInfo', () => {
  const muniTable = {
    '13101': { prefName: '東京都', muniName: '千代田区' },
  };

  it('テーブルに存在すればMuniInfoを返す', () => {
    expect(resolveMuniInfo('13101', muniTable)).toEqual({
      muniCode: '13101',
      prefName: '東京都',
      muniName: '千代田区',
    });
  });

  it('テーブルに存在しなければnullを返す', () => {
    expect(resolveMuniInfo('99999', muniTable)).toBeNull();
  });
});
