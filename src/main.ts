import './style.css';
import { resolveMuniInfo } from './core/geocode.js';
import { shouldRefetch } from './core/locationDiff.js';
import { findRentRecord, formatRentDisplay } from './core/rentLookup.js';
import type { LocationStatus, MuniTable, RentDataset } from './core/types.js';
import { fetchMuniCd } from './services/reverseGeocodeClient.js';
import { startWatchingPosition } from './services/geolocationWatcher.js';
import { loadMuniTable, loadRentDataset } from './services/staticDataClient.js';

const statusEl = document.querySelector<HTMLDivElement>('#status')!;
const resultEl = document.querySelector<HTMLDivElement>('#result')!;

function renderStatus(status: LocationStatus): void {
  statusEl.classList.remove('status-error', 'status-denied');

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
      renderRetryButton();
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

function renderRetryButton(): void {
  const button = document.createElement('button');
  button.textContent = '再試行';
  button.addEventListener('click', () => {
    button.remove();
    main();
  });
  statusEl.append(document.createElement('br'), button);
}

function renderRentInfo(view: ReturnType<typeof formatRentDisplay>): void {
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

async function main(): Promise<void> {
  renderStatus({ kind: 'requesting' });

  const [rentDataset, muniTable]: [RentDataset | null, MuniTable | null] = await Promise.all([
    loadRentDataset(),
    loadMuniTable(),
  ]);

  if (!rentDataset || !muniTable) {
    renderStatus({ kind: 'error', message: '相場データの読み込みに失敗しました。' });
    return;
  }

  let lastMuniCode: string | null = null;

  startWatchingPosition({
    onPosition: async (lat, lon) => {
      const muniCd = await fetchMuniCd(lat, lon);
      if (!muniCd) {
        renderStatus({ kind: 'error', message: '現在地の逆ジオコーディングに失敗しました。' });
        return;
      }
      if (!shouldRefetch(lastMuniCode, muniCd)) {
        return;
      }
      lastMuniCode = muniCd;

      const muni = resolveMuniInfo(muniCd, muniTable);
      if (!muni) {
        renderStatus({ kind: 'muniUnresolved' });
        return;
      }

      renderStatus({ kind: 'located', muni });
      const record = findRentRecord(rentDataset.records, muni.muniCode);
      renderRentInfo(formatRentDisplay(record, muni));
    },
    onDenied: () => renderStatus({ kind: 'denied' }),
    onError: (message) => renderStatus({ kind: 'error', message }),
    onUnsupported: () => renderStatus({ kind: 'unsupported' }),
  });
}

main();
