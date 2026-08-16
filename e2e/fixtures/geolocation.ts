import type { BrowserContext } from '@playwright/test';

export const CHIYODA = { latitude: 35.6812, longitude: 139.7671 };
export const SHIBUYA = { latitude: 35.6595, longitude: 139.7005 };

export async function grantAndSetGeolocation(
  context: BrowserContext,
  coords: { latitude: number; longitude: number },
): Promise<void> {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation(coords);
}
