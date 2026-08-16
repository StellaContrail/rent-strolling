import { describe, expect, it } from 'vitest';
import { transformEstatResponse } from './estatTransform.js';

describe('transformEstatResponse', () => {
  const muniTable = {
    '13101': { prefName: '東京都', muniName: '千代田区' },
  };

  it('e-StatのgetStatsDataレスポンスをRentRecord[]に変換する', () => {
    const json = {
      GET_STATS_DATA: {
        STATISTICAL_DATA: {
          DATA_INF: {
            VALUE: [{ '@area': '13101', '@time': '2023000000', $: '3500' }],
          },
        },
      },
    };

    const records = transformEstatResponse(json, muniTable, 2023);
    expect(records).toEqual([
      { muniCode: '13101', prefName: '東京都', muniName: '千代田区', rentPerSqm: 3500, surveyYear: 2023 },
    ]);
  });

  it('muniTableに無い地域コードのレコードは除外する', () => {
    const json = {
      GET_STATS_DATA: {
        STATISTICAL_DATA: {
          DATA_INF: {
            VALUE: [{ '@area': '99999', '@time': '2023000000', $: '3000' }],
          },
        },
      },
    };

    expect(transformEstatResponse(json, muniTable, 2023)).toEqual([]);
  });

  it('数値化できない値のレコードは除外する', () => {
    const json = {
      GET_STATS_DATA: {
        STATISTICAL_DATA: {
          DATA_INF: {
            VALUE: [{ '@area': '13101', '@time': '2023000000', $: '-' }],
          },
        },
      },
    };

    expect(transformEstatResponse(json, muniTable, 2023)).toEqual([]);
  });

  it('不正な形のレスポンスなら空配列を返す', () => {
    expect(transformEstatResponse({}, muniTable, 2023)).toEqual([]);
  });
});
