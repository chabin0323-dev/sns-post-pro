
import { GoogleGenAI, Type } from "@google/genai";

export const generateSNSPostContentStream = async (
  theme: string, 
  length: string, 
  gender: string, 
  age: string,
  onUpdate: (post: any) => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents: `テーマ「${theme}」で、${age}${gender}向けのSNS投稿を作成してください。
目標文字数は「${length}」です。

【構成ルール】
1. 本文：読者の共感を得る内容。
2. 格言：最後に「💡 今日の格言」として、心に刺さる一言を添える。
3. ハッシュタグ：最後に必ず「5個」を並める。

【重要：内容の指示とフォーマット】
生成する2つのコンテンツ（snsContentとcapcutContent）は、以下のルールに従ってください。
- 内容の同一性: snsContentとcapcutContentの文章内容（本文および格言）は全く同じにする。
- SNS記事（snsContent）: 読みやすい改行。ハッシュタグは直後。
- CapCut台本（capcutContent）: 1行15文字以内、厳格に改行。ハッシュタグは1行1つずつ。

JSON形式で返却してください:
{
  "title": "タイトル",
  "snsContent": "...",
  "capcutContent": "...",
  "hashtags": ["#タグ1", "#タグ2", "#タグ3", "#タグ4", "#タグ5"]
}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          snsContent: { type: Type.STRING },
          capcutContent: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "snsContent", "capcutContent", "hashtags"]
      }
    }
  });

  let fullText = "";
  for await (const chunk of responseStream) {
    fullText += chunk.text;
    try {
      // ストリーミング中に不完全なJSONをパースしようとすると失敗するため、
      // 成功した時のみ（1文字ずつ保存の意図として）コールバックを実行
      const data = JSON.parse(fullText);
      const processed = processRawData(data);
      onUpdate(processed);
    } catch (e) {
      // 途中経過の保存（壊れたJSONでもテキストとして保存したい場合はここを調整）
    }
  }

  const finalData = JSON.parse(fullText);
  return processRawData(finalData);
};

// データの加工ロジック
const processRawData = (data: any) => {
  let cleanTitle = (data.title || '無題').trim().replace(/[！!]+$/, '');
  const titleWithExclamation = `${cleanTitle}！`;
  
  const snsFinal = `${titleWithExclamation}\n\n${data.snsContent || ''}`;
  let capcutFinal = `${titleWithExclamation}\n\n${data.capcutContent || ''}`;

  const ageMap: Record<string, string> = {
    '10代': 'じゅうだい', '20代': 'にじゅうだい', '30代': 'さんじゅうだい', '40代': 'よんじゅうだい', '50代': 'ごじゅうだい',
  };
  
  Object.entries(ageMap).forEach(([key, value]) => {
    capcutFinal = capcutFinal.split(key).join(value);
  });

  return {
    title: titleWithExclamation,
    content: snsFinal,
    hashtags: data.hashtags || [],
    capcutScript: capcutFinal
  };
};

export const getRelatedKeywords = async (theme: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `${theme}に関連する、SNSで使いやすい興味を引くキーワードを15個提案してください。JSON: {"keywords": []}`,
    config: { responseMimeType: "application/json" }
  });
  const data = JSON.parse(response.text || '{"keywords":[]}');
  return data.keywords || [];
};
