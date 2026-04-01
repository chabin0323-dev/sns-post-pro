import React, { useState } from 'react';
import {
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

type ResultPost = {
  title?: string;
  content: string;
  capcutScript: string;
  xPost: string;
  instagramPost: string;
  youtubePost: string;
  hashtags?: string[];
};

type ChannelBlock = {
  labels: string[];
  text: string;
  theme: 'light' | 'dark' | 'sky' | 'pink' | 'red';
};

const normalizeText = (text: string) => text.trim();

const groupChannels = (post: ResultPost): ChannelBlock[] => {
  const source = [
    { label: 'note', text: post.content, theme: 'light' as const },
    { label: 'TikTok', text: post.capcutScript, theme: 'dark' as const },
    { label: 'X', text: post.xPost, theme: 'sky' as const },
    { label: 'Instagram', text: post.instagramPost, theme: 'pink' as const },
    { label: 'YouTube', text: post.youtubePost, theme: 'red' as const }
  ];

  const grouped = new Map<string, ChannelBlock>();

  source.forEach((item) => {
    const key = normalizeText(item.text);
    if (grouped.has(key)) {
      grouped.get(key)!.labels.push(item.label);
    } else {
      grouped.set(key, {
        labels: [item.label],
        text: item.text,
        theme: item.theme
      });
    }
  });

  return Array.from(grouped.values());
};

const themeClassMap = {
  light: {
    wrap: 'bg-white border-slate-100',
    badge: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    text: 'text-slate-700 bg-slate-50/40 border-slate-100',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
  },
  dark: {
    wrap: 'bg-slate-900 border-slate-800',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/20',
    text: 'text-cyan-50 bg-slate-950/50 border-slate-800',
    button: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
  },
  sky: {
    wrap: 'bg-sky-50 border-sky-100',
    badge: 'bg-white text-sky-600 border-sky-100',
    text: 'text-slate-700 bg-white/70 border-sky-100',
    button: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-200'
  },
  pink: {
    wrap: 'bg-pink-50 border-pink-100',
    badge: 'bg-white text-pink-600 border-pink-100',
    text: 'text-slate-700 bg-white/70 border-pink-100',
    button: 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200'
  },
  red: {
    wrap: 'bg-red-50 border-red-100',
    badge: 'bg-white text-red-600 border-red-100',
    text: 'text-slate-700 bg-white/70 border-red-100',
    button: 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
  }
};

export const ResultCard: React.FC<{ post: ResultPost }> = ({ post }) => {
  const [copiedKey, setCopiedKey] = useState('');
  const groupedBlocks = groupChannels(post);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      {groupedBlocks.map((block, index) => {
        const themeClasses = themeClassMap[block.theme];
        const copyKey = `${block.labels.join('-')}-${index}`;

        return (
          <div
            key={copyKey}
            className={`rounded-[40px] shadow-2xl overflow-hidden border ${themeClasses.wrap}`}
          >
            <div className="p-8 md:p-10">
              <div className="flex flex-wrap gap-2 mb-8">
                <span
                  className={`text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider ${themeClasses.badge}`}
                >
                  {block.labels.join('・')}
                </span>
                {block.labels.length > 1 && (
                  <span className="text-[10px] font-black px-3 py-1.5 rounded-full border uppercase tracking-wider bg-emerald-50 text-emerald-600 border-emerald-100">
                    共通
                  </span>
                )}
              </div>

              <div
                className={`whitespace-pre-wrap leading-relaxed text-lg mb-10 font-medium rounded-3xl border p-6 ${themeClasses.text}`}
              >
                {block.text}
              </div>

              <button
                onClick={() => handleCopy(block.text, copyKey)}
                className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg ${themeClasses.button}`}
              >
                {copiedKey === copyKey ? (
                  <>
                    <CheckIcon className="w-6 h-6" />
                    コピー完了！
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-6 h-6" />
                    {block.labels.join('・')}としてコピー
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
