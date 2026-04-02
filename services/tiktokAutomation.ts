import type {
  BuzzAnalysis,
  BuzzScene,
  BuzzScriptPack,
  GeneratedPost,
  InfiniteIdeaPack,
  PostPackage,
  ScheduleItem,
  TrendPack,
} from '../types';

const LOVE_TREND_DB = [
  '復縁', '片思い', '不倫', '既読無視', '年下彼氏', '年上彼女', '遠距離恋愛',
  '連絡頻度', '脈あり', '運命の人', 'ツインレイ', '相性診断', '誕生日占い',
  '名前相性', '彼の本音', '恋愛成就'
];

const HOOK_DB = [
  '知らないと損です',
  '実は逆です',
  'この恋、勘違いしていませんか？',
  '当てはまったら危険です',
  'これを知らないと遠回りします',
  '本音を言うと、ここが分かれ道です',
];

const STRUCTURE_DB = [
  '疑問→否定→共感→衝撃→誘導',
  '結論→理由→体験→逆転→誘導',
  'あるある→ズレ→本音→解決→誘導',
  '不安→真実→共感→希望→誘導',
];

const CTA_SET = [
  '続きはプロフィール',
  '無料占いはこちら',
];

const zodiacs = [
  '子', '丑', '寅', '卯', '辰', '巳',
  '午', '未', '申', '酉', '戌', '亥'
];

const toSeed = (input: string) =>
  input.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

const seededPick = <T,>(items: T[], seed: number, offset = 0): T =>
  items[(seed + offset) % items.length];

const generateScenes = (
  theme: string,
  hook: string,
  shockOrSolution: string,
  pullLine: string
): BuzzScene[] => [
  {
    id: 'scene-1',
    title: '疑問形タイトル',
    text: `${theme}で悩む人、実は最初に見直す場所が違います。`,
    englishKeyword: 'QUESTION',
    durationSec: 8,
  },
  {
    id: 'scene-2',
    title: '常識の否定',
    text: `頑張るほど良い、は恋愛では逆になることがあります。`,
    englishKeyword: 'DENIAL',
    durationSec: 8,
  },
  {
    id: 'scene-3',
    title: '共感ストーリー',
    text: `連絡を待って、占って、でも苦しくなる。その流れ、あなただけではありません。`,
    englishKeyword: 'EMPATHY',
    durationSec: 8,
  },
  {
    id: 'scene-4',
    title: '解決 or 衝撃',
    text: shockOrSolution,
    englishKeyword: 'SHOCK',
    durationSec: 8,
  },
  {
    id: 'scene-5',
    title: '行動誘導',
    text: pullLine,
    englishKeyword: 'CTA',
    durationSec: 8,
  },
];

export const generateTrendPack = (theme: string): TrendPack => {
  const seed = toSeed(theme);

  const trendKeywords = Array.from(
    new Set([
      theme,
      seededPick(LOVE_TREND_DB, seed, 1),
      seededPick(LOVE_TREND_DB, seed, 3),
      seededPick(LOVE_TREND_DB, seed, 5),
      seededPick(LOVE_TREND_DB, seed, 7),
    ])
  ).slice(0, 5);

  const hookPatterns = [
    seededPick(HOOK_DB, seed, 0),
    seededPick(HOOK_DB, seed, 2),
    seededPick(HOOK_DB, seed, 4),
  ];

  const structureTemplates = [
    seededPick(STRUCTURE_DB, seed, 0),
    seededPick(STRUCTURE_DB, seed, 1),
  ];

  return {
    trendKeywords,
    hookPatterns,
    structureTemplates,
    generatedTrendTitle: `${theme} × ${trendKeywords[1]}で作るトレンド風投稿`,
  };
};

export const generateBuzzScriptPack = (
  theme: string,
  autoCtaEnabled: boolean
): BuzzScriptPack => {
  const seed = toSeed(theme);

  const questionTitle = `${theme}がうまくいかない本当の理由、知っていますか？`;
  const hook = seededPick(HOOK_DB, seed, 0);
  const denial = `「待てば好転する」は${theme}では通用しないことがあります。`;
  const empathyStory = `何度も相手の気持ちを考えて、期待して、でも不安になる。その流れにハマる人は本当に多いです。`;
  const shockOrSolution = `${theme}で流れを変える人は、感情ではなくタイミングと見せ方を先に整えています。`;
  const pullLine = autoCtaEnabled
    ? `${CTA_SET[0]}。${CTA_SET[1]}。`
    : '続きは次の投稿で解説します。';

  const scenes = generateScenes(theme, hook, shockOrSolution, pullLine);

  return {
    questionTitle,
    hook,
    denial,
    empathyStory,
    shockOrSolution,
    pullLine,
    scenes,
    fullScript: [
      `【${questionTitle}】`,
      hook,
      denial,
      empathyStory,
      shockOrSolution,
      pullLine,
    ].join('\n\n'),
  };
};

export const generateInfiniteIdeaPack = (
  theme: string,
  name: string,
  birthDate: string
): InfiniteIdeaPack => {
  const safeName = name.trim() || 'あなた';
  const safeBirth = birthDate.trim() || '1990-01-01';
  const date = new Date(safeBirth);
  const zodiac = zodiacs[(date.getFullYear() - 4 + 1200) % 12];

  const fortuneSummary = `${safeName}さんは${zodiac}の気質が強く、${theme}では直感よりも“伝える順番”を整えるほど流れが上向きやすいタイプです。`;

  const loveStory = `${safeName}さんの恋は、最初は静かに進みますが、ある瞬間に一気に流れが変わる傾向があります。${theme}を題材にすると、見えない本音・すれ違い・再接近の兆しをストーリー化しやすくなります。`;

  const endlessIdeas = [
    `${theme}で相手の本音が出る瞬間`,
    `${theme}で連絡が来る前兆`,
    `${theme}でやってはいけない行動3つ`,
    `${theme}で逆転する人の共通点`,
    `${theme}と${zodiac}の恋愛傾向`,
    `${safeName}さんタイプがハマりやすい恋の罠`,
    `${theme}を占いストーリーにしたらこうなる`,
  ];

  return {
    fortuneSummary,
    loveStory,
    endlessIdeas,
  };
};

export const generateSchedulePack = (
  times: string[],
  theme: string
): ScheduleItem[] => {
  const safeTimes = times.filter(Boolean).slice(0, 5);
  return safeTimes.map((time, index) => ({
    id: `schedule-${time}-${index}`,
    label: index === 0 ? '朝' : index === 1 ? '昼' : index === 2 ? '夜' : `枠${index + 1}`,
    time,
    outputTitle: `${theme}の投稿データ`,
    status: 'ready',
  }));
};

export const buildPostPackage = (
  theme: string,
  hashtags: string[],
  autoCtaEnabled: boolean
): PostPackage => {
  const finalCta = autoCtaEnabled
    ? `${CTA_SET[0]} / ${CTA_SET[1]}`
    : '保存してあとで見返してください';

  const tiktokCaption = [
    `${theme}で悩む人へ。`,
    '最初に見直すだけで流れが変わるポイントをまとめました。',
    finalCta,
    hashtags.join(' '),
  ].join('\n');

  return {
    tiktokCaption,
    finalCta,
    hashtags,
    readyToPostText: `${tiktokCaption}\n\n#TikTok #恋愛 #占い`,
  };
};

export const analyzeBuzzFromHistory = (
  currentTheme: string,
  history: GeneratedPost[]
): BuzzAnalysis => {
  const allThemes = history
    .map((item) => item.theme?.trim())
    .filter((item): item is string => !!item);

  const allHooks = history
    .map((item) => item.buzzScript?.hook?.trim())
    .filter((item): item is string => !!item);

  const countMap = (items: string[]) =>
    [...new Set(items)].sort(
      (a, b) =>
        items.filter((item) => item === b).length -
        items.filter((item) => item === a).length
    );

  const topThemes = countMap(allThemes).slice(0, 3);
  const topHooks = countMap(allHooks).slice(0, 3);

  const strengths = [
    '疑問形タイトルを使っている',
    '恋愛系の感情ワードと具体ワードが入っている',
    '最後に行動誘導がある',
  ];

  const weakPoints = [];
  if (!/\d/.test(currentTheme)) {
    weakPoints.push('数字要素が少ない');
  }
  if (!currentTheme.includes('本音') && !currentTheme.includes('前兆')) {
    weakPoints.push('感情フックを増やせる');
  }

  let score = 72;
  if (currentTheme.includes('復縁') || currentTheme.includes('不倫') || currentTheme.includes('片思い')) score += 8;
  if (topThemes.includes(currentTheme)) score += 5;
  if (weakPoints.length === 0) score += 5;

  return {
    score: Math.min(score, 98),
    strengths,
    weakPoints,
    optimizationNext: [
      'フックに断定ワードを追加する',
      'シーン4で衝撃または逆転要素を強める',
      '最後の誘導文を短く強くする',
    ],
    topThemesFromHistory: topThemes,
    topHookPatternsFromHistory: topHooks,
  };
};
