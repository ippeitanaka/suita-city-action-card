-- Supabase 用の初期データ投入スクリプト
-- このファイルを Supabase SQL エディタに貼り付けて実行すると
-- `cards` テーブルと `action_status` テーブルを作成し、初期データを挿入します。

-- action_status テーブル作成（トグル状態共有用）
create table if not exists public.action_status (
  id serial primary key,
  area text not null,
  place text not null,
  is_active boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(area, place)
);

-- RLS 有効化
alter table public.action_status enable row level security;

-- 匿名ユーザー向けポリシー（全操作許可）
create policy "allow_anon_all" on public.action_status
  for all using (true) with check (true);

-- updated_at 自動更新トリガー
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger update_action_status_updated_at
  before update on public.action_status
  for each row execute procedure update_updated_at_column();

-- テーブル作成

create table if not exists public.cards (
  id text primary key,
  title text not null,
  sections jsonb not null,
  place text,   -- 担当場所
  person text   -- 担当者
);

-- 既存データ削除
delete from public.cards;

-- 以下の JSON 部分は script.js に記載されている fallbackCards の
-- 各カードの sections 部分をそのまま貼り付けてください。
-- $${JSON:...}$$ は PostgreSQL のドル区切り文字列です。

insert into public.cards (id, title, sections, place, person) values
('commander', '指揮者用カード', '[{"name":"初動","tasks":[{"id":"check_fire","description":"火災の発生を確認してください（火災発生時は「火災時対応」を参照）","type":"boolean","value":false},{"id":"check_injured","description":"負傷者の有無を確認してください（負傷者がいる場合は「負傷者対応」を参照）","type":"boolean","value":false},{"id":"secure_corridor","description":"室内通路を確保し、転倒・落下物を排除してください","type":"boolean","value":false},{"id":"appoint_leader","description":"リーダーを決定してください（リーダーはアクションカードに従い行動します）","type":"text","value":""},{"id":"assign_roles","description":"担当者を決め、名前を記載してください（人手が不足する場合は優先順位を考慮）","type":"text","value":""}]},{"name":"避難所準備","tasks":[{"id":"open_hq","description":"災害対策総本部を体育館前教室に開設（担当2名）","type":"boolean","value":false},{"id":"open_first_aid","description":"応急処置室を保健室に開設し、応急処置セットを用意（担当1名）","type":"boolean","value":false},{"id":"internal_check_assignment","description":"建物内部チェックカードを渡して担当者2名を指名","type":"text","value":""},{"id":"external_check_assignment","description":"建物外部・周辺チェックカードを渡して担当者1名を指名","type":"text","value":""},{"id":"damage_prevention_assignment","description":"被害状況確認・二次災害防止を担当する人を指名（担当1名）","type":"text","value":""},{"id":"open_chat_assignment","description":"オープンチャット担当者を指名（担当1名）","type":"text","value":""}]},{"name":"総本部指示","tasks":[{"id":"move_unassigned_to_hq","description":"担当者以外は総本部へ移動するよう指示する","type":"boolean","value":false},{"id":"leader_move_to_hq","description":"リーダーも総本部へ移動し、指示を実行する","type":"boolean","value":false}]},{"name":"携行品（総本部担当者）","items":[{"id":"disaster_backpack","name":"防災リュック"},{"id":"mobile_battery","name":"モバイルバッテリー"},{"id":"wrap","name":"ラップ"},{"id":"flashlight","name":"懐中電灯"},{"id":"gloves","name":"手袋"},{"id":"lantern","name":"ランタン"},{"id":"magic_pen","name":"マジックペン"},{"id":"radio","name":"ラジオ"},{"id":"copy_paper","name":"コピー用紙 A4 500枚"},{"id":"master_key","name":"マスターキー（非常用）"},{"id":"emergency_key","name":"非常物資倉庫カギ"},{"id":"notebook_pc","name":"ノートパソコン"},{"id":"dry_batteries","name":"乾電池"},{"id":"ipad","name":"iPad"},{"id":"portable_battery","name":"ポータブルバッテリー"},{"id":"transceiver","name":"トランシーバー（チャンネル7）"}]}]'::jsonb, '', ''),
('internal', '建物内部チェック', '[{"name":"準備","tasks":[{"id":"gym_key","description":"体育館の鍵を持参","type":"boolean","value":false},{"id":"transceiver","description":"トランシーバー（チャンネル7）を携行","type":"boolean","value":false},{"id":"pen","description":"ボールペンを携行","type":"boolean","value":false},{"id":"caution_tape","description":"立ち入り禁止テープを携行","type":"boolean","value":false}]},{"name":"点検","tasks":[{"id":"check_all_floors","description":"全フロア・全教室の状況を確認する（体育館→校舎の順）","type":"boolean","value":false},{"id":"floor_tilt","description":"床の傾斜がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"window_frame_deform","description":"窓枠の歪みがないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"pillar_damage","description":"柱の変形/破断がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"wall_damage","description":"壁の破損がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"floor_damage","description":"床の破損がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"ceiling_damage","description":"天井の破損がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"window_damage","description":"窓の破損がないか確認し、あれば場所・状況を記入","type":"text","value":""}]},{"name":"各階避難可否","tasks":[{"id":"floor1_evacuate","description":"1階の避難可否（可能/不可）","type":"choice","options":["可能","不可"],"value":""},{"id":"floor2_evacuate","description":"2階の避難可否（可能/不可）","type":"choice","options":["可能","不可"],"value":""},{"id":"floor3_evacuate","description":"3階の避難可否（可能/不可）","type":"choice","options":["可能","不可"],"value":""},{"id":"floor4_evacuate","description":"4階の避難可否（可能/不可）","type":"choice","options":["可能","不可"],"value":""}]},{"name":"報告","tasks":[{"id":"report_to_hq","description":"全フロア確認後、総本部へ移動して報告","type":"boolean","value":false}]}]'::jsonb, '', ''),
('external', '建物外部チェック', '[{"name":"準備","tasks":[{"id":"helmet","description":"ヘルメットを装着","type":"boolean","value":false},{"id":"transceiver","description":"トランシーバー（チャンネル7）を携行","type":"boolean","value":false},{"id":"caution_tape","description":"立ち入り禁止テープを携行","type":"boolean","value":false}]},{"name":"点検","tasks":[{"id":"check_perimeter","description":"建物外周・敷地内の状況を確認する","type":"boolean","value":false},{"id":"fence_damage","description":"フェンスの破損がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"wall_crack","description":"外壁のひび割れ・破損がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"window_damage","description":"窓ガラスの破損がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"roof_damage","description":"屋根の破損がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"gutter_damage","description":"雨どいの破損がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"playground_equipment","description":"遊具の破損がないか確認し、あれば場所・状況を記入","type":"text","value":""},{"id":"other_damage","description":"その他、危険箇所がないか確認し、あれば場所・状況を記入","type":"text","value":""}]},{"name":"報告","tasks":[{"id":"report_to_hq","description":"確認後、総本部へ移動して報告","type":"boolean","value":false}]}]'::jsonb, '', ''),
('teacher', '教室教員用カード', '[{"name":"初動","tasks":[{"id":"check_students","description":"児童・生徒の安否確認を行う","type":"boolean","value":false},{"id":"check_injuries","description":"負傷者の有無を確認し、必要に応じて応急処置を行う","type":"boolean","value":false},{"id":"check_escape_route","description":"避難経路の安全を確認する","type":"boolean","value":false},{"id":"discuss_with_teachers","description":"同じフロアの教員と避難方法（順序・担当・経路）を決める","type":"boolean","value":false}]},{"name":"避難","tasks":[{"id":"lead_students","description":"児童・生徒を安全に避難させる","type":"boolean","value":false},{"id":"check_classroom","description":"教室内に取り残されている児童・生徒がいないか確認する","type":"boolean","value":false},{"id":"close_windows","description":"窓を閉め、施錠する","type":"boolean","value":false},{"id":"turn_off_power","description":"電源を切る","type":"boolean","value":false},{"id":"bring_attendance_book","description":"出席簿を持参する","type":"boolean","value":false},{"id":"bring_emergency_bag","description":"非常持出袋を持参する","type":"boolean","value":false},{"id":"bring_first_aid","description":"応急処置セットを持参する","type":"boolean","value":false},{"id":"bring_transceiver","description":"トランシーバー（チャンネル7）を持参する","type":"boolean","value":false}]}]'::jsonb, '', '');