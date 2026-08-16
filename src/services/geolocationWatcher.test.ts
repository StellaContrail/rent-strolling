import { afterEach, describe, expect, it, vi } from 'vitest';
import { startWatchingPosition } from './geolocationWatcher.js';

const GEOLOCATION_ERROR_CODES = { PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as const;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('startWatchingPosition', () => {
  it('navigator.geolocationが無ければonUnsupportedを呼ぶ', () => {
    vi.stubGlobal('navigator', {});
    const onUnsupported = vi.fn();

    startWatchingPosition({
      onPosition: vi.fn(),
      onDenied: vi.fn(),
      onError: vi.fn(),
      onUnsupported,
    });

    expect(onUnsupported).toHaveBeenCalledOnce();
  });

  it('位置取得に成功すればonPositionを緯度経度付きで呼ぶ', () => {
    const watchPosition = vi.fn((success: (position: unknown) => void) => {
      success({ coords: { latitude: 35.6812, longitude: 139.7671 } });
    });
    vi.stubGlobal('navigator', { geolocation: { watchPosition } });
    const onPosition = vi.fn();

    startWatchingPosition({ onPosition, onDenied: vi.fn(), onError: vi.fn(), onUnsupported: vi.fn() });

    expect(onPosition).toHaveBeenCalledWith(35.6812, 139.7671);
  });

  it('PERMISSION_DENIEDエラーならonDeniedを呼ぶ', () => {
    const watchPosition = vi.fn((_success: unknown, error: (err: unknown) => void) => {
      error({ code: GEOLOCATION_ERROR_CODES.PERMISSION_DENIED, message: 'denied', ...GEOLOCATION_ERROR_CODES });
    });
    vi.stubGlobal('navigator', { geolocation: { watchPosition } });
    const onDenied = vi.fn();

    startWatchingPosition({ onPosition: vi.fn(), onDenied, onError: vi.fn(), onUnsupported: vi.fn() });

    expect(onDenied).toHaveBeenCalledOnce();
  });

  it('PERMISSION_DENIED以外のエラーならonErrorをメッセージ付きで呼ぶ', () => {
    const watchPosition = vi.fn((_success: unknown, error: (err: unknown) => void) => {
      error({
        code: GEOLOCATION_ERROR_CODES.POSITION_UNAVAILABLE,
        message: '位置情報を取得できません',
        ...GEOLOCATION_ERROR_CODES,
      });
    });
    vi.stubGlobal('navigator', { geolocation: { watchPosition } });
    const onError = vi.fn();

    startWatchingPosition({ onPosition: vi.fn(), onDenied: vi.fn(), onError, onUnsupported: vi.fn() });

    expect(onError).toHaveBeenCalledWith('位置情報を取得できません');
  });
});
