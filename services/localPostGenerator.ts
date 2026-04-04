import type {
  BuzzAnalysis,
  GenerateInput,
  GeneratedPost,
  Platform,
  TrendIdea
} from '../types';
import { buildVideoMeta, buildVideoScenes } from './localVideoBuilder';

const FIXED_HASHTAGS: Record<Platform, string[]> = {
  TikTok: ['#TikTok', '#おすすめ', '#おすすめにのりたい', '#バズりたい'],
  X: ['#拡散希望', '#話題', '#注目'],
  note: ['#note', '#発信', '#コンテンツ販売'],
  Instagram: ['#Instagram', '#インスタ運用', '#投稿作成'],
  YouTube: ['#YouTube', '#動画投稿', '#ショート動画']
};

const TIKTOK_THEME_TAGS: Record<string, string[]> = {
  恋愛: ['#恋愛', '#恋愛心理', '#告白'],
  美容: ['#美容', '#垢抜け', '#スキンケア'],
  副業: ['#副業', '#在宅ワーク', '#お金'],
  集客: ['#集客', '#マーケティング', '#売れる導線'],
  ダイエット: ['#ダイエット', '#痩せる習慣', '#食事改善'],
  SNS: ['#SNS運用', '#投稿ネタ', '#バズ投稿'],
  子育て: ['#子育て', '#育児', '#ママ向け'],
  スピリチュアル: ['#引き寄せ', '#運気', '#スピリチュアル']
};

const PLATFORM_LABEL: Record<Platform, string> = {
  TikTok: 'TikTok',
  X: 'X',
  note: 'note',
  Instagram: 'Instagram',
  YouTube: 'YouTube'
};

const SALES_CTA = {
  soft: '気になる方はプロフィールからチェックしてください。',
  normal: '続きが気になる方はプロフィールのリンクから確認してください。',
  strong: '今すぐプロフィールのリンクから確認してください。迷っている時間がもったいないです。'
};

const FOLLOW_CTA = {
  soft: 'こういう内容をもっと見たい方はフォローしてください。',
  normal: '次も見逃したくない方は今のうちにフォローしてください。',
  strong: 'バズる型を逃したくない方は今すぐフォローしてください。'
};

const LEAD_CTA = {
  soft: '必要な方は保存して後で見返してください。',
  normal: '使う予定がある方は保存してすぐ使えるようにしておいてください。',
  strong: 'あとで探すと遅いので、今すぐ保存してください。'
};

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function findThemeTags(theme: string): string[] {
  const hit = Object.entries(TIKTOK_THEME_TAGS).find(([key]) =>
    theme.includes(key)
  );
  if (hit) return hit[1];
  return ['#発信', '#投稿アイデア', '#伸びる投稿'];
}

function normalizeTheme(theme: string) {
  return theme.trim() || '投稿テーマ';
}

function normalizeTarget(target: string) {
  return target.trim() || '初心者';
}

function buildCTA(
  goal: GenerateInput['goal'],
  ctaMode: GenerateInput['ctaMode'],
  includeUrgency: boolean,
  includeOffer: boolean
): string {
  let base = '';

  if (goal === 'sales') base = SALES_CTA[ctaMode];
  if (goal === 'followers') base = FOLLOW_CTA[ctaMode];
  if (goal === 'lead') base = LEAD_CTA[ctaMode];
  if (goal === 'engagement') {
    base =
      ctaMode === 'soft'
        ? 'あなたならどう思うか、コメントで教えてください。'
        : ctaMode === 'normal'
        ? 'あなたの意見をコメントで教えてください。'
        : '今すぐコメントで意見を書いてください。';
  }

  if (includeOffer) {
    base += ' 無料で使える型も用意しています。';
  }

  if (includeUrgency) {
    base += ' 今動く人ほど伸びやすいです。';
  }

  return base;
}

function genderText(gender: GenerateInput['gender']) {
  if (gender === '男性向け') return '男性向け';
  if (gender === '女性向け') return '女性向け';
  return '幅広い層向け';
}

function buildTitle(platform: Platform, theme: string, target: string, gender: GenerateInput['gender']) {
  const g = gender === '指定なし' ? '' : `｜${gender}`;
  switch (platform) {
    case 'TikTok':
      return `${target}向け${g}｜${theme}で反応が変わる投稿の型`;
    case 'X':
      return `${theme}で反応が取れない人へ。改善ポイントを1つだけ言います。`;
    case 'note':
      return `${theme}で伸びる発信の作り方｜${target}向け完全ガイド`;
    case 'Instagram':
      return `${theme}で見られる投稿に変えるコツ`;
    case 'YouTube':
      return `${theme}で再生されやすくなる構成を解説`;
    default:
      return `${theme}の投稿案`;
  }
}

function buildHook(
  theme: string,
  target: string,
  tone: GenerateInput['tone'],
  gender: GenerateInput['gender']
) {
  const gText = genderText(gender);

  if (tone === 'soft') {
    return `${target}の方へ。${gText}として${theme}で反応が取れないなら、まず最初の一文を変えてみてください。`;
  }
  if (tone === 'strong') {
    return `${theme}で伸びない原因は、内容ではなく“最初の1秒”です。${target}ほどここを外しています。${gText}にも刺さる見せ方が重要です。`;
  }
  return `${target}が${theme}で結果を出すなら、最初の見せ方を変えるだけで反応はかなり変わります。${gText}に届く表現を意識しましょう。`;
}

function buildBody(platform: Platform, input: GenerateInput, cta: string) {
  const theme = normalizeTheme(input.theme);
  const target = normalizeTarget(input.target);
  const hook = buildHook(theme, target, input.tone, input.gender);
  const genderLabel = genderText(input.gender);

  const commonBlocks = [
    hook,
    '',
    '伸びない投稿には共通点があります。',
    'それは「言いたいこと」から始めていることです。',
    '',
    '見られる投稿は逆です。',
    '最初に“相手が気になること”を置きます。',
    '',
    `例えば${theme}なら、`,
    '・失敗する人の共通点',
    '・知らないと損する落とし穴',
    '・今すぐ変えるべき1点',
    'このような切り口にすると、最後まで見られやすくなります。',
    '',
    `${target}向け、${genderLabel}に届きやすい言い方としては、`,
    '難しいことを言うより、',
    '「これなら自分にもできそう」と思わせる設計が重要です。',
    '',
    cta
  ];

  if (platform === 'X') {
    return [
      `${hook}`,
      `伸びない投稿の多くは「伝えたいこと」から始まります。`,
      `でも見られる投稿は「相手が気になること」から始まります。`,
      `例えば${theme}なら「失敗する人の共通点」「知らないと損する1点」から入るだけで反応は変わります。`,
      `${genderLabel}に届く言葉選びを入れるとさらに強くなります。`,
      cta
    ].join('\n');
  }

  if (platform === 'TikTok') {
    return [
      `${hook}`,
      '',
      `【伸びない理由】`,
      `伝えたいことを先に言っている`,
      '',
      `【伸びる型】`,
      `1. 痛みを先に出す`,
      `2. 失敗例を見せる`,
      `3. すぐ使える改善例を1つ出す`,
      `4. 保存 or プロフ誘導で締める`,
      '',
      `【${genderLabel}へ刺さりやすい例】`,
      `「${theme}で失敗する人、最初にここを間違えています」`,
      '',
      cta
    ].join('\n');
  }

  if (platform === 'note') {
    return [
      `${hook}`,
      '',
      `この記事では、${target}が${theme}で反応を取るための考え方を整理します。`,
      '',
      '結論から言うと、重要なのは内容量ではありません。',
      '最初のつかみ、途中の離脱防止、最後の行動導線です。',
      '',
      `さらに、${genderLabel}へ自然に届く表現に寄せるとCVも上がりやすくなります。`,
      '',
      '特に最初の一文で「自分に関係ある」と思わせることができるかどうかで、読了率もCVも変わります。',
      '',
      'この型を使うだけで、投稿の見られ方はかなり変わります。',
      '',
      cta
    ].join('\n');
  }

  return commonBlocks.join('\n');
}

function buildHashtags(platform: Platform, input: GenerateInput): string[] {
  if (!input.includeHashtags || input.hashtagMode === 'none') return [];

  const themeTags = findThemeTags(input.theme);
  const fixed = input.includeFixedHashtags ? FIXED_HASHTAGS[platform] : [];
  const genderTags =
    input.gender === '男性向け'
      ? ['#男性向け']
      : input.gender === '女性向け'
      ? ['#女性向け']
      : [];

  const raw = [...themeTags, ...genderTags, ...fixed];
  return Array.from(new Set(raw)).slice(0, platform === 'TikTok' ? 7 : 5);
}

function scoreBuzz(platform: Platform, content: string, hashtags: string[], input: GenerateInput): BuzzAnalysis {
  let hookPower = 72;
  let readability = 74;
  let curiosity = 73;
  let conversion = 70;

  if (platform === 'TikTok') {
    hookPower += 10;
    curiosity += 9;
  }

  if (input.goal === 'sales') conversion += 12;
  if (input.goal === 'followers') curiosity += 4;
  if (input.ctaMode === 'strong') conversion += 8;
  if (input.includeUrgency) conversion += 5;
  if (hashtags.length >= 4) readability += 3;
  if (content.includes('失敗')) curiosity += 4;
  if (content.includes('今すぐ')) conversion += 3;
  if (input.gender !== '指定なし') curiosity += 2;

  hookPower = Math.min(99, hookPower);
  readability = Math.min(99, readability);
  curiosity = Math.min(99, curiosity);
  conversion = Math.min(99, conversion);

  const score = Math.round((hookPower + readability + curiosity + conversion) / 4);

  const reason: string[] = [];

  if (platform === 'TikTok') reason.push('TikTok向けに冒頭3秒の引きを強めています');
  if (input.includeUrgency) reason.push('緊急性を入れて行動率を上げています');
  if (input.goal === 'sales') reason.push('販売導線を意識したCTA構成です');
  if (hashtags.length > 0) reason.push('テーマ連動ハッシュタグで発見率を補強しています');
  if (input.tone === 'strong') reason.push('スクロール停止を狙う強い言い回しを使用しています');
  if (input.gender !== '指定なし') reason.push('性別向けの訴求を足して刺さりやすさを高めています');

  return {
    score,
    hookPower,
    readability,
    curiosity,
    conversion,
    reason
  };
}

function buildCapcutScript(
  platform: Platform,
  theme: string,
  target: string,
  cta: string,
  gender: GenerateInput['gender']
) {
  return [
    `【${PLATFORM_LABEL[platform]}用ショート動画構成】`,
    `1. 冒頭3秒`,
    `${target}向け。${theme}で伸びない原因は内容ではなく入り方です。`,
    ``,
    `2. 問題提起`,
    `言いたいことから話すと飛ばされます。`,
    ``,
    `3. 改善ポイント`,
    `${genderText(gender)}に刺さる言い方を入れながら、先に痛み、次に失敗例、最後に改善例を出します。`,
    ``,
    `4. CTA`,
    `${cta}`
  ].join('\n');
}

function buildSinglePost(platform: Platform, input: GenerateInput): GeneratedPost {
  const theme = normalizeTheme(input.theme);
  const target = normalizeTarget(input.target);
  const cta = buildCTA(
    input.goal,
    input.ctaMode,
    input.includeUrgency,
    input.includeOffer
  );

  const title = buildTitle(platform, theme, target, input.gender);
  const hashtags = buildHashtags(platform, input);
  const content = buildBody(platform, input, cta);
  const buzzAnalysis = scoreBuzz(platform, content, hashtags, input);
  const capcutScript = buildCapcutScript(platform, theme, target, cta, input.gender);
  const videoScenes = buildVideoScenes(input, platform);
  const videoMeta = buildVideoMeta(input, platform);
  const now = new Date().toISOString();

  return {
    id: generateId(),
    platform,
    title,
    content,
    hashtags,
    capcutScript,
    theme,
    target,
    gender: input.gender,
    cta,
    buzzScore: buzzAnalysis.score,
    buzzAnalysis,
    createdAt: now,
    updatedAt: now,
    status: 'ready',
    videoTitle: videoMeta.videoTitle,
    videoScenes,
    videoDescription: videoMeta.videoDescription,
    thumbnailText: videoMeta.thumbnailText
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
      reason: '痛みベースでスクロール停止を狙いやすい型'
    },
    {
      id: generateId(),
      angle: '比較',
      title: `伸びない投稿と伸びる投稿の違い`,
      hook: `同じ${t}でも、伸びる人と伸びない人の差はここです。`,
      reason: '比較は最後まで見られやすく理解されやすい'
    },
    {
      id: generateId(),
      angle: '即効性',
      title: `${t}で今すぐ変えるべき1つ`,
      hook: `${t}で結果を変えたいなら、最初に直すのはここです。`,
      reason: '1点集中は保存率と実行率が高い'
    }
  ];
}

export function generateIdeaPosts(theme: string, target: string): string[] {
  const t = normalizeTheme(theme);
  const g = normalizeTarget(target);

  return [
    `${g}向け｜${t}で反応が変わる冒頭テンプレ3選`,
    `${t}で伸びない人の共通点`,
    `${t}で“保存される投稿”の作り方`,
    `${t}で売れる人が先にやっていること`,
    `${t}で最後まで見られる流れ`
  ];
}
