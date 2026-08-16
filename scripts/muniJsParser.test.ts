import { describe, expect, it } from 'vitest';
import { parseMuniJs } from './muniJsParser.js';

describe('parseMuniJs', () => {
  it('GSI.MUNI_ARRAYの代入文をパースし、5桁ゼロ埋めキーの表を返す', () => {
    const raw = `
GSI.MUNI_ARRAY = {};
GSI.MUNI_ARRAY["1100"] = '1,北海道,1100,札幌市';
GSI.MUNI_ARRAY["1101"] = '1,北海道,1101,札幌市　中央区';
GSI.MUNI_ARRAY["13101"] = '13,東京都,13101,千代田区';
`;
    const table = parseMuniJs(raw);
    expect(table['01100']).toEqual({ prefName: '北海道', muniName: '札幌市' });
    expect(table['01101']).toEqual({ prefName: '北海道', muniName: '札幌市　中央区' });
    expect(table['13101']).toEqual({ prefName: '東京都', muniName: '千代田区' });
  });

  it('該当する代入文が無ければ空オブジェクトを返す', () => {
    expect(parseMuniJs('GSI.MUNI_ARRAY = {};')).toEqual({});
  });
});
