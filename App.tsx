import React, { useEffect, useMemo, useState } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { generatePosts, generateTrendIdeas } from './services/localPostGenerator';
import type { GenerateInput, GeneratedPost, TrendIdea } from './types';

const STORAGE_KEY = 'sns_post_generator_final_v2';
const THEME_HISTORY_KEY = 'sns_post_generator_theme_history_final_v2';
const TARGET_HISTORY_KEY = 'sns_post_generator_target_history_final_v2';

const defaultInput: GenerateInput = {
  theme: '',
  target: '初心者',
  gender: '指定なし',
  platforms: ['TikTok'],
  tone: 'strong',
  goal: 'sales',
  includeHashtags: true,
  includeFixedHashtags: true,
  hashtagMode: 'auto',
  ctaMode: 'strong',
  includeUrgency: true,
  includeOffer: true,
  lengthMode: '標準',
  noteXPhrase: '詳しくはこちら👇',
  noteXUrl: '',
  noteXInsertPosition: 'end',
  tiktokPhrase: '続きはプロフィールから👇',
  tiktokInsertPosition: 'both'
};

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f7f7fb 0%, #eef4fb 100%)',
  padding: '24px 16px 60px'
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto'
};

const darkPanel: React.CSSProperties = {
  background: 'linear-gradient(180deg, #0b1020 0%, #11182f 100%)',
  borderRadius: 24,
  padding: 20,
  boxShadow: '0 12px 35px rgba(0,0,0,0.18)'
};

export default function App() {
  const [input, setInput] = useState<GenerateInput>(defaultInput);
  const [history, setHistory] = useState<GeneratedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<TrendIdea[]>([]);
  const [themeHistory, setThemeHistory] = useState<string[]>([]);
  const [targetHistory, setTargetHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem(STORAGE_KEY);
      const rawThemeHistory = localStorage.getItem(THEME_HISTORY_KEY);
      const rawTargetHistory = localStorage.getItem(TARGET_HISTORY_KEY);

      if (rawHistory) {
        const parsed = JSON.parse(rawHistory) as GeneratedPost[];
        if (Array.isArray(parsed)) setHistory(parsed);
      }

      if (rawThemeHistory) {
        const parsed = JSON.parse(rawThemeHistory) as string[];
        if (Array.isArray(parsed)) setThemeHistory(parsed);
      }

      if (rawTargetHistory) {
        const parsed = JSON.parse(rawTargetHistory) as string[];
        if (Array.isArray(parsed)) setTargetHistory(parsed);
      }
    } catch (error) {
      console.error('load error', error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(THEME_HISTORY_KEY, JSON.stringify(themeHistory));
  }, [themeHistory]);

  useEffect(() => {
    localStorage.setItem(TARGET_HISTORY_KEY, JSON.stringify(targetHistory));
  }, [targetHistory]);

  const saveRecentValue = (value: string, prevList: string[]) => {
    const clean = value.trim();
    if (!clean) return prevList;
    return [clean, ...prevList.filter((x) => x !== clean)].slice(0, 10);
  };

  const handleGenerate = () => {
    setLoading(true);
    try {
      const posts = generatePosts(input);
      setHistory((prev) => [...posts, ...prev]);
      setThemeHistory((prev) => saveRecentValue(input.theme, prev));
      setTargetHistory((prev) => saveRecentValue(input.target, prev));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTrends = () => {
    setTrends(generateTrendIdeas(input.theme, input.target));
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyThemeSuggestion = (theme: string) => {
    setInput((prev) => ({ ...prev, theme }));
  };

  const handleApplyTargetSuggestion = (target: string) => {
    setInput((prev) => ({ ...prev, target }));
  };

  const summary = useMemo(() => {
    const total = history.length;
    const tiktokCount = history.filter((x) => x.platform === 'TikTok').length;
    const avgBuzz = total > 0
      ? Math.round(history.reduce((sum, item) => sum + item.buzzScore, 0) / total)
      : 0;

    return { total, tiktokCount, avgBuzz };
  }, [history]);

  const latestItem = history[0] ?? null;

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 34, fontWeight: 900, color: '#15233d', marginBottom: 10 }}>
            SNS投稿生成アプリ
          </div>
          <div style={{ color: '#58708f', fontSize: 15, lineHeight: 1.7 }}>
            文字数選択と各SNSの決まり文挿入機能を復活し、生成時に自動反映する版です。
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: 18,
            alignItems: 'start'
          }}
        >
          <InputForm
            value={input}
            onChange={setInput}
            onGenerate={handleGenerate}
            onGenerateTrends={handleGenerateTrends}
            loading={loading}
            themeHistory={themeHistory}
            targetHistory={targetHistory}
            onApplyThemeSuggestion={handleApplyThemeSuggestion}
            onApplyTargetSuggestion={handleApplyTargetSuggestion}
          />

          <div style={{ display: 'grid', gap: 16 }}>
            <div style={darkPanel}>
              <div style={{ color: '#fff', fontWeight: 900, marginBottom: 14 }}>ダッシュボード</div>
              <MetricCard label="累計生成" value={`${summary.total}`} />
              <MetricCard label="TikTok生成数" value={`${summary.tiktokCount}`} />
              <MetricCard label="平均バズ度" value={`${summary.avgBuzz}`} />
            </div>

            {latestItem && (
              <div style={darkPanel}>
                <div style={{ color: '#fff', fontWeight: 900, marginBottom: 10 }}>最新生成</div>
                <div style={{ color: '#fff', fontSize: 18, fontWeight: 800, lineHeight: 1.5 }}>
                  {latestItem.title}
                </div>
                <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.76)', fontSize: 13 }}>
                  {latestItem.platform} ／ バズ度 {latestItem.buzzScore} ／ {latestItem.gender}
                </div>
              </div>
            )}

            {trends.length > 0 && (
              <div style={darkPanel}>
                <div style={{ color: '#fff', fontWeight: 900, marginBottom: 12 }}>トレンド生成</div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {trends.map((trend) => (
                    <div
                      key={trend.id}
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 16,
                        padding: 14
                      }}
                    >
                      <div style={{ color: '#fff', fontWeight: 800, marginBottom: 6 }}>
                        {trend.title}
                      </div>
                      <div style={{ color: '#cfdcff', fontSize: 13, marginBottom: 6 }}>
                        Hook：{trend.hook}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
                        理由：{trend.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ color: '#15233d', fontWeight: 900, fontSize: 22, marginBottom: 14 }}>
            生成履歴
          </div>

          {history.length === 0 ? (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #d8e0ef',
                borderRadius: 20,
                padding: 18,
                color: '#5e728f'
              }}
            >
              まだ履歴がありません。上のフォームから投稿を生成してください。
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 18 }}>
              {history.map((item) => (
                <ResultCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10
      }}
    >
      <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: 13, marginBottom: 6 }}>{label}</div>
      <div style={{ color: '#fff', fontWeight: 900, fontSize: 24 }}>{value}</div>
    </div>
  );
}
