import type { MuniInfo, RentDataset, RentDisplayViewModel, RentRecord } from './types.js';

export function isValidRentDataset(json: unknown): json is RentDataset {
  if (typeof json !== 'object' || json === null) {
    return false;
  }
  const candidate = json as Record<string, unknown>;
  return (
    typeof candidate.surveyYear === 'number' &&
    typeof candidate.generatedAt === 'string' &&
    Array.isArray(candidate.records)
  );
}

export function findRentRecord(records: RentRecord[], muniCode: string): RentRecord | null {
  return records.find((record) => record.muniCode === muniCode) ?? null;
}

export function formatRentDisplay(record: RentRecord | null, muni: MuniInfo): RentDisplayViewModel {
  const title = `${muni.prefName}${muni.muniName}`;

  if (!record) {
    return {
      hasData: false,
      title,
      note: 'このエリアの家賃データは現在整備されていません。',
    };
  }

  return {
    hasData: true,
    title,
    rentText: `1m²あたり 約${record.rentPerSqm.toLocaleString('ja-JP')}円`,
    note: `${record.surveyYear}年の住宅・土地統計調査に基づく目安です。実勢の賃料とは異なる場合があります。`,
  };
}
