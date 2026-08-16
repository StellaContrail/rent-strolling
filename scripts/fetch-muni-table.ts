import { writeFile } from 'node:fs/promises';
import { parseMuniJs } from './muniJsParser.js';

const MUNI_JS_URL = 'https://maps.gsi.go.jp/js/muni.js';

async function main() {
  const res = await fetch(MUNI_JS_URL);
  if (!res.ok) {
    console.error(`[fetch-muni-table] 取得に失敗しました: ${res.status}`);
    process.exit(1);
  }

  const rawText = await res.text();
  const table = parseMuniJs(rawText);
  const count = Object.keys(table).length;

  if (count === 0) {
    console.error('[fetch-muni-table] パース結果が空です。muni.jsの形式が変わった可能性があります。');
    process.exit(1);
  }

  await writeFile('public/data/muni-table.json', JSON.stringify(table, null, 2));
  console.log(`[fetch-muni-table] ${count}件を public/data/muni-table.json に書き出しました`);
}

main();
