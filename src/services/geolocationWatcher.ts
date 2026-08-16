export interface GeolocationHandlers {
  onPosition: (lat: number, lon: number) => void;
  onDenied: () => void;
  onError: (message: string) => void;
  onUnsupported: () => void;
}

export function startWatchingPosition(handlers: GeolocationHandlers): void {
  if (!('geolocation' in navigator)) {
    handlers.onUnsupported();
    return;
  }

  navigator.geolocation.watchPosition(
    (position) => {
      handlers.onPosition(position.coords.latitude, position.coords.longitude);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        handlers.onDenied();
      } else {
        handlers.onError(error.message);
      }
    },
    { enableHighAccuracy: true, maximumAge: 10_000 },
  );
}
