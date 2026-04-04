import React from 'react';
import type { GenerateInput, InputFormProps, Platform } from '../types';

const ALL_PLATFORMS: Platform[] = ['TikTok', 'X', 'note', 'Instagram', 'YouTube'];

export default function InputForm({
  value,
  onChange,
  onGenerate,
  loading,
  onGenerateTrends
}: InputFormProps) {

  const set = (key: keyof GenerateInput, val: any) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div style={{ padding: 20 }}>

      <h2>投稿テーマ</h2>
      <input
        value={value.theme}
        onChange={(e) => set('theme', e.target.value)}
        placeholder="例：恋愛"
        style={{ width: '100%', padding: 10 }}
      />

      <h3>ターゲット</h3>
      <select
        value={value.target}
        onChange={(e) => set('target', e.target.value)}
      >
        <option>初心者</option>
        <option>20代女性</option>
        <option>30代女性</option>
        <option>40代女性</option>
        <option>男性</option>
        <option>副業初心者</option>
      </select>

      <h3>性別</h3>
      <select
        value={value.gender}
        onChange={(e) => set('gender', e.target.value)}
      >
        <option value="指定なし">指定なし</option>
        <option value="男性向け">男性向け</option>
        <option value="女性向け">女性向け</option>
      </select>

      <h3>SNS</h3>
      {ALL_PLATFORMS.map((p) => (
        <button key={p} onClick={() => set('platforms', [p])}>
          {p}
        </button>
      ))}

      <br /><br />

      <button onClick={onGenerate} disabled={loading}>
        投稿を生成
      </button>

      <button onClick={onGenerateTrends}>
        トレンド生成
      </button>

    </div>
  );
}
