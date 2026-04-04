import React, { useEffect, useMemo, useState } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { generateIdeaPosts, generatePosts, generateTrendIdeas } from './services/localPostGenerator';
import type { GenerateInput, GeneratedPost, TrendIdea } from './types';

const STORAGE_KEY = 'sns_post_generator_history_v3';
const THEME_HISTORY_KEY = 'sns_post_generator_theme_history_v3';
const TARGET_HISTORY_KEY = 'sns_post_generator_target_history_v3';

const defaultInput: GenerateInput = {
  theme: '',
  target: '',
  gender: '指定なし',
  platforms: ['TikTok'],
  tone: 'strong',
  goal: 'sales',
  includeHashtags: true,
  includeFixedHashtags: true,
  hashtagMode: 'auto',
  ctaMode: 'strong',
  includeUrgency: true,
  includeOffer: true
};

const shellStyle: React.CSSProperties = {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top left, rgba(124,58,237,0.28), transparent 30%), radial-gradient(circle at top right, rgba(236,72,153,0.22), transparent 28%), linear-gradient(180deg, #0b1020 0%, #11182f 100%)',
  padding: '24px 16px 60px'
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 1180,
  margin: '0 auto'
};

const glassStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 24,
  padding: 20,
  boxShadow: '0 12px 35px rgba(0,0,0,0.18)',
  backdropFilter: 'blur(12px)'
};

export default function App() {
  const [input, setInput] = useState<GenerateInput>(defaultInput);
  const [history, setHistory] = useState<GeneratedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<TrendIdea[]>([]);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [videoPreviewId, setVideoPreviewId] = useState<string | null>(null);
  const [themeHistory, setThemeHistory] = useState<string[]>([]);
  const [targetHistory, setTargetHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GeneratedPost[];
        if (Array.isArray(parsed)) setHistory(parsed);
      }

      const rawTheme = localStorage.getItem(THEME_HISTORY_KEY);
      if (rawTheme) {
        const parsedTheme = JSON.parse(rawTheme) as string[];
        if (Array.isArray(parsedTheme)) setThemeHistory(parsedTheme);
      }

      const rawTarget = localStorage.getItem(TARGET_HISTORY_KEY);
      if (rawTarget) {
        const parsedTarget = JSON.parse(rawTarget) as string[];
        if (Array.isArray(parsedTarget)) setTargetHistory(parsedTarget);
      }
    } catch (error) {
      console.error('load error', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('history save error', error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_HISTORY_KEY, JSON.stringify(themeHistory));
    } catch (error) {
      console.error('theme history save error', error);
    }
  }, [themeHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(TARGET_HISTORY_KEY, JSON.stringify(targetHistory));
    } catch (error) {
      console.error('target history save error', error);
    }
  }, [targetHistory]);

  const latestItem = useMemo(() => history[0] ?? null, [history]);

  const summary = useMemo(() => {
    const total = history.length;
    const tiktokCount = history.filter((x) => x.platform === 'TikTok').length;
    const avgBuzz =
      total > 0
        ? Math.round(history.reduce((sum, item) => sum + item.buzzScore, 0) / total)
        : 0;

    return { total, tiktokCount, avgBuzz };
  }, [history]);

  const saveRecentValue = (value: string, prevList: string[]) => {
    const clean = value.trim();
    if (!clean) return prevList;
    return [clean, ...prevList.filter((x) => x !== clean)].slice(0, 8);
  };

  const handleGenerate = () => {
    setLoading(true);

    try {
      const items = generatePosts(input);
      setHistory((prev) => [...items, ...prev]);
      setThemeHistory((prev) => saveRecentValue(input.theme, prev));
      setTargetHistory((prev) => saveRecentValue(input.target, prev));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTrends = () => {
    setTrends(generateTrendIdeas(input.theme, input.target));
  };

  const handleGenerateIdeas = () => {
    setIdeas(generateIdeaPosts(input.theme, input.target));
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (videoPreviewId === id) {
      setVideoPreviewId(null);
    }
  };

  const handleBuildVideo = (id: string) => {
    setVideoPreviewId(id);
  };

  const handleApplyThemeSuggestion = (theme: string) => {
    setInput((prev) => ({
      ...prev,
      theme
    }));
  };

  const handleApplyTargetSuggestion = (target: string) => {
    setInput((prev) => ({
      ...prev,
      target
    }));
  };

  const previewItem = history.find((x) => x.id === videoPreviewId) ?? null;

  return (
    <div style={shellStyle}>
      <div style={containerStyle}>
        <div style={{ marginBottom: 22, color: '#fff' }}>
          <div style={{ fontSize: 34, fontWeight: 900, marginBottom: 10 }}>
            SNS投稿生成アプリ
          </div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)', lineHeight: 1.7 }}>
            TikTok中心で、X / note / Instagram / YouTubeまで一括生成。
            バズだけでなく、保存・フォロー・販売導線まで強めています。
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr 0.75fr',
            gap: 18,
            alignItems: 'start'
          }}
        >
          <InputForm
            value={input}
            onChange={setInput}
            onGenerate={handleGenerate}
            onGenerateTrends={handleGenerateTrends}
            onGenerateIdeas={handleGenerateIdeas}
            loading={loading}
            themeHistory={themeHistory}
            targetHistory={targetHistory}
            onApplyThemeSuggestion={handleApplyThemeSuggestion}
            onApplyTargetSuggestion={handleApplyTargetSuggestion}
          />

          <div style={{ display: 'grid', gap: 16 }}>
            <div style={glassStyle}>
              <div style={{ color: '#fff', fontWeight: 900, marginBottom: 14 }}>ダッシュボード</div>

              <MetricCard label="累計生成" value={`${summary.total}`} />
              <MetricCard label="TikTok生成数" value={`${summary.tiktokCount}`} />
              <MetricCard label="平均バズ度" value={`${summary.avgBuzz}`} />

              <div
                style={{
                  marginTop: 16,
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(236,72,153,0.18))',
                  borderRadius: 18,
                  padding: 16,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div style={{ fontWeight: 900, color: '#fff', marginBottom: 8 }}>CV強化ポイント</div>
                <div style={{ color: 'rgba(255,255,255,0.84)', fontSize: 14, lineHeight: 1.8 }}>
                  ・最初の1文で痛みを出す<br />
                  ・中盤で改善策を1つだけ見せる<br />
                  ・最後に保存 or プロフ誘導を必ず入れる
                </div>
              </div>
            </div>

            {latestItem && (
              <div style={glassStyle}>
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
              <div style={glassStyle}>
                <div style={{ color: '#fff', fontWeight: 900, marginBottom: 12 }}>トレンド生成</div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {trends.map((trend) => (
                    <div
                      key={trend.id}
                      style={{
                        background: 'rgba(12,16,35,0.7)',
                        borderRadius: 16,
                        padding: 14
                      }}
                    >
                      <div style={{ color: '#fff', fontWeight: 800, marginBottom: 6 }}>
                        {trend.title}
                      </div>
                      <div style={{ color: '#f6d2ff', fontSize: 13, marginBottom: 6 }}>
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

            {ideas.length > 0 && (
              <div style={glassStyle}>
                <div style={{ color: '#fff', fontWeight: 900, marginBottom: 12 }}>提案</div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {ideas.map((idea, index) => (
                    <div
                      key={`${idea}_${index}`}
                      style={{
                        background: 'rgba(12,16,35,0.7)',
                        borderRadius: 14,
                        padding: '12px 14px',
                        color: 'rgba(255,255,255,0.88)',
                        fontSize: 14
                      }}
                    >
                      {idea}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewItem && (
              <div style={glassStyle}>
                <div style={{ color: '#fff', fontWeight: 900, marginBottom: 12 }}>動画構成プレビュー</div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
                  {previewItem.videoTitle}
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {previewItem.videoScenes.map((scene) => (
                    <div
                      key={scene.id}
                      style={{
                        background: 'rgba(12,16,35,0.72)',
                        borderRadius: 14,
                        padding: 12
                      }}
                    >
                      <div style={{ color: '#fff', fontWeight: 800 }}>
                        Scene {scene.id} / {scene.duration}
                      </div>
                      <div style={{ color: '#f6d2ff', fontSize: 13, marginTop: 4 }}>
                        テロップ：{scene.telop}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, marginTop: 4 }}>
                        映像：{scene.visual}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: 13, marginTop: 4, lineHeight: 1.7 }}>
                        ナレーション：{scene.narration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginBottom: 14 }}>
            生成履歴
          </div>

          {history.length === 0 ? (
            <div style={glassStyle}>
              <div style={{ color: 'rgba(255,255,255,0.8)' }}>
                まだ履歴がありません。上のフォームから投稿を生成してください。
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 18 }}>
              {history.map((item) => (
                <ResultCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onBuildVideo={handleBuildVideo}
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
        background: 'rgba(12,16,35,0.7)',
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
