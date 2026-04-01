import React from 'react';
import type { GenerateInput, Platform, ThemeSuggestion, TemplateMode } from '../types';

interface InputFormProps {
  value: GenerateInput;
  onChange: (next: GenerateInput) => void;
  onGenerate: () => void;
  themeSuggestions: ThemeSuggestion[];
  premiumEnabled: boolean;
  usageCount: number;
  freeLimit: number;
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 20,
  padding: 20,
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  border: '1px solid #ececec',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  fontWeight: 700,
  marginBottom: 8,
  color: '#222',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid #d8d8d8',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  marginBottom: 14,
  color: '#111',
};

const platformButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: '10px 14px',
  borderRadius: 999,
  border: active ? '1px solid #111' : '1px solid #d8d8d8',
  background: active ? '#111' : '#fff',
  color: active ? '#fff' : '#111',
  fontWeight: 700,
  cursor: 'pointer',
});

const chipStyle = (premium: boolean): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 12px',
  borderRadius: 999,
  border: premium ? '1px solid #f0b429' : '1px solid #ddd',
  background: premium ? '#fff8e7' : '#f8f8f8',
  fontSize: 13,
  cursor: 'pointer',
  marginRight: 8,
  marginBottom: 8,
});

const checkboxRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  marginTop: 10,
};

function updateField<K extends keyof GenerateInput>(
  value: GenerateInput,
  key: K,
  nextValue: GenerateInput[K],
  onChange: (next: GenerateInput) => void
) {
  onChange({
    ...value,
    [key]: nextValue,
  });
}

export default function InputForm({
  value,
  onChange,
  onGenerate,
  themeSuggestions,
  premiumEnabled,
  usageCount,
  freeLimit,
}: InputFormProps) {
  const platforms: Platform[] = [
    'TikTok',
    'Instagram Reels',
    'Instagram Feed',
    'X',
    'note',
    'YouTube Shorts',
  ];

  const templateModes: { label: string; value: TemplateMode }[] = [
    { label: 'なし', value: 'none' },
    { label: '最初だけ', value: 'start' },
    { label: '最後だけ', value: 'end' },
    { label: '両方', value: 'both' },
  ];

  const isVideoPlatform =
    value.platform === 'TikTok' ||
    value.platform === 'Instagram Reels' ||
    value.platform === 'YouTube Shorts';

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={cardStyle}>
        <div style={{ ...sectionTitleStyle, marginBottom: 10 }}>投稿設定</div>

        <div style={{ marginBottom: 14 }}>
          <div style={labelStyle}>媒体</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {platforms.map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => updateField(value, 'platform', platform, onChange)}
                style={platformButtonStyle(value.platform === platform)}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>テーマ</label>
          <input
            style={inputStyle}
            value={value.theme}
            onChange={(e) => updateField(value, 'theme', e.target.value, onChange)}
            placeholder="例：売れる導線の作り方"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>トーン</label>
            <input
              style={inputStyle}
              value={value.tone}
              onChange={(e) => updateField(value, 'tone', e.target.value, onChange)}
              placeholder="例：やさしい / 熱量高め"
            />
          </div>

          <div>
            <label style={labelStyle}>対象読者</label>
            <input
              style={inputStyle}
              value={value.audience}
              onChange={(e) => updateField(value, 'audience', e.target.value, onChange)}
              placeholder="例：初心者 / 女性向け"
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={labelStyle}>目的</label>
          <input
            style={inputStyle}
            value={value.purpose}
            onChange={(e) => updateField(value, 'purpose', e.target.value, onChange)}
            placeholder="例：保存されたい / 商品販売 / フォロワー増"
          />
        </div>

        <div style={checkboxRow}>
          <label style={{ fontSize: 14 }}>
            <input
              type="checkbox"
              checked={value.useEmoji}
              onChange={(e) => updateField(value, 'useEmoji', e.target.checked, onChange)}
              style={{ marginRight: 8 }}
            />
            絵文字を入れる
          </label>

          <label style={{ fontSize: 14 }}>
            <input
              type="checkbox"
              checked={value.includeHashtags}
              onChange={(e) => updateField(value, 'includeHashtags', e.target.checked, onChange)}
              style={{ marginRight: 8 }}
            />
            ハッシュタグ生成
          </label>

          <label style={{ fontSize: 14 }}>
            <input
              type="checkbox"
              checked={value.includeCTA}
              onChange={(e) => updateField(value, 'includeCTA', e.target.checked, onChange)}
              style={{ marginRight: 8 }}
            />
            CTAを入れる
          </label>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>投稿テンプレ挿入</div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>挿入位置</label>
          <select
            style={selectStyle}
            value={value.templateMode}
            onChange={(e) =>
              updateField(value, 'templateMode', e.target.value as TemplateMode, onChange)
            }
          >
            {templateModes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>最初に入れる文章</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
            value={value.templateStart}
            onChange={(e) => updateField(value, 'templateStart', e.target.value, onChange)}
            placeholder="例：投稿を見ていただきありがとうございます。"
          />
        </div>

        <div>
          <label style={labelStyle}>最後に入れる文章</label>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
            value={value.templateEnd}
            onChange={(e) => updateField(value, 'templateEnd', e.target.value, onChange)}
            placeholder="例：気になる方はプロフィールからどうぞ。"
          />
        </div>
      </div>

      {isVideoPlatform && (
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>動画系共通設定</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>フックの強さ</label>
              <select
                style={selectStyle}
                value={value.tiktokSettings.hookStyle}
                onChange={(e) =>
                  onChange({
                    ...value,
                    tiktokSettings: {
                      ...value.tiktokSettings,
                      hookStyle: e.target.value as 'strong' | 'soft' | 'emotional',
                    },
                  })
                }
              >
                <option value="strong">強め</option>
                <option value="soft">やさしめ</option>
                <option value="emotional">感情系</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>動画尺</label>
              <select
                style={selectStyle}
                value={value.tiktokSettings.duration}
                onChange={(e) =>
                  onChange({
                    ...value,
                    tiktokSettings: {
                      ...value.tiktokSettings,
                      duration: e.target.value as '15秒' | '30秒' | '60秒',
                    },
                  })
                }
              >
                <option value="15秒">15秒</option>
                <option value="30秒">30秒</option>
                <option value="60秒">60秒</option>
              </select>
            </div>
          </div>

          <label style={{ fontSize: 14, display: 'block', marginTop: 12 }}>
            <input
              type="checkbox"
              checked={value.tiktokSettings.includeCaptionIdea}
              onChange={(e) =>
                onChange({
                  ...value,
                  tiktokSettings: {
                    ...value.tiktokSettings,
                    includeCaptionIdea: e.target.checked,
                  },
                })
              }
              style={{ marginRight: 8 }}
            />
            キャプション案も含める
          </label>

          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              background: '#f8f8f8',
              border: '1px solid #ececec',
              fontSize: 13,
              color: '#555',
              lineHeight: 1.7,
            }}
          >
            TikTok / Instagram Reels / YouTube Shorts は共通ロジックで生成されます。
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>テーマ提案</div>
        <div>
          {themeSuggestions.map((item) => {
            const locked = !!item.premium && !premiumEnabled;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (locked) return;
                  updateField(value, 'theme', item.label, onChange);
                }}
                style={{
                  ...chipStyle(!!item.premium),
                  opacity: locked ? 0.6 : 1,
                  cursor: locked ? 'not-allowed' : 'pointer',
                }}
                title={locked ? '有料版で使えるテーマです' : item.label}
              >
                <span>{item.label}</span>
                {item.premium && <span>{locked ? '🔒' : '⭐'}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          ...cardStyle,
          background: 'linear-gradient(135deg, #111, #2d2d2d)',
          color: '#fff',
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
          SNS投稿を生成する
        </div>

        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 16 }}>
          無料版使用回数：{usageCount} / {freeLimit}
        </div>

        <button
          type="button"
          onClick={onGenerate}
          style={{
            width: '100%',
            padding: '15px 18px',
            borderRadius: 14,
            border: 'none',
            background: '#fff',
            color: '#111',
            fontSize: 16,
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          投稿文を生成する
        </button>
      </div>
    </div>
  );
}
