import type { GenerateInput, GeneratedPost, Platform } from '../types';

const VIDEO_PLATFORMS: Platform[] = [
  'TikTok',
  'Instagram Reels',
  'YouTube Shorts',
];

const platformRules: Record<
  Platform,
  {
    maxLength: number;
    style: string;
    cta: string;
    hashtagBase: string[];
  }
> = {
  TikTok: {
    maxLength: 220,
    style: '強いフック・テンポ',
    cta: 'コメントで教えてください',
    hashtagBase: ['#TikTok', '#おすすめ'],
  },
  'Instagram Reels': {
    maxLength: 240,
    style: '共感＋保存重視',
    cta: '保存して後で見返してください',
    hashtagBase: ['#リール', '#インスタ運用'],
  },
  'YouTube Shorts': {
    maxLength: 260,
    style: '価値提示＋続き誘導',
    cta: '続きはチャンネルで',
    hashtagBase: ['#shorts', '#YouTube'],
  },
  'Instagram Feed': {
    maxLength: 600,
    style: '保存・読みやすさ重視',
    cta: '保存がおすすめです',
    hashtagBase: ['#インスタ投稿'],
  },
  X: {
    maxLength: 140,
    style: '短く刺さる',
    cta: 'いいね・保存お願いします',
    hashtagBase: ['#SNS運用'],
  },
  note: {
    maxLength: 900,
    style: '読み物',
    cta: '続きは本文で',
    hashtagBase: ['#note'],
  },
};

const hooks = {
  strong: ['知らないと損です', 'これやってませんか？'],
  soft: ['こんな悩みありませんか？'],
  emotional: ['そのままだと危険です'],
};

function buildVideoContent(input: GenerateInput, platform: Platform) {
  const hook =
    hooks[input.tiktokSettings.hookStyle][
      Math.floor(Math.random() * hooks[input.tiktokSettings.hookStyle].length)
    ];

  const base = `
${hook}
${input.theme}
今すぐできるポイント👇
① シンプルに伝える
② 最初で惹きつける
③ 行動を促す
`;

  return base.trim();
}

function buildTextContent(input: GenerateInput) {
  return `
テーマ：${input.theme}

読者：${input.audience}
目的：${input.purpose}

ポイント
・結論を先に
・共感を入れる
・具体例を出す
`.trim();
}

function applyTemplate(body: string, input: GenerateInput) {
  const s = input.templateStart;
  const e = input.templateEnd;

  if (input.templateMode === 'none') return body;
  if (input.templateMode === 'start') return `${s}\n\n${body}`;
  if (input.templateMode === 'end') return `${body}\n\n${e}`;
  return `${s}\n\n${body}\n\n${e}`;
}

export function generateLocalPost(
  input: GenerateInput,
  premium: boolean
): GeneratedPost {
  const rule = platformRules[input.platform];

  const isVideo = VIDEO_PLATFORMS.includes(input.platform);

  const content = isVideo
    ? buildVideoContent(input, input.platform)
    : buildTextContent(input);

  const finalContent = applyTemplate(content, input);

  const hashtags = input.includeHashtags
    ? [...rule.hashtagBase, `#${input.theme}`]
    : [];

  const capcutScript = isVideo
    ? `
【動画構成】
①フック
②悩み
③解決
④CTA
`.trim()
    : '';

  return {
    id: Date.now().toString(),
    theme: input.theme,
    platform: input.platform,
    title: `${input.theme}の投稿`,
    content: finalContent,
    hashtags,
    capcutScript,
    createdAt: new Date().toISOString(),
    isPremiumGenerated:
      premium &&
      (input.platform === 'YouTube Shorts' ||
        input.platform === 'note'),
  };
}
