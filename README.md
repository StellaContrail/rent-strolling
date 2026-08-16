# ぶらり家賃旅
散歩中にその場所周辺の家賃がどれくらいかを知りたい。できればリアルタイムで

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開き、位置情報の利用を許可してください。
`localhost` はHTTPのままGeolocation APIが使えますが、それ以外のホストからアクセスする場合はHTTPSが必要です。

## 家賃データについて

表示される家賃は総務省「住宅・土地統計調査」に基づく市区町村単位の**目安**です。
リアルタイムの実勢賃料ではありません。現状は開発確認用の少数の市区町村のみ仮データが入っています
（`public/data/rent-by-municipality.json`）。

実データに更新するには、e-Stat APIの利用登録（<https://www.e-stat.go.jp/mypage/user/preregister>）でappIdを取得し、
リポジトリ直下に `.env` を作成してください（`.env.example` は権限設定の都合でCLIから作成できなかったため、以下の内容を手動で保存してください）。

```
ESTAT_APP_ID=
ESTAT_STATS_DATA_ID=
```

`ESTAT_STATS_DATA_ID` には住宅・土地統計調査の対象統計表IDを指定します。設定後、以下を実行してください。

```bash
npm run fetch-data
```
