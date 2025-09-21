// --- faithful差し替えロジック（4 携行備品・5 情報収集・報告） ---
(function applyFaithfulCards() {
  const carryingItemsRich = {
    id: 'hq_supplies',
    title: '携行備品（原文再現）',
    richSections: [
      {
        title: '総本部担当者 携行備品',
        blocks: [
          { type:'raw', text:'4 災害対策総本部担当者は以下のものを携行して\n総本部にむかう【体育館前教室】' },
          { type:'raw', text:'■ 常備品 リュック内を確認し、不足していれば補充する' },
          { type:'raw', text:'1 防災リュック' },
          { type:'raw', text:'1 モバイルバッテリー' },
          { type:'raw', text:'2 ラップ' },
          { type:'raw', text:'3 懐中電灯' },
          { type:'raw', text:'4 ランタン' },
          { type:'raw', text:'6 筆記用具' },
          { type:'raw', text:'7 立ち入り禁止テープ' },
          { type:'raw', text:'8 手袋' },
          { type:'raw', text:'9 マジックペン' },
          { type:'raw', text:'コピー用紙A4 500枚' },
          { type:'raw', text:'iphone ノートパソコン' },
          { type:'raw', text:'ラジオ 10' },
        ]
      },
      {
        title: '■ 携行品（職員室内で探してリュックに入れる）',
        blocks: [
          { type:'raw', text:'1 マスターキー(非常用)' },
          { type:'raw', text:'2 非常物資倉庫 カギ' },
          { type:'raw', text:'3 乾電池' },
          { type:'raw', text:'4 ipad' },
          { type:'raw', text:'5 ポータブルバッテリー' },
          { type:'raw', text:'6 トランシーバー 1台' },
          { type:'raw', text:'トランシーバーのチャンネルは7' },
          { type:'raw', text:'※ 1 マスターキー(非常用)・2 非常物資倉庫カギは職員室' },
          { type:'check', text:'常備品の在庫を確認した' },
          { type:'check', text:'携行品を職員室で確保した' },
          { type:'field', label:'不足・備考', value:'' },
        ]
      }
    ]
  };
  const infoReportRich = {
    id: 'hq_info_report',
    title: '情報収集・報告（原文再現）',
    richSections: [
      {
        title: '総本部担当者 情報収集・報告',
        blocks: [
          { type:'raw', text:'5 災害対策総本部担当者は、可能な限り情報の収集・伝達をおこなう' },
          { type:'raw', text:'収集した情報は必要に応じてオープンチャットで伝える' },
          { type:'raw', text:'情報収集' },
          { type:'raw', text:'➡ 各教室・応急処置室などから情報が集まる' },
          { type:'raw', text:'➡ 建物内部チェック担当者・建物外部周辺担当者などから情報が集まる' },
          { type:'raw', text:'収集した情報は黒板・ホワイトボード・用紙に記載するなどして 可視化・共有できるようにしておく' },
          { type:'raw', text:'1 負傷者の状況【人数・氏名・程度など】' },
          { type:'raw', text:'2 建物と周囲の被害状況' },
          { type:'raw', text:'3 利用可能な通信機器の確認 内線・固定電話・携帯電話・SNS・インターネット・wi-fi 等' },
          { type:'raw', text:'4 インターネット上から情報収集' },
          { type:'raw', text:'全般的な情報／気象庁・大阪府・吹田市役所等' },
          { type:'raw', text:'津波情報／気象庁・ニュースサイト等' },
          { type:'raw', text:'大津波警報の場合は千里丘駅周辺まで浸水する危険がある' },
          { type:'raw', text:'津波警報・津波注意報の場合は浸水の可能性は低い' },
          { type:'raw', text:'交通情報／各交通機関のホームページ等' },
        ]
      },
      {
        title: '報告',
        blocks: [
          { type:'raw', text:'1 吹田市への状況報告 危機管理室 電話番号:06-6384-1753' },
          { type:'raw', text:'➡ 人員など応援が必要な場合は要請する' },
          { type:'check', text:'黒板／ホワイトボードに集約して可視化した' },
          { type:'check', text:'オープンチャットに必要情報を配信した' },
          { type:'field', label:'連絡・要請の記録', value:'' },
        ]
      }
    ]
  };
  const registry = (window.fallbackCards || {});
  function upsertCardByTitleOrId(newCard, titleKeywordList) {
    const allEntries = Object.entries(registry);
    let hitKey = allEntries.find(([key, card]) => {
      if (!card) return false;
      const title = (card.title || '') + '';
      const id = (card.id || key || '') + '';
      const byId = (id && (id === newCard.id));
      const byTitle = titleKeywordList.some(k => title.includes(k));
      return byId || byTitle;
    });
    if (hitKey) {
      const [key, card] = hitKey;
      card.title = newCard.title;
      card.richSections = newCard.richSections;
      delete card.sections;
      registry[key] = card;
      return card;
    } else {
      registry[newCard.id] = newCard;
      return newCard;
    }
  }
  upsertCardByTitleOrId(carryingItemsRich, ['携行備品']);
  upsertCardByTitleOrId(infoReportRich, ['情報収集', '報告', '情報収集・報告']);
  if (window.fallbackCards) window.fallbackCards = registry;
})();

// --- richSections描画関数 ---
function renderRichSections(card, container) {
  container.innerHTML = '';
  (card.richSections || []).forEach(section => {
    const secDiv = document.createElement('div');
    secDiv.className = 'section';
    if (section.title) {
      const h2 = document.createElement('h2');
      h2.textContent = section.title;
      secDiv.appendChild(h2);
    }
    (section.blocks || []).forEach(block => {
      if (block.type === 'raw') {
        const p = document.createElement('pre');
        p.textContent = block.text;
        p.className = 'mono';
        secDiv.appendChild(p);
      } else if (block.type === 'check') {
        const label = document.createElement('label');
        label.style.display = 'block';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.style.marginRight = '0.7em';
        label.appendChild(cb);
        label.appendChild(document.createTextNode(block.text));
        secDiv.appendChild(label);
      } else if (block.type === 'field') {
        const fieldDiv = document.createElement('div');
        fieldDiv.style.margin = '0.7em 0';
        const label = document.createElement('label');
        label.textContent = block.label || '';
        label.style.marginRight = '0.7em';
        const input = document.createElement('input');
        input.type = 'text';
        input.value = block.value || '';
        input.style.minWidth = '200px';
        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
        secDiv.appendChild(fieldDiv);
      }
    });
    container.appendChild(secDiv);
  });
}
// action_card_app/script.js
// テスト版の災害時アクションカードアプリのメインスクリプトです。
// Supabase を利用してカードデータを保存・取得しますが、Supabase が
// 未設定の場合は下記の fallbackCards を利用します。

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase の URL と anon キーを以下の順で取得します:
// 1) `window.SUPABASE_URL` / `window.SUPABASE_ANON_KEY` (deploy 時に生成された config.js から注入)
// 2) localStorage (ローカル検証用)
// 設定がない場合は空文字列になり Supabase は無効になります。
const SUPABASE_URL = (window.SUPABASE_URL) ? window.SUPABASE_URL : (window.localStorage.getItem('supabaseUrl') || '');
const SUPABASE_ANON_KEY = (window.SUPABASE_ANON_KEY) ? window.SUPABASE_ANON_KEY : (window.localStorage.getItem('supabaseAnonKey') || '');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.info('Supabase 未設定: ブラウザで localStorage に supabaseUrl/supabaseAnonKey を設定するか、deploy 時に config.js を生成してください.');
} else {
  console.info('Supabase 設定を読み込みました (URL と anon key が設定されています).');
}

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
  if (!area) {
    console.warn('upsertActionStatus: area が未設定です', area, place);
    return;
  }
  try {
    const payload = {
      area_name: area,
      place_name: place || '',
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };
    // onConflict の列は Supabase 側でユニーク制約が設定されている想定
    console.info('upsertActionStatus: payload=', payload);
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
  if (!area) return null;
  try {
    let query = supabase.from('action_status').select('is_active');
    query = query.eq('area_name', area);
    if (place && place !== '') {
      query = query.eq('place_name', place);
    } else {
      // place が空なら place_name が空文字または NULL のレコードを探す
      query = query.or(`place_name.eq.'' , place_name.is.null`);
    }
    // 単一レコード想定のため single を試みる
    const { data, error } = await query.single();
    if (error) {
      console.warn('fetchActionStatus: データ取得エラー', error);
      return null;
    }
    console.info('fetchActionStatus: result=', data);
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
  hq_supplies: {
    id: 'hq_supplies',
    title: '総本部 4 携行備品',
    sections: [
      {
        name: '携行品・常備品チェックリスト',
        tasks: [
          { id: 'mobile_battery', description: 'モバイルバッテリー', type: 'boolean', value: false },
          { id: 'wrap', description: 'ラップ', type: 'boolean', value: false },
          { id: 'flashlight', description: '懐中電灯', type: 'boolean', value: false },
          { id: 'transceiver', description: 'トランシーバー（チャンネル7）', type: 'boolean', value: false },
          { id: 'gloves', description: '手袋', type: 'boolean', value: false },
          { id: 'lantern', description: 'ランタン', type: 'boolean', value: false },
          { id: 'magic_pen', description: 'マジックペン', type: 'boolean', value: false },
          { id: 'radio', description: 'ラジオ', type: 'boolean', value: false },
          { id: 'copy_paper', description: 'コピー用紙 A4 500枚', type: 'boolean', value: false },
          { id: 'master_key', description: 'マスターキー（非常用）', type: 'boolean', value: false },
          { id: 'emergency_key', description: '非常物資倉庫カギ', type: 'boolean', value: false },
          { id: 'notebook_pc', description: 'ノートパソコン', type: 'boolean', value: false },
          { id: 'dry_batteries', description: '乾電池', type: 'boolean', value: false },
          { id: 'ipad', description: 'iPad', type: 'boolean', value: false },
          { id: 'portable_battery', description: 'ポータブルバッテリー', type: 'boolean', value: false }
        ]
      },
      {
        name: 'メモ',
        tasks: [
          { id: 'memo', description: '備考・メモ', type: 'text', value: '' }
        ]
      }
    ]
  },
  hq_info_report: {
    id: 'hq_info_report',
    title: '総本部 5 情報収集・報告',
    sections: [
      {
        name: '情報収集',
        tasks: [
          { id: 'injured_status', description: '負傷者の状況', type: 'text', value: '' },
          { id: 'building_damage', description: '建物被害の状況', type: 'text', value: '' },
          { id: 'communication', description: '通信可否', type: 'choice', options: ['可', '不可'], value: '' },
          { id: 'internet_info', description: 'ネット・SNS等の情報', type: 'text', value: '' }
        ]
      },
      {
        name: '危機管理室への報告',
        tasks: [
          { id: 'report_to_office', description: '危機管理室（06-6384-1753）へ報告した', type: 'boolean', value: false },
          { id: 'memo', description: '備考・メモ', type: 'text', value: '' }
        ]
      }
    ]
  },
  secondary_disaster: {
    id: 'secondary_disaster',
    title: '二次災害防止 6',
    sections: [
      {
        name: '建物被害チェック',
        tasks: [
          { id: 'wall_floor_ceiling', description: '壁・床・天井・窓の被害確認', type: 'boolean', value: false },
          { id: 'pillar_deform', description: '柱の変形/破断の有無', type: 'boolean', value: false },
          { id: 'memo1', description: '被害状況メモ', type: 'text', value: '' }
        ]
      },
      {
        name: 'ライフライン・火災',
        tasks: [
          { id: 'lifeline_stop', description: '電気・ガス・水道の停止確認', type: 'boolean', value: false },
          { id: 'fire_reference', description: '火災時の参考手順（火災発生対応カード参照）', type: 'boolean', value: false },
          { id: 'memo2', description: '備考・メモ', type: 'text', value: '' }
        ]
      }
    ]
  },
  open_chat: {
    id: 'open_chat',
    title: 'オープンチャット 7',
    sections: [
      {
        name: '運用原則',
        tasks: [
          { id: 'who_sends', description: '誰が配信するか（担当者・リーダー等）', type: 'text', value: '' },
          { id: 'priority_info', description: '優先配信事項（火災・受け入れ開始・市からの情報など）', type: 'text', value: '' },
          { id: 'template', description: '配信テンプレ例：「現在○○で火災〜」など', type: 'text', value: '' },
          { id: 'memo', description: '備考・メモ', type: 'text', value: '' }
        ]
      },
      {
        name: '配信例',
        tasks: [
          { id: 'example1', description: '先ほど発生した地震に関する情報や今後の対応については随時配信でお知らせします。', type: 'label' },
          { id: 'example2', description: '現在、○○で火災が発生しています。南山田小学校のグラウンドへ避難してください。煙 が出ているときは、ハンカチなどで口と鼻を塞いで、身体を低くして避難してください', type: 'label' },
          { id: 'example3', description: '今回の地震による避難所の被害は現在のところ確認されておりません', type: 'label' },
          { id: 'example4', description: 'ガラスの割れや棚の転倒が確認されています。十分に気をつけてください。', type: 'label' },
          { id: 'example5', description: '火災の発生は確認されていません。', type: 'label' },
          { id: 'example6', description: '先ほど発生した地震(災害)に伴い、南山田小学校の避難所が開設されました。', type: 'label' },
          { id: 'example7', description: '今後、余震が発生する可能性がありますので、移動の際は十分注意してください。', type: 'label' },
          { id: 'example8', description: 'エレベーターは使用せず、階段などを利用してください。閉じ込められる恐れがあります。', type: 'label' },
          { id: 'example9', description: '今回発生した地震の震度は○・震源地は○○・この地震による津波の発生は心配ありません。', type: 'label' },
          { id: 'example10', description: '今回の地震では大津波警報が発表されており、○分後に○mを超える津波が予想されています。建物の3階以上に避難してください。', type: 'label' },
          { id: 'example11', description: '南山田小学校の損傷が大きく、このまま校舎内に留まることは危険をともなうため、山田中学校など、他の避難所に避難してください。', type: 'label' },
          { id: 'example12', description: '携帯電話や SNS が繋がる場合は、ご家族などに各自安否報告をおこなってください。携帯電話による通話がつながりにくい場合は、SNS での連絡を試みてください。', type: 'label' }
        ]
      }
    ]
  },
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
  fire_response: {
    id: 'fire_response',
    title: '火災発生対応',
    sections: [
      {
        name: '火災発生時',
        tasks: [
          {
            id: 'notify_alarm',
            description: 'フロア全体に知らせて、火災報知器を押下',
            type: 'boolean',
            value: false,
          },
          {
            id: 'initial_extinguish_judgement',
            description: '消火器・消火栓による初期消火が可能か判断',
            type: 'choice',
            options: ['可能', '不可能'],
            value: '',
          },
          {
            id: 'initial_extinguish_execute',
            description: '初期消火が可能なら消火器・消火栓で初期消火',
            type: 'boolean',
            value: false,
          },
          {
            id: 'evacuate',
            description: '初期消火が不可能なら建物外へ避難',
            type: 'boolean',
            value: false,
          },
          {
            id: 'notify_open_chat',
            description: '消火できなかった場合、オープンチャット担当者に火災発生・火元・避難路を伝える',
            type: 'boolean',
            value: false,
          },
          {
            id: 'smoke_measures',
            description: '煙が出ているときはハンカチで口と鼻を塞ぎ、身体を低くして避難',
            type: 'boolean',
            value: false,
          },
          {
            id: 'confirm_and_report',
            description: '消火できた場合、消火を再度確認し総本部に報告',
            type: 'boolean',
            value: false,
          },
        ],
      },
    ],
  },
  injured_response: {
    id: 'injured_response',
    title: '負傷者対応',
    sections: [
      {
        name: '負傷者対応',
        tasks: [
          {
            id: 'transport_injured',
            description: '負傷者を応急処置室（保健室）に運ぶ（必要なら担架を使用）',
            type: 'text',
            value: '',
          },
          {
            id: 'stretcher_location',
            description: '担架の設置場所',
            type: 'text',
            value: '',
          },
          {
            id: 'assist_staff',
            description: '人手が不足する場合は教員などの協力を得る',
            type: 'boolean',
            value: false,
          },
          {
            id: 'report_injured',
            description: '負傷者の属性・人数等を総本部へ報告する',
            type: 'text',
            value: '',
          },
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
  if (card.richSections) {
    renderRichSections(card, container);
    return;
  }
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
  (card.sections || []).forEach((section, secIdx) => {
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
    (section.tasks || []).forEach((task, taskIdx) => {
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
  btn.className = 'big-main-btn';
  btn.style.position = 'absolute';
  btn.style.left = '50%';
  btn.style.transform = 'translateX(-50%)';
  btn.style.bottom = '18vh';
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
  btn.className = 'big-main-btn';
  (async () => {
    const active = await fetchActionStatus('南山田地区', '');
    if (active) {
      btn.style.background = 'linear-gradient(90deg, #fde68a 60%, #fbbf24 100%)';
      btn.style.color = '#222';
    }
  })();
  btn.addEventListener('click', () => {
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

  // 場所ボタンの共通スタイルと作成関数
  const createPlaceButton = (placeName) => {
    const btn = document.createElement('button');
    btn.textContent = placeName;
    btn.className = 'place-btn';
    (async () => {
      const active = await fetchActionStatus(CURRENT_AREA || '南山田地区', placeName);
      if (active) btn.style.background = 'linear-gradient(90deg, #fde68a 60%, #fbbf24 100%)';
    })();
    btn.addEventListener('click', () => {
      CURRENT_PLACE = placeName;
      document.getElementById('tabs').style.display = '';
      showActionCard('commander', '指揮者用カード');
    });
    return btn;
  };

  // 各場所のボタンを追加
  placeDiv.appendChild(createPlaceButton('南山田小学校'));
  placeDiv.appendChild(createPlaceButton('山田中学校'));
  placeDiv.appendChild(createPlaceButton('南山田公民館'));

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
  // デフォルトは未チェック。localStorage は補助目的に残すが、Supabase の取得結果で上書きする。
  toggle.checked = false;
  try {
    (async () => {
      const active = await fetchActionStatus(CURRENT_AREA, CURRENT_PLACE);
      if (active !== null) {
        toggle.checked = !!active;
      } else {
        // localStorage の値があれば参照する（過去の動作互換）
        toggle.checked = window.localStorage.getItem('action_started') === '1';
      }
    })();
  } catch (err) {
    console.warn('toggle 初期化時にエラー:', err);
  }
  toggle.addEventListener('change', async (e) => {
    const checked = e.target.checked;
    window.localStorage.setItem('action_started', checked ? '1' : '0');
    try {
      await upsertActionStatus(CURRENT_AREA || '', CURRENT_PLACE || '', checked);
    } catch (err) {
      console.error('トグル変更時の upsert で例外:', err);
    }
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