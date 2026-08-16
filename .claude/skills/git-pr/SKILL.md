---
name: git-pr
description: 現在のブランチの変更からプルリクエスト（PR）を作成するスキル。ユーザーが「PRを作成して」「プルリクを出して」「PR出して」「レビューに出したい」などと言ったとき、または変更がひとまとまり完了してレビュー依頼したい文脈で必ず使用する。mainブランチへの直接pushを防ぎ、GitHub Flowに沿ってブランチ確認・コミット確認・テンプレート準拠の説明文作成・push・`gh pr create`までを一貫して行う。単なる`git commit`だけの依頼には使わない（それは git-commit の役割）。
---

# Git PR

現在のブランチの変更を GitHub Flow に従ってプルリクエストにするスキル。

## ワークフロー

### 1. ブランチを確認する

```bash
git branch --show-current
```

**最重要:** `main` 上にいる場合は、そのまま push や PR 作成に進まない。ユーザーに意図を確認したうえで新しいブランチを切る（[[CLAUDE.md]] のルールにより、切る前に `git pull origin main` する）。

```bash
git pull origin main
git checkout -b <type>/<短い説明>
```

ブランチ名は `git-commit` スキルの type（`feat` / `fix` / `docs` / `refactor` / `chore`）に揃える（例: `feat/rent-search-api`）。

### 2. 変更がコミット済みか確認する

```bash
git status
git diff
git diff --staged
```

未コミットの変更は `git-commit` スキルの方針でコミットする。PR に無関係な変更が混ざっていないか確認する。

### 3. リモートとの差分を確認する

```bash
git fetch origin
git log origin/main..HEAD --oneline
```

base ブランチから分岐して以降の全コミットが PR 説明の対象（最新コミットだけではない）。

### 4. PR テンプレートを探す

- `.github/pull_request_template.md` / `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/PULL_REQUEST_TEMPLATE/` 配下（複数あればユーザーに選んでもらう）

見つかったら中身を読み、見出し・チェックリストの構造を把握する（この時点では書き込まない）。

### 5. 説明文を起草する

- テンプレートの見出し・チェックリストは省略せず維持する。
- チェックリストは実際にやったことだけ `[x]` にする（やっていない項目は `[ ]` のまま）。
- `git log` / `git diff`（`origin/main..HEAD`）を根拠に、何を・なぜ変更したかを簡潔にまとめる。

### 6. ブランチを push する

```bash
git branch --show-current   # main でないことを再確認
git push -u origin HEAD
```

### 7. PR を作成する

ステップ4で読んだのはテンプレートの「ひな形」。実際の変更内容を埋めた説明文には改行やバッククォート・`$` が含まれ得るため、`--body` へのインライン渡しはシェルエスケープ事故の元。`--body-file -` とクォートしたヒアドキュメント（`<<'PR_BODY_EOF'`）で標準入力から渡す。

```bash
gh pr create --title "<type>(<scope>): <要約>" --body-file - <<'PR_BODY_EOF'
<起草した説明文>
PR_BODY_EOF
```

タイトルは `git-commit` スキルと同じ Conventional Commits 形式に揃える。作成後、`gh pr view --web` で URL をユーザーに提示する。

## 安全性に関する原則

- `main` への直接 push は絶対にしない。
- `--force` push や履歴の書き換えを伴う操作はこのスキルの範囲外。必要になった場合は先にユーザーに確認する。
