import { isValidRentDataset } from '../core/rentLookup.js';
import type { MuniTable, RentDataset } from '../core/types.js';

export async function loadRentDataset(): Promise<RentDataset | null> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/rent-by-municipality.json`);
  if (!res.ok) {
    return null;
  }
  const json = await res.json();
  return isValidRentDataset(json) ? json : null;
}

export async function loadMuniTable(): Promise<MuniTable | null> {
  const res = await fetch(`${import.meta.env.BASE_URL}data/muni-table.json`);
  if (!res.ok) {
    return null;
  }
  const json = await res.json();
  if (typeof json !== 'object' || json === null) {
    return null;
  }
  return json as MuniTable;
}
