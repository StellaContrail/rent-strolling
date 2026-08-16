import type { MuniTableEntry } from '../src/core/types.js';

export function parseMuniJs(rawText: string): Record<string, MuniTableEntry> {
  const result: Record<string, MuniTableEntry> = {};
  const pattern = /GSI\.MUNI_ARRAY\["(\d+)"\]\s*=\s*'([^']+)';/g;

  for (const match of rawText.matchAll(pattern)) {
    const key = match[1];
    const value = match[2];
    const [, prefName, , muniName] = value.split(',');
    result[key.padStart(5, '0')] = { prefName, muniName: muniName.trim() };
  }

  return result;
}
