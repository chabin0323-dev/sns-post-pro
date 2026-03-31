export const generateSNSPostContent = (
  theme: string,
  length: string,
  gender: string,
  age: string,
  templateText: string,
  templateUrl: string,
  insertPosition: string
) => {

  const hook = `【${theme}の真実】`;

  const baseContent = `
${hook}

${theme}で結果が出ない人の共通点は
「順番を間違えていること」です。

正しくはこの3つ。

・考え方
・行動
・継続

これだけで変わります。
`.trim();

  // 🔥決まり文生成
  const templateBlock = `
${templateText}
${templateUrl}
`.trim();

  // 🔥挿入処理
  const finalContent =
    insertPosition === 'start'
      ? `${templateBlock}\n\n${baseContent}`
      : `${baseContent}\n\n${templateBlock}`;

  return {
    title: hook,
    content: finalContent,

    capcutScript: finalContent,

    xPost: `${theme}で結果が出ない理由は「順番」です。\n\n${templateUrl}`
  };
};
