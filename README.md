# アカツキ公式WEBサイト MVP

無料公開できる公式HPの土台と、複数人で会話できる匿名リアルタイムチャットのMVPです。参考リポジトリのコードや固有デザインはコピーせず、匿名入室、部屋、入退室、会話ログ、アイコン選択という体験だけを参考にしています。

## 技術構成

- Vite + React + TypeScript
- Supabase Postgres
- Supabase Realtime
- 通常CSS
- Cloudflare Pages または GitHub Pages 想定

## 開発環境の起動

```bash
npm install
npm run dev
```

ビルド確認:

```bash
npm run build
```

## Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/) にログインします。
2. New project からプロジェクトを作成します。
3. Project Settings の API で `Project URL` と `anon public key` を確認します。

## schema.sqlの流し込み

1. Supabase Dashboard の SQL Editor を開きます。
2. `supabase/schema.sql` の内容を貼り付けます。
3. Run を実行します。

初期部屋として「本部」「雑談室」「作戦会議」「初参加者の部屋」「深夜集会」が作成されます。

## Realtimeを有効化する方法

1. Supabase Dashboard の Database から Replication または Realtime 設定を開きます。
2. `messages` テーブルの INSERT を Realtime 対象にします。
3. Presence はクライアント側の Realtime Channel で使っています。追加テーブルは不要です。

## 環境変数の設定

`.env.example` をコピーして `.env.local` を作成します。

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxx
```

Cloudflare Pages や GitHub Pages のビルド環境にも同じ変数を設定してください。

## 公開方法

### Cloudflare Pages

1. GitHubにリポジトリをpushします。
2. Cloudflare Pages で対象リポジトリを接続します。
3. Build command を `npm run build` にします。
4. Build output directory を `dist` にします。
5. 環境変数に `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を登録します。

### GitHub Pages

1. `npm run build` を実行します。
2. `dist` をGitHub Pagesの公開対象にします。
3. SPAルーティングを使うため、必要に応じてPages側の404 fallbackを設定してください。

Cloudflare PagesのほうがSPA fallbackを扱いやすいため、最初の公開先としてはCloudflare Pagesを推奨します。

## 現在の機能

- トップページ
- 仮ルールページ
- 仮管理ページ
- ニックネームとアイコンで入室
- 部屋一覧
- 部屋作成
- メッセージ送信
- `messages` INSERT のRealtime購読
- Supabase Realtime Presence によるオンライン人数表示
- 入室・退室のsystemメッセージ
- 300文字制限
- 空文字送信禁止
- 1秒以内の連投禁止
- 同じ文章の連続投稿禁止
- NGワード配列による送信ブロック
- メッセージ通報

## 今後追加するべき機能

- ログイン機能
- 管理者権限
- メッセージ削除
- 通報管理
- BAN機能
- 部屋の鍵機能
- 画像投稿
- 活動報告ページ
- 憲章ページ
- SNS連携
