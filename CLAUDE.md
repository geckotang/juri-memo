# CLAUDE.md

## プロジェクト概要

スト6 モダンジュリのメモ管理Webアプリ。
コンボ・起き攻め・キャラ対策などを体系的に管理し、PC/スマホで閲覧・編集できる。
GitHub Gist API でデバイス間同期。

## 技術スタック

- **フレームワーク**: Svelte 5 (Runes モード)
- **状態管理**: `svelte/store` writable（`src/stores/notes.js`）
- **スタイリング**: Tailwind CSS v4 + カスタムCSS (`src/style.css`)
- **ビルド**: Vite 6
- **同期**: GitHub Gist API (fetch直接呼び出し、ライブラリなし)
- **依存ライブラリなし**: marked等は使わず、Markdownは自前の `renderMarkdown()` で処理

## ファイル構成

```
src/
  main.js                  Svelte mount エントリーポイント
  App.svelte               サイドバー + メインエリアのルートレイアウト
  style.css                全スタイル（CSS変数 + カスタムCSS）
  stores/
    notes.js               データストア（localStorage永続化 + Gist同期）
  components/
    AppSidebar.svelte      左サイドバー（PC固定 / スマホはドロワー）
    ContentView.svelte     メインコンテンツ（カテゴリ別表示・検索）
    ComboCard.svelte       コンボカード表示
    OkizemeCard.svelte     起き攻めカード表示
    MatchupCard.svelte     キャラ対策カード表示
    ItemEditModal.svelte   追加・編集ドロワー（モードレス、右スライド）
    FreetextView.svelte    Markdownプレビュー付きフリーテキスト編集
    SettingsModal.svelte   GitHub Gist設定・同期
```

## データ構造

`src/stores/notes.js` の `DEFAULT_DATA` を参照。

カテゴリの `type` フィールドでUIが分岐する：

| type | 用途 | カードコンポーネント |
|---|---|---|
| `combo` | コンボ | `ComboCard.svelte` |
| `okizeme` | 起き攻め | `OkizemeCard.svelte` |
| `matchup` | キャラ対策 | `MatchupCard.svelte` |
| `freetext` | 自由記述 | `FreetextView.svelte` |

## Svelte 5 の主要パターン

- `$state()` → リアクティブな状態
- `$derived()` / `$derived.by()` → 算出値
- `$effect()` → 副作用（Vue の watch に相当）
- `$props()` → コンポーネントのprops宣言
- `$storeName` → writable ストアの自動購読（`$data`, `$gistConfig`）
- コンポーネントイベント → callback props（`onedit`, `ondelete` など）
- `onclick={fn}` → イベントハンドラ（`on:click` は旧構文）

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # ビルド結果の確認
```

## スタイルの方針

- CSS変数は `:root` に集約（`src/style.css` 冒頭）
- **WCAG AA準拠**: ベースフォント16px、`--text-muted` は背景に対してコントラスト比6.2:1以上を維持
- Tailwind はリセット目的のみ。コンポーネントのスタイルはすべてカスタムCSSクラスで書く
- レスポンシブは `@media (max-width: 768px)` の1ブレークポイントのみ

## UIの方針

- **編集ドロワー（`ItemEditModal.svelte`）はモードレス**。右からスライドインし、背後のカードを見ながら入力できる。オーバーレイなし（スマホのみバックドロップあり）
- サイドバーはPC固定・スマホはハンバーガー→ドロワー
- スマホ用FABは各セクション内のみ表示

## 注意事項

- `app.js` / `data.js` / `data/` は旧バージョンの残骸。無視してよい
- Gist同期のロジックは `src/stores/notes.js` の `syncToGist()` / `loadFromGist()` にある
- Markdownレンダリングは `FreetextView.svelte` の `renderMarkdown()` で自前処理（外部ライブラリなし）
