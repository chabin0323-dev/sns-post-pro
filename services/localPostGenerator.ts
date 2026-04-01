import type { GenerateInput, GeneratedPost, Platform } from '../types';

const VIDEO_PLATFORMS: Platform[] = [
  'TikTok',
  'Instagram Reels',
  'YouTube Shorts',
];

const platformRules: Record<
  Platform,
  { maxLength: number; hashtagBase: string[] }
> = {
  TikTok: { maxLength: 220, hashtagBase: ['#TikTok', '#おすすめ'] },
  'Instagram Reels': { maxLength: 240, hashtagBase: ['#リール'] },
  'YouTube Shorts': { maxLength: 260, hashtagBase: ['#shorts'] },
  'Instagram Feed': { maxLength: 300, hashtagBase: ['#インスタ'] },
  X: { maxLength: 140, hashtagBase: ['#X'] },
  note: { maxLength: 900, hashtagBase: ['#note'] },
};

const hooks = {
  strong: ['知らないと損です', 'これやってますか？'],
  soft: ['こんな悩みありませんか？'],
  emotional: ['そのままだと危険です'],
};

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

function buildVideo(input: GenerateInput, platform: Platform) {
  const hook =
    hooks[input.tiktokSettings.hookStyle][
      Math.floor(Math.random() * hooks[input.tiktokSettings.hookStyle].length)
    ];

  return `
${hook}
${input.theme}

① シンプルに伝える
② 最初で惹きつける
③ 行動を促す
`.trim();
}

function buildText(input: GenerateInput) {
  return `
テーマ：${input.theme}

・結論を先に
・共感を入れる
・具体例を出す
`.trim();
}

function applyTemplate(input: GenerateInput, body: string) {
  if (input.templateMode === 'none') return body;
  if (input.templateMode === 'start') return `${input.templateStart}\n\n${body}`;
  if (input.templateMode === 'end') return `${body}\n\n${input.templateEnd}`;
  return `${input.templateStart}\n\n${body}\n\n${input.templateEnd}`;
}

export function generateLocalPost(input: GenerateInput): GeneratedPost {
  const isVideo = VIDEO_PLATFORMS.includes(input.platform);

  const base = isVideo
    ? buildVideo(input, input.platform)
    : buildText(input);

  const content = applyTemplate(input, base);

  const hashtags = input.includeHashtags
    ? [...platformRules[input.platform].hashtagBase, `#${input.theme}`]
    : [];

  return {
    id: Date.now().toString(),
    theme: input.theme,
    platform: input.platform,
    title: `${input.theme}の投稿`,
    content: truncate(content, platformRules[input.platform].maxLength),
    hashtags,
    capcutScript: isVideo
      ? `①フック\n②悩み\n③解決\n④CTA`
      : '',
    createdAt: new Date().toISOString(),
  };
}
