import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { generateLocalPost } from './services/localPostGenerator';
import type { GenerateInput, GeneratedPost } from './types';

const defaultInput: GenerateInput = {
  theme: '',
  platform: 'TikTok',
  tone: '',
  audience: '',
  purpose: '',
  templateMode: 'none',
  templateStart: '',
  templateEnd: '',
  useEmoji: true,
  includeHashtags: true,
  includeCTA: true,
  tiktokSettings: {
    hookStyle: 'strong',
    duration: '15秒',
    includeCaptionIdea: true,
  },
};

export default function App() {
  const [form, setForm] = useState(defaultInput);
  const [result, setResult] = useState<GeneratedPost | null>(null);

  const handleGenerate = () => {
    if (!form.theme) {
      alert('テーマ入力してください');
      return;
    }

    const post = generateLocalPost(form);
    setResult(post);
  };

  return (
    <div style={{ padding: 20 }}>
      <InputForm
        value={form}
        onChange={setForm}
        onGenerate={handleGenerate}
        themeSuggestions={[]}
        premiumEnabled={false}
        usageCount={0}
        freeLimit={999}
      />

      <ResultCard post={result} />
    </div>
  );
}
