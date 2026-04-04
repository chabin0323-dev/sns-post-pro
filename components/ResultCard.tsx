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

export default function ResultCard({ item, onDelete }: ResultCardProps) {
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
            テーマ：{item.theme} ／ ターゲット：{item.target} ／ {item.gender}
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

      <div style={{ marginTop: 18, display: 'grid', gap: 16 }}>
        <div style={{ background: 'rgba(12,16,35,0.72)', borderRadius: 16, padding: 16 }}>
          <div style={{ color: '#fff', fontWeight: 900, marginBottom: 10 }}>投稿本文</div>
          <textarea
            readOnly
            value={item.content}
            style={{
              width: '100%',
              minHeight: 260,
              resize: 'vertical',
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.94)',
              padding: 14,
              boxSizing: 'border-box',
              fontSize: 14,
              lineHeight: 1.8,
              outline: 'none'
            }}
          />
        </div>

        {item.hashtags.length > 0 && (
          <div style={{ background: 'rgba(12,16,35,0.72)', borderRadius: 16, padding: 16 }}>
            <div style={{ color: '#fff', fontWeight: 900, marginBottom: 10 }}>ハッシュタグ</div>
            <textarea
              readOnly
              value={item.hashtags.join(' ')}
              style={{
                width: '100%',
                minHeight: 90,
                resize: 'vertical',
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.94)',
                padding: 14,
                boxSizing: 'border-box',
                fontSize: 14,
                lineHeight: 1.8,
                outline: 'none'
              }}
            />
          </div>
        )}

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
