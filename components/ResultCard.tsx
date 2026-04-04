import React from 'react';
import type { ResultCardProps } from '../types';

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 22,
  padding: 20,
  boxShadow: '0 12px 35px rgba(0,0,0,0.18)',
  backdropFilter: 'blur(10px)'
};

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 12px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  background: 'rgba(255,255,255,0.1)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.1)'
};

export default function ResultCard({ item, onDelete, onBuildVideo }: ResultCardProps) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            <span style={pillStyle}>{item.platform}</span>
            <span style={pillStyle}>バズ度 {item.buzzScore}</span>
          </div>

          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.4 }}>
            {item.title}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', marginTop: 6 }}>
            テーマ：{item.theme} ／ ターゲット：{item.target}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          style={{
            border: 'none',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            width: 38,
            height: 38,
            borderRadius: 999,
            cursor: 'pointer',
            fontSize: 18,
            fontWeight: 800
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 16 }}>
        <div style={{ background: 'rgba(12,16,35,0.72)', borderRadius: 16, padding: 16 }}>
          <div style={{ color: '#fff', fontWeight: 900, marginBottom: 10 }}>投稿本文</div>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'inherit',
              fontSize: 14,
              lineHeight: 1.8,
              margin: 0
            }}
          >
            {item.content}
          </pre>

          {item.hashtags.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ color: '#fff', fontWeight: 900, marginBottom: 8 }}>ハッシュタグ</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {item.hashtags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      ...pillStyle,
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(236,72,153,0.35))'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: 'rgba(12,16,35,0.72)', borderRadius: 16, padding: 16 }}>
            <div style={{ color: '#fff', fontWeight: 900, marginBottom: 12 }}>バズ分析</div>

            <div style={{ display: 'grid', gap: 10 }}>
              <ScoreRow label="フック力" value={item.buzzAnalysis.hookPower} />
              <ScoreRow label="読みやすさ" value={item.buzzAnalysis.readability} />
              <ScoreRow label="興味引き" value={item.buzzAnalysis.curiosity} />
              <ScoreRow label="CV導線" value={item.buzzAnalysis.conversion} />
            </div>

            <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.86)', fontSize: 13, lineHeight: 1.7 }}>
              {item.buzzAnalysis.reason.map((r, i) => (
                <div key={i}>・{r}</div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(12,16,35,0.72)', borderRadius: 16, padding: 16 }}>
            <div style={{ color: '#fff', fontWeight: 900, marginBottom: 10 }}>販売導線CTA</div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 1.8 }}>
              {item.cta}
            </div>

            <div style={{ marginTop: 16, color: '#fff', fontWeight: 900, marginBottom: 10 }}>
              動画用サムネ文言
            </div>
            <div
              style={{
                whiteSpace: 'pre-wrap',
                color: 'rgba(255,255,255,0.9)',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: 12,
                fontWeight: 800
              }}
            >
              {item.thumbnailText}
            </div>

            <button
              type="button"
              onClick={() => onBuildVideo(item.id)}
              style={{
                marginTop: 16,
                width: '100%',
                border: 'none',
                borderRadius: 14,
                padding: '14px 16px',
                cursor: 'pointer',
                fontWeight: 900,
                color: '#fff',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)'
              }}
            >
              動画構成を確認する
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, background: 'rgba(12,16,35,0.72)', borderRadius: 16, padding: 16 }}>
        <div style={{ color: '#fff', fontWeight: 900, marginBottom: 10 }}>CapCut用構成</div>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'inherit',
            fontSize: 14,
            lineHeight: 1.7,
            margin: 0
          }}
        >
          {item.capcutScript}
        </pre>
      </div>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: 13, marginBottom: 6 }}>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div
        style={{
          width: '100%',
          height: 10,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
          }}
        />
      </div>
    </div>
  );
}
