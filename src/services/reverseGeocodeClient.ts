import { parseReverseGeocodeResponse } from '../core/geocode.js';

const BASE_URL = 'https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress';

export function buildReverseGeocodeUrl(lat: number, lon: number): string {
  return `${BASE_URL}?lat=${lat}&lon=${lon}`;
}

export async function fetchMuniCd(lat: number, lon: number): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(buildReverseGeocodeUrl(lat, lon), { signal: controller.signal });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    const parsed = parseReverseGeocodeResponse(json);
    return parsed?.muniCd ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
