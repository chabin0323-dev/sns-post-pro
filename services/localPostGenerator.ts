import { GenerateInput, GeneratedPost, Platform } from '../types';

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hooks(theme: string) {
  return [
    `実はこれ、${theme}のサインです`,
    `${theme}で9割が間違えてます`,
    `${theme}で損してる人の特徴`,
    `${theme}で逆転する方法`,
    `${theme}でやってはいけない行動`
  ];
}

function buildContent(theme: string) {
  const hook = rand(hooks(theme));

  const patterns = [
    [
      hook,
      '',
      'これ知らないと',
      '普通に損します',
      '',
      'ほとんどの人は',
      'ここを間違えています',
      '',
      'だから結果が出ません',
      '',
      'でも逆に',
      '',
      'ここを変えるだけで',
      '一気に変わります',
      '',
      '続きはプロフィールから👇'
    ],
    [
      hook,
      '',
      'これ気づいてますか？',
      '',
      'うまくいかない人は',
      '同じパターンです',
      '',
      '原因は能力じゃありません',
      '',
      'やり方です',
      '',
      '順番を変えるだけで',
      '全部変わります',
      '',
      '続きはプロフィールから👇'
    ]
  ];

  return rand(patterns).join('\n');
}

function buildPost(platform: Platform, input: GenerateInput): GeneratedPost {
  return {
    id: Date.now().toString(),
    platform,
    title: input.theme,
    content: buildContent(input.theme),
    hashtags: ['#おすすめ', '#バズりたい'],
    theme: input.theme,
    target: input.target,
    gender: input.gender,
    buzzScore: 90,
    buzzAnalysis: {
      score: 90,
      hookPower: 90,
      readability: 85,
      curiosity: 88,
      conversion: 87,
      reason: ['バズ構造']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'ready'
  };
}

export function generatePosts(input: GenerateInput): GeneratedPost[] {
  return input.platforms.map((p) => buildPost(p, input));
}
