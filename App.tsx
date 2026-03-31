const handleGenerate = (
  theme,
  length,
  gender,
  age,
  templateText,
  templateUrl,
  insertPosition
) => {

  const result = generateSNSPostContent(
    theme,
    length,
    gender,
    age,
    templateText,
    templateUrl,
    insertPosition
  );

  setCurrentPost(result);
};
