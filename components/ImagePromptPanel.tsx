import React, { useState } from 'react';
import type { GeneratedPost } from '../types';
import { generateImagePrompts, type ImagePrompt } from '../services/imagePromptGenerator';

interface Props {
  post: GeneratedPost;
}

export default function ImagePromptPanel({ post }: Props) {
  const [prompts, setPrompts] = useState<ImagePrompt[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const handleGenerate = () => {
    setPrompts(generateImagePrompts(post));
  };

  const handleCopy = async (prompt: ImagePrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopiedId(prompt.id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // ignore
    }
  };

  const handleCopyAll = async () => {
    const all = prompts.map((p, i) => `[${p.label}]\n${p.prompt}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(all);
      setAllCopied(true);
      window.setTimeout(() => setAllCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  const handleOpenNanoBanana = () => {
    window.open('https://nano-banana.ai', '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ marginTop: 14 }}>
      <div
        style={{
          borderTop: '1px solid rgba(94, 126, 184, 0.2)',
          paddingTop: 14
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12
          }}
        >
          <span style={{ fontSize: 13, color: '#9fb2d7', fontWeight: 700 }}>
            ナノバナナ用 画像プロンプト
          </span>
          <span
            style={{
              fontSize: 10,
              background: 'rgba(139,92,246,0.2)',
              color: '#c4b5fd',
              borderRadius: 6,
              padding: '2px 7px',
              fontWeight: 700
            }}
          >
            CapCut 9:16
          </span>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid rgba(139,92,246,0.45)',
            background: 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(99,102,241,0.14))',
            color: '#c4b5fd',
            fontWeight: 800,
            fontSize: 14,
            cursor: 'pointer',
            marginBottom: prompts.length > 0 ? 14 : 0
          }}
        >
          ✨ 画像プロンプトを生成
        </button>

        {prompts.length > 0 && (
          <>
            <div style={{ display: 'grid', gap: 10, marginBottom: 12 }}>
              {prompts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(94,126,184,0.25)',
                    borderRadius: 12,
                    padding: '12px 14px'
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: '#8b9ac7',
                      fontWeight: 700,
                      marginBottom: 6
                    }}
                  >
                    {p.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#d0deff',
                      lineHeight: 1.7,
                      wordBreak: 'break-word',
                      fontFamily: 'monospace',
                      marginBottom: 10
                    }}
                  >
                    {p.prompt}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(p)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 8,
                      border: '1px solid rgba(94,126,184,0.3)',
                      background: copiedId === p.id
                        ? 'rgba(34,197,94,0.15)'
                        : 'rgba(255,255,255,0.05)',
                      color: copiedId === p.id ? '#86efac' : '#9fb2d7',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {copiedId === p.id ? '✓ コピーしました' : '📋 コピー'}
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                onClick={handleCopyAll}
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(94,126,184,0.35)',
                  background: allCopied
                    ? 'rgba(34,197,94,0.15)'
                    : 'rgba(255,255,255,0.05)',
                  color: allCopied ? '#86efac' : '#ffffff',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                {allCopied ? '✓ 全てコピー済み' : '📋 全てコピー'}
              </button>

              <button
                type="button"
                onClick={handleOpenNanoBanana}
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                🍌 ナノバナナで生成する
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
