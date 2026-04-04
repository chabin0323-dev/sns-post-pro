import type {
  GenerateInput,
  GeneratedPost,
  Platform,
  TrendIdea,
  InsertPosition,
  TiktokInsertPosition
} from '../types';

const FIXED_HASHTAGS: Record<Platform, string[]> = {
  TikTok: ['#TikTok', '#おすすめ', '#おすすめにのりたい', '#バズりたい'],
  X: ['#拡散希望', '#話題', '#注目'],
  note: ['#note', '#発信', '#コンテンツ販売'],
  Instagram: ['#Instagram', '#インスタ運用', '#投稿作成'],
  YouTube: ['#YouTube', '#動画投稿', '#ショート動画']
};

const THEME_TAGS: Record<string, string[]> = {
  恋愛: ['#恋愛', '#恋愛心理', '#好きな人'],
  告白: ['#告白', '#告白成功', '#告白初心者'],
  復縁: ['#復縁', '#復縁したい', '#復縁コツ'],
  片想い: ['#片想い', '#恋愛', '#好きな人'],
  脈あり: ['#脈あり', '#恋愛心理', '#好意'],
  脈なし: ['#脈なし', '#恋愛相談', '#逆転'],
  浮気: ['#浮気', '#恋愛', '#恋愛相談'],
  恋愛心理: ['#恋愛心理', '#恋愛', '#好きな人'],
  美容: ['#美容', '#垢抜け', '#自分磨き'],
  副業: ['#副業', '#在宅ワーク', '#お金'],
  集客: ['#集客', '#マーケティング', '#売れる導線'],
  ダイエット: ['#ダイエット', '#痩せる習慣', '#食事改善'],
  SNS運用: ['#SNS運用', '#投稿ネタ', '#バズ投稿'],
  占い: ['#占い', '#運勢', '#恋愛占い']
};

type ThemeScenario = {
  title: string;
  issue: string;
  wrong: string;
  truth: string;
  action: string;
  warning?: string;
};

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalizeTheme(theme: string): string {
  return theme.trim() || '恋愛';
}

function normalizeTarget(target: string): string {
  return target.trim() || '初心者';
}

function detectThemeKey(theme: string): string {
  const normalized = normalizeTheme(theme);
  const keys = [
    '恋愛心理',
    '脈あり',
    '脈なし',
    '片想い',
    '告白',
    '復縁',
    '浮気',
    '恋愛',
    '美容',
    '副業',
    '集客',
    'ダイエット',
    'SNS運用',
    '占い'
  ];

  for (const key of keys) {
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

function targetChars(lengthMode: GenerateInput['lengthMode'], platform: Platform): number {
  if (platform === 'TikTok') return lengthMode;
  if (platform === 'X') return Math.min(lengthMode, 500);

  if (platform === 'note') {
    if (lengthMode === 100) return 700;
    if (lengthMode === 200) return 1200;
    if (lengthMode === 300) return 1800;
    if (lengthMode === 400) return 2400;
    return 3200;
  }

  return lengthMode;
}

function trimToChars(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, Math.max(0, maxChars - 1)).trimEnd() + '…';
}

function buildThemeScenarios(themeKey: string, target: string): ThemeScenario[] {
  switch (themeKey) {
    case '恋愛':
      return [
        {
          title: 'この行動、恋愛が終わる前兆です',
          issue: '恋愛が急に冷める時は、目立つ喧嘩より「小さな雑さ」が増えていることが多いです。',
          wrong: '多くの人は大きな問題だけを見ますが、本当に危ないのは返信の雑さ、会話の短さ、優先順位の低下です。',
          truth: '恋愛が続く人は、気持ちの強さより「相手を雑に扱わないこと」を守っています。',
          action: `${target}ほど不安で詰めたくなりますが、まずは相手の変化を冷静に見て、感情ではなく事実で判断してください。`,
          warning: '違和感を我慢し続けるほど、後から一気に崩れやすいです。'
        },
        {
          title: '恋愛で結果が変わる人の共通点',
          issue: '恋愛が進む人は、好きの強さより順番を大事にしています。',
          wrong: '多くの人は早く答えを欲しがりますが、それが相手の負担になることがあります。',
          truth: '本当に大事なのは、話しやすさ、安心感、また会いたさを順番に作ることです。',
          action: `${target}ほど結果を急ぎやすいので、まずは「この人といると楽だな」と思わせる流れを作ってください。`
        }
      ];

    case '告白':
      return [
        {
          title: '告白で失敗する人の共通点',
          issue: '告白がうまくいかない人は、勇気が足りないのではなく、気持ちを伝える順番を間違えています。',
          wrong: 'いきなり重い想いを伝えると、相手は嬉しいより先に驚きや負担を感じやすいです。',
          truth: '告白前に必要なのは、安心感・会話の自然さ・一緒にいて心地いい空気です。',
          action: `${target}ほど答えを急ぎやすいので、告白の前に「この人とまた会いたい」と思わせる流れを整えてください。`
        },
        {
          title: '告白の成功率を下げるNG行動',
          issue: '成功しない人ほど、告白の瞬間だけで逆転できると思っています。',
          wrong: 'でも実際は、その前の会話や距離感でほとんど決まっています。',
          truth: '告白は勝負ではなく確認に近いです。相手が受け取りやすい空気を作れているかが重要です。',
          action: `${target}なら、まず関係を少しずつ前に進めることを優先してください。`
        }
      ];

    case '復縁':
      return [
        {
          title: '復縁したい人が最初にやるべきこと',
          issue: '復縁したい人ほど、別れた直後に気持ちを伝え直したくなります。',
          wrong: 'でも焦って連絡を重ねるほど、相手は戻るより距離を取りたくなります。',
          truth: '復縁で最初に必要なのは、説得ではなく感情を落ち着かせる時間です。',
          action: `${target}ほど不安で動きたくなりますが、まずは追わないこと、次に印象を整え直すこと、この順番が大切です。`
        },
        {
          title: '復縁でやってはいけない行動',
          issue: '復縁を遠ざけるのは、嫌われることより「重さ」です。',
          wrong: '謝りすぎる、気持ちを何度も送る、返事がないのに追う。これが一番逆効果です。',
          truth: '相手が戻りやすいのは、落ち着いた距離感と変化が見える時です。',
          action: `${target}なら、まず未練を見せすぎないことから始めてください。`
        }
      ];

    case '片想い':
      return [
        {
          title: '片想いが進まない人の特徴',
          issue: '片想いが長引く人は、相手の気持ちより先に自分の不安を見ています。',
          wrong: '返信が遅いだけで脈なしだと決めつけると、関係が育つ前に自分から崩れます。',
          truth: '片想いで大事なのは、一回の反応ではなく、関係が少しずつ深くなる流れです。',
          action: `${target}ほど答えを急ぎやすいので、まずは「会話が自然に続く関係」を作ることに集中してください。`
        }
      ];

    case '脈あり':
      return [
        {
          title: '好きな人が出している脈ありサイン',
          issue: '脈ありは言葉より先に行動に出ます。',
          wrong: '多くの人は優しい言葉だけを見ますが、実際に大事なのは行動の量です。',
          truth: '返信が続く、質問が返ってくる、会話を終わらせない。これは好意の可能性が高いサインです。',
          action: `${target}なら、言葉より行動の積み重ねを見て判断してください。`
        }
      ];

    case '脈なし':
      return [
        {
          title: '脈なしっぽい時にやってはいけないこと',
          issue: '脈なしに見える時に一番危ないのは、焦って距離を詰めることです。',
          wrong: '反応が弱い時に押すほど、相手はさらに引きやすくなります。',
          truth: '逆転したいなら、まずは一度引いて、印象を整えて、軽く接点を作り直すことです。',
          action: `${target}ほど不安で動きすぎるので、まずは追わない強さを持ってください。`
        }
      ];

    case '浮気':
      return [
        {
          title: '実はこれ、浮気のサインです',
          issue: '浮気の違和感は、派手な証拠より先に小さな変化として出ます。',
          wrong: '多くの人は決定的な証拠を探しますが、その前にスマホの扱い、返信の雑さ、予定の曖昧さに変化が出ます。',
          truth: '本当に見るべきなのは言葉ではなく行動です。優しさでごまかされるほど見抜きにくくなります。',
          action: `${target}ほど不安で見ないふりをしやすいので、違和感は放置せず、感情より事実を整理してください。`
        }
      ];

    case '恋愛心理':
      return [
        {
          title: '恋愛心理で差がつくポイント',
          issue: '恋愛は気持ちだけで動くように見えて、実は心理の流れで大きく差がつきます。',
          wrong: '好きだから伝わる、頑張れば届く、という考えだけでは相手は動きません。',
          truth: '安心する、気になる、失いたくない。この順番で感情は深まりやすいです。',
          action: `${target}に向けるなら、まず安心感を作ることを優先してください。`
        }
      ];

    default:
      return [
        {
          title: `実はこれ、${themeKey}で見落としがちな事実です`,
          issue: `${themeKey}で結果が出ない人は、内容が悪いのではなく、伝える順番で損しています。`,
          wrong: '多くの人は言いたいことを先に全部入れてしまいます。',
          truth: 'でも読まれる文章は、相手が気になることから入っています。',
          action: `${target}ほど詰め込みやすいので、まずは一文目だけ変えてください。`
        }
      ];
  }
}

function expandTikTokArticle(scenario: ThemeScenario, target: string, lengthMode: GenerateInput['lengthMode']): string {
  const lines: string[] = [
    scenario.title,
    '',
    scenario.issue,
    '',
    scenario.wrong,
    '',
    scenario.truth,
    ''
  ];

  if (scenario.warning) {
    lines.push(scenario.warning, '');
  }

  lines.push(
    scenario.action,
    '',
    '大事なのは',
    '感情だけで動かないこと',
    '',
    '順番を変えるだけで',
    '見え方はかなり変わります'
  );

  const base = lines.join('\n');
  return trimToChars(base, targetChars(lengthMode, 'TikTok'));
}

function applyPhraseToTikTok(text: string, phrase: string, position: TiktokInsertPosition): string {
  const clean = phrase.trim();
  if (!clean) return text;

  if (position === 'start') return `${clean}\n\n${text}`;
  if (position === 'end') return `${text}\n\n${clean}`;
  return `${clean}\n\n${text}\n\n${clean}`;
}

function buildNoteXInsertText(phrase: string, url: string): string {
  const lines = [phrase.trim(), url.trim()].filter(Boolean);
  return lines.join('\n');
}

function applyPhraseToText(body: string, phrase: string, url: string, position: InsertPosition): string {
  const insertText = buildNoteXInsertText(phrase, url);
  if (!insertText) return body;
  if (position === 'start') return `${insertText}\n\n${body}`;
  return `${body}\n\n${insertText}`;
}

function buildNoteBody(themeKey: string, input: GenerateInput): string {
  const target = normalizeTarget(input.target);
  const scenario = rand(buildThemeScenarios(themeKey, target));

  const paragraphs: string[] = [
    `${scenario.title}`,
    '',
    `${scenario.issue}`,
    '',
    `${scenario.wrong}`,
    '',
    `${scenario.truth}`,
    '',
    `ここで重要なのは、${themeKey}がうまくいかない理由を「気持ちが弱いから」「努力が足りないから」と考えないことです。実際には、順番や見せ方がズレているだけで、結果が変わってしまうことがとても多いです。`,
    '',
    `${target}に向けて言うなら、相手の反応を一回ごとに大きく判断するよりも、流れ全体を見る方がはるかに大事です。短いやり取り、空気感、優先順位、態度の変化。こういった細かい要素が積み重なって結果になります。`,
    '',
    `多くの人は「今すぐ答えがほしい」と思って焦ります。しかし、焦って言葉を増やすほど、相手には重く伝わりやすくなります。だからこそ、先に整えるべきなのは気持ちの量ではなく、受け取られ方です。`,
    '',
    `見られる文章も、進む関係も、共通しているのは入口の作り方です。最初に相手が気になることを見せる。次に共感させる。最後に行動の方向を示す。この流れがあるだけで、同じ内容でも反応は大きく変わります。`,
    '',
    `そして本当に差がつくのは、派手なテクニックよりも「雑に扱わないこと」です。返信の仕方、距離感、言葉の順番、そのすべてが積み重なって印象になります。`,
    '',
    `${scenario.action}`,
    '',
    `もし今まで${themeKey}で思うような結果が出ていないなら、内容を増やす前に、まず最初の一文と相手への見せ方を見直してください。それだけでも流れはかなり変わります。`
  ];

  return trimToChars(paragraphs.join('\n'), targetChars(input.lengthMode, 'note'));
}

function buildXBody(themeKey: string, input: GenerateInput): string {
  const target = normalizeTarget(input.target);
  const scenario = rand(buildThemeScenarios(themeKey, target));

  const body = [
    `${scenario.title}`,
    `${scenario.issue}`,
    `${scenario.truth}`,
    `${scenario.action}`
  ].join('\n');

  return trimToChars(body, targetChars(input.lengthMode, 'X'));
}

function buildBody(platform: Platform, input: GenerateInput): { title: string; content: string } {
  const themeKey = detectThemeKey(input.theme);
  const target = normalizeTarget(input.target);
  const scenario = rand(buildThemeScenarios(themeKey, target));

  if (platform === 'TikTok') {
    const tiktokContent = expandTikTokArticle(scenario, target, input.lengthMode);
    return {
      title: scenario.title,
      content: applyPhraseToTikTok(tiktokContent, input.tiktokPhrase, input.tiktokInsertPosition)
    };
  }

  if (platform === 'note') {
    const noteBody = buildNoteBody(themeKey, input);
    return {
      title: scenario.title,
      content: applyPhraseToText(noteBody, input.noteXPhrase, input.noteXUrl, input.noteXInsertPosition)
    };
  }

  if (platform === 'X') {
    const xBody = buildXBody(themeKey, input);
    return {
      title: scenario.title,
      content: applyPhraseToText(xBody, input.noteXPhrase, input.noteXUrl, input.noteXInsertPosition)
    };
  }

  const generic = `${scenario.title}\n\n${scenario.issue}\n\n${scenario.truth}\n\n${scenario.action}`;
  return {
    title: scenario.title,
    content: trimToChars(generic, targetChars(input.lengthMode, platform))
  };
}

function buildBuzzAnalysis(platform: Platform, input: GenerateInput, hashtags: string[]) {
  let hookPower = platform === 'TikTok' ? 94 : 80;
  let readability = input.lengthMode <= 200 ? 90 : input.lengthMode >= 500 ? 84 : 87;
  let curiosity = 90;
  let conversion = input.goal === 'sales' ? 89 : 83;

  if (input.ctaMode === 'strong') conversion += 3;
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
      'タイトルと本文を同じテーマ設計で作っています',
      'フック → 共感 → 本質 → 行動の流れで構成しています',
      '文字数設定に合わせて長さを調整しています'
    ]
  };
}

function buildSinglePost(platform: Platform, input: GenerateInput): GeneratedPost {
  const now = new Date().toISOString();
  const hashtags = buildHashtags(platform, input);
  const built = buildBody(platform, input);
  const buzzAnalysis = buildBuzzAnalysis(platform, input, hashtags);

  return {
    id: generateId(),
    platform,
    title: built.title,
    content: built.content,
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
      title: `実はこれ、${t}のサインです`,
      hook: `${t}で気づいていない人が多いポイントです。`,
      reason: 'フックが強いタイトル'
    },
    {
      id: generateId(),
      angle: '失敗回避',
      title: `${t}で失敗する人の共通点`,
      hook: `${t}で損している人は同じミスをしています。`,
      reason: '痛み訴求で反応が出やすい'
    },
    {
      id: generateId(),
      angle: '改善',
      title: `${g}向け｜${t}で結果が変わる人の特徴`,
      hook: `${t}で結果を変えたいなら最初にここを直してください。`,
      reason: 'ターゲット連動で使いやすい'
    }
  ];
}
