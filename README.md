# ぶらり家賃旅

[![CI](https://github.com/StellaContrail/rent-strolling/actions/workflows/ci.yml/badge.svg)](https://github.com/StellaContrail/rent-strolling/actions/workflows/ci.yml)

散歩中にその場所周辺の家賃がどれくらいかを知りたい。できればリアルタイムで

公開URL: <https://stellacontrail.github.io/rent-strolling/>

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開き、位置情報の利用を許可してください。
`localhost` はHTTPのままGeolocation APIが使えますが、それ以外のホストからアクセスする場合はHTTPSが必要です。

## 家賃データについて

表示される家賃は総務省「住宅・土地統計調査（令和5年）」の「延べ面積1m²当たり家賃」統計表
（[0004021492](https://www.e-stat.go.jp/dbview?sid=0004021492)、民営借家・家賃0円を除く条件）に基づく市区町村単位の**目安**です。
リアルタイムの実勢賃料ではありません。全国1227市区町村分のデータが `public/data/rent-by-municipality.json` に入っていますが、
一部の小規模自治体はサンプル数不足により統計非公開のため対象外です。

データを再取得するには、e-Stat APIの利用登録（<https://www.e-stat.go.jp/mypage/user/preregister>）でappIdを取得し、
リポジトリ直下に `.env` を作成してください（`.env.example` は権限設定の都合でCLIから作成できなかったため、以下の内容を手動で保存してください）。

```
ESTAT_APP_ID=
ESTAT_STATS_DATA_ID=0004021492
```

設定後、以下を実行してください。

```bash
npm run fetch-data
```
