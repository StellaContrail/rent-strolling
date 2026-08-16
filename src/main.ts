import './style.css';
import { resolveMuniInfo } from './core/geocode.js';
import { shouldRefetch } from './core/locationDiff.js';
import { findRentRecord, formatRentDisplay } from './core/rentLookup.js';
import type { MuniTable, RentDataset } from './core/types.js';
import { renderRentInfo, renderStatus, type RenderElements } from './render.js';
import { fetchMuniCd } from './services/reverseGeocodeClient.js';
import { startWatchingPosition } from './services/geolocationWatcher.js';
import { loadMuniTable, loadRentDataset } from './services/staticDataClient.js';

const elements: RenderElements = {
  statusEl: document.querySelector<HTMLDivElement>('#status')!,
  resultEl: document.querySelector<HTMLDivElement>('#result')!,
};

async function main(): Promise<void> {
  renderStatus(elements, { kind: 'requesting' }, main);

  const [rentDataset, muniTable]: [RentDataset | null, MuniTable | null] = await Promise.all([
    loadRentDataset(),
    loadMuniTable(),
  ]);

  if (!rentDataset || !muniTable) {
    renderStatus(elements, { kind: 'error', message: '相場データの読み込みに失敗しました。' }, main);
    return;
  }

  let lastMuniCode: string | null = null;

  startWatchingPosition({
    onPosition: async (lat, lon) => {
      const muniCd = await fetchMuniCd(lat, lon);
      if (!muniCd) {
        renderStatus(elements, { kind: 'error', message: '現在地の逆ジオコーディングに失敗しました。' }, main);
        return;
      }
      if (!shouldRefetch(lastMuniCode, muniCd)) {
        return;
      }
      lastMuniCode = muniCd;

      const muni = resolveMuniInfo(muniCd, muniTable);
      if (!muni) {
        renderStatus(elements, { kind: 'muniUnresolved' }, main);
        return;
      }

      renderStatus(elements, { kind: 'located', muni }, main);
      const record = findRentRecord(rentDataset.records, muni.muniCode);
      renderRentInfo(elements, formatRentDisplay(record, muni));
    },
    onDenied: () => renderStatus(elements, { kind: 'denied' }, main),
    onError: (message) => renderStatus(elements, { kind: 'error', message }, main),
    onUnsupported: () => renderStatus(elements, { kind: 'unsupported' }, main),
  });
}

main();
