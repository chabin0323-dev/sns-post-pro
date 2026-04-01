import React, { useEffect, useMemo, useState } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import {
  THEME_SUGGESTIONS,
  FREE_LIMIT,
  canGenerateFree,
  generateLocalPost,
  getUsageCount,
  incrementUsageCount,
} from './services/localPostGenerator';
import type { GenerateInput, GeneratedPost } from './types';

const HISTORY_KEY = 'sns_post_history';
const PREMIUM_KEY = 'sns_post_premium_enabled';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f7f7fb 0%, #f2f3f7 100%)',
  padding: '24px 16px 50px',
  boxSizing: 'border-box',
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1280,
  margin: '0 auto',
};

const heroStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #111 0%, #2b2b2b 100%)',
  color: '#fff',
  borderRadius: 28,
  padding: '28px 24px',
  boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
  marginBottom: 20,
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 20,
  padding: 20,
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  border: '1px solid #ececec',
};

const historyItemStyle: React.CSSProperties = {
  border: '1px solid #e8e8e8',
  borderRadius: 16,
  padding: 14,
  background: '#fafafa',
};

const defaultInput: GenerateInput = {
  theme: '',
  platform: 'TikTok',
  tone: 'やさしい',
  audience: '初心者',
  purpose: '保存されたい',
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
  const [form, setForm] = useState<GenerateInput>(defaultInput);
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [history, setHistory] = useState<GeneratedPost[]>([]);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [premiumEnabled, setPremiumEnabled] = useState<boolean>(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as GeneratedPost[];
        setHistory(Array.isArray(parsed) ? parsed : []);
      } catch {
        setHistory([]);
      }
    }

    setUsageCount(getUsageCount());
    setPremiumEnabled(localStorage.getItem(PREMIUM_KEY) === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const suggestions = useMemo(() => {
    return premiumEnabled
      ? THEME_SUGGESTIONS
      : THEME_SUGGESTIONS.filter((item) => !item.premium);
  }, [premiumEnabled]);

  const handleGenerate = () => {
    if (!form.theme.trim()) {
      alert('テーマを入力してください');
      return;
    }

    if (!premiumEnabled && !canGenerateFree()) {
      alert('無料版の生成回数に達しました。有料版をご利用ください。');
      return;
    }

    const post = generateLocalPost(form, premiumEnabled);
    setResult(post);
    setHistory((prev) => [post, ...prev].slice(0, 50));

    if (!premiumEnabled) {
      const next = incrementUsageCount();
      setUsageCount(next);
    }
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (result?.id === id) {
      setResult(null);
    }
  };

  const handleReuseHistory = (item: GeneratedPost) => {
    setForm((prev) => ({
      ...prev,
      theme: item.theme,
      platform: item.platform,
    }));
    setResult(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpgradeClick = () => {
    window.open('https://example.com/paid', '_blank');
  };

  const handleMockUnlock = () => {
    localStorage.setItem(PREMIUM_KEY, 'true');
    setPremiumEnabled(true);
    alert('有料版モードをONにしました。本番では決済URLに差し替えてください。');
  };

  const resetPremium = () => {
    localStorage.removeItem(PREMIUM_KEY);
    setPremiumEnabled(false);
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={heroStyle}>
          <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 10 }}>
            SNS投稿生成アプリ
          </div>

          <div style={{ fontSize: 15, lineHeight: 1.9, opacity: 0.95, maxWidth: 860 }}>
            TikTok / Instagram Reels / Instagram Feed / X / note / YouTube Shorts に対応した
            投稿文生成ツールです。APIなしで軽く動き、テンプレ挿入・履歴保存・販売向けロック導線まで入っています。
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
            <span
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.16)',
                padding: '8px 12px',
                borderRadius: 999,
                fontSize: 13,
              }}
            >
              無料版回数: {usageCount}/{FREE_LIMIT}
            </span>

            <span
              style={{
                background: premiumEnabled ? '#1d9b5f' : 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.16)',
                padding: '8px 12px',
                borderRadius: 999,
                fontSize: 13,
              }}
            >
              {premiumEnabled ? '有料版モードON' : '無料版モード'}
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 460px) minmax(0, 1fr)',
            gap: 20,
            alignItems: 'start',
          }}
        >
          <div>
            <InputForm
              value={form}
              onChange={setForm}
              onGenerate={handleGenerate}
              themeSuggestions={suggestions}
              premiumEnabled={premiumEnabled}
              usageCount={usageCount}
              freeLimit={FREE_LIMIT}
            />

            <div style={{ ...cardStyle, marginTop: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
                販売向け設定
              </div>

              <div style={{ color: '#555', lineHeight: 1.9, fontSize: 14, marginBottom: 14 }}>
                本番ではこの部分を決済導線に置き換えてください。
                <br />
                今は確認用に、有料版モードをONにできるボタンを置いています。
              </div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {!premiumEnabled ? (
                  <button
                    type="button"
                    onClick={handleMockUnlock}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 14,
                      border: 'none',
                      background: '#111',
                      color: '#fff',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    有料版モードをON
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={resetPremium}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 14,
                      border: '1px solid #ddd',
                      background: '#fff',
                      color: '#111',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    無料版に戻す
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleUpgradeClick}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 14,
                    border: '1px solid #ddd',
                    background: '#fff',
                    color: '#111',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  決済ページURLを開く
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 20 }}>
            <ResultCard
              post={result}
              premiumEnabled={premiumEnabled}
              onUpgradeClick={handleUpgradeClick}
            />

            <div style={cardStyle}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800 }}>履歴</div>

                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm('履歴をすべて削除しますか？')) return;
                      setHistory([]);
                      setResult(null);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '1px solid #ddd',
                      background: '#fff',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    履歴を全削除
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div style={{ color: '#666', lineHeight: 1.8 }}>
                  まだ履歴はありません。投稿文を生成するとここに保存されます。
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {history.map((item) => (
                    <div key={item.id} style={historyItemStyle}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 10,
                          alignItems: 'start',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                            {item.platform} / {new Date(item.createdAt).toLocaleString()}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: '#444',
                              lineHeight: 1.7,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {item.content}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteHistory(item.id)}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 999,
                            border: '1px solid #ddd',
                            background: '#fff',
                            cursor: 'pointer',
                            fontWeight: 900,
                          }}
                          title="削除"
                        >
                          ✕
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                        <button
                          type="button"
                          onClick={() => handleReuseHistory(item)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 10,
                            border: '1px solid #ddd',
                            background: '#fff',
                            cursor: 'pointer',
                            fontWeight: 700,
                          }}
                        >
                          開く
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigator.clipboard.writeText(`${item.title}\n\n${item.content}`)
                          }
                          style={{
                            padding: '8px 12px',
                            borderRadius: 10,
                            border: '1px solid #ddd',
                            background: '#fff',
                            cursor: 'pointer',
                            fontWeight: 700,
                          }}
                        >
                          コピー
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
