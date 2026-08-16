import { describe, expect, it } from 'vitest';
import { shouldRefetch } from './locationDiff.js';

describe('shouldRefetch', () => {
  it('初回（prevがnull）は常に再取得する', () => {
    expect(shouldRefetch(null, '13101')).toBe(true);
  });

  it('同じ市区町村コードなら再取得しない', () => {
    expect(shouldRefetch('13101', '13101')).toBe(false);
  });

  it('市区町村コードが変われば再取得する', () => {
    expect(shouldRefetch('13101', '13102')).toBe(true);
  });
});
