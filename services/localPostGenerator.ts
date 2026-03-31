const getProfileLabel = (gender: string, age: string) => {
  const safeGender = gender === '指定なし' ? '' : gender;
  const safeAge = age === '指定なし' ? '' : age;
  return `${safeAge}${safeGender}`.trim() || '幅広い層';
};

const getHashtags = (theme: string) => {
  const cleaned = theme.replace(/\s+/g, '');
  return [`#${cleaned}`, '#SNS投稿', '#発信力', '#行動改善', '#習慣化'];
};

const buildTemplateBlock = (templateText: string, templateUrl: string) => {
  const text = templateText.trim();
  const url = templateUrl.trim();

  if (!text && !url) return '';
  if (text && url) return `${text}\n${url}`;
  return text || url;
};

const insertTemplate = (
  baseText: string,
  templateText: string,
  templateUrl: string,
  insertPosition: 'start' | 'end'
) => {
  const block = buildTemplateBlock(templateText, templateUrl);
  if (!block) return baseText;

  return insertPosition === 'start'
    ? `${block}\n\n${baseText}`
    : `${baseText}\n\n${block}`;
};

export const generateSNSPostContent = (
  theme: string,
  length: string,
  gender: string,
  age: string,
  templateText: string,
  templateUrl: string,
  insertPosition: 'start' | 'end'
) => {
  const profile = getProfileLabel(gender, age);
  const hashtags = getHashtags(theme);
  const hook = `【${theme}で結果が変わる人の共通点】`;

  const noteBase = `${hook}

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

まずは
1. 目的をはっきりさせる
2. 相手に伝わる形に整える
3. 続けられるやり方に変える

この3つを意識しています。

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
伝え方の順番を整えることから始めてみてください。

${hashtags.join(' ')}`;

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

  const xBase = `${theme}で結果が出ない人ほど、努力不足ではなく「順番」で損しています。

大事なのは
・目的をはっきりさせる
・相手に伝わる形にする
・続けられる形に変える

才能より、まず伝え方。
ここを整えるだけで反応はかなり変わります。`;

  return {
    title: hook,
    content: insertTemplate(noteBase, templateText, templateUrl, insertPosition),
    capcutScript: insertTemplate(tiktokBase, templateText, templateUrl, insertPosition),
    xPost: insertTemplate(xBase, templateText, templateUrl, insertPosition),
    hashtags,
  };
};
