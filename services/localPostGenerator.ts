import type {
  BuzzAnalysis,
  GenerateInput,
  GeneratedPost,
  Platform,
  TrendIdea
} from '../types';

const FIXED_HASHTAGS: Record<Platform, string[]> = {
  TikTok: ['#TikTok', '#おすすめ', '#おすすめにのりたい', '#バズりたい'],
  X: ['#拡散希望', '#話題', '#注目'],
  note: ['#note', '#発信', '#コンテンツ販売'],
  Instagram: ['#Instagram', '#インスタ運用', '#投稿作成'],
  YouTube: ['#YouTube', '#動画投稿', '#ショート動画']
};

const THEME_TAGS: Record<string, string[]> = {
  恋愛: ['#恋愛', '#恋愛心理', '#片想い'],
  告白: ['#告白', '#告白成功', '#告白初心者'],
  復縁: ['#復縁', '#復縁したい', '#復縁コツ'],
  片想い: ['#片想い', '#恋愛', '#好きな人'],
  脈あり: ['#脈あり', '#恋愛心理', '#好意'],
  脈なし: ['#脈なし', '#恋愛相談', '#逆転'],
  恋愛心理: ['#恋愛心理', '#恋愛', '#好きな人'],
  美容: ['#美容', '#垢抜け', '#自分磨き'],
  副業: ['#副業', '#在宅ワーク', '#お金'],
  集客: ['#集客', '#マーケティング', '#売れる導線'],
  ダイエット: ['#ダイエット', '#痩せる習慣', '#食事改善'],
  SNS運用: ['#SNS運用', '#投稿ネタ', '#バズ投稿'],
  占い: ['#占い', '#運勢', '#恋愛占い']
};

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeTheme(theme: string) {
  return theme.trim() || '投稿テーマ';
}

function normalizeTarget(target: string) {
  return target.trim() || '初心者';
}

function detectThemeKey(theme: string): string {
  const normalized = normalizeTheme(theme);

  const priorityKeys = [
    '恋愛心理',
    '脈あり',
    '脈なし',
    '片想い',
    '告白',
    '復縁',
    '恋愛',
    '美容',
    '副業',
    '集客',
    'ダイエット',
    'SNS運用',
    '占い'
  ];

  for (const key of priorityKeys) {
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

function buildBuzzAnalysis(platform: Platform, input: GenerateInput, hashtags: string[]): BuzzAnalysis {
  let hookPower = platform === 'TikTok' ? 90 : 76;
  let readability = 86;
  let curiosity = 84;
  let conversion = input.goal === 'sales' ? 88 : 80;

  if (input.ctaMode === 'strong') conversion += 4;
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
      '入力テーマに合わせて記事内容を切り替えています',
      'TikTok向けの短文改行構成です',
      '冒頭で興味を引く流れにしています'
    ]
  };
}

function buildThemeRelatedTiktokContent(input: GenerateInput): string {
  const theme = normalizeTheme(input.theme);
  const target = normalizeTarget(input.target);
  const themeKey = detectThemeKey(theme);

  switch (themeKey) {
    case '告白':
      return [
        '続きはプロフィールから👇',
        '',
        '【告白で',
        '失敗しやすい人の共通点】',
        '',
        '告白がうまくいかない人は',
        '',
        '勇気がないからじゃなく',
        '順番を間違えています',
        '',
        '多いのは',
        '',
        'いきなり気持ちを',
        '重く伝えてしまうこと',
        '',
        'これをすると',
        '相手は驚いて',
        '引きやすくなります',
        '',
        '本当に大事なのは',
        '',
        '告白の前に',
        '安心感を作ること',
        '',
        '話しやすい',
        '会いやすい',
        '返しやすい',
        '',
        'この流れがあると',
        '結果は変わりやすいです',
        '',
        `${target}ほど`,
        '気持ちを急ぎすぎるので',
        '',
        'まずは',
        '告白前の空気を',
        '整えてください',
        '',
        '続きはプロフィールから👇'
      ].join('\n');

    case '復縁':
      return [
        '続きはプロフィールから👇',
        '',
        '【復縁で',
        '止まる人の共通点】',
        '',
        '復縁したい人ほど',
        '',
        'すぐ連絡したくなります',
        '',
        'でもそこで焦ると',
        '相手は戻りにくくなります',
        '',
        '理由は簡単で',
        '',
        '別れた直後は',
        '感情が残っているからです',
        '',
        'この時期に必要なのは',
        '',
        '説得ではなく',
        '距離の整え直しです',
        '',
        '落ち着く',
        '変わる',
        '自然に見せる',
        '',
        'この順番を守ると',
        '復縁は進みやすくなります',
        '',
        `${target}の人は`,
        '気持ちで押しやすいので',
        '',
        'まずは追わない形を',
        '覚えてください',
        '',
        '続きはプロフィールから👇'
      ].join('\n');

    case '片想い':
      return [
        '続きはプロフィールから👇',
        '',
        '【片想いで',
        '苦しくなる人の共通点】',
        '',
        '片想いが長引く人は',
        '',
        '相手の気持ちより先に',
        '不安を見ています',
        '',
        'だから',
        '',
        '少し返信が遅いだけで',
        '脈なしだと思いやすいです',
        '',
        'でも実際は',
        '',
        '反応より',
        '積み重ねの方が大事です',
        '',
        '話しかけやすい',
        '一緒にいて自然',
        'また会いたくなる',
        '',
        'この流れができると',
        '片想いは動きやすいです',
        '',
        `${target}の人は`,
        '答えを急ぎやすいので',
        '',
        'まずは',
        '関係が深まる行動を',
        '増やしてください',
        '',
        '続きはプロフィールから👇'
      ].join('\n');

    case '脈あり':
      return [
        '続きはプロフィールから👇',
        '',
        '【脈ありか',
        '見抜けない人へ】',
        '',
        '脈ありは',
        '言葉より行動に出ます',
        '',
        'たとえば',
        '',
        '返信が続く',
        '質問が返ってくる',
        '会話が終わらない',
        '',
        'これは好意の可能性が',
        '高いサインです',
        '',
        '逆に',
        '',
        '必要な返事だけ',
        '話が広がらない',
        '自分発信がない',
        '',
        'この形は',
        '温度が低いことが多いです',
        '',
        `${target}ほど`,
        '言葉だけを見やすいので',
        '',
        '行動の量を',
        '見てください',
        '',
        '続きはプロフィールから👇'
      ].join('\n');

    case '脈なし':
      return [
        '続きはプロフィールから👇',
        '',
        '【脈なしから',
        '逆転したい人へ】',
        '',
        '脈なしっぽい時に',
        '',
        '一番やってはいけないのは',
        '追いすぎることです',
        '',
        '相手が引いている時に',
        '押すほど',
        '距離は広がります',
        '',
        '逆転したいなら',
        '',
        '一度引く',
        '印象を変える',
        '軽く接点を作る',
        '',
        'この流れが必要です',
        '',
        `${target}の人は`,
        '不安で動きすぎるので',
        '',
        'まずは',
        '追わない強さを',
        '持ってください',
        '',
        '続きはプロフィールから👇'
      ].join('\n');

    case '恋愛心理':
      return [
        '続きはプロフィールから👇',
        '',
        '【恋愛心理で',
        '差がつくポイント】',
        '',
        '恋愛は',
        '気持ちだけでは動きません',
        '',
        '人は',
        '',
        '安心する人',
        '気になる人',
        '失いたくない人',
        '',
        'この順で',
        '惹かれやすくなります',
        '',
        'だから大事なのは',
        '',
        '好かれようとする前に',
        '安心感を作ることです',
        '',
        `${target}の人は`,
        '気持ちを見せるのが早いので',
        '',
        'まずは',
        '相手が自然に戻る空気を',
        '作ってください',
        '',
        '続きはプロフィールから👇'
      ].join('\n');

    case '恋愛':
      return [
        '続きはプロフィールから👇',
        '',
        '【恋愛で',
        '結果が変わる人の共通点】',
        '',
        '恋愛が進む人は',
        '',
        '気持ちの強さより',
        '順番を大事にしています',
        '',
        '多くの人は',
        '',
        '好きになると',
        'すぐ答えを求めます',
        '',
        'でも本当に大事なのは',
        '',
        '話しやすさ',
        '安心感',
        'また会いたさ',
        '',
        'この流れを作ることです',
        '',
        `${target}ほど`,
        '結果を急ぎやすいので',
        '',
        'まずは',
        '好かれる前に',
        '心地よさを作ってください',
        '',
        '続きはプロフィールから👇'
      ].join('\n');

    default:
      return [
        '続きはプロフィールから👇',
        '',
        `【${theme}で`,
        '反応が変わる人の共通点】',
        '',
        `${theme}で結果が出る人は`,
        '',
        '内容より先に',
        '伝わり方を整えています',
        '',
        '多いのは',
        '',
        '言いたいことを先に',
        '全部入れてしまうこと',
        '',
        'でも見られる投稿は',
        '',
        '最初に気になる言葉',
        '次に失敗例',
        '最後に改善例',
        '',
        'この順番です',
        '',
        `${target}の人ほど`,
        '詰め込みやすいので',
        '',
        'まずは一文目だけ',
        '変えてください',
        '',
        '続きはプロフィールから👇'
      ].join('\n');
  }
}

function buildBody(platform: Platform, input: GenerateInput): string {
  const theme = normalizeTheme(input.theme);
  const target = normalizeTarget(input.target);

  if (platform === 'TikTok') {
    return buildThemeRelatedTiktokContent(input);
  }

  if (platform === 'X') {
    return [
      `${theme}で結果が変わる人は、内容ではなく順番を整えています。`,
      `${target}ほど急ぎやすいので、まずは一文目の伝わり方を見直すだけでも反応は変わります。`
    ].join('\n');
  }

  if (platform === 'note') {
    return [
      `${theme}で反応を変えたいなら、まず最初の一文を見直してください。`,
      `${target}に届く発信は、説明より先に「自分ごと」と思わせる流れがあります。`
    ].join('\n\n');
  }

  return [
    `${theme}に関連した投稿案です。`,
    `${target}に伝わりやすい流れで作っています。`
  ].join('\n');
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
      title: `${g}向け｜${t}で結果が変わる人の共通点`,
      hook: `${t}でうまくいく人は、最初にここを整えています。`,
      reason: 'テーマ直結で使いやすいタイトル'
    },
    {
      id: generateId(),
      angle: '失敗回避',
      title: `${t}で失敗しやすい人の特徴`,
      hook: `${t}で止まる人は、同じミスをしています。`,
      reason: '痛み訴求で反応を取りやすい'
    },
    {
      id: generateId(),
      angle: '改善',
      title: `${t}で今すぐ変えるべき1つ`,
      hook: `${t}で結果を変えたいなら、最初に直すのはここです。`,
      reason: '短く強いタイトルで使いやすい'
    }
  ];
}
