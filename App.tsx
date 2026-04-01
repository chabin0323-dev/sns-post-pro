// 変更点：tiktokInsertPosition を追加

const handleGenerate = (
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

  const result = generateSNSPostContent(
    theme,
    length,
    gender,
    age,
    templateText,
    templateUrl,
    tiktokTemplateText,
    insertPosition,
    tiktokInsertPosition
  );

  setCurrentPost({
    ...result,
    theme,
    timestamp: new Date()
  });
};
