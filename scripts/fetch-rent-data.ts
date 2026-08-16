import 'dotenv/config';
import { readFile, writeFile } from 'node:fs/promises';
import { transformEstatResponse } from './estatTransform.js';

const APP_ID = process.env.ESTAT_APP_ID;
const STATS_DATA_ID = process.env.ESTAT_STATS_DATA_ID;
const SURVEY_YEAR = 2023;

async function main() {
  if (!APP_ID) {
    console.error(
      '[fetch-rent-data] ESTAT_APP_ID が未設定です。https://www.e-stat.go.jp/mypage/user/preregister で登録し、.env.example を参考に .env に設定してください。',
    );
    process.exit(1);
  }
  if (!STATS_DATA_ID) {
    console.error(
      '[fetch-rent-data] ESTAT_STATS_DATA_ID が未設定です。e-Statで住宅・土地統計調査の統計表IDを特定し .env に設定してください。',
    );
    process.exit(1);
  }

  const muniTable = JSON.parse(await readFile('public/data/muni-table.json', 'utf-8'));

  // cdCat01=3: 民営借家、cdCat02=2: 家賃0円(社宅等の無償住宅)を含まない
  const url = `https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData?appId=${APP_ID}&statsDataId=${STATS_DATA_ID}&cdCat01=3&cdCat02=2&limit=100000`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[fetch-rent-data] APIエラー: ${res.status}`);
    process.exit(1);
  }

  const json = await res.json();
  const records = transformEstatResponse(json, muniTable, SURVEY_YEAR);

  if (records.length === 0) {
    console.error('[fetch-rent-data] 変換結果が0件でした。統計表IDやレスポンス形式を確認してください。');
    process.exit(1);
  }

  await writeFile(
    'public/data/rent-by-municipality.json',
    JSON.stringify(
      { surveyYear: SURVEY_YEAR, generatedAt: new Date().toISOString(), records },
      null,
      2,
    ),
  );

  console.log(`[fetch-rent-data] ${records.length}件を public/data/rent-by-municipality.json に書き出しました`);
}

main();
