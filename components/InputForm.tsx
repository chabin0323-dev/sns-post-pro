import React, { useMemo } from 'react';
import type { GenerateInput, InputFormProps, Platform } from '../types';

const ALL_PLATFORMS: Platform[] = ['TikTok', 'X', 'note', 'Instagram', 'YouTube'];

const THEME_PRESETS = [
  '恋愛',
  '美容',
  '副業',
  '集客',
  'ダイエット',
  'SNS運用',
  '子育て',
  'スピリチュアル',
  '占い',
  'ビジネス'
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

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 20,
  padding: 20,
  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  backdropFilter: 'blur(10px)'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  marginBottom: 8,
  fontWeight: 700,
  color: '#f5f7ff'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(12,16,35,0.78)',
  color: '#fff',
  outline: 'none',
  fontSize: 14,
  boxSizing: 'border-box'
};

const buttonBase: React.CSSProperties = {
  border: 'none',
  borderRadius: 14,
  padding: '14px 18px',
  fontWeight: 800,
  cursor: 'pointer',
  fontSize: 14
};

const chipStyle: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.08)',
  color: '#fff',
  borderRadius: 999,
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700
};

const suggestionBoxStyle: React.CSSProperties = {
  marginTop: 8,
  padding: 10,
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)'
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
    const merged = [...themeHistory, ...THEME_PRESETS];
    const unique = Array.from(new Set(merged.map((x) => x.trim()).filter(Boolean)));
    const keyword = value.theme.trim();

    if (!keyword) {
      return unique.slice(0, 8);
    }

    return unique
      .filter((item) => item.toLowerCase().includes(keyword.toLowerCase()))
      .slice(0, 8);
  }, [themeHistory, value.theme]);

  const targetSuggestions = useMemo(() => {
    const merged = [...targetHistory, ...TARGET_PRESETS];
    const unique = Array.from(new Set(merged.map((x) => x.trim()).filter(Boolean)));
    const keyword = value.target.trim();

    if (!keyword) {
      return unique.slice(0, 8);
    }

    return unique
      .filter((item) => item.toLowerCase().includes(keyword.toLowerCase()))
      .slice(0, 8);
  }, [targetHistory, value.target]);

  return (
    <div style={{ ...cardStyle }}>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
          TikTok特化・SNS投稿生成
        </div>
        <div style={{ color: 'rgba(255,255,255,0.78)', fontSize: 14, lineHeight: 1.6 }}>
          バズ率とCVを意識した投稿を、APIなしロジックで即生成します。
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>投稿テーマプルダウン</label>
            <select
              style={inputStyle}
              value={THEME_PRESETS.includes(value.theme) ? value.theme : ''}
              onChange={(e) => {
                if (e.target.value) setField('theme', e.target.value);
              }}
            >
              <option value="">選択してください</option>
              {THEME_PRESETS.map((theme) => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>投稿テーマ入力</label>
            <input
              style={inputStyle}
              value={value.theme}
              onChange={(e) => setField('theme', e.target.value)}
              placeholder="例：恋愛 / 副業 / 美容 / 集客 / ダイエット"
            />
            {themeSuggestions.length > 0 && (
              <div style={suggestionBoxStyle}>
                <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 12, marginBottom: 8 }}>
                  テーマ候補
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {themeSuggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      style={chipStyle}
                      onClick={() => onApplyThemeSuggestion(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label style={labelStyle}>前回使った投稿テーマ</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {themeHistory.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>まだ履歴がありません</div>
            ) : (
              themeHistory.map((item) => (
                <button
                  key={item}
                  type="button"
                  style={chipStyle}
                  onClick={() => onApplyThemeSuggestion(item)}
                >
                  {item}
                </button>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>ターゲットプルダウン</label>
            <select
              style={inputStyle}
              value={TARGET_PRESETS.includes(value.target) ? value.target : ''}
              onChange={(e) => {
                if (e.target.value) setField('target', e.target.value);
              }}
            >
              <option value="">選択してください</option>
              {TARGET_PRESETS.map((target) => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>ターゲット入力</label>
            <input
              style={inputStyle}
              value={value.target}
              onChange={(e) => setField('target', e.target.value)}
              placeholder="例：30代女性 / 初心者 / 片想い中の人 / 個人事業主"
            />
            {targetSuggestions.length > 0 && (
              <div style={suggestionBoxStyle}>
                <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 12, marginBottom: 8 }}>
                  ターゲット候補
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {targetSuggestions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      style={chipStyle}
                      onClick={() => onApplyTargetSuggestion(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label style={labelStyle}>前回使ったターゲット</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {targetHistory.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>まだ履歴がありません</div>
            ) : (
              targetHistory.map((item) => (
                <button
                  key={item}
                  type="button"
                  style={chipStyle}
                  onClick={() => onApplyTargetSuggestion(item)}
                >
                  {item}
                </button>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>性別</label>
            <select
              style={inputStyle}
              value={value.gender}
              onChange={(e) => setField('gender', e.target.value as GenerateInput['gender'])}
            >
              <option value="指定なし">指定なし</option>
              <option value="男性向け">男性向け</option>
              <option value="女性向け">女性向け</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>文章の強さ</label>
            <select
              style={inputStyle}
              value={value.tone}
              onChange={(e) => setField('tone', e.target.value as GenerateInput['tone'])}
            >
              <option value="soft">やさしめ</option>
              <option value="normal">標準</option>
              <option value="strong">強め</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>目的</label>
            <select
              style={inputStyle}
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

        <div>
          <label style={labelStyle}>対応SNS</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {ALL_PLATFORMS.map((platform) => {
              const active = value.platforms.includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  style={{
                    ...buttonBase,
                    padding: '12px 16px',
                    background: active
                      ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                      : 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    border: active
                      ? '1px solid rgba(255,255,255,0.18)'
                      : '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {platform}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={labelStyle}>ハッシュタグ</label>
            <select
              style={inputStyle}
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
            <label style={labelStyle}>固定タグ</label>
            <select
              style={inputStyle}
              value={value.includeFixedHashtags ? 'yes' : 'no'}
              onChange={(e) => setField('includeFixedHashtags', e.target.value === 'yes')}
            >
              <option value="yes">あり</option>
              <option value="no">なし</option>
            </select>
          </div>
        </div>

        <div style={{ ...cardStyle, padding: 16 }}>
          <div style={{ fontWeight: 900, color: '#fff', marginBottom: 12 }}>CTA設定</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>CTA強度</label>
              <select
                style={inputStyle}
                value={value.ctaMode}
                onChange={(e) => setField('ctaMode', e.target.value as GenerateInput['ctaMode'])}
              >
                <option value="soft">やさしい</option>
                <option value="normal">標準</option>
                <option value="strong">強め</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>緊急性</label>
              <select
                style={inputStyle}
                value={value.includeUrgency ? 'yes' : 'no'}
                onChange={(e) => setField('includeUrgency', e.target.value === 'yes')}
              >
                <option value="yes">あり</option>
                <option value="no">なし</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>特典訴求</label>
              <select
                style={inputStyle}
                value={value.includeOffer ? 'yes' : 'no'}
                onChange={(e) => setField('includeOffer', e.target.value === 'yes')}
              >
                <option value="yes">あり</option>
                <option value="no">なし</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }}>
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            style={{
              ...buttonBase,
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
              ...buttonBase,
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              minHeight: 54,
              border: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            トレンド生成
          </button>
        </div>
      </div>
    </div>
  );
}
