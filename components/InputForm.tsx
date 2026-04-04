import React, { useMemo, useState } from 'react';
import type { GenerateInput, InputFormProps, Platform } from '../types';

const ALL_PLATFORMS: Platform[] = ['TikTok', 'X', 'note', 'Instagram', 'YouTube'];

const THEME_PRESETS = [
  '恋愛',
  '告白',
  '復縁',
  '片想い',
  '美容',
  '副業',
  '集客',
  'ダイエット',
  'SNS運用',
  '占い'
];

const TARGET_PRESETS = [
  '初心者',
  '30代女性',
  '40代女性',
  '20代男性',
  '個人事業主',
  '副業初心者',
  '片想い中の人',
  'ママ層',
  '経営者',
  '在宅ワーカー'
];

const outerCard: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(247,240,249,0.92), rgba(235,248,250,0.92))',
  border: '1px solid rgba(181, 191, 255, 0.55)',
  borderRadius: 28,
  padding: 24,
  boxShadow: '0 10px 28px rgba(69, 86, 160, 0.10)'
};

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: '#12223d',
  marginBottom: 10
};

const softInput: React.CSSProperties = {
  width: '100%',
  padding: '16px 18px',
  borderRadius: 18,
  border: '1.5px solid #bfc9ff',
  background: '#ffffff',
  color: '#16233b',
  outline: 'none',
  fontSize: 15,
  boxSizing: 'border-box'
};

const ghostChip: React.CSSProperties = {
  border: '1px solid #d1d8e6',
  background: '#ffffff',
  color: '#263b59',
  borderRadius: 999,
  padding: '10px 14px',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8
};

const actionBtn: React.CSSProperties = {
  border: 'none',
  borderRadius: 16,
  padding: '14px 18px',
  fontWeight: 800,
  cursor: 'pointer',
  fontSize: 14
};

export default function InputForm({
  value,
  onChange,
  onGenerate,
  onGenerateTrends,
  loading,
  themeHistory,
  targetHistory,
  onApplyThemeSuggestion,
  onApplyTargetSuggestion
}: InputFormProps) {
  const [themeMode, setThemeMode] = useState<'suggestion' | 'history'>('suggestion');

  const setField = <K extends keyof GenerateInput>(key: K, fieldValue: GenerateInput[K]) => {
    onChange({
      ...value,
      [key]: fieldValue
    });
  };

  const togglePlatform = (platform: Platform) => {
    const exists = value.platforms.includes(platform);
    const next = exists
      ? value.platforms.filter((p) => p !== platform)
      : [...value.platforms, platform];

    onChange({
      ...value,
      platforms: next.length > 0 ? next : ['TikTok']
    });
  };

  const themeSuggestions = useMemo(() => {
    const merged = [...THEME_PRESETS, ...themeHistory];
    const unique = Array.from(new Set(merged.map((x) => x.trim()).filter(Boolean)));
    const keyword = value.theme.trim();

    if (!keyword) return unique.slice(0, 8);

    return unique.filter((item) => item.includes(keyword)).slice(0, 8);
  }, [themeHistory, value.theme]);

  const themeHistoryList = useMemo(() => {
    return Array.from(new Set(themeHistory.map((x) => x.trim()).filter(Boolean))).slice(0, 8);
  }, [themeHistory]);

  const targetSuggestions = useMemo(() => {
    const merged = [...TARGET_PRESETS, ...targetHistory];
    const unique = Array.from(new Set(merged.map((x) => x.trim()).filter(Boolean)));
    const keyword = value.target.trim();

    if (!keyword) return unique.slice(0, 8);

    return unique.filter((item) => item.includes(keyword)).slice(0, 8);
  }, [targetHistory, value.target]);

  const visibleThemeChips = themeMode === 'suggestion' ? themeSuggestions : themeHistoryList;

  return (
    <div style={outerCard}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...sectionTitle, fontSize: 18, marginBottom: 0 }}>投稿テーマ</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div />
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            onClick={() => setThemeMode('suggestion')}
            style={{
              border: 'none',
              background: 'transparent',
              color: themeMode === 'suggestion' ? '#5b58ff' : '#6d7e99',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            提案
          </button>
          <button
            type="button"
            onClick={() => setThemeMode('history')}
            style={{
              border: 'none',
              background: 'transparent',
              color: themeMode === 'history' ? '#5b58ff' : '#6d7e99',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            履歴
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <input
            style={{ ...softInput, paddingLeft: 48 }}
            value={value.theme}
            onChange={(e) => setField('theme', e.target.value)}
            placeholder="投稿テーマを入力"
          />
          <span
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 16
            }}
          >
            ✨
          </span>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #d4dae7',
          background: 'rgba(255,255,255,0.48)',
          borderRadius: 20,
          padding: 16,
          marginBottom: 18
        }}
      >
        <div style={{ color: '#54657f', fontSize: 13, fontWeight: 800, marginBottom: 12 }}>
          ● {themeMode === 'suggestion' ? 'テーマ提案' : 'テーマ履歴'}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {visibleThemeChips.length === 0 ? (
            <div style={{ color: '#7b8ba5', fontSize: 13 }}>まだありません</div>
          ) : (
            visibleThemeChips.map((item) => (
              <button
                key={item}
                type="button"
                style={ghostChip}
                onClick={() => onApplyThemeSuggestion(item)}
              >
                {item}
                <span style={{ color: '#90a0b8' }}>×</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <div style={sectionTitle}>ターゲット</div>
          <input
            style={softInput}
            value={value.target}
            onChange={(e) => setField('target', e.target.value)}
            placeholder="ターゲットを入力"
          />
        </div>

        <div>
          <div style={sectionTitle}>ターゲット候補</div>
          <div
            style={{
              minHeight: 56,
              border: '1.5px solid #bfc9ff',
              borderRadius: 18,
              background: '#ffffff',
              padding: 10,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}
          >
            {targetSuggestions.slice(0, 4).map((item) => (
              <button
                key={item}
                type="button"
                style={{ ...ghostChip, padding: '8px 12px' }}
                onClick={() => onApplyTargetSuggestion(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <div style={sectionTitle}>性別</div>
          <select
            style={softInput}
            value={value.gender}
            onChange={(e) => setField('gender', e.target.value as GenerateInput['gender'])}
          >
            <option value="指定なし">指定なし</option>
            <option value="男性向け">男性向け</option>
            <option value="女性向け">女性向け</option>
          </select>
        </div>

        <div>
          <div style={sectionTitle}>文章の強さ</div>
          <select
            style={softInput}
            value={value.tone}
            onChange={(e) => setField('tone', e.target.value as GenerateInput['tone'])}
          >
            <option value="soft">やさしめ</option>
            <option value="normal">標準</option>
            <option value="strong">強め</option>
          </select>
        </div>

        <div>
          <div style={sectionTitle}>目的</div>
          <select
            style={softInput}
            value={value.goal}
            onChange={(e) => setField('goal', e.target.value as GenerateInput['goal'])}
          >
            <option value="engagement">反応を取る</option>
            <option value="sales">販売導線</option>
            <option value="followers">フォロワー増加</option>
            <option value="lead">保存・見込み客獲得</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={sectionTitle}>対応SNS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {ALL_PLATFORMS.map((platform) => {
            const active = value.platforms.includes(platform);
            return (
              <button
                key={platform}
                type="button"
                onClick={() => togglePlatform(platform)}
                style={{
                  ...actionBtn,
                  padding: '12px 16px',
                  background: active ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : '#ffffff',
                  color: active ? '#ffffff' : '#31445f',
                  border: active ? 'none' : '1px solid #d2dae8'
                }}
              >
                {platform}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <div style={sectionTitle}>ハッシュタグ</div>
          <select
            style={softInput}
            value={value.hashtagMode}
            onChange={(e) => {
              const mode = e.target.value as GenerateInput['hashtagMode'];
              setField('hashtagMode', mode);
              setField('includeHashtags', mode !== 'none');
            }}
          >
            <option value="auto">自動最適化あり</option>
            <option value="none">なし</option>
          </select>
        </div>

        <div>
          <div style={sectionTitle}>固定タグ</div>
          <select
            style={softInput}
            value={value.includeFixedHashtags ? 'yes' : 'no'}
            onChange={(e) => setField('includeFixedHashtags', e.target.value === 'yes')}
          >
            <option value="yes">あり</option>
            <option value="no">なし</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          style={{
            ...actionBtn,
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            color: '#fff',
            minHeight: 54
          }}
        >
          {loading ? '生成中...' : '投稿を生成する'}
        </button>

        <button
          type="button"
          onClick={onGenerateTrends}
          style={{
            ...actionBtn,
            background: '#ffffff',
            color: '#31445f',
            border: '1px solid #d2dae8',
            minHeight: 54
          }}
        >
          トレンド生成
        </button>
      </div>
    </div>
  );
}
