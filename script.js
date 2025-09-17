// action_card_app/script.js
// テスト版の災害時アクションカードアプリのメインスクリプトです。
// Supabase を利用してカードデータを保存・取得しますが、Supabase が
// 未設定の場合は下記の fallbackCards を利用します。

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase の URL と anon キーを localStorage から取得します。
// 設定していない場合は空文字列になるため、Supabase は無効になります。
const SUPABASE_URL = window.localStorage.getItem('supabaseUrl') || '';
const SUPABASE_ANON_KEY = window.localStorage.getItem('supabaseAnonKey') || '';

let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn('Supabase の初期化に失敗しました。Fallback データを使用します。', e);
  }
}

// 現在選択中の地区・場所を保持（Supabase に状態を保存する際に使用）
let CURRENT_AREA = '';
let CURRENT_PLACE = '';

/**
 * action_status を upsert して他ユーザーと共有できるようにする。
 * テーブルは Supabase 側であらかじめ作成しておく前提。
 * @param {string} area
 * @param {string} place
 * @param {boolean} isActive
 */
async function upsertActionStatus(area, place, isActive) {
  if (!supabase) {
    console.info('Supabase 未設定のため action_status の保存をスキップします');
    return;
  }
  if (!area || !place) {
    console.warn('upsertActionStatus: area/place が未設定です', area, place);
    return;
  }
  try {
    const payload = {
      area_name: area,
      place_name: place,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };
    // onConflict の列は Supabase 側でユニーク制約が設定されている想定
    const { data, error } = await supabase
      .from('action_status')
      .upsert(payload, { onConflict: ['area_name', 'place_name'] });
    if (error) console.error('action_status upsert エラー:', error);
    else console.info('action_status upsert 成功', data);
  } catch (err) {
    console.error('upsertActionStatus で例外:', err);
  }
}

/**
 * 指定した地区・場所の action_status を取得して true/false を返す。
 * @param {string} area
 * @param {string} place
 * @returns {Promise<boolean|null>} is_active の値、存在しなければ null
 */
async function fetchActionStatus(area, place) {
  if (!supabase) return null;
  if (!area || !place) return null;
  try {
    const { data, error } = await supabase
      .from('action_status')
      .select('is_active')
      .eq('area_name', area)
      .eq('place_name', place)
      .single();
    if (error) {
      console.warn('fetchActionStatus: データ取得エラー', error);
      return null;
    }
    return data ? !!data.is_active : null;
  } catch (err) {
    console.error('fetchActionStatus で例外:', err);
    return null;
  }
}

// Fallback データ。Supabase が利用できない場合に使用します。
// 各カードは id、title、sections を持ち、sections の中には
// name と tasks もしくは items が含まれます。task の type に応じて
// 適切な入力フォームが生成されます。
const fallbackCards = {
  commander: {
    id: 'commander',
    title: '指揮者用カード',
    sections: [
      {
        name: '初動',
        tasks: [
          {
            id: 'check_fire',
            description: '火災の発生を確認してください（火災発生時は「火災時対応」を参照）',
            type: 'boolean',
            value: false,
          },
          {
            id: 'check_injured',
            description: '負傷者の有無を確認してください（負傷者がいる場合は「負傷者対応」を参照）',
            type: 'boolean',
            value: false,
          },
          {
            id: 'secure_corridor',
            description: '室内通路を確保し、転倒・落下物を排除してください',
            type: 'boolean',
            value: false,
          },
          {
            id: 'appoint_leader',
            description: 'リーダーを決定してください（リーダーはアクションカードに従い行動します）',
            type: 'text',
            value: '',
          },
          {
            id: 'assign_roles',
            description: '担当者を決め、名前を記載してください（人手が不足する場合は優先順位を考慮）',
            type: 'text',
            value: '',
          },
        ],
      },
      {
        name: '避難所準備',
        tasks: [
          {
            id: 'open_hq',
            description: '災害対策総本部を体育館前教室に開設（担当2名）',
            type: 'boolean',
            value: false,
          },
          {
            id: 'open_first_aid',
            description: '応急処置室を保健室に開設し、応急処置セットを用意（担当1名）',
            type: 'boolean',
            value: false,
          },
          {
            id: 'internal_check_assignment',
            description: '建物内部チェックカードを渡して担当者2名を指名',
            type: 'text',
            value: '',
          },
          {
            id: 'external_check_assignment',
            description: '建物外部・周辺チェックカードを渡して担当者1名を指名',
            type: 'text',
            value: '',
          },
          {
            id: 'damage_prevention_assignment',
            description: '被害状況確認・二次災害防止を担当する人を指名（担当1名）',
            type: 'text',
            value: '',
          },
          {
            id: 'open_chat_assignment',
            description: 'オープンチャット担当者を指名（担当1名）',
            type: 'text',
            value: '',
          },
        ],
      },
      {
        name: '総本部指示',
        tasks: [
          {
            id: 'move_unassigned_to_hq',
            description: '担当者以外は総本部へ移動するよう指示する',
            type: 'boolean',
            value: false,
          },
          {
            id: 'leader_move_to_hq',
            description: 'リーダーも総本部へ移動し、指示を実行する',
            type: 'boolean',
            value: false,
          },
        ],
      },
      {
        name: '携行品（総本部担当者）',
        items: [
          { id: 'disaster_backpack', name: '防災リュック' },
          { id: 'mobile_battery', name: 'モバイルバッテリー' },
          { id: 'wrap', name: 'ラップ' },
          { id: 'flashlight', name: '懐中電灯' },
          { id: 'gloves', name: '手袋' },
          { id: 'lantern', name: 'ランタン' },
          { id: 'magic_pen', name: 'マジックペン' },
          { id: 'radio', name: 'ラジオ' },
          { id: 'copy_paper', name: 'コピー用紙 A4 500枚' },
          { id: 'master_key', name: 'マスターキー（非常用）' },
          { id: 'emergency_key', name: '非常物資倉庫カギ' },
          { id: 'notebook_pc', name: 'ノートパソコン' },
          { id: 'dry_batteries', name: '乾電池' },
          { id: 'ipad', name: 'iPad' },
          { id: 'portable_battery', name: 'ポータブルバッテリー' },
          { id: 'transceiver', name: 'トランシーバー（チャンネル7）' },
        ],
      },
    ],
  },
  internal: {
    id: 'internal',
    title: '建物内部チェック',
    sections: [
      {
        name: '準備',
        tasks: [
          { id: 'gym_key', description: '体育館の鍵を持参', type: 'boolean', value: false },
          { id: 'transceiver', description: 'トランシーバー（チャンネル7）を携行', type: 'boolean', value: false },
          { id: 'pen', description: 'ボールペンを携行', type: 'boolean', value: false },
          { id: 'caution_tape', description: '立ち入り禁止テープを携行', type: 'boolean', value: false },
        ],
      },
      {
        name: '点検',
        tasks: [
          { id: 'check_all_floors', description: '全フロア・全教室の状況を確認する（体育館→校舎の順）', type: 'boolean', value: false },
          { id: 'floor_tilt', description: '床の傾斜がないか確認し、あれば場所・状況を記入', type: 'text', value: '' },
          { id: 'window_frame_deform', description: '窓枠の歪みがないか確認し、あれば場所・状況を記入', type: 'text', value: '' },
          { id: 'pillar_damage', description: '柱の変形/破断がないか確認し、あれば場所・状況を記入', type: 'text', value: '' },
          { id: 'wall_damage', description: '壁の破損がないか確認し、あれば場所・状況を記入', type: 'text', value: '' },
          { id: 'floor_damage', description: '床の破損がないか確認し、あれば場所・状況を記入', type: 'text', value: '' },
          { id: 'ceiling_damage', description: '天井の破損がないか確認し、あれば場所・状況を記入', type: 'text', value: '' },
          { id: 'window_damage', description: '窓の破損がないか確認し、あれば場所・状況を記入', type: 'text', value: '' },
        ],
      },
      {
        name: '各階避難可否',
        tasks: [
          { id: 'floor1_evacuate', description: '1階の避難可否（可能/不可）', type: 'choice', options: ['可能', '不可'], value: '' },
          { id: 'floor2_evacuate', description: '2階の避難可否（可能/不可）', type: 'choice', options: ['可能', '不可'], value: '' },
          { id: 'floor3_evacuate', description: '3階の避難可否（可能/不可）', type: 'choice', options: ['可能', '不可'], value: '' },
          { id: 'floor4_evacuate', description: '4階の避難可否（可能/不可）', type: 'choice', options: ['可能', '不可'], value: '' },
        ],
      },
      {
        name: '報告',
        tasks: [
          { id: 'report_to_hq', description: '全フロア確認後、総本部へ移動して報告', type: 'boolean', value: false },
        ],
      },
    ],
  },
  external: {
    id: 'external',
    title: '建物外部チェック',
    sections: [
      {
        name: '準備',
        tasks: [
          { id: 'helmet', description: 'ヘルメットを装着', type: 'boolean', value: false },
          { id: 'transceiver', description: 'トランシーバー（チャンネル7）を携行', type: 'boolean', value: false },
          { id: 'caution_tape', description: '立ち入り禁止テープを携行', type: 'boolean', value: false },
        ],
      },
      {
        name: '建物の安全確認',
        tasks: [
          { id: 'collapse', description: '建物全体または一部が崩壊していないか', type: 'boolean', value: false },
          { id: 'floor_crush', description: '建物の一層以上がつぶれていないか', type: 'boolean', value: false },
          { id: 'tilt', description: '建物全体または一部に明らかな傾斜がないか', type: 'boolean', value: false },
          { id: 'window_frame_deform', description: '窓枠が大きく変形していないか', type: 'boolean', value: false },
          { id: 'broken_glass', description: '窓ガラスが割れていないか（落下の危険がある部分にはテープを貼る）', type: 'boolean', value: false },
          { id: 'outer_wall_crack', description: '外壁にひび割れや剥離がないか（落下の危険がある部分にはテープを貼る）', type: 'boolean', value: false },
          { id: 'light_damage', description: 'ライト等に傾斜/破損がないか（落下の危険がある部分にはテープを貼る）', type: 'boolean', value: false },
          { id: 'emergency_stair_damage', description: '非常階段に傾斜/破損がないか（使用不可なら総本部に連絡してテープを依頼）', type: 'boolean', value: false },
        ],
      },
      {
        name: '周辺状況',
        tasks: [
          { id: 'land_collapse', description: '隣接地の地盤が崩れて建物を破壊していないか', type: 'boolean', value: false },
          { id: 'adjacent_building_tilt', description: '隣接建物が校舎側に傾いて倒れていないか、倒れそうになっていないか', type: 'boolean', value: false },
          { id: 'other_conditions', description: '周辺の状況に異常がないか（メモ）', type: 'text', value: '' },
        ],
      },
      {
        name: '報告',
        tasks: [
          { id: 'report_to_hq', description: '確認が済んだら総本部へ移動して報告', type: 'boolean', value: false },
        ],
      },
    ],
  },
  teacher: {
    id: 'teacher',
    title: '教室教員用カード',
    sections: [
      {
        name: '揺れがおさまったら',
        tasks: [
          { id: 'check_fire', description: '火災の発生を確認（火災発生時は火災時対応を参照）', type: 'boolean', value: false },
          { id: 'gather_students', description: '児童を教室内の安全な場所に集める（窓ガラスや落下物のない場所）', type: 'boolean', value: false },
          { id: 'remove_obstacles', description: '出入口までに障害物があれば取り除く', type: 'boolean', value: false },
          { id: 'open_door', description: '出入口のドアを開放する', type: 'boolean', value: false },
          { id: 'count_students', description: '児童の人数を確認する', type: 'number', value: '' },
          { id: 'check_injured', description: '負傷者がいるか確認（負傷者ありの場合は負傷者対応を参照）', type: 'boolean', value: false },
          { id: 'calm_students', description: '不穏な児童を落ち着かせる', type: 'boolean', value: false },
          { id: 'stay_in_classroom', description: '校内放送があるまで教室から出ないよう伝える', type: 'boolean', value: false },
        ],
      },
      {
        name: '負傷者対応',
        tasks: [
          { id: 'move_to_first_aid', description: '負傷者を応急処置室（保健室）に運ぶ（担架が必要なら記入）', type: 'text', value: '' },
          { id: 'injured_report', description: '負傷者の属性・人数等を総本部へ報告する', type: 'text', value: '' },
        ],
      },
      {
        name: '被害状況確認・二次災害防止',
        tasks: [
          { id: 'check_walls', description: '教室の壁・床・天井・窓に被害がないか確認し、危険箇所にはテープを貼る', type: 'boolean', value: false },
          { id: 'check_tilt_deform', description: '床の傾斜・窓枠の歪み・柱の変形/破断がないか確認し、該当する場合は総本部に報告', type: 'boolean', value: false },
          { id: 'close_taps', description: '水道の蛇口をすべて閉める', type: 'boolean', value: false },
          { id: 'turn_off_switches', description: '停電の際は電気スイッチをオフにする', type: 'boolean', value: false },
          { id: 'extinguish_flames', description: '火元があれば火の始末を行う（ガスを止める等）', type: 'boolean', value: false },
          { id: 'open_doors', description: 'ドアを開放する', type: 'boolean', value: false },
          { id: 'inform_leader_injured', description: '負傷者がいる場合はリーダーに伝えて対応を促す', type: 'boolean', value: false },
          { id: 'move_to_hq', description: '確認が済んだら総本部へ移動して報告', type: 'boolean', value: false },
        ],
      },
      {
        name: '避難場所への移動',
        tasks: [
          { id: 'discuss_with_teachers', description: '同じフロアの教員と避難方法（順序・担当・経路）を決める', type: 'boolean', value: false },
          { id: 'communicate_to_students', description: '児童に避難場所・避難方法・経路を伝える', type: 'boolean', value: false },
          { id: 'evacuate_students', description: '児童を2人1組で所定の避難場所へ移動させる', type: 'boolean', value: false },
          { id: 'confirm_students_at_shelter', description: '避難完了後に児童の人数を確認する', type: 'number', value: '' },
          { id: 'report_completion', description: '避難完了と人数を総本部に報告する', type: 'text', value: '' },
        ],
      },
    ],
  },
};

/**
 * Supabase からカードデータを取得します。利用できない場合は fallbackCards を返します。
 * @param {string} cardId カードのID
 * @returns {Promise<object>} カードオブジェクト
 */
async function getCardData(cardId) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select()
        .eq('id', cardId)
        .single();
      if (error) {
        console.warn('Supabase からカードを取得できませんでした。fallback を使用します。', error);
      }
      if (data && data.sections) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase からの取得時にエラーが発生しました。fallback を使用します。', err);
    }
  }
  return structuredClone(fallbackCards[cardId]);
}

/**
 * カードの sections 全体を更新し Supabase に保存します。
 * Supabase が無効な場合は何もしません。
 * @param {string} cardId
 * @param {Array} sections
 */
async function updateCardSections(cardId, sections) {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('cards')
      .update({ sections })
      .eq('id', cardId);
    if (error) {
      console.error('Supabase の更新に失敗しました:', error);
    }
  } catch (err) {
    console.error('Supabase への更新時にエラーが発生しました:', err);
  }
}

/**
 * カードを描画します。タブがクリックされたときに呼び出されます。
 * @param {string} cardId
 */
async function renderCard(cardId) {
  const container = document.getElementById('content');
  container.textContent = '読み込み中...';
  // 新鮮なデータを取得するために毎回クローンを使用
  const card = await getCardData(cardId);
  container.innerHTML = '';
  // --- 担当場所・担当者 入力欄を上部に追加 ---
  if (["internal", "external", "teacher"].includes(cardId)) {
    // 保存用キー
    const key = `cardmeta_${cardId}`;
    // 既存値を取得
    let meta = { place: '', person: '' };
    try {
      meta = JSON.parse(localStorage.getItem(key)) || meta;
    } catch {}
    const metaDiv = document.createElement('div');
    metaDiv.className = 'section';
    metaDiv.style.marginBottom = '1.5rem';
    // 担当場所
    const placeDiv = document.createElement('div');
    placeDiv.className = 'task';
    const placeLabel = document.createElement('label');
    placeLabel.textContent = '担当場所';
    placeLabel.htmlFor = `${cardId}_meta_place`;
    const placeInput = document.createElement('input');
    placeInput.type = 'text';
    placeInput.id = `${cardId}_meta_place`;
    placeInput.value = meta.place;
    placeInput.placeholder = '例: 体育館1階';
    placeInput.addEventListener('input', (e) => {
      meta.place = e.target.value;
      localStorage.setItem(key, JSON.stringify(meta));
    });
    placeDiv.appendChild(placeLabel);
    placeDiv.appendChild(placeInput);
    // 担当者
    const personDiv = document.createElement('div');
    personDiv.className = 'task';
    const personLabel = document.createElement('label');
    personLabel.textContent = '担当者';
    personLabel.htmlFor = `${cardId}_meta_person`;
    const personInput = document.createElement('input');
    personInput.type = 'text';
    personInput.id = `${cardId}_meta_person`;
    personInput.value = meta.person;
    personInput.placeholder = '例: 山田 太郎';
    personInput.addEventListener('input', (e) => {
      meta.person = e.target.value;
      localStorage.setItem(key, JSON.stringify(meta));
    });
    personDiv.appendChild(personLabel);
    personDiv.appendChild(personInput);
    // まとめて追加
    metaDiv.appendChild(placeDiv);
    metaDiv.appendChild(personDiv);
    container.appendChild(metaDiv);
  }
  // セクションを1つずつ描画
  card.sections.forEach((section, secIdx) => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section';
    const header = document.createElement('h2');
    header.textContent = section.name;
    sectionDiv.appendChild(header);
    // 装備品リストの場合
    if (section.items) {
      const ul = document.createElement('ul');
      ul.className = 'equipment-list';
      section.items.forEach((item, itemIndex) => {
        const li = document.createElement('li');
        // 名称編集用のテキスト入力
        const input = document.createElement('input');
        input.type = 'text';
        input.value = item.name;
        input.addEventListener('change', async (e) => {
          section.items[itemIndex].name = e.target.value;
          await updateCardSections(cardId, card.sections);
        });
        li.appendChild(input);
        // 削除ボタン
        const delButton = document.createElement('button');
        delButton.textContent = '削除';
        delButton.addEventListener('click', async () => {
          section.items.splice(itemIndex, 1);
          await updateCardSections(cardId, card.sections);
          renderCard(cardId);
        });
        li.appendChild(delButton);
        ul.appendChild(li);
      });
      sectionDiv.appendChild(ul);
      // 追加ボタン
      const addBtn = document.createElement('button');
      addBtn.className = 'add-btn';
      addBtn.textContent = '追加';
      addBtn.addEventListener('click', async () => {
        const name = prompt('装備・備品の名称を入力してください');
        if (name) {
          section.items.push({ id: 'item' + Date.now(), name });
          await updateCardSections(cardId, card.sections);
          renderCard(cardId);
        }
      });
      sectionDiv.appendChild(addBtn);
      container.appendChild(sectionDiv);
      return;
    }
    // タスクを描画
    section.tasks.forEach((task, taskIdx) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'task';
      const label = document.createElement('label');
      label.textContent = task.description;
      label.htmlFor = `${cardId}_${secIdx}_${task.id}`;
      taskDiv.appendChild(label);
      let input;
      // タスクの種類によって適切な入力フォームを作成
      if (task.type === 'boolean') {
        input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = task.value === true;
        input.addEventListener('change', async (e) => {
          task.value = e.target.checked;
          await updateCardSections(cardId, card.sections);
        });
      } else if (task.type === 'choice') {
        input = document.createElement('select');
        task.options.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt;
          if (task.value === opt) {
            option.selected = true;
          }
          input.appendChild(option);
        });
        input.addEventListener('change', async (e) => {
          task.value = e.target.value;
          await updateCardSections(cardId, card.sections);
        });
      } else if (task.type === 'number') {
        input = document.createElement('input');
        input.type = 'number';
        input.value = task.value || '';
        input.addEventListener('change', async (e) => {
          task.value = e.target.value;
          await updateCardSections(cardId, card.sections);
        });
      } else {
        // text またはその他のタイプは textarea を使用
        input = document.createElement('textarea');
        input.rows = 2;
        input.value = task.value || '';
        input.addEventListener('change', async (e) => {
          task.value = e.target.value;
          await updateCardSections(cardId, card.sections);
        });
      }
      input.id = `${cardId}_${secIdx}_${task.id}`;
      taskDiv.appendChild(input);
      sectionDiv.appendChild(taskDiv);
    });
    container.appendChild(sectionDiv);
  });
}

// 地域・場所・カード選択・ヘッダー制御
function setHeaderVisible(visible, cardLabel) {
  const header = document.querySelector('header');
  const tabs = document.getElementById('tabs');
  if (visible) {
    header.style.display = '';
    // 既存のトップコントロールを保持（もしあれば取得して後で再追加する）
    const existingControls = header.querySelector('#top-action-controls');
    // header の中身を再構築
    header.innerHTML = '';
    const h1 = document.createElement('h1');
    h1.textContent = '吹田市災害時アクションカードアプリ　南山田地区';
    header.appendChild(h1);
    if (cardLabel) {
      const sub = document.createElement('div');
      sub.style.fontSize = '1.1rem';
      sub.style.marginTop = '0.3rem';
      sub.textContent = cardLabel;
      header.appendChild(sub);
    }
    if (existingControls) header.appendChild(existingControls);
    if (tabs) tabs.style.display = '';
  } else {
    header.style.display = 'none';
    if (tabs) tabs.style.display = 'none';
  }
}

function setupTabs(cardId, cardLabel) {
  document.querySelectorAll('#tabs button').forEach((btn) => {
    btn.onclick = (e) => {
      document.querySelectorAll('#tabs button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cid = btn.dataset.card;
      showActionCard(cid, btn.textContent);
    };
    btn.classList.remove('active');
    if (btn.dataset.card === cardId) btn.classList.add('active');
  });
  setHeaderVisible(true, cardLabel);
}

function showHome() {
  setHeaderVisible(false);
  const container = document.getElementById('content');
  container.innerHTML = '';
  // 画像を全面に表示
  const imgDiv = document.createElement('div');
  imgDiv.style.position = 'relative';
  imgDiv.style.width = '100vw';
  imgDiv.style.height = '100vh';
  imgDiv.style.display = 'flex';
  imgDiv.style.justifyContent = 'center';
  imgDiv.style.alignItems = 'center';
  imgDiv.style.overflow = 'hidden';
  imgDiv.style.background = '#bfc3e6'; // 画像外の余白色
  const img = document.createElement('img');
  img.src = './home_image.png';
  img.alt = '災害時アクションカード';
  img.style.maxWidth = '100vw';
  img.style.maxHeight = '100vh';
  img.style.width = 'auto';
  img.style.height = 'auto';
  img.style.objectFit = 'contain';
  img.style.position = 'relative';
  imgDiv.appendChild(img);
  // ボタン
  const btn = document.createElement('button');
  btn.textContent = '地区を選ぶ';
  btn.style.fontSize = '1.2rem';
  btn.style.padding = '1rem 2rem';
  btn.style.position = 'absolute';
  btn.style.left = '50%';
  btn.style.transform = 'translateX(-50%)';
  btn.style.bottom = '12vh';
  btn.style.background = 'rgba(255,255,255,0.95)';
  btn.style.border = '2px solid #333';
  btn.style.borderRadius = '8px';
  btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  btn.addEventListener('click', showAreaSelect);
  imgDiv.appendChild(btn);
  container.appendChild(imgDiv);
}

function showAreaSelect() {
  setHeaderVisible(false);
  const container = document.getElementById('content');
  container.innerHTML = '';
  const areaDiv = document.createElement('div');
  areaDiv.style.textAlign = 'center';
  // 戻るボタン
  const backBtn = document.createElement('button');
  backBtn.textContent = '← 戻る';
  backBtn.style.position = 'absolute';
  backBtn.style.left = '1rem';
  backBtn.style.top = '1rem';
  backBtn.style.fontSize = '1rem';
  backBtn.style.padding = '0.4rem 1.2rem';
  backBtn.style.background = '#fff';
  backBtn.style.border = '1px solid #888';
  backBtn.style.borderRadius = '6px';
  backBtn.style.zIndex = '10';
  backBtn.onclick = showHome;
  areaDiv.appendChild(backBtn);
  const title = document.createElement('h2');
  title.textContent = '地区を選択してください';
  areaDiv.appendChild(title);
  const btn = document.createElement('button');
  btn.textContent = '南山田地区';
  btn.style.fontSize = '1.2rem';
  btn.style.padding = '1rem 2rem';
  // 初期はハイライトをしていないが、Supabase と連携している場合は地区単位で判断する
  (async () => {
    const active = await fetchActionStatus('南山田地区', '');
    if (active) {
      btn.style.background = '#ffef99';
    }
  })();
  btn.addEventListener('click', () => {
    // 地区を選択
    CURRENT_AREA = '南山田地区';
    showPlaceSelect();
  });
  areaDiv.appendChild(btn);
  container.appendChild(areaDiv);
}

function showPlaceSelect() {
  setHeaderVisible(false);
  const container = document.getElementById('content');
  container.innerHTML = '';
  const placeDiv = document.createElement('div');
  placeDiv.style.textAlign = 'center';
  // 戻るボタン
  const backBtn = document.createElement('button');
  backBtn.textContent = '← 戻る';
  backBtn.style.position = 'absolute';
  backBtn.style.left = '1rem';
  backBtn.style.top = '1rem';
  backBtn.style.fontSize = '1rem';
  backBtn.style.padding = '0.4rem 1.2rem';
  backBtn.style.background = '#fff';
  backBtn.style.border = '1px solid #888';
  backBtn.style.borderRadius = '6px';
  backBtn.style.zIndex = '10';
  backBtn.onclick = showAreaSelect;
  placeDiv.appendChild(backBtn);
  const title = document.createElement('h2');
  title.textContent = '実施場所を選択してください';
  placeDiv.appendChild(title);
  const btn = document.createElement('button');
  btn.textContent = '南山田小学校';
  btn.style.fontSize = '1.2rem';
  btn.style.padding = '1rem 2rem';
  // Supabase からその場所が実施中かどうかチェックして色付け
  (async () => {
    const active = await fetchActionStatus(CURRENT_AREA || '南山田地区', '南山田小学校');
    if (active) btn.style.background = '#ffef99';
  })();
  btn.addEventListener('click', () => {
    // 地区・場所を設定
    CURRENT_PLACE = '南山田小学校';
    // タブUIを必ず表示し、指揮者用カード画面に遷移
    document.getElementById('tabs').style.display = '';
    showActionCard('commander', '指揮者用カード');
  });
  placeDiv.appendChild(btn);
  container.appendChild(placeDiv);
}

// showCardMenuは不要になったため削除

function showActionCard(cardId, cardLabel) {
  setHeaderVisible(true, cardLabel);
  const container = document.getElementById('content');
  container.innerHTML = '';

  // ヘッダー直下にボタン群を表示（既存のものがあれば置換）。
  const existing = document.getElementById('top-action-controls');
  if (existing) existing.remove();
  const topDiv = document.createElement('div');
  topDiv.id = 'top-action-controls';
  topDiv.style.display = 'flex';
  topDiv.style.justifyContent = 'space-between';
  topDiv.style.alignItems = 'center';
  topDiv.style.marginTop = '0.4rem';
  topDiv.style.marginBottom = '0.8rem';
  topDiv.style.gap = '1rem';

  // 戻るボタン
  const backBtn = document.createElement('button');
  backBtn.textContent = '← 戻る';
  backBtn.style.fontSize = '1rem';
  backBtn.style.padding = '0.4rem 1.2rem';
  backBtn.style.background = '#fff';
  backBtn.style.border = '1px solid #888';
  backBtn.style.borderRadius = '6px';
  backBtn.style.zIndex = '1000';
  backBtn.onclick = showPlaceSelect;
  topDiv.appendChild(backBtn);

  // トグルボタン
  const toggleLabel = document.createElement('label');
  toggleLabel.style.fontWeight = 'bold';
  toggleLabel.style.fontSize = '1.05rem';
  toggleLabel.style.cursor = 'pointer';
  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.style.transform = 'scale(1.25)';
  toggle.style.marginRight = '0.6em';
  toggle.id = 'start-action-toggle';
  // デフォルトは localStorage。Supabase が有効なら上書きして最新状態を取得する。
  toggle.checked = window.localStorage.getItem('action_started') === '1';
  (async () => {
    const active = await fetchActionStatus(CURRENT_AREA, CURRENT_PLACE);
    if (active !== null) {
      toggle.checked = !!active;
    }
  })();
  toggle.addEventListener('change', async (e) => {
    window.localStorage.setItem('action_started', e.target.checked ? '1' : '0');
    await upsertActionStatus(CURRENT_AREA, CURRENT_PLACE, e.target.checked);
  });
  toggleLabel.appendChild(toggle);
  toggleLabel.appendChild(document.createTextNode('アクションカードを開始する'));
  topDiv.appendChild(toggleLabel);

  // ヘッダーがあればその直下へ、なければ #content の先頭に挿入
  const header = document.querySelector('header');
  if (header) {
    header.appendChild(topDiv);
  } else {
    container.insertBefore(topDiv, container.firstChild);
  }

  // タブUIを必ず表示
  document.getElementById('tabs').style.display = '';
  setupTabs(cardId, cardLabel);
  renderCard(cardId);
}

// 初期表示はホーム画面
showHome();