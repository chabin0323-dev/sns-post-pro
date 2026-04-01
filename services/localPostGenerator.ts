import type {
  GenerateInput,
  GeneratedPost,
  Platform,
  ThemeSuggestion,
} from '../types';

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
    style: '短く、冒頭で惹きつける。テンポ重視。',
    cta: '続きはコメントで教えてください。',
    hashtagBase: ['#TikTok', '#おすすめ', '#投稿ネタ'],
  },
  'Instagram Reels': {
    maxLength: 240,
    style: '共感＋保存重視。TikTok流用向き。',
    cta: '保存して後で見返してください。',
    hashtagBase: ['#リール', '#InstagramReels', '#インスタ運用'],
  },
  'YouTube Shorts': {
    maxLength: 260,
    style: '価値提示＋続き誘導。',
    cta: '続きはチャンネルでチェックしてください。',
    hashtagBase: ['#shorts', '#YouTubeShorts', '#動画投稿'],
  },
  'Instagram Feed': {
    maxLength: 300,
    style: '見やすく改行。共感と保存されやすさ重視。',
    cta: 'あとで見返せるよう保存してください。',
    hashtagBase: ['#Instagram運用', '#インスタ集客', '#投稿作成'],
  },
  X: {
    maxLength: 140,
    style: '短く、刺さる一言。共感・気づき重視。',
    cta: '共感したら保存・シェアしてください。',
    hashtagBase: ['#X運用', '#SNS運用', '#発信'],
  },
  note: {
    maxLength: 900,
    style: '導入→本文→まとめを意識。読みやすさ重視。',
    cta: '続きは本文で詳しく解説します。',
    hashtagBase: ['#note', '#コンテンツ販売', '#文章術'],
  },
};

const hooks = {
  strong: ['知らないと損です。', 'これ、意外とやっていませんか？', '結論から言うと、ここが重要です。'],
  soft: ['こんな悩みはありませんか？', '今日はやさしく解説します。', '無理なく続けるコツをお伝えします。'],
  emotional: ['そのままだと、もったいないです。', '頑張っているのに届かない人へ。', '少しの工夫で反応は変わります。'],
};

export const FREE_LIMIT = 10;

export const THEME_SUGGESTIONS: ThemeSuggestion[] = [
  { id: '1', label: '初心者向けの投稿ネタ5選', category: '基本' },
  { id: '2', label: '売上につながる投稿の作り方', category: '集客' },
  { id: '3', label: '保存されやすい投稿の共通点', category: '集客' },
  { id: '4', label: 'フォロワーが増えない原因', category: '改善' },
  { id: '5', label: '毎日投稿が続かない人へ', category: '悩み' },
  { id: '6', label: '商品が自然に売れる導線', category: '販売' },
  { id: '7', label: 'プロフィールから売る設計', category: '販売', premium: true },
  { id: '8', label: 'リール・ショートで反応を取る方法', category: '動画', premium: true },
  { id: '9', label: '高単価商品向けの教育投稿', category: '販売', premium: true },
  { id: '10', label: 'ステップ導線で成約率を上げる方法', category: '販売', premium: true },
];

function truncateText(text: string, limit: number) {
  if (text.length <= limit) return text;
  return text.slice(0, Math.max(0, limit - 1)) + '…';
}

function buildTitle(theme: string, platform: Platform, purpose: string) {
  const baseMap: Record<Platform, string> = {
    TikTok: `【${theme}】見た人から変わる短尺ネタ`,
    'Instagram Reels': `【${theme}】リールで反応を取る短尺ネタ`,
    'Instagram Feed': `【${theme}】保存したくなる要点まとめ`,
    X: `【${theme}】今すぐ見直したい1ポイント`,
    note: `【${theme}】成果につながる考え方と実践法`,
    'YouTube Shorts': `【${theme}】Shortsで伝わる実践ポイント`,
  };

  if (purpose.trim()) {
    return `${baseMap[platform]}｜${purpose}`;
  }

  return baseMap[platform];
}

function buildVideoContent(input: GenerateInput, platform: Platform) {
  const hook =
    hooks[input.tiktokSettings.hookStyle][
      Math.floor(Math.random() * hooks[input.tiktokSettings.hookStyle].length)
    ];

  const platformLine =
    platform === 'TikTok'
      ? 'TikTok向けにテンポよくまとめます。'
      : platform === 'Instagram Reels'
      ? 'Instagram Reels向けに保存されやすくまとめます。'
      : 'YouTube Shorts向けに続きが気になる形でまとめます。';

  const content = [
    hook,
    `テーマは「${input.theme}」です。`,
    platformLine,
    input.audience ? `対象は${input.audience}です。` : '初心者でも実践しやすい内容です。',
    input.purpose ? `目的は${input.purpose}です。` : '反応が上がる形を意識します。',
    'ポイントは3つです。',
    '① 最初の1秒で興味を引く',
    '② 1テーマ1メッセージで伝える',
    '③ 最後に保存・コメントなどの行動を促す',
  ]
    .filter(Boolean)
    .join('\n');

  return truncateText(content, platformRules[platform].maxLength);
}

function buildTextContent(input: GenerateInput, platform: Platform) {
  const rule = platformRules[platform];
  const content =
    platform === 'note'
      ? `テーマは「${input.theme}」です。

対象は${input.audience || '初心者'}です。
目的は${input.purpose || '反応アップ'}です。
トーンは${input.tone || 'やさしい'}です。

まず大事なのは、伝えたいことを1つに絞ることです。
次に、読む人が「自分ごと」と感じる悩みを最初に置きます。
そのうえで、すぐ試せる具体策を3つほど入れると、読了率と保存率が上がりやすくなります。

最後に、次の行動が分かる一文を入れると、反応につながりやすくなります。`
      : `テーマは「${input.theme}」です。
対象は${input.audience || '初心者'}です。
目的は${input.purpose || '反応アップ'}です。
トーンは${input.tone || 'やさしい'}です。

結論を先に伝える。
共感を入れる。
すぐ試せる具体策を入れる。
最後に行動を促す。`;

  return truncateText(content, rule.maxLength);
}

function applyTemplate(
  body: string,
  mode: GenerateInput['templateMode'],
  start: string,
  end: string
) {
  const s = start.trim();
  const e = end.trim();

  if (mode === 'none') return body;
  if (mode === 'start') return [s, body].filter(Boolean).join('\n\n');
  if (mode === 'end') return [body, e].filter(Boolean).join('\n\n');
  return [s, body, e].filter(Boolean).join('\n\n');
}

function buildHashtags(input: GenerateInput) {
  if (!input.includeHashtags) return [];

  const base = platformRules[input.platform].hashtagBase;
  const themeTag = `#${input.theme.replace(/\s+/g, '')}`;
  const purposeTag = input.purpose ? `#${input.purpose.replace(/\s+/g, '')}` : null;

  return [...base, themeTag, purposeTag].filter(Boolean) as string[];
}

function buildCapcutScript(input: GenerateInput) {
  if (!VIDEO_PLATFORMS.includes(input.platform)) return '';

  const duration = input.tiktokSettings.duration;
  return [
    `【動画構成 ${duration}】`,
    '1. 0〜3秒：強いフックを表示',
    '2. 3〜8秒：悩みを提示',
    '3. 8〜20秒：解決策を3つ提示',
    '4. 最後：コメント・保存を促す',
    input.tiktokSettings.includeCaptionIdea
      ? '5. キャプション案：短く結論＋メリットを書く'
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function generateLocalPost(input: GenerateInput, premiumEnabled: boolean): GeneratedPost {
  const title = buildTitle(input.theme, input.platform, input.purpose);

  const body = VIDEO_PLATFORMS.includes(input.platform)
    ? buildVideoContent(input, input.platform)
    : buildTextContent(input, input.platform);

  const content = applyTemplate(
    body,
    input.templateMode,
    input.templateStart,
    input.templateEnd
  );

  const hashtags = buildHashtags(input);
  const capcutScript = buildCapcutScript(input);

  const isPremiumGenerated =
    premiumEnabled &&
    (input.platform === 'YouTube Shorts' ||
      input.platform === 'note' ||
      input.theme.includes('導線') ||
      input.theme.includes('高単価') ||
      input.theme.includes('成約'));

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    theme: input.theme,
    platform: input.platform,
    title,
    content,
    hashtags,
    capcutScript,
    createdAt: new Date().toISOString(),
    templateMode: input.templateMode,
    isPremiumGenerated,
  };
}

export function getUsageCount(): number {
  const raw = localStorage.getItem('sns_post_usage_count');
  return raw ? Number(raw) || 0 : 0;
}

export function incrementUsageCount() {
  const next = getUsageCount() + 1;
  localStorage.setItem('sns_post_usage_count', String(next));
  return next;
}

export function canGenerateFree(): boolean {
  return getUsageCount() < FREE_LIMIT;
}
