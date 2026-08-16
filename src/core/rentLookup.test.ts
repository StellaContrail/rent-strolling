import { describe, expect, it } from 'vitest';
import { findRentRecord, formatRentDisplay, isValidRentDataset } from './rentLookup.js';
import type { MuniInfo, RentRecord } from './types.js';

describe('isValidRentDataset', () => {
  it('正しい形式ならtrue', () => {
    const dataset = {
      surveyYear: 2023,
      generatedAt: '2026-08-16T00:00:00.000Z',
      records: [],
    };
    expect(isValidRentDataset(dataset)).toBe(true);
  });

  it('recordsが配列でなければfalse', () => {
    expect(isValidRentDataset({ surveyYear: 2023, generatedAt: '', records: {} })).toBe(false);
  });

  it('nullならfalse', () => {
    expect(isValidRentDataset(null)).toBe(false);
  });
});

describe('findRentRecord', () => {
  const records: RentRecord[] = [
    { muniCode: '13101', prefName: '東京都', muniName: '千代田区', rentPerSqm: 3500, surveyYear: 2023 },
  ];

  it('該当する市区町村コードのレコードを返す', () => {
    expect(findRentRecord(records, '13101')).toEqual(records[0]);
  });

  it('該当しなければnullを返す', () => {
    expect(findRentRecord(records, '13102')).toBeNull();
  });
});

describe('formatRentDisplay', () => {
  const muni: MuniInfo = { muniCode: '13101', prefName: '東京都', muniName: '千代田区' };

  it('レコードがある場合、家賃目安と注記を含む表示モデルを返す', () => {
    const record: RentRecord = { ...muni, rentPerSqm: 3500, surveyYear: 2023 };
    const view = formatRentDisplay(record, muni);
    expect(view.hasData).toBe(true);
    expect(view.title).toBe('東京都千代田区');
    if (view.hasData) {
      expect(view.rentText).toContain('3,500');
    }
    expect(view.note).toContain('2023');
    expect(view.note).toContain('目安');
  });

  it('レコードが無い場合、データ未整備の旨を返す', () => {
    const view = formatRentDisplay(null, muni);
    expect(view.hasData).toBe(false);
    expect(view.title).toBe('東京都千代田区');
    expect(view.note).toContain('整備されていません');
  });
});
