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

const TIKTOK_THEME_TAGS: Record<string, string[]> = {
  恋愛: ['#恋愛', '#恋愛心理', '#告白'],
  告白: ['#告白', '#告白成功', '#告白初心者'],
  復縁: ['#復縁', '#復縁コツ', '#復縁したい'],
  片想い: ['#片想い', '#恋愛', '#告白'],
  美容: ['#美容', '#垢抜け', '#スキンケア'],
  副業: ['#副業', '#在宅ワーク', '#お金'],
  集客: ['#集客', '#マーケティング', '#売れる導線'],
  ダイエット: ['#ダイエット', '#痩せる習慣', '#食事改善'],
  SNS: ['#SNS運用', '#投稿ネタ', '#バズ投稿']
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

function findThemeTags(theme: string): string[] {
  const keys = Object.keys(TIKTOK_THEME_TAGS);
  const hit = keys.find((key) => theme.includes(key));
  if (!hit) return ['#投稿', '#発信', '#伸びる投稿'];
  return TIKTOK_THEME_TAGS[hit];
}

function buildHashtags(platform: Platform, input: GenerateInput): string[] {
  if (!input.includeHashtags || input.hashtagMode === 'none') return [];

  const themeTags = findThemeTags(input.theme);
  const fixed = input.includeFixedHashtags ? FIXED_HASHTAGS[platform] : [];
  const raw = [...themeTags, ...fixed];

  return Array.from(new Set(raw)).slice(0, platform === 'TikTok' ? 6 : 5);
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

  const reason: string[] = [];
  if (platform === 'TikTok') reason.push('TikTok向けの短文改行構成です');
  reason.push('冒頭で痛みを出して離脱を下げています');
  reason.push('短い改行で読みやすさを上げています');
  if (input.goal === 'sales') reason.push('販売導線を意識した締め方にしています');

  return {
    score,
    hookPower,
    readability,
    curiosity,
    conversion,
    reason
  };
}

function buildTiktokContent(input: GenerateInput): string {
  const theme = normalizeTheme(input.theme);
  const target = normalizeTarget(input.target);

  if (theme.includes('告白') || theme.includes('恋愛')) {
    return [
      '続きはプロフィールから👇',
      '',
      '【告白 初心者で',
      '結果が変わる人の共通点】',
      '',
      'ちょっと待ってください',
      '',
      '告白 初心者を',
      '頑張ってるのに',
      '結果が出ない人',
      '',
      'かなり多いです',
      '',
      'でも原因は',
      '能力不足じゃありません',
      '',
      '足りないのは',
      '努力じゃなくて',
      '',
      '順番です',
      '',
      '結果が出る人は',
      '最初に3つだけ',
      '意識しています',
      '',
      '1つ目',
      '目的をはっきりさせる',
      '',
      '2つ目',
      '相手に伝わる形にする',
      '',
      '3つ目',
      '逃げられる形に変える',
      '',
      'この3つです',
      '',
      '逆に止まる人は',
      '何となく始めて',
      '',
      '言いたいことを',
      '詰め込みすぎて',
      '',
      '途中で苦しくなります',
      '',
      'だから続かない',
      '',
      'でも安心してください',
      '',
      '変えるべきなのは',
      '才能じゃなくて',
      '',
      '伝え方です',
      '',
      '今日から意識するのは',
      'たった1つ',
      '',
      '一瞬で伝わるか',
      '',
      'ここだけです',
      '',
      'これを変えるだけで',
      `${target}の結果は`,
      '変わりやすくなります',
      '',
      '本当に大事なのは',
      '頑張り方より',
      '伝わる順番です',
      '',
      'まず1回',
      '整えてみてください',
      '',
      '続きはプロフィールから👇'
    ].join('\n');
  }

  return [
    '続きはプロフィールから👇',
    '',
    `【${theme}で`,
    '反応が変わる',
    '基本構成】',
    '',
    `${target}で`,
    `${theme}を発信しても`,
    '伸びない人は',
    '',
    '内容より先に',
    '順番を見直してください',
    '',
    '最初に必要なのは',
    '説明ではなく',
    '',
    '一瞬で',
    '気になる言葉です',
    '',
    '見られる投稿は',
    '最初に',
    '',
    '痛み',
    '失敗例',
    '改善例',
    '',
    'この順で入ります',
    '',
    '逆に伸びない投稿は',
    '言いたいことを',
    '先に並べます',
    '',
    'だから止まらない',
    '',
    'でも変えるのは',
    '難しくありません',
    '',
    'まずは',
    '一文目だけ',
    '変えてください',
    '',
    'それだけでも',
    '反応は変わります',
    '',
    '続きはプロフィールから👇'
  ].join('\n');
}

function buildSimpleBody(platform: Platform, input: GenerateInput): string {
  const theme = normalizeTheme(input.theme);
  const target = normalizeTarget(input.target);

  if (platform === 'TikTok') {
    return buildTiktokContent(input);
  }

  if (platform === 'X') {
    return [
      `${target}向けに言うと、${theme}で反応が出ない人は内容ではなく順番を外しています。`,
      `最初に必要なのは説明ではなく「気になる一文」です。`,
      `痛み → 失敗例 → 改善例の順にすると反応は変わりやすいです。`
    ].join('\n');
  }

  if (platform === 'note') {
    return [
      `${theme}で反応が変わる理由は、内容量ではなく見せ方にあります。`,
      `${target}に届く投稿は、最初の一文で「自分ごと」と思わせています。`,
      'そのあとに失敗例と改善例を入れることで、最後まで読まれやすくなります。'
    ].join('\n\n');
  }

  return [
    `${target}向けの${theme}投稿です。`,
    '最初の一文を強くして、離脱されにくい流れにしています。'
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
    content: buildSimpleBody(platform, input),
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
      angle: '失敗回避',
      title: `${g}が${t}でやりがちな失敗3選`,
      hook: `${t}で反応が出ない人、最初にここを間違えています。`,
      reason: '痛みベースで止まりやすい型'
    },
    {
      id: generateId(),
      angle: '比較',
      title: `伸びない投稿と伸びる投稿の違い`,
      hook: `同じ${t}でも、差は最初の一文です。`,
      reason: '比較系は最後まで読まれやすい'
    },
    {
      id: generateId(),
      angle: '即効性',
      title: `${t}で今すぐ変えるべき1つ`,
      hook: `${t}で結果を変えたいなら、最初に直すのはここです。`,
      reason: 'すぐ使える型は保存されやすい'
    }
  ];
}
