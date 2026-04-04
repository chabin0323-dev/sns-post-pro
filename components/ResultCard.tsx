import React, { useState } from 'react';
import type { Platform, ResultCardProps } from '../types';

const shell: React.CSSProperties = {
  background: 'linear-gradient(180deg, #071225 0%, #09172b 100%)',
  border: '1px solid rgba(94, 126, 184, 0.35)',
  borderRadius: 18,
  padding: 16,
  boxShadow: '0 10px 28px rgba(0,0,0,0.22)'
};

const inner: React.CSSProperties = {
  background: '#071120',
  border: '1px solid rgba(79, 108, 160, 0.35)',
  borderRadius: 16,
  padding: 14
};

function getCopyLabel(platform: Platform, copied: boolean) {
  if (copied) return 'コピーしました';

  if (platform === 'TikTok') return '📋 TikTokとしてコピー';
  if (platform === 'note') return '📋 noteとしてコピー';
  if (platform === 'X') return '📋 Xとしてコピー';
  if (platform === 'Instagram') return '📋 Instagramとしてコピー';
  return '📋 YouTubeとしてコピー';
}

export default function ResultCard({ item, onDelete }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = item.hashtags.length > 0
      ? `${item.content}\n\n${item.hashtags.join(' ')}`
      : item.content;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('copy failed', error);
    }
  };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ color: '#dbe8ff', fontSize: 13, fontWeight: 800 }}>
          {item.platform} ／ {item.theme} ／ {item.target}
        </div>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#9fb2d7',
            cursor: 'pointer',
            fontSize: 18,
            fontWeight: 800
          }}
        >
          ×
        </button>
      </div>

      <div style={inner}>
        <div
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: '#ffffff',
            fontSize: 14,
            lineHeight: 1.9,
            fontWeight: 700
          }}
        >
          {item.content}
        </div>

        {item.hashtags.length > 0 && (
          <div
            style={{
              marginTop: 16,
              color: '#d6e3ff',
              fontSize: 13,
              lineHeight: 1.8,
              fontWeight: 700
            }}
          >
            {item.hashtags.join(' ')}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        style={{
          width: '100%',
          marginTop: 14,
          border: '1px solid rgba(119, 145, 194, 0.35)',
          background: 'rgba(255,255,255,0.04)',
          color: '#ffffff',
          borderRadius: 12,
          padding: '14px 16px',
          fontWeight: 800,
          cursor: 'pointer'
        }}
      >
        {getCopyLabel(item.platform, copied)}
      </button>
    </div>
  );
}
