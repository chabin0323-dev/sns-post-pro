import React, { useMemo, useState } from 'react';
import type { GenerateInput, InputFormProps, Platform } from '../types';

const ALL_PLATFORMS: Platform[] = ['TikTok', 'X', 'note', 'Instagram', 'YouTube'];

const outerCard: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(247,240,249,0.92), rgba(235,248,250,0.92))',
  border: '1px solid rgba(181, 191, 255, 0.55)',
  borderRadius: 28,
  padding: 24
};

const softInput: React.CSSProperties = {
  width: '100%',
  padding: '16px 18px',
  borderRadius: 18,
  border: '1.5px solid #bfc9ff',
  background: '#ffffff',
  fontSize: 15
};

const chip: React.CSSProperties = {
  border: '1px solid #d1d8e6',
  background: '#fff',
  borderRadius: 999,
  padding: '10px 14px',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer'
};

function generateTitleSuggestions(theme: string): string[] {
  if (!theme) {
    return [
      'これ、9割の人が間違えています',
      '知らないと損する話',
      '実はこれが正解です'
    ];
  }

  return [
    `実はこれ、${theme}のサインです`,
    `${theme}で失敗する人の共通点`,
    `${theme}で結果が変わる人の特徴`,
    `${theme}でやってはいけない行動`,
    `${theme}で逆転する方法`,
    `${theme}がうまくいかない理由`,
    `${theme}で損している人の特徴`,
    `${theme}が一気に変わる考え方`,
    `${theme}で差がつくポイント`,
    `${theme}で見落としがちな事実`
  ];
}

export default function InputForm({
  value,
  onChange,
  onGenerate,
  loading,
  onApplyThemeSuggestion
}: InputFormProps) {
  const [mode, setMode] = useState<'suggestion' | 'history'>('suggestion');

  const suggestions = useMemo(() => {
    return generateTitleSuggestions(value.theme);
  }, [value.theme]);

  const setTheme = (v: string) => {
    onChange({ ...value, theme: v });
  };

  return (
    <div style={outerCard}>
      <h2>投稿テーマ</h2>

      <input
        style={softInput}
        value={value.theme}
        onChange={(e) => {
          setTheme(e.target.value);
          setMode('suggestion');
        }}
        placeholder="例：恋愛"
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={() => setMode('suggestion')}>提案</button>
      </div>

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {suggestions.map((s) => (
          <div
            key={s}
            style={chip}
            onClick={() => {
              setTheme(s);
              onApplyThemeSuggestion(s);
            }}
          >
            {s}
          </div>
        ))}
      </div>

      <button
        onClick={onGenerate}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: '14px',
          width: '100%',
          background: '#7c3aed',
          color: '#fff',
          borderRadius: 12,
          fontWeight: 800
        }}
      >
        投稿を生成する
      </button>
    </div>
  );
}
