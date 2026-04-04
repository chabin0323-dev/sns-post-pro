import type { GenerateInput, GeneratedPost } from '../types';

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function hooks(theme: string) {
  return [
    `実はこれ、${theme}のサインです`,
    `${theme}で9割が間違えてます`,
    `${theme}で損してる人の特徴`,
    `${theme}で一気に変わる方法`,
    `${theme}でやってはいけない行動`
  ];
}

function buildContent(input: GenerateInput) {
  const h = rand(hooks(input.theme));

  const patterns = [

    [
      h,
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
      h,
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
    ],

    [
      h,
      '',
      '実は逆です',
      '',
      '多くの人が',
      '勘違いしています',
      '',
      'だから失敗します',
      '',
      '正しくは',
      '',
      'これを先にやること',
      '',
      '続きはプロフィールから👇'
    ]

  ];

  return rand(patterns).join('\n');
}

export function generatePosts(input: GenerateInput): GeneratedPost[] {

  return input.platforms.map((p) => {

    return {
      id: Date.now().toString(),
      platform: p,
      title: input.theme,
      content: buildContent(input),
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

  });

}
