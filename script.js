// --- fallbackCards: アクションカード定義 ---
const fallbackCards = {
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
        name: '指揮者の役割',
        tasks: [
          { id: 'assign_roles', description: '担当者を決め、名前を記載してください（人手が不足する場合は優先順位を考慮）', type: 'text', value: '' }
        ]
      },
      {
        name: '避難所準備',
        tasks: [
          { id: 'open_hq', description: '災害対策総本部を体育館前教室に開設（担当2名）', type: 'boolean', value: false },
          { id: 'open_first_aid', description: '応急処置室を保健室に開設し、応急処置セットを用意（担当1名）', type: 'boolean', value: false },
          { id: 'internal_check_assignment', description: '建物内部チェックカードを渡して担当者2名を指名', type: 'text', value: '' },
          { id: 'external_check_assignment', description: '建物外部・周辺チェックカードを渡して担当者1名を指名', type: 'text', value: '' },
          { id: 'damage_prevention_assignment', description: '被害状況確認・二次災害防止を担当する人を指名（担当1名）', type: 'text', value: '' },
          { id: 'open_chat_assignment', description: 'オープンチャット担当者を指名（担当1名）', type: 'text', value: '' }
        ]
      },
      {
        name: '総本部指示',
        tasks: [
          { id: 'move_unassigned_to_hq', description: '担当者以外は総本部へ移動するよう指示する', type: 'boolean', value: false },
          { id: 'leader_move_to_hq', description: 'リーダーも総本部へ移動し、指示を実行する', type: 'boolean', value: false }
        ]
      }
    ]
  }
  // 他カードも必要に応じて追加
};
window.fallbackCards = fallbackCards;


/**
 * カードIDからカードデータを取得（現状はfallbackCardsのみ）
 * @param {string} cardId
 * @returns {Promise<object>} カードデータ
 */
async function getCardData(cardId) {
  // 将来的にSupabaseから取得する場合はここで分岐
  if (window.fallbackCards && window.fallbackCards[cardId]) {
    return window.fallbackCards[cardId];
  }
  // fallbackCardsがなければ空オブジェクト
  return {};
}

// グローバル変数: 地域・場所
let CURRENT_AREA = '';
let CURRENT_PLACE = '';

/**
 * Supabaseからアクション開始状態（action_status）を取得
 * @param {string} area
 * @param {string} place
 * @returns {Promise<boolean|null>} is_active or null
 */
async function fetchActionStatus(area, place) {
  if (!window.supabase || !area) return null;
  try {
    // ここにSupabaseからaction_statusを取得するロジックを記述
    // 例: const { data, error } = await window.supabase
    // 実装は後で追加
  } catch (e) {
    console.error(e);
    return null;
  }
}

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
        const p = document.createElement('p');
        p.textContent = block.text;
        secDiv.appendChild(p);
      } else if (block.type === 'check') {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!block.checked;
        label.appendChild(input);
        label.appendChild(document.createTextNode(block.text));
        secDiv.appendChild(label);
      } else if (block.type === 'field') {
        const label = document.createElement('label');
        label.textContent = block.label;
        const textarea = document.createElement('textarea');
        textarea.value = block.value || '';
        secDiv.appendChild(label);
        secDiv.appendChild(textarea);
      }
    });
    container.appendChild(secDiv);
  });
          if (supabase && CURRENT_AREA && CURRENT_PLACE) {
            // チャンネル名はarea/facility/card_idでユニークに
            const channel = supabase.channel(`card_states_${CURRENT_AREA}_${CURRENT_PLACE}_${cardId}`);
            channel
              .on(
                'postgres_changes',
                {
                  event: '*',
                  schema: 'public',
                  table: 'card_states',
                  filter: `area=eq.${CURRENT_AREA},facility=eq.${CURRENT_PLACE},card_id=eq.${cardId}`
                },
                (payload) => {
                  // 他ユーザーの変更も即時反映
                  if (payload.new && payload.new.state) {
                    renderCard(cardId);
                  }
                }
              )
              .subscribe();
          }

        }
// --- ここまで ---

// ...（カードデータ断片全削除済み）...


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
document.addEventListener('DOMContentLoaded', showHome);