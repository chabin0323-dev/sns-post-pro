import type { GenerateInput, Platform, VideoScene } from '../types';

function buildOpeningHook(theme: string, target: string): string {
  return `${target}向け。${theme}で反応が取れない人は、この入りを変えるだけで見られ方が変わります。`;
}

function buildMiddleValue(theme: string): string {
  return `大事なのは、${theme}を説明することではなく、最初の1秒で“自分ごと”にさせることです。`;
}

function buildClosingCTA(goal: GenerateInput['goal']): string {
  switch (goal) {
    case 'sales':
      return '続きが必要な方はプロフィールのリンクから確認してください。';
    case 'followers':
      return 'こういう伸びる型をもっと見たい方はフォローしてください。';
    case 'lead':
      return '後で使う方は今のうちに保存してください。';
    default:
      return 'あなたならどう使うか、コメントで教えてください。';
  }
}

export function buildVideoScenes(
  input: GenerateInput,
  platform: Platform
): VideoScene[] {
  const opening = buildOpeningHook(input.theme, input.target);
  const middle = buildMiddleValue(input.theme);
  const closing = buildClosingCTA(input.goal);

  return [
    {
      id: 1,
      duration: '0-3秒',
      visual: '強い表情・スマホを持つ手元・ズームイン',
      telop: `${input.target}へ`,
      narration: opening
    },
    {
      id: 2,
      duration: '3-8秒',
      visual: '失敗例を画面表示',
      telop: '伸びない原因',
      narration: `多くの人は${input.theme}をただ説明してしまい、スクロールされます。`
    },
    {
      id: 3,
      duration: '8-15秒',
      visual: '改善後の型を箇条書きで表示',
      telop: '変えるべき型',
      narration: middle
    },
    {
      id: 4,
      duration: '15-22秒',
      visual: '具体例を1つ見せる',
      telop: 'すぐ使える例',
      narration: `例えば「${input.theme}で失敗する人の共通点」から入ると、最後まで見られやすいです。`
    },
    {
      id: 5,
      duration: '22-30秒',
      visual: 'プロフィール誘導・保存訴求',
      telop: '保存・確認',
      narration: closing
    }
  ];
}

export function buildVideoMeta(input: GenerateInput, platform: Platform) {
  const videoTitle =
    platform === 'TikTok'
      ? `${input.target}向け｜${input.theme}で反応を取る型`
      : `${input.theme}で反応を上げる投稿テンプレ`;

  const videoDescription = `${input.target}向けに、${input.theme}で反応を取るための短尺動画構成です。最初の3秒、失敗例、改善例、最後のCTAまで入れています。`;

  const thumbnailText =
    platform === 'TikTok'
      ? `${input.theme}\n反応が変わる`
      : `${input.theme}\n伸びる型`;

  return {
    videoTitle,
    videoDescription,
    thumbnailText
  };
}
