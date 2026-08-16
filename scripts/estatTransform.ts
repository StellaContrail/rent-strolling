import type { MuniTableEntry, RentRecord } from '../src/core/types.js';

interface EstatValue {
  '@area'?: string;
  $?: string;
}

export function transformEstatResponse(
  json: unknown,
  muniTable: Record<string, MuniTableEntry>,
  surveyYear: number,
): RentRecord[] {
  const values = extractValues(json);
  const records: RentRecord[] = [];

  for (const value of values) {
    const muniCode = value['@area'];
    if (!muniCode) continue;

    const muni = muniTable[muniCode];
    if (!muni) continue;

    const rentPerSqm = Number(value.$);
    if (!Number.isFinite(rentPerSqm)) continue;

    records.push({
      muniCode,
      prefName: muni.prefName,
      muniName: muni.muniName,
      rentPerSqm,
      surveyYear,
    });
  }

  return records;
}

function extractValues(json: unknown): EstatValue[] {
  const value = (json as {
    GET_STATS_DATA?: { STATISTICAL_DATA?: { DATA_INF?: { VALUE?: unknown } } };
  })?.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF?.VALUE;

  return Array.isArray(value) ? (value as EstatValue[]) : [];
}
