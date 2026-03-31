import { writable, get } from 'svelte/store'

const STORAGE_KEY = 'juri-memo-data'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

const DEFAULT_DATA = {
  version: '1',
  comboTags: ['ストック0', 'ストック1', 'ストック2', 'ストック3', '中央', '端', 'パニカン', '壁ドン', '基本', 'SA1', 'SA3', 'Dリバ後'],
  lastUpdated: new Date().toISOString(),
  categories: [
    {
      id: 'combos',
      name: 'コンボ',
      type: 'combo',
      sections: [
        {
          id: 'stock-based',
          name: 'ストック別',
          items: [
            {
              id: generateId(),
              tags: ['ストック0', '中央'],
              starter: '前大P',
              route: 'OD風波 > 引き大 > 五黄殺',
              damage: null,
              advantage: '36',
              notes: 'ラッシュから投げが埋まる',
              starred: false,
            },
            {
              id: generateId(),
              tags: ['ストック1', '中央'],
              starter: '前大P',
              route: 'OD風波 > 引き大 > 五黄殺',
              damage: null,
              advantage: '36',
              notes: '',
              starred: false,
            },
            {
              id: generateId(),
              tags: ['ストック1', '中央'],
              starter: '前大P',
              route: 'OD風波 > 引き大 > 五黄殺 > 暗剣殺',
              damage: null,
              advantage: '43',
              notes: '',
              starred: false,
            },
            {
              id: generateId(),
              tags: ['ストック2', '中央'],
              starter: '前大P',
              route: 'OD風波 > 引き大 > 五黄殺 > 暗剣殺',
              damage: null,
              advantage: '43',
              notes: '',
              starred: false,
            },
            {
              id: generateId(),
              tags: ['ストック3', '中央'],
              starter: '前大P',
              route: 'OD暗剣殺 > しゃが中P > 五黄殺歳破衝暗剣殺 > しゃが中P > 中風波',
              damage: null,
              advantage: null,
              notes: '',
              starred: false,
            },
          ],
        },
        {
          id: 'panic-counter',
          name: 'パニカン',
          items: [
            {
              id: generateId(),
              tags: ['パニカン', '立ち中P'],
              starter: '中P（パニカン）',
              route: '大P > 強化暗剣殺 > しゃが中P > OD風波 > 引き大K > 五黄殺',
              damage: null,
              advantage: null,
              notes: '',
              starred: false,
            },
            {
              id: generateId(),
              tags: ['パニカン', '立ち中P'],
              starter: '中P（パニカン）',
              route: '引き大K > OD風波 > 引き大 > 五黄殺',
              damage: 3320,
              advantage: null,
              notes: '',
              starred: false,
            },
            {
              id: generateId(),
              tags: ['パニカン', '立ち中P'],
              starter: '中P（パニカン）',
              route: '引き大K > OD風波 > 引き大 > 五黄殺 > 暗剣殺',
              damage: null,
              advantage: null,
              notes: '',
              starred: false,
            },
          ],
        },
        {
          id: 'combo-misc',
          name: 'よく使うコンボ',
          items: [
            {
              id: generateId(),
              tags: ['基本'],
              starter: 'DR',
              route: '中 > 中 > アシ中 > 五黄殺',
              damage: 2380,
              advantage: null,
              notes: '強化で2520。ストック1',
              starred: true,
            },
            {
              id: generateId(),
              tags: ['基本'],
              starter: 'DR',
              route: '中 > 中 > アシ中 > cDR > 下大 > 中 > アシ中 > 五黄殺',
              damage: 3109,
              advantage: null,
              notes: '強化で3177',
              starred: true,
            },
            {
              id: generateId(),
              tags: ['基本', 'SA1'],
              starter: 'DR',
              route: '中 > 中 > アシ中 > cDR > 下大 > 中 > アシ中 > cDR > 下大 > 中 > 後中 > 中 > SA1',
              damage: 3898,
              advantage: null,
              notes: '強化で3998',
              starred: true,
            },
          ],
        },
        {
          id: 'wall-bounce',
          name: '壁ドン',
          items: [
            {
              id: generateId(),
              tags: ['壁ドン', 'SA3'],
              starter: '前大（壁ドン後）',
              route: 'cDR > ディレイ前大 > cDR > ディレイ下大 > 五黄殺 > SA3',
              damage: 5069,
              advantage: null,
              notes: 'ガードして壁ドンの場合は4436',
              starred: false,
            },
            {
              id: generateId(),
              tags: ['壁ドン', 'SA3'],
              starter: '前大（壁ドン後）',
              route: 'cDR > ディレイ前大 > cDR > ディレイ下大 > 強化五黄殺 > SA3',
              damage: 5153,
              advantage: null,
              notes: 'ガードして壁ドンの場合は4530',
              starred: false,
            },
          ],
        },
      ],
    },
    {
      id: 'okizeme',
      name: '起き攻め',
      type: 'okizeme',
      sections: [
        {
          id: 'frame-36',
          name: '+36（OD風波>引き大>五黄殺〆）',
          items: [
            { id: generateId(), consumeMove: '屈弱P消費', frameAfter: '22', actions: [], notes: '', starred: false },
            { id: generateId(), consumeMove: '屈弱K消費', frameAfter: '21', actions: ['中段'], notes: '', starred: false },
            { id: generateId(), consumeMove: '前ステ消費', frameAfter: '14', actions: ['ラッシュ中P', 'ラッシュしゃがみ弱K', 'ラッシュ投げ'], notes: '', starred: false },
            { id: generateId(), consumeMove: '投げ消費', frameAfter: '6', actions: ['しゃがみ弱K'], notes: '', starred: true },
            { id: generateId(), consumeMove: '弱風波消費', frameAfter: '2', actions: ['投げ'], notes: '', starred: true },
          ],
        },
        {
          id: 'frame-39',
          name: '+39（OD風波>前中P>五黄殺〆）アシコン',
          items: [
            { id: generateId(), consumeMove: '弱風波消費', frameAfter: '5', actions: ['中P', '投げ', 'しゃがみ弱P'], notes: '', starred: true },
            { id: generateId(), consumeMove: '前ステ消費', frameAfter: '17', actions: ['中段', 'ラッシュ引き大K', 'ラッシュ大P'], notes: '', starred: false },
            { id: generateId(), consumeMove: '投げ消費', frameAfter: '9', actions: [], notes: '', starred: false },
          ],
        },
        {
          id: 'frame-43',
          name: '+43（OD風波>引き大>五黄殺暗剣殺）',
          items: [
            { id: generateId(), consumeMove: '大足消費', frameAfter: '8', actions: ['中P持続当て（ガード+5/ヒット+10）', '中P'], notes: '', starred: true },
            { id: generateId(), consumeMove: '引き大K消費', frameAfter: '3', actions: ['中P', '投げ'], notes: '', starred: true },
            { id: generateId(), consumeMove: '中風波消費', frameAfter: '6', actions: ['中P'], notes: '中風波 > しゃがみ弱K：SA詐欺', starred: true },
            { id: generateId(), consumeMove: '屈弱K消費', frameAfter: '28', actions: ['ラッシュ中段'], notes: '', starred: false },
          ],
        },
        {
          id: 'frame-45',
          name: '+45（OD風波>前中P>五黄殺暗剣殺）アシコン',
          items: [
            { id: generateId(), consumeMove: '引き大K消費', frameAfter: '5', actions: ['中P', 'しゃがみ弱K', '投げ', '後ろ下がり'], notes: '', starred: true },
            { id: generateId(), consumeMove: '中風波消費', frameAfter: '8', actions: ['中P持続当て（ガード+5/ヒット+10）', '中P'], notes: '', starred: true },
            { id: generateId(), consumeMove: '大足消費', frameAfter: '10', actions: [], notes: '', starred: false },
          ],
        },
        {
          id: 'setplay-center',
          name: 'セットプレー（中央）',
          items: [
            { id: generateId(), consumeMove: '引き大K五黄殺（+36）', frameAfter: null, actions: ['前ステラッシュ中P', '前ステラッシュ屈弱K', '前ステラッシュ投げ'], notes: '', starred: true },
            { id: generateId(), consumeMove: 'A中コンボ五黄殺（+39）', frameAfter: null, actions: ['前ステラッシュ前大P', '前ステラッシュ引き大K'], notes: '', starred: true },
            { id: generateId(), consumeMove: '引き大K五黄殺暗剣殺（+43）', frameAfter: null, actions: ['屈弱Kラッシュ中段'], notes: '', starred: false },
            { id: generateId(), consumeMove: 'A中コンボ五黄殺暗剣殺（+45）', frameAfter: null, actions: ['屈弱Kラッシュ中段'], notes: '', starred: false },
          ],
        },
      ],
    },
    {
      id: 'matchups',
      name: 'キャラ対策',
      type: 'matchup',
      sections: [
        {
          id: 'ed',
          name: 'エド',
          items: [
            { id: generateId(), situation: 'サイコスパーク', response: 'ガードして強天穿輪', notes: 'サイコシュート派生でも相打ちで+35', important: false },
          ],
        },
        {
          id: 'bega',
          name: 'ベガ',
          items: [
            { id: generateId(), situation: 'ヘッドプレスで踏まれて後ろに逃げた', response: '着地にラッシュで確定', notes: '', important: false },
          ],
        },
        {
          id: 'jp',
          name: 'JP',
          items: [
            { id: generateId(), situation: 'SA3後のODヴィーハト設置', response: 'SA1確定', notes: '', important: true },
            { id: generateId(), situation: 'コパ刻み弱ストリボーグ', response: 'SA1確定。弱ストリボーグをパリィできれば大足確定', notes: '', important: true },
            { id: generateId(), situation: '端の前投げ後のリバサアムネジア', response: '前ステコパ（取られる）バクステ大P(SA3)', notes: '★ 前ステコパ（アムネジアで取られる）バクステ中足(SA1)、前ステ中P（SA1）微歩き投げ', important: true },
            { id: generateId(), situation: '生ラヴーシュカ', response: 'SA1の初段が届く間合いなら確定', notes: '', important: false },
          ],
        },
        {
          id: 'zangi',
          name: 'ザンギ',
          items: [
            { id: generateId(), situation: 'ラッシュ大足（スクリュー後など）', response: 'SA1確定', notes: '', important: false },
            { id: generateId(), situation: 'SA2、SA3警戒', response: '端前投げ前ステOD暗剣殺（のあとは大P）', notes: '★', important: true },
          ],
        },
        {
          id: 'gouki',
          name: '豪鬼',
          items: [
            { id: generateId(), situation: 'ラッシュ大足（画面中央前投げなど）', response: 'SA1確定', notes: '', important: false },
          ],
        },
        {
          id: 'terry',
          name: 'テリー',
          items: [
            { id: generateId(), situation: '弱パワーウェイブ', response: '暗剣殺で弾よけ（開幕距離ならパニカン）/ SA1 / 疾空', notes: '開幕距離より少し離れていたらSA1。OD歳破衝に派生OD五黄殺でパニカン', important: false },
            { id: generateId(), situation: 'SA1', response: '暗転でSA1、SA3、CA、OD天穿輪', notes: '', important: true },
            { id: generateId(), situation: 'SA2', response: '暗転明けの遅らせSA3・CA（パワー「ゲ」あたり）', notes: '', important: true },
          ],
        },
      ],
    },
    {
      id: 'practice',
      name: '練習メニュー',
      type: 'freetext',
      content: `しばらくはトレモしてバトルハブやカジュアルでトレモでやったことの確認と、反省会。

## 中足ラッシュのヒット確認

- 投げシケに対して
  - 中パン大パン強風波天穿輪
  - ゲージあるなら中パン大パン暗剣殺
- ガードなら
  - コパコパ
  - コパ投げ
- ヒットなら
  - しゃがみ大パンコンボ

## ラッシュ中パン

- ヒットなら
  - 大P暗剣殺
  - 大P強風波天穿輪
- ガードなら
  - 歩き投げ
  - 後ろ下がり
  - 中パン重ね
  - 前大で遅らせ狩りとヒット確認
  - 引大でジャンプ狩り

## 対空

- 通常対空
- めくり
- 端の通常対空
- 端の空対空

## トレモ

- 豪鬼：ラッシュ中Pガード練習
- ジュリ：対空
- テリー：中Pガード

## 中Pガード後の行動

- 中P > しゃが中P > 中風波
- 中P > 前歩き > 投げ
- 中P > 前歩き > 中P
- 中P > 前歩き > 中足 > 弱風波
`,
    },
    {
      id: 'misc',
      name: '立ち回り・メモ',
      type: 'freetext',
      content: `## 風波ストック管理

- 風波ストックが0,3個のときはOD暗剣殺
- 風波ストックが1,2個のときはOD風波

## 雑なメモ

- コンボ入力は開始と終了のキー方向を意識すること
- めくり攻撃対策
  - 昇竜しない
  - 屈中P、屈大P
  - 垂直空対空（J中K、J弱P）
  - 空投げ
  - めくりが多い豪鬼、ブランカ、ヴァイパーは特に気をつける
- 大Pや前大Pは当たる距離で振る
  - 歩いてちゃんと当てる
  - 後ろ下がりから前大P出す
- しゃが中P振る
- コンボミス減らす
- 下手にボタン押さない、ガードする
- 何を食らったらリーサルされちゃうのかを考える
  - 相手が打撃択だったら、バクステやら投げ抜けはだめ
- ラッシュ中段カウンターヒットで下大Pつながる
- 百鬼に空対空（ジャンプ中K）

## 全体フレーム一覧

| 技 | 全体F |
|---|---|
| 屈弱P | 14 |
| 屈弱K | 15 |
| 立弱K | 16 |
| 中P | 21 |
| 前ステ | 22 |
| しゃが中P | 24 |
| 中足 | 29 |
| 投げ | 30 |
| 弱風波 | 34 |
| 下大P | 34 |
| 大足 | 35 |
| 大P | 36 |
| 中風波 | 37 |
| 大K | 39 |
| 引き大K | 40 |
`,
    },
    {
      id: 'reflection',
      name: '反省点',
      type: 'freetext',
      content: `## 反省するところ

- 相手のダウン以外で生風波しない
- しゃがみガードしっかり
- 下がらなくて良いところで下がらない
- ドライブゲージ3本以下の立ち回り
- コンボ精度上げる
- ジャンプしない
- 歳破衝うたない、ストックはダメージに回す
- 焦らない
- 下がりすぎない
- 端の起き攻めする
- 時間使う
- 不利フレームで暴れない
- 遅らせグラップを覚える
`,
    },
    {
      id: 'version',
      name: 'バージョン情報',
      type: 'freetext',
      content: `## 2026/03/17 バージョン

### 変更点

- 暗剣殺ガードで-8
  - 生暗剣殺ヒットでSAにつながる
- 五黄殺暗剣殺からSA3つながる
- OD風波から前中P、近ければ引き大がつながる
  - 大足や、端なら微歩きコパ等もつながる
  - アシスト中コンボが、しゃが中P>OD風波>前中P>SA1になってる
- ラッシュ中段から投げられない距離に変更
`,
    },
  ],
}

function stripPlus(v) {
  return typeof v === 'string' ? v.replace(/^\+/, '') : v
}

function migrateData(d) {
  return {
    ...d,
    categories: d.categories.map(cat => {
      if (cat.sections) {
        return {
          ...cat,
          sections: cat.sections.map(sec => ({
            ...sec,
            items: (sec.items ?? []).map(item => {
              if (cat.type === 'combo')   return { ...item, advantage: stripPlus(item.advantage) }
              if (cat.type === 'okizeme') return { ...item, frameAfter: stripPlus(item.frameAfter) }
              return item
            }),
          })),
        }
      }
      return cat
    }),
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (!parsed.comboTags) parsed.comboTags = DEFAULT_DATA.comboTags
      return migrateData(parsed)
    }
  } catch {}
  return DEFAULT_DATA
}

function loadGistConfig() {
  try {
    const saved = localStorage.getItem('juri-memo-gist')
    if (saved) return JSON.parse(saved)
  } catch {}
  return { pat: '', gistId: '' }
}

export const data = writable(loadFromStorage())
export const gistConfig = writable(loadGistConfig())

data.subscribe(val => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)))
gistConfig.subscribe(val => localStorage.setItem('juri-memo-gist', JSON.stringify(val)))

function touch() {
  data.update(d => ({ ...d, lastUpdated: new Date().toISOString() }))
}

// ---- Category CRUD ----
export function addCategory(name, type) {
  const id = generateId()
  data.update(d => ({
    ...d,
    categories: [...d.categories, {
      id, name, type,
      ...(type === 'freetext' ? { content: '' } : { sections: [] }),
    }],
  }))
  touch()
  return id
}

export function updateCategory(id, patch) {
  data.update(d => ({
    ...d,
    categories: d.categories.map(cat => cat.id === id ? { ...cat, ...patch } : cat),
  }))
  touch()
}

export function deleteCategory(id) {
  data.update(d => ({
    ...d,
    categories: d.categories.filter(c => c.id !== id),
  }))
  touch()
}

// ---- Section CRUD ----
export function addSection(categoryId, name) {
  const id = generateId()
  data.update(d => ({
    ...d,
    categories: d.categories.map(cat => {
      if (cat.id !== categoryId || !cat.sections) return cat
      return { ...cat, sections: [...cat.sections, { id, name, items: [] }] }
    }),
  }))
  touch()
  return id
}

export function updateSection(categoryId, sectionId, patch) {
  data.update(d => ({
    ...d,
    categories: d.categories.map(cat => {
      if (cat.id !== categoryId || !cat.sections) return cat
      return {
        ...cat,
        sections: cat.sections.map(sec => sec.id === sectionId ? { ...sec, ...patch } : sec),
      }
    }),
  }))
  touch()
}

export function deleteSection(categoryId, sectionId) {
  data.update(d => ({
    ...d,
    categories: d.categories.map(cat => {
      if (cat.id !== categoryId || !cat.sections) return cat
      return { ...cat, sections: cat.sections.filter(s => s.id !== sectionId) }
    }),
  }))
  touch()
}

export function reorderSection(categoryId, sectionId, direction) {
  data.update(d => ({
    ...d,
    categories: d.categories.map(cat => {
      if (cat.id !== categoryId || !cat.sections) return cat
      const sections = [...cat.sections]
      const idx = sections.findIndex(s => s.id === sectionId)
      const newIdx = idx + direction
      if (newIdx < 0 || newIdx >= sections.length) return cat
      ;[sections[idx], sections[newIdx]] = [sections[newIdx], sections[idx]]
      return { ...cat, sections }
    }),
  }))
  touch()
}

// ---- Item CRUD ----
export function addItem(categoryId, sectionId, item) {
  const id = generateId()
  data.update(d => ({
    ...d,
    categories: d.categories.map(cat => {
      if (cat.id !== categoryId || !cat.sections) return cat
      return {
        ...cat,
        sections: cat.sections.map(sec => {
          if (sec.id !== sectionId) return sec
          return { ...sec, items: [...sec.items, { id, ...item }] }
        }),
      }
    }),
  }))
  touch()
  return id
}

export function updateItem(categoryId, sectionId, itemId, patch) {
  data.update(d => ({
    ...d,
    categories: d.categories.map(cat => {
      if (cat.id !== categoryId || !cat.sections) return cat
      return {
        ...cat,
        sections: cat.sections.map(sec => {
          if (sec.id !== sectionId) return sec
          return {
            ...sec,
            items: sec.items.map(i => i.id === itemId ? { ...i, ...patch } : i),
          }
        }),
      }
    }),
  }))
  touch()
}

export function deleteItem(categoryId, sectionId, itemId) {
  data.update(d => ({
    ...d,
    categories: d.categories.map(cat => {
      if (cat.id !== categoryId || !cat.sections) return cat
      return {
        ...cat,
        sections: cat.sections.map(sec => {
          if (sec.id !== sectionId) return sec
          return { ...sec, items: sec.items.filter(i => i.id !== itemId) }
        }),
      }
    }),
  }))
  touch()
}

// ---- ComboTag CRUD ----
export function addComboTag(name) {
  const trimmed = name.trim()
  if (!trimmed) return
  data.update(d => {
    if (d.comboTags.includes(trimmed)) return d
    return { ...d, comboTags: [...d.comboTags, trimmed] }
  })
  touch()
}

export function deleteComboTag(name) {
  data.update(d => ({
    ...d,
    comboTags: d.comboTags.filter(t => t !== name),
  }))
  touch()
}

export function updateFreetext(categoryId, content) {
  data.update(d => ({
    ...d,
    categories: d.categories.map(cat => cat.id === categoryId ? { ...cat, content } : cat),
  }))
  touch()
}

export function saveGistConfig(pat, gistId) {
  gistConfig.set({ pat, gistId })
}

export async function syncToGist() {
  const { pat, gistId } = get(gistConfig)
  if (!pat) throw new Error('GitHub PATが設定されていません')
  const payload = {
    files: { 'juri-memo.json': { content: JSON.stringify(get(data), null, 2) } },
  }
  if (gistId) {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Gist更新失敗: ${res.status}`)
  } else {
    const res = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, description: 'SF6 ジュリメモ', public: false }),
    })
    if (!res.ok) throw new Error(`Gist作成失敗: ${res.status}`)
    const json = await res.json()
    gistConfig.update(c => ({ ...c, gistId: json.id }))
  }
}

export async function loadFromGist() {
  const { pat, gistId } = get(gistConfig)
  if (!pat || !gistId) throw new Error('GitHub PATとGist IDが必要です')
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `Bearer ${pat}` },
  })
  if (!res.ok) throw new Error(`Gist取得失敗: ${res.status}`)
  const json = await res.json()
  const content = json.files['juri-memo.json']?.content
  if (!content) throw new Error('juri-memo.json が見つかりません')
  const remote = migrateData(JSON.parse(content))
  if (!remote.comboTags) remote.comboTags = DEFAULT_DATA.comboTags
  const localTime = new Date(get(data).lastUpdated).getTime()
  const remoteTime = new Date(remote.lastUpdated).getTime()
  if (remoteTime > localTime) {
    data.set(remote)
  }
  return remoteTime > localTime ? 'updated' : 'already-latest'
}
