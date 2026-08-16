import type { LocationStatus, RentDisplayViewModel } from './core/types.js';

export interface RenderElements {
  statusEl: HTMLElement;
  resultEl: HTMLElement;
}

export function renderStatus(elements: RenderElements, status: LocationStatus, onRetry: () => void): void {
  const { statusEl } = elements;
  statusEl.classList.remove('status-error', 'status-denied');
  statusEl.textContent = '';

  switch (status.kind) {
    case 'idle':
    case 'requesting':
      statusEl.textContent = '現在地を取得しています…';
      break;
    case 'unsupported':
      statusEl.textContent = 'このブラウザまたはこの接続では位置情報が利用できません。';
      statusEl.classList.add('status-error');
      break;
    case 'denied':
      statusEl.textContent = '位置情報の利用が許可されていません。ブラウザの設定から許可してください。';
      statusEl.classList.add('status-denied');
      renderRetryButton(elements, onRetry);
      break;
    case 'error':
      statusEl.textContent = `位置情報の取得に失敗しました: ${status.message}`;
      statusEl.classList.add('status-error');
      break;
    case 'muniUnresolved':
      statusEl.textContent = '現在地の市区町村を特定できませんでした。';
      statusEl.classList.add('status-error');
      break;
    case 'located':
      statusEl.textContent = `現在地: ${status.muni.prefName}${status.muni.muniName}`;
      break;
  }
}

function renderRetryButton(elements: RenderElements, onRetry: () => void): void {
  const button = document.createElement('button');
  button.textContent = '再試行';
  button.addEventListener('click', () => {
    button.remove();
    onRetry();
  });
  elements.statusEl.append(document.createElement('br'), button);
}

export function renderRentInfo(elements: RenderElements, view: RentDisplayViewModel): void {
  const { resultEl } = elements;

  if (!view.hasData) {
    resultEl.innerHTML = `
      <div class="rent-card">
        <h2>${view.title}</h2>
        <p class="rent-note">${view.note}</p>
      </div>
    `;
    return;
  }

  resultEl.innerHTML = `
    <div class="rent-card">
      <h2>${view.title}</h2>
      <p class="rent-value">${view.rentText}</p>
      <p class="rent-note">${view.note}</p>
    </div>
  `;
}
