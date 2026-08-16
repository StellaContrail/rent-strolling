---
name: git-commit
description: Stages the relevant changed files and creates a commit following Conventional Commits format. Use this skill whenever the user asks to commit changes — "コミットして", "commit this", "変更をコミットして", "ここまでの変更をまとめてコミットして" — or asks for help writing a commit message, even if they don't specify the exact wording or format they want. Also use it proactively at natural checkpoints (e.g. after a TDD cycle's tests go green, after finishing a self-contained unit of work) without waiting to be asked — the user has opted into automatic commits for this repo. Do not use it to push, open a PR, or amend history — those are separate concerns.
---

# Git Commit

自動でConventional Commits 形式に従うコミットを作成するスキル。

## ワークフロー

### 1. 状況を確認する

```bash
git status
git diff              # 未ステージの変更
git diff --staged     # 既にステージされている変更
```

### 2. コミットメッセージを組み立てる（Conventional Commits）

```
<type>[(<scope>)][!]: <要約>

[本文]

[フッター]
```

`git diff` の内容から type を判定する:

| type       | 用途                                      |
| ---------- | ----------------------------------------- |
| `feat`     | 新機能                                     |
| `fix`      | バグ修正                                   |
| `docs`     | ドキュメントのみの変更                       |
| `style`    | フォーマット等、ロジックに影響しない変更       |
| `refactor` | 機能追加でもバグ修正でもないリファクタリング   |
| `perf`     | パフォーマンス改善                          |
| `test`     | テストの追加・修正                          |
| `build`    | ビルドシステム・依存関係の変更                |
| `ci`       | CI 設定の変更                              |
| `chore`    | その他の雑務・保守                          |
| `revert`   | 直前のコミットの取り消し                     |

- `scope` は変更の対象領域が明確なら括弧付きで添える（省略可）
- 要約は日本語で書く。命令形・簡潔に、72 文字程度を目安に収める。末尾の句点は不要。
- 変更が大きく複数行の説明が要る場合は、1 行目に要約、空行を挟んで本文に「なぜ」を書く。
- 関連する Issue があれば `Closes #123` のようにフッターで参照する。

破壊的変更には `type`/`scope` の直後に `!` を付けるか、フッターに `BREAKING CHANGE:` を書く:

```
feat!: 旧エンドポイントを廃止
```

例:
```
feat(rent): 徒歩ルート周辺の家賃相場を取得するAPIを追加
fix(map): 現在地取得に失敗した際のクラッシュを修正
chore: 依存パッケージを更新
```

### 3. ステージングする

```bash
git add <関連ファイル>
```

- `git status` の差分から、今回の変更に関連するファイルを具体的にファイル名で `git add` する。
- 差分の中身が性質の異なる複数の変更（例: 無関係な機能追加とバグ修正が混在）にまたがる場合は、1 コミットにまとめず分割する。

### 4. コミットを作成する

- メッセージは必ず HEREDOC 経由で渡す（改行やクォートの事故を防ぐため）。
- 既存コミットを上書きしない: `--amend` は使わない。新規コミットとして積む。
- フックはスキップしない: `--no-verify` は使わない。pre-commit フックが失敗したら原因を直し、再度ステージしてから新しいコミットを作る。
- 署名回避もしない: `--no-gpg-sign` は使わない。

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <要約>

<必要であれば本文>
EOF
)"
```

## 安全性に関する原則

- 明示的な依頼がなくても、意味のある区切りで自動的に実行してよい。ただし後から取り消しやすい単位（小さく・意味のまとまった単位）でコミットする。
- コミット対象や粒度に迷いがあるとき（変更が大きすぎる、無関係な差分が混在している等）は、黙って進めずユーザーに確認する。
