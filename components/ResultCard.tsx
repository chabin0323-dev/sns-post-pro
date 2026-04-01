import React from 'react';
import type { GeneratedPost } from '../types';

interface ResultCardProps {
  post: GeneratedPost | null;
  premiumEnabled: boolean;
  onUpgradeClick: () => void;
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 20,
  padding: 20,
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  border: '1px solid #ececec',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  marginBottom: 14,
  color: '#111',
};

const outputBoxStyle: React.CSSProperties = {
  background: '#fafafa',
  border: '1px solid #e7e7e7',
  borderRadius: 14,
  padding: 14,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.7,
  fontSize: 14,
};

function copyText(text: string) {
  navigator.clipboard.writeText(text);
  alert('コピーしました');
}

export default function ResultCard({
  post,
  premiumEnabled,
  onUpgradeClick,
}: ResultCardProps) {
  if (!post) {
    return (
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>生成結果</div>
        <div style={{ color: '#666', lineHeight: 1.8 }}>
          ここに投稿文が表示されます。
          <br />
          左側でテーマや媒体を選んで、投稿文を生成してください。
        </div>
      </div>
    );
  }

  const showPremiumArea = premiumEnabled || post.isPremiumGenerated;

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={sectionTitleStyle}>生成結果</div>
            <div style={{ fontSize: 12, color: '#666' }}>
              {post.platform} / {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => copyText(`${post.title}\n\n${post.content}`)}
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid #ddd',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              本文をコピー
            </button>

            <button
              type="button"
              onClick={() => copyText(post.hashtags.join(' '))}
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid #ddd',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ハッシュタグをコピー
            </button>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#444' }}>タイトル</div>
          <div style={outputBoxStyle}>{post.title}</div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#444' }}>本文</div>
          <div style={outputBoxStyle}>{post.content}</div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#444' }}>ハッシュタグ</div>
          <div style={outputBoxStyle}>{post.hashtags.length ? post.hashtags.join(' ') : 'なし'}</div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>販売向けの強化エリア</div>

        {!showPremiumArea ? (
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 16,
              border: '1px solid #f1d28a',
              background: 'linear-gradient(135deg, #fff8e7, #fffdf7)',
              padding: 18,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>
              🔒 この先は有料版で解放
            </div>

            <div style={{ color: '#5d4a1f', lineHeight: 1.8, marginBottom: 16 }}>
              有料版では次が使えます。
              <br />
              ・売れる導線テンプレ
              <br />
              ・高反応CTA案
              <br />
              ・販売用の訴求文セット
              <br />
              ・TikTok/YouTube強化構成
              <br />
              ・高単価向けテーマ提案
            </div>

            <div
              style={{
                filter: 'blur(3px)',
                opacity: 0.8,
                background: '#fff',
                borderRadius: 14,
                border: '1px solid #eee',
                padding: 14,
                marginBottom: 16,
                userSelect: 'none',
              }}
            >
              【限定】購入率を高める本文テンプレ
              {'\n'}1. 共感
              {'\n'}2. 悩みの明確化
              {'\n'}3. 解決策
              {'\n'}4. 実績・信頼
              {'\n'}5. CTA
            </div>

            <button
              type="button"
              onClick={onUpgradeClick}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 14,
                border: 'none',
                background: '#111',
                color: '#fff',
                fontWeight: 800,
                cursor: 'pointer',
                fontSize: 15,
              }}
            >
              有料版を確認する
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 12, color: '#444', lineHeight: 1.8 }}>
              有料版向けの販売補助テンプレです。
            </div>

            <div style={outputBoxStyle}>
              【売れる導線テンプレ】
              {'\n\n'}1. 読者の悩みを1文で提示する
              {'\n'}2. 放置するデメリットを入れる
              {'\n'}3. 解決できる理由を具体的に書く
              {'\n'}4. 商品・サービスの価値を短く伝える
              {'\n'}5. 「今見る理由」を最後に入れる
            </div>

            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                onClick={() =>
                  copyText(
                    `【売れる導線テンプレ】\n\n1. 読者の悩みを1文で提示する\n2. 放置するデメリットを入れる\n3. 解決できる理由を具体的に書く\n4. 商品・サービスの価値を短く伝える\n5. 「今見る理由」を最後に入れる`
                  )
                }
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: '1px solid #ddd',
                  background: '#fff',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                販売テンプレをコピー
              </button>
            </div>
          </div>
        )}
      </div>

      {post.capcutScript && (
        <div style={cardStyle}>
          <div style={sectionTitleStyle}>動画構成</div>
          <div style={outputBoxStyle}>{post.capcutScript}</div>
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={() => copyText(post.capcutScript)}
              style={{
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid #ddd',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              構成をコピー
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
