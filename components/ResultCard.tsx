import React from 'react';
import type { GeneratedPost } from '../types';

interface Props {
  post: GeneratedPost | null;
}

export default function ResultCard({ post }: Props) {
  if (!post) return <div>ここに結果が表示されます</div>;

  return (
    <div>
      <h2>{post.title}</h2>

      <pre>{post.content}</pre>

      <div>{post.hashtags.join(' ')}</div>

      {post.capcutScript && (
        <pre>{post.capcutScript}</pre>
      )}
    </div>
  );
}
