import React, { useState } from 'react';
import { LoadingState } from '../types';

interface InputFormProps {
  onGenerate: (
    theme: string,
    length: string,
    gender: string,
    age: string,
    templateText: string,
    templateUrl: string,
    insertPosition: string
  ) => void;
  loadingState: LoadingState;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, loadingState }) => {
  const [theme, setTheme] = useState('');
  const [gender, setGender] = useState('男性');
  const [age, setAge] = useState('30代');

  // 🔥追加
  const [templateText, setTemplateText] = useState('詳しくはこちら👇');
  const [templateUrl, setTemplateUrl] = useState('https://example.com');
  const [insertPosition, setInsertPosition] = useState('end'); // start / end

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!theme.trim()) return;

    onGenerate(
      theme,
      '',
      gender,
      age,
      templateText,
      templateUrl,
      insertPosition
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <input
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="テーマ"
        className="w-full p-3 border rounded"
      />

      {/* 🔥決まり文 */}
      <input
        value={templateText}
        onChange={(e) => setTemplateText(e.target.value)}
        placeholder="決まり文"
        className="w-full p-3 border rounded"
      />

      {/* 🔥URL */}
      <input
        value={templateUrl}
        onChange={(e) => setTemplateUrl(e.target.value)}
        placeholder="URL"
        className="w-full p-3 border rounded"
      />

      {/* 🔥位置 */}
      <select
        value={insertPosition}
        onChange={(e) => setInsertPosition(e.target.value)}
        className="w-full p-3 border rounded"
      >
        <option value="start">最初に挿入</option>
        <option value="end">最後に挿入</option>
      </select>

      <button className="w-full bg-indigo-600 text-white p-3 rounded">
        生成
      </button>
    </form>
  );
};
