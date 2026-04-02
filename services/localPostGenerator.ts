const getProfileLabel = (gender: string, age: string) => {
  const safeGender = gender === '指定なし' ? '' : gender;
  const safeAge = age === '指定なし' ? '' : age;
  return `${safeAge}${safeGender}`.trim() || '幅広い層';
};

const cleanTagText = (text: string) =>
  text.replace(/\s+/g, '').replace(/[^\p{L}\p{N}]/gu, '');

const uniqueTags = (tags: string[], count: number) =>
  Array.from(new Set(tags)).slice(0, count);

const getNoteHashtags = (theme: string) => {
  const cleaned = cleanTagText(theme);
  return uniqueTags([
    `#${cleaned}`,
    '#恋愛',
    '#占い',
    '#恋愛占い',
    '#恋愛心理',
    '#本音',
    '#運命',
    '#引き寄せ',
  ], 5);
};

const getTikTokHashtags = (theme: string) => {
  const cleaned = cleanTagText(theme);
  return uniqueTags([
    `#${cleaned}`,
    '#TikTok',
    '#おすすめ',
    '#おすすめにのりたい',
    '#バズりたい',
    '#恋愛',
    '#恋愛占い',
    '#恋愛心理',
    '#片思い',
    '#復縁',
    '#運命の人',
    '#本音',
  ], 5);
};

const getXHashtags = (theme: string) => {
  const cleaned = cleanTagText(theme);
  return uniqueTags([
    `#${cleaned}`,
    '#恋愛',
    '#恋愛相談',
    '#恋愛心理',
    '#恋愛成就',
    '#占い',
    '#復縁',
    '#片思い',
  ], 3);
};

const getInstagramHashtags = (theme: string) => {
  const cleaned = cleanTagText(theme);
  return uniqueTags([
    `#${cleaned}`,
    '#恋愛',
    '#恋愛占い',
    '#恋愛心理',
    '#恋愛成就',
    '#片思い',
    '#復縁',
    '#本音',
    '#引き寄せ',
    '#運命の人',
    '#恋愛運',
    '#相性',
  ], 10);
};

const getYouTubeHashtags = (theme: string) => {
  const cleaned = cleanTagText(theme);
  return uniqueTags([
    `#${cleaned}`,
    '#恋愛',
    '#占い',
    '#恋愛占い',
    '#恋愛心理',
    '#復縁',
    '#片思い',
    '#相性',
  ], 5);
};

const buildTemplateBlock = (templateText: string, templateUrl: string) => {
  const text = templateText.trim();
  const url = templateUrl.trim();

  if (!text && !url) return '';
  if (text && url) return `${text}\n${url}`;
  return text || url;
};

const buildTextOnlyTemplateBlock = (templateText: string) => {
  return templateText.trim();
};

const insertBlock = (
  baseText: string,
  block: string,
  insertPosition: 'start' | 'end'
) => {
  if (!block) return baseText;

  return insertPosition === 'start'
    ? `${block}\n\n${baseText}`
    : `${baseText}\n\n${block}`;
};

const insertBlockAdvanced = (
  baseText: string,
  block: string,
  position: 'start' | 'end' | 'both'
) => {
  if (!block) return baseText;

  if (position === 'start') {
    return `${block}\n\n${baseText}`;
  }

  if (position === 'end') {
    return `${baseText}\n\n${block}`;
  }

  return `${block}\n\n${baseText}\n\n${block}`;
};

const trimByLength = (text: string, length: string) => {
  const max = length === '200文字' ? 220 : length === '500文字' ? 560 : 360;
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
};

const appendHashtags = (text: string, hashtags: string[], hashtagMode: 'あり' | 'なし') => {
  if (hashtagMode === 'なし') return text;
  if (!hashtags.length) return text;
  return `${text}\n\n${hashtags.join(' ')}`;
};

export const generateSNSPostContent = (
  theme: string,
  length: string,
  gender: string,
  age: string,
  templateText: string,
  templateUrl: string,
  tiktokTemplateText: string,
  insertPosition: 'start' | 'end',
  tiktokInsertPosition: 'start' | 'end' | 'both',
  hashtagMode: 'あり' | 'なし'
) => {
  const profile = getProfileLabel(gender, age);

  const noteHashtags = getNoteHashtags(theme);
  const tikTokHashtags = getTikTokHashtags(theme);
  const xHashtags = getXHashtags(theme);
  const instagramHashtags = getInstagramHashtags(theme);
  const youtubeHashtags = getYouTubeHashtags(theme);

  const hook = `【${theme}で結果が変わる人の共通点】`;

  const noteBase = trimByLength(`${hook}

「${theme}を頑張っているのに、思うように結果が出ない」
そんなふうに感じたことはありませんか？

特に${profile}の人ほど、
真面目に取り組むほど、
「自分のやり方が合っているのか」が分からなくなりやすいです。

でも、結果が出ない理由は才能不足ではありません。

多くの場合、
足りないのは“努力”ではなく
「順番」と「見せ方」です。

たとえば${theme}で変化を出す人は、
最初から大きく変えようとはしません。

まずは次の3つを整えています。

1. 目的をはっきりさせる
2. 相手に伝わる形に整える
3. 続けられるやり方に変える

逆に結果が止まりやすい人は、
・何となく始める
・伝えたいことを詰め込みすぎる
・続けにくい形で頑張る

この流れに入りやすいです。

大切なのは、
「もっと頑張ること」ではなく
“伝わる形”に整えることです。

今日から意識したいのはこの1つです。

「この内容は、相手が一瞬で理解できるか？」

ここを整えるだけで、
${theme}の伝わり方は大きく変わります。

最後にもう一度だけ。

${theme}で結果を変える人は、
特別な才能がある人ではありません。
“伝わる順番”を知っている人です。

まずは1回、
伝え方の順番を整えることから始めてみてください。`, length);

  const tiktokBase = `${hook}

ちょっと待ってください

${theme}を頑張ってるのに
結果が出ない人

かなり多いです

でも原因は
能力不足じゃありません

足りないのは
努力じゃなくて

順番です

結果が出る人は
最初に3つだけ
意識しています

1つ目
目的をはっきりさせる

2つ目
相手に伝わる形にする

3つ目
続けられる形に変える

この3つです

逆に止まる人は
何となく始めて

言いたいことを
詰め込みすぎて

途中で苦しくなります

だから続かない

でも安心してください

変えるべきなのは
才能じゃなくて

伝え方です

今日から意識するのは
たった1つ

一瞬で伝わるか

ここだけです

これを整えるだけで
${theme}の結果は変わります

本当に大事なのは
頑張り方より
伝わる順番です

まず1回
整えてみてください`;

  const xBase = trimByLength(`${theme}で結果が出ない人ほど、努力不足ではなく「順番」で損しています。

大事なのは
・目的をはっきりさせる
・相手に伝わる形にする
・続けられる形に変える

才能より、まず伝え方。
ここを整えるだけで反応はかなり変わります。`, length);

  const instagramBase = trimByLength(`${hook}

${theme}で結果を変えたいなら、
最初に整えるべきなのは「順番」です。

・目的をはっきりさせる
・相手に伝わる形にする
・続けられる形に変える

この3つを意識するだけで、
伝わり方も反応も大きく変わります。

がんばり方を増やすより、
まずは伝わる形を整えること。`, length);

  const youtubeBase = trimByLength(`${hook}

${theme}で結果が変わる人には共通点があります。

それは、努力量ではなく
「順番」を整えていることです。

今回のポイントは3つです。

1. 目的をはっきりさせる
2. 相手に伝わる形にする
3. 続けられる形に変える

この順番を意識するだけで、
発信の反応も結果も大きく変わります。

まずは今日、
1つだけでも見直してみてください。`, length);

  const noteBlock = buildTemplateBlock(templateText, templateUrl);
  const xBlock = buildTemplateBlock(templateText, templateUrl);
  const instagramBlock = buildTemplateBlock(templateText, templateUrl);
  const youtubeBlock = buildTemplateBlock(templateText, templateUrl);
  const tiktokBlock = buildTextOnlyTemplateBlock(tiktokTemplateText);

  const noteText = appendHashtags(
    insertBlock(noteBase, noteBlock, insertPosition),
    noteHashtags,
    hashtagMode
  );

  const tiktokText = appendHashtags(
    insertBlockAdvanced(tiktokBase, tiktokBlock, tiktokInsertPosition),
    tikTokHashtags,
    hashtagMode
  );

  const xText = appendHashtags(
    insertBlock(xBase, xBlock, insertPosition),
    xHashtags,
    hashtagMode
  );

  const instagramText = appendHashtags(
    insertBlock(instagramBase, instagramBlock, insertPosition),
    instagramHashtags,
    hashtagMode
  );

  const youtubeText = appendHashtags(
    insertBlock(youtubeBase, youtubeBlock, insertPosition),
    youtubeHashtags,
    hashtagMode
  );

  return {
    title: hook,
    content: noteText,
    capcutScript: tiktokText,
    xPost: xText,
    instagramPost: instagramText,
    youtubePost: youtubeText,
    hashtags:
      hashtagMode === 'あり'
        ? Array.from(
            new Set([
              ...noteHashtags,
              ...tikTokHashtags,
              ...xHashtags,
              ...instagramHashtags,
              ...youtubeHashtags,
            ])
          )
        : [],
  };
};
