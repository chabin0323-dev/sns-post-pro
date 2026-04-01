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

export const generateSNSPostContent = (
  theme: string,
  length: string,
  gender: string,
  age: string,
  templateText: string,
  templateUrl: string,
  tiktokTemplateText: string,
  insertPosition: 'start' | 'end',
  tiktokInsertPosition: 'start' | 'end' | 'both'
) => {
  const hook = `【${theme}で結果が変わる人の共通点】`;

  const noteBase = `${hook}

${theme}で結果が出ない人が多い理由は、
才能ではなく「順番」にあります。

まず大切なのは、
・目的をはっきりさせる
・相手に伝わる形にする
・続けられる形に変える

この3つです。

正しい順番で整えるだけで、
伝わり方も反応も大きく変わります。`;

  const tiktokBase = `${hook}

ちょっと待ってください

${theme}で結果が出ない人
かなり多いです

でも原因は
能力不足じゃありません

足りないのは
努力じゃなくて
順番です

結果が出る人は
最初に3つだけ意識しています

1つ目
目的をはっきりさせる

2つ目
相手に伝わる形にする

3つ目
続けられる形に変える

これだけです`;

  const xBase = `${theme}で結果が出ない人ほど、努力不足ではなく「順番」で損しています。

大事なのは
・目的をはっきりさせる
・相手に伝わる形にする
・続けられる形に変える

才能より、まず伝え方です。`;

  const noteBlock =
    templateText && templateUrl
      ? `${templateText}\n${templateUrl}`
      : templateText || templateUrl;

  return {
    title: hook,
    content:
      insertPosition === 'start'
        ? `${noteBlock}\n\n${noteBase}`
        : `${noteBase}\n\n${noteBlock}`,

    capcutScript: insertBlockAdvanced(
      tiktokBase,
      tiktokTemplateText,
      tiktokInsertPosition
    ),

    xPost:
      insertPosition === 'start'
        ? `${noteBlock}\n\n${xBase}`
        : `${xBase}\n\n${noteBlock}`,
  };
};
