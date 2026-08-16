import type { MuniInfo } from './types.js';

export function parseReverseGeocodeResponse(json: unknown): { muniCd: string } | null {
  if (typeof json !== 'object' || json === null || !('results' in json)) {
    return null;
  }
  const results = (json as { results: unknown }).results;
  if (typeof results !== 'object' || results === null || !('muniCd' in results)) {
    return null;
  }
  const muniCd = (results as { muniCd: unknown }).muniCd;
  if (typeof muniCd !== 'string') {
    return null;
  }
  return { muniCd };
}

export function resolveMuniInfo(
  muniCd: string,
  muniTable: Record<string, { prefName: string; muniName: string }>,
): MuniInfo | null {
  const entry = muniTable[muniCd];
  if (!entry) {
    return null;
  }
  return { muniCode: muniCd, prefName: entry.prefName, muniName: entry.muniName };
}
