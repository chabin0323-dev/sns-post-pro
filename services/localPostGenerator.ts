import type {
  GenerateInput,
  GeneratedPost,
  Platform,
  TrendIdea,
  InsertPosition,
  TiktokInsertPosition
} from '../types';

const FIXED_HASHTAGS: Record<Platform, string[]> = {
  TikTok: ['#TikTok', '#おすすめ', '#おすすめにのりたい', '#バズりたい'],
  X: ['#拡散希望', '#話題', '#注目'],
  note: ['#note', '#発信', '#コンテンツ販売'],
  Instagram: ['#Instagram', '#インスタ運用', '#投稿作成'],
  YouTube: ['#YouTube', '#動画投稿', '#ショート動画']
};

const THEME_TAGS: Record<string, string[]> = {
  恋愛: ['#恋愛', '#恋愛心理', '#好きな人'],
  告白: ['#告白', '#告白成功', '#告白初心者'],
  復縁: ['#復縁', '#復縁したい', '#復縁コツ'],
  片想い: ['#片想い', '#恋愛', '#好きな人'],
  脈あり: ['#脈あり', '#恋愛心理', '#好意'],
  脈なし: ['#脈なし', '#恋愛相談', '#逆転'],
  浮気: ['#浮気', '#恋愛', '#恋愛相談'],
  恋愛心理: ['#恋愛心理', '#恋愛', '#好きな人'],
  美容: ['#美容', '#垢抜け', '#自分磨き'],
  副業: ['#副業', '#在宅ワーク', '#お金'],
  集客: ['#集客', '#マーケティング', '#売れる導線'],
  ダイエット: ['#ダイエット', '#痩せる習慣', '#食事改善'],
  SNS運用: ['#SNS運用', '#投稿ネタ', '#バズ投稿'],
  占い: ['#占い', '#運勢', '#恋愛占い']
};

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeTheme(theme: string): string {
  return theme.trim() || '恋愛';
}

function normalizeTarget(target: string): string {
  return target.trim() || '初心者';
}

function detectThemeKey(theme: string): string {
  const normalized = normalizeTheme(theme);
  const keys = [
    '恋愛心理',
    '脈あり',
    '脈なし',
    '片想い',
    '告白',
    '復縁',
    '浮気',
    '恋愛',
    '美容',
    '副業',
    '集客',
    'ダイエット',
    'SNS運用',
    '占い'
  ];

  for (const key of keys) {
    if (normalized.includes(key)) return key;
  }

  return normalized;
}

function buildHashtags(platform: Platform, input: GenerateInput): string[] {
  if (!input.includeHashtags || input.hashtagMode === 'none') return [];

  const themeKey = detectThemeKey(input.theme);
  const themeTags = THEME_TAGS[themeKey] ?? ['#投稿', '#発信', '#伸びる投稿'];
  const fixed = input.includeFixedHashtags ? FIXED_HASHTAGS[platform] : [];

  return Array.from(new Set([...themeTags, ...fixed])).slice(0, platform === 'TikTok' ? 6 : 5);
}

function buildHooks(themeKey: string): string[] {
  return [
    `実はこれ、${themeKey}のサインです`,
    `${themeKey}で9割が間違えています`,
    `${themeKey}で損している人の特徴`,
    `${themeKey}がうまくいかない理由`,
    `${themeKey}で差がつくポイント`,
    `${themeKey}でやってはいけない行動`,
    `${themeKey}で逆転する方法`,
    `${themeKey}で結果が変わる人の共通点`,
    `${themeKey}で見落としがちな事実`,
    `${themeKey}で一番大事なこと`
  ];
}

function pickLengthBlocks(lengthMode: GenerateInput['lengthMode']) {
  if (lengthMode === '短め') return 10;
  if (lengthMode === '長め') return 22;
  return 16;
}

function trimBlocks(blocks: string[], lengthMode: GenerateInput['lengthMode']) {
  const limit = pickLengthBlocks(lengthMode);
  const result: string[] = [];
  let count = 0;

  for (const line of blocks) {
    result.push(line);
    if (line !== '') count += 1;
    if (count >= limit) break;
  }

  return result;
}

function buildThemeBlocks(themeKey: string, target: string): string[][] {
  const hook = rand(buildHooks(themeKey));

  const common = [
    [
      hook,
      '',
      'これ知らないと',
      '普通に損します',
      '',
      '多くの人は',
      'ここを間違えています',
      '',
      'だから結果が出ません',
      '',
      'でも逆に',
      'ここを変えるだけで',
      '一気に流れが変わります',
      '',
      `${target}ほど`,
      '急ぎやすいので',
      'まずは順番を',
      '見直してください',
      '',
      '今ここを変える人ほど',
      '結果は変わりやすいです'
    ],
    [
      hook,
      '',
      'これ気づいてますか？',
      '',
      'うまくいかない人は',
      '同じパターンです',
      '',
      '原因は',
      '能力不足ではなく',
      'やり方です',
      '',
      '順番を変えるだけで',
      '反応は変わります',
      '',
      '急ぐほど',
      'ズレやすいので',
      '最初の流れを',
      '整えてください'
    ],
    [
      hook,
      '',
      'ほとんどの人が',
      '勘違いしています',
      '',
      '実はこれ',
      '逆です',
      '',
      'だから失敗します',
      '',
      '正しくは',
      '先にこれをやること',
      '',
      'それだけで',
      '変わりやすくなります',
      '',
      '大事なのは',
      '努力より順番です'
    ]
  ];

  const map: Record<string, string[][]> = {
    恋愛: [
      [
        hook,
        '',
        '恋愛が進む人は',
        '',
        '気持ちの強さより',
        '順番を大事にしています',
        '',
        'いきなり答えを求めず',
        '',
        '話しやすさ',
        '安心感',
        'また会いたさ',
        '',
        'この流れを作っています',
        '',
        `${target}ほど`,
        '結果を急ぎやすいので',
        '',
        'まずは心地よさを',
        '作ってください'
      ]
    ],
    告白: [
      [
        hook,
        '',
        '告白で失敗する人は',
        '勇気が足りないのではなく',
        '',
        '空気作りを',
        '飛ばしています',
        '',
        '先に必要なのは',
        '安心感です',
        '',
        '話しやすい',
        '会いやすい',
        '返しやすい',
        '',
        'この流れができると',
        '結果は変わります'
      ]
    ],
    復縁: [
      [
        hook,
        '',
        '復縁したい人ほど',
        'すぐ連絡したくなります',
        '',
        'でも焦るほど',
        '戻りにくくなります',
        '',
        '必要なのは',
        '説得ではなく',
        '距離の整え直しです',
        '',
        '落ち着く',
        '変わる',
        '自然に見せる',
        '',
        'この順番が大事です'
      ]
    ],
    片想い: [
      [
        hook,
        '',
        '片想いで苦しくなる人は',
        '相手の気持ちより',
        '不安を見ています',
        '',
        '返信が少し遅いだけで',
        '脈なしと思いやすいです',
        '',
        'でも本当に大事なのは',
        '積み重ねです',
        '',
        '会いやすい',
        '話しやすい',
        'また会いたい',
        '',
        'この流れを作ってください'
      ]
    ],
    脈あり: [
      [
        hook,
        '',
        '脈ありは',
        '言葉より行動に出ます',
        '',
        '返信が続く',
        '質問が返ってくる',
        '会話を終わらせない',
        '',
        'これは好意の可能性が',
        '高いです',
        '',
        '逆に',
        '必要な返事だけなら',
        '温度は低めです'
      ]
    ],
    脈なし: [
      [
        hook,
        '',
        '脈なしっぽい時に',
        '一番やってはいけないのは',
        '追いすぎることです',
        '',
        '相手が引いている時に',
        '押すほど',
        '距離は広がります',
        '',
        '逆転したいなら',
        '一度引くこと',
        '',
        'これが大事です'
      ]
    ],
    浮気: [
      [
        hook,
        '',
        '違和感があるなら',
        '気のせいではないかも',
        'しれません',
        '',
        '浮気をしている人は',
        '',
        'スマホを隠す',
        '返信が雑になる',
        '予定を聞かれるのを嫌がる',
        '',
        'この変化が',
        '出やすいです',
        '',
        '言葉より行動を',
        '見てください'
      ]
    ]
  };

  return [...(map[themeKey] ?? []), ...common];
}

function applyPhraseToTikTok(blocks: string[], phrase: string, position: TiktokInsertPosition): string[] {
  if (!phrase.trim()) return blocks;

  if (position === 'start') {
    return [phrase, '', ...blocks];
  }

  if (position === 'end') {
    return [...blocks, '', phrase];
  }

  return [phrase, '', ...blocks, '', phrase];
}

function applyPhraseToNoteX(body: string, phrase: string, url: string, position: InsertPosition): string {
  const cleanPhrase = phrase.trim();
  const cleanUrl = url.trim();
  const insertText = [cleanPhrase, cleanUrl].filter(Boolean).join('\n');

  if (!insertText) return body;
  if (position === 'start') return `${insertText}\n\n${body}`;
  return `${body}\n\n${insertText}`;
}

function buildBody(platform: Platform, input: GenerateInput): string {
  const themeKey = detectThemeKey(input.theme);
  const target = normalizeTarget(input.target);

  if (platform === 'TikTok') {
    const baseBlocks = rand(buildThemeBlocks(themeKey, target));
    const sizedBlocks = trimBlocks(baseBlocks, input.lengthMode);
    const finalBlocks = applyPhraseToTikTok(sizedBlocks, input.tiktokPhrase, input.tiktokInsertPosition);
    return finalBlocks.join('\n');
  }

  const base = platform === 'X'
    ? [
        `${themeKey}で結果が変わる人は、内容ではなく順番を整えています。`,
        `${target}ほど急ぎやすいので、まずは一文目の伝わり方を見直すだけでも反応は変わります。`
      ].join('\n')
    : [
        `${themeKey}で反応を変えたいなら、最初の一文を見直してください。`,
        `${target}に届く発信は、説明より先に「自分ごと」と思わせる流れがあります。`
      ].join('\n\n');

  if (platform === 'X' || platform === 'note') {
    return applyPhraseToNoteX(base, input.noteXPhrase, input.noteXUrl, input.noteXInsertPosition);
  }

  return base;
}

function buildBuzzAnalysis(platform: Platform, input: GenerateInput, hashtags: string[]) {
  let hookPower = platform === 'TikTok' ? 92 : 78;
  let readability = input.lengthMode === '短め' ? 90 : input.lengthMode === '長め' ? 82 : 86;
  let curiosity = 88;
  let conversion = input.goal === 'sales' ? 89 : 82;

  if (input.ctaMode === 'strong') conversion += 3;
  if (input.includeUrgency) conversion += 3;
  if (hashtags.length >= 4) readability += 2;

  hookPower = Math.min(99, hookPower);
  readability = Math.min(99, readability);
  curiosity = Math.min(99, curiosity);
  conversion = Math.min(99, conversion);

  const score = Math.round((hookPower + readability + curiosity + conversion) / 4);

  return {
    score,
    hookPower,
    readability,
    curiosity,
    conversion,
    reason: [
      '冒頭フックを強くしています',
      '短文改行で最後まで読まれやすくしています',
      'テーマに連動した内容にしています',
      'SNSごとの決まり文を自動挿入しています'
    ]
  };
}

function buildTitle(platform: Platform, input: GenerateInput): string {
  const theme = normalizeTheme(input.theme);
  const target = normalizeTarget(input.target);

  if (platform === 'TikTok') {
    return `${target}向け｜${theme}で反応が変わる投稿`;
  }

  return `${theme}投稿案`;
}

function buildSinglePost(platform: Platform, input: GenerateInput): GeneratedPost {
  const now = new Date().toISOString();
  const hashtags = buildHashtags(platform, input);
  const buzzAnalysis = buildBuzzAnalysis(platform, input, hashtags);

  return {
    id: generateId(),
    platform,
    title: buildTitle(platform, input),
    content: buildBody(platform, input),
    hashtags,
    theme: normalizeTheme(input.theme),
    target: normalizeTarget(input.target),
    gender: input.gender,
    buzzScore: buzzAnalysis.score,
    buzzAnalysis,
    createdAt: now,
    updatedAt: now,
    status: 'ready'
  };
}

export function generatePosts(input: GenerateInput): GeneratedPost[] {
  return input.platforms.map((platform) => buildSinglePost(platform, input));
}

export function generateTrendIdeas(theme: string, target: string): TrendIdea[] {
  const t = normalizeTheme(theme);
  const g = normalizeTarget(target);

  return [
    {
      id: generateId(),
      angle: '共通点',
      title: `実はこれ、${t}のサインです`,
      hook: `${t}で気づいていない人が多いポイントです。`,
      reason: 'フックが強いタイトル'
    },
    {
      id: generateId(),
      angle: '失敗回避',
      title: `${t}で失敗する人の共通点`,
      hook: `${t}で損している人は同じミスをしています。`,
      reason: '痛み訴求で反応が出やすい'
    },
    {
      id: generateId(),
      angle: '改善',
      title: `${g}向け｜${t}で結果が変わる人の特徴`,
      hook: `${t}で結果を変えたいなら最初にここを直してください。`,
      reason: 'ターゲット連動で使いやすい'
    }
  ];
}
