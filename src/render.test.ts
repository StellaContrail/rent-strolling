// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRentInfo, renderStatus, type RenderElements } from './render.js';

function createElements(): RenderElements {
  document.body.innerHTML = '<div id="status"></div><div id="result"></div>';
  return {
    statusEl: document.querySelector('#status')!,
    resultEl: document.querySelector('#result')!,
  };
}

describe('renderStatus', () => {
  let elements: RenderElements;

  beforeEach(() => {
    elements = createElements();
  });

  it('locatedの場合、都道府県と市区町村名を表示する', () => {
    renderStatus(elements, { kind: 'located', muni: { muniCode: '13101', prefName: '東京都', muniName: '千代田区' } }, vi.fn());

    expect(elements.statusEl.textContent).toContain('東京都千代田区');
    expect(elements.statusEl.classList.contains('status-error')).toBe(false);
  });

  it('deniedの場合、エラー表示クラスと再試行ボタンを出す', () => {
    const onRetry = vi.fn();
    renderStatus(elements, { kind: 'denied' }, onRetry);

    expect(elements.statusEl.classList.contains('status-denied')).toBe(true);
    const button = elements.statusEl.querySelector('button');
    expect(button).not.toBeNull();

    button?.click();
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('unsupportedの場合、エラー表示クラスを付ける', () => {
    renderStatus(elements, { kind: 'unsupported' }, vi.fn());

    expect(elements.statusEl.classList.contains('status-error')).toBe(true);
  });

  it('muniUnresolvedの場合、特定できなかった旨を表示する', () => {
    renderStatus(elements, { kind: 'muniUnresolved' }, vi.fn());

    expect(elements.statusEl.textContent).toContain('特定できませんでした');
  });

  it('前回のエラー表示クラスは次の描画でリセットされる', () => {
    renderStatus(elements, { kind: 'denied' }, vi.fn());
    renderStatus(elements, { kind: 'located', muni: { muniCode: '13101', prefName: '東京都', muniName: '千代田区' } }, vi.fn());

    expect(elements.statusEl.classList.contains('status-denied')).toBe(false);
  });
});

describe('renderRentInfo', () => {
  let elements: RenderElements;

  beforeEach(() => {
    elements = createElements();
  });

  it('hasData:trueの場合、家賃と注記を表示する', () => {
    renderRentInfo(elements, {
      hasData: true,
      title: '東京都千代田区',
      rentText: '1m²あたり 約4,200円',
      note: '2023年の統計に基づく目安です。',
    });

    expect(elements.resultEl.textContent).toContain('東京都千代田区');
    expect(elements.resultEl.textContent).toContain('4,200');
    expect(elements.resultEl.textContent).toContain('目安');
  });

  it('hasData:falseの場合、データ未整備の旨を表示する', () => {
    renderRentInfo(elements, {
      hasData: false,
      title: '東京都千代田区',
      note: 'このエリアの家賃データは現在整備されていません。',
    });

    expect(elements.resultEl.textContent).toContain('整備されていません');
  });
});
