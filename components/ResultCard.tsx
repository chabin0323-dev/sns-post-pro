import React, { useState } from 'react';
import { GeneratedPost } from '../types';

export const ResultCard: React.FC<{ post: any }> = ({ post }) => {
  const [copied, setCopied] = useState('');

  const copy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-10">

      {/* note用 */}
      <div className="bg-white p-6 rounded-2xl">
        <h2 className="font-bold mb-3">note投稿用</h2>
        <pre className="whitespace-pre-wrap">{post.content}</pre>
        <button onClick={() => copy(post.content, 'note')}>
          {copied === 'note' ? 'コピー済み' : 'コピー'}
        </button>
      </div>

      {/* TikTok */}
      <div className="bg-black text-white p-6 rounded-2xl">
        <h2 className="font-bold mb-3">TikTok台本</h2>
        <pre className="whitespace-pre-wrap">{post.capcutScript}</pre>
        <button onClick={() => copy(post.capcutScript, 'tiktok')}>
          {copied === 'tiktok' ? 'コピー済み' : 'コピー'}
        </button>
      </div>

      {/* X */}
      <div className="bg-blue-50 p-6 rounded-2xl">
        <h2 className="font-bold mb-3">X投稿</h2>
        <pre className="whitespace-pre-wrap">{post.xPost}</pre>
        <button onClick={() => copy(post.xPost, 'x')}>
          {copied === 'x' ? 'コピー済み' : 'コピー'}
        </button>
      </div>

    </div>
  );
};
