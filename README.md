# 南山田地区災害時アクションカード アプリ（テスト版）

このフォルダーには、災害時アクションカードをウェブアプリ化したテスト版のソースコードが含まれています。南山田地区のアクションカード（指揮者用、建物内部チェック、建物外部チェック、教室教員用）をそのままデジタル化し、タブで切り替えて利用できるようにしています。また、地域や避難所によって備品が異なる場合に備えて、携行品リストを自由に編集・追加・削除できる機能も備えています。

## 構成

- **index.html** – アプリ本体の HTML。タブ式のナビゲーションとコンテンツ領域があります。
- **script.js** – アプリのロジックを実装したモジュール。Supabase との通信、カードデータの表示、タスクの編集・保存を行います。
- **README.md** – このファイル。アプリの概要とセットアップ方法をまとめています。
- **seed.sql** – Supabase でテーブルを作成し、カードデータを登録するための SQL。任意で使用してください。

## セットアップ手順

1. **ファイルを開く**

   ブラウザで `index.html` を開くとアプリが表示されます。ローカル環境で動作させる場合は、ファイルをダブルクリックするか、簡易サーバーを使って配信してください。

2. **Supabase の設定（任意）**

   このテスト版は Supabase を利用してデータを保存・共有できます。Supabase を使用しない場合は、ローカルの `fallback` データで動作します。Supabase を利用するには、以下の手順を実施してください。

   - Supabase プロジェクトを作成し、**API > Settings** から `Project URL` と `Anon public key` を取得します。
   - Supabase の SQL エディタで `seed.sql` の内容を実行し、`cards` テーブルを作成・初期データを登録します。
   - ブラウザの開発者コンソールを開き、次のスクリプトで Supabase の URL と鍵を保存します。ページを読み込む前に実行してください。例:

     ```js
     localStorage.setItem('supabaseUrl', 'https://YOUR_PROJECT.supabase.co');
     localStorage.setItem('supabaseAnonKey', 'YOUR_PUBLIC_ANON_KEY');
     ```

     `YOUR_PROJECT` と `YOUR_PUBLIC_ANON_KEY` は、ご自身の Supabase 設定に置き換えてください。

   - これでアプリ起動時に Supabase クライアントが初期化され、タスクの変更や装備品リストの編集内容が Supabase の `cards` テーブルに保存されるようになります。

## 使い方

1. ブラウザで `index.html` を開くと、「指揮者用カード」「建物内部チェック」「建物外部チェック」「教室教員用カード」のタブが表示されます。タブをクリックすると、それぞれのカードに対応するセクションが読み込まれます。
2. セクションごとにタスクがリスト表示され、チェックボックス・テキストエリア・数値入力・選択肢などのフォームで進捗やメモを記録できます。これらの値は Supabase に保存されるか、Supabase 未設定の場合はブラウザ上のみで保持されます。
3. 指揮者用カードには「携行品（総本部担当者）」という装備品リストがあります。リスト内の名称は直接編集できるほか、「追加」ボタンでアイテムを追加し、「削除」ボタンで削除できます。変更内容は Supabase に保存されます。
4. 地域や避難所に応じてチェック項目や装備品が異なる場合は、Supabase の `cards` テーブルの `sections` カラムを直接編集することでカスタマイズできます。表形式のデータ構造なので、JSON を編集・追加するだけで項目を増やせます。

## Supabase スキーマ (seed.sql)

以下は `cards` テーブルを作成し、初期データを挿入する SQL の例です。Supabase の SQL エディタで実行してください。

```sql
-- cards テーブルを作成
create table if not exists public.cards (
  id text primary key,
  title text not null,
  sections jsonb not null
);

-- 既存データをクリア
delete from public.cards;

-- データ挿入
insert into public.cards (id, title, sections) values
  ('commander', '指揮者用カード', $${JSON:commander_sections}$$::jsonb),
  ('internal', '建物内部チェック', $${JSON:internal_sections}$$::jsonb),
  ('external', '建物外部チェック', $${JSON:external_sections}$$::jsonb),
  ('teacher', '教室教員用カード', $${JSON:teacher_sections}$$::jsonb);
```

`$${JSON:commander_sections}$$` 等は、それぞれ `script.js` の `fallbackCards` にある `sections` 部分をそのまま貼り付けてください。Supabase では `$${ ... }$$` のような PostgreSQL のドル区切り文字列を利用することで JSON の引用を容易にできます。

## 注意点

- 本アプリはテスト版のため、認証やアクセス制限は実装していません。Supabase の公開アノンキーを利用しているため、システムを運用する際は読み取り専用ロールの利用や Row Level Security の設定など、適切なセキュリティ対策を検討してください。
- 各カードやタスクの内容は、提供された PDF アクションカードを基に簡潔にデジタル化したものです。実際の運用では、各学校や地域の事情に合わせて項目や文言を調整してください。
- ブラウザのローカルストレージに Supabase の URL と鍵を保存しているため、複数人で共有する端末や公的端末では鍵の取り扱いに十分注意してください。

## ライセンス

このコードは教育目的で提供されています。商用利用や再配布は、元のアクションカードの著作権に留意の上、関係者の許可を得てください。