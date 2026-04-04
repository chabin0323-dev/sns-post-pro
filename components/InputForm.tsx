import React from 'react';
import type { GenerateInput, InputFormProps, Platform } from '../types';

const ALL_PLATFORMS: Platform[] = ['TikTok', 'X', 'note', 'Instagram', 'YouTube'];

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

export default function InputForm({
  value,
  onChange,
  onGenerate,
  onGenerateTrends,
  onGenerateIdeas,
  loading
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
        <div>
          <label style={labelStyle}>投稿テーマ</label>
          <input
            style={inputStyle}
            value={value.theme}
            onChange={(e) => setField('theme', e.target.value)}
            placeholder="例：恋愛 / 副業 / 美容 / 集客 / ダイエット"
          />
        </div>

        <div>
          <label style={labelStyle}>ターゲット</label>
          <input
            style={inputStyle}
            value={value.target}
            onChange={(e) => setField('target', e.target.value)}
            placeholder="例：30代女性 / 初心者 / 片想い中の人 / 個人事業主"
          />
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

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12 }}>
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

          <button
            type="button"
            onClick={onGenerateIdeas}
            style={{
              ...buttonBase,
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              minHeight: 54,
              border: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            ネタ生成
          </button>
        </div>
      </div>
    </div>
  );
}
