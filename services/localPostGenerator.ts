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

  if (position === 'both') {
    return `${block}\n\n${baseText}\n\n${block}`;
  }

  return baseText;
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

（省略：今のままでOK）`;

  const tiktokBase = `${hook}

（省略：今のままでOK）`;

  const xBase = `${theme}で結果が出ない人ほど、努力不足ではなく「順番」で損しています。`;

  const noteBlock = templateText && templateUrl
    ? `${templateText}\n${templateUrl}`
    : templateText || templateUrl;

  const tiktokBlock = tiktokTemplateText;

  return {
    title: hook,
    content:
      insertPosition === 'start'
        ? `${noteBlock}\n\n${noteBase}`
        : `${noteBase}\n\n${noteBlock}`,

    capcutScript: insertBlockAdvanced(
      tiktokBase,
      tiktokBlock,
      tiktokInsertPosition
    ),

    xPost:
      insertPosition === 'start'
        ? `${noteBlock}\n\n${xBase}`
        : `${xBase}\n\n${noteBlock}`,
  };
};
