import React, { useMemo, useState } from 'react';
import {
  ClipboardDocumentIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { GeneratedPost } from '../types';

type ChannelBlock = {
  labels: string[];
  text: string;
  theme: 'light' | 'dark' | 'sky' | 'pink' | 'red' | 'amber' | 'violet';
};

const normalizeText = (text: string) => text.trim();

const groupChannels = (post: GeneratedPost): ChannelBlock[] => {
  const source = [
    { label: 'note', text: post.content, theme: 'light' as const },
    { label: 'TikTok', text: post.capcutScript, theme: 'dark' as const },
    { label: 'X', text: post.xPost, theme: 'sky' as const },
    { label: 'Instagram', text: post.instagramPost, theme: 'pink' as const },
    { label: 'YouTube', text: post.youtubePost, theme: 'red' as const },
    { label: '記事', text: post.article || '', theme: 'amber' as const },
    { label: '誘導文', text: post.cta || '', theme: 'violet' as const },
    { label: 'サムネコピー', text: post.thumbnail || '', theme: 'amber' as const },
    { label: 'CapCut台本', text: post.capcutTemplate || '', theme: 'dark' as const },
    { label: 'プロフィール文', text: post.profile || '', theme: 'sky' as const },
    { label: 'note誘導文', text: post.noteLead || '', theme: 'pink' as const },
    {
      label: '1週間テンプレ',
      text: Array.isArray(post.weeklyTemplates) ? post.weeklyTemplates.join('\n') : '',
      theme: 'violet' as const
    }
  ].filter((item) => normalizeText(item.text) !== '');

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
  },
  amber: {
    wrap: 'bg-amber-50 border-amber-100',
    badge: 'bg-white text-amber-700 border-amber-100',
    text: 'text-slate-700 bg-white/70 border-amber-100',
    button: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
  },
  violet: {
    wrap: 'bg-violet-50 border-violet-100',
    badge: 'bg-white text-violet-700 border-violet-100',
    text: 'text-slate-700 bg-white/70 border-violet-100',
    button: 'bg-violet-500 hover:bg-violet-600 text-white shadow-violet-200'
  }
};

interface ResultCardProps {
  post: GeneratedPost;
  history?: GeneratedPost[];
  onSelectHistory?: (post: GeneratedPost) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  post,
  history = [],
  onSelectHistory
}) => {
  const [copiedKey, setCopiedKey] = useState('');
  const groupedBlocks = useMemo(() => groupChannels(post), [post]);

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
      {typeof post.buzzScore === 'number' && post.buzzScore > 0 && (
        <div className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-6 shadow-lg">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs font-black tracking-[0.2em] text-emerald-600 uppercase">Buzz Check</div>
              <div className="text-3xl font-black text-emerald-700 mt-1">{post.buzzScore}点</div>
            </div>
            <div className="text-sm font-bold text-emerald-700">
              ギャップ・断定・数字・感情ワード・ストーリーを反映
            </div>
          </div>
        </div>
      )}

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

      {history.length > 0 && (
        <div className="rounded-[40px] shadow-2xl overflow-hidden border bg-white border-slate-100">
          <div className="p-8 md:p-10 space-y-6">
            <div>
              <div className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">History</div>
              <h3 className="text-2xl font-black text-slate-800 mt-2">生成履歴</h3>
            </div>

            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={`${item.timestamp ?? 'time'}-${index}`}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2 min-w-0">
                      <div className="text-sm font-black text-slate-800 break-all">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 font-bold">
                        {item.theme || 'テーマ未設定'} / {item.generatedLength || '300文字'} /{' '}
                        {item.generatedGender || '指定なし'} / {item.generatedAge || '指定なし'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleString('ja-JP')
                          : ''}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectHistory?.(item)}
                        className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-black text-sm"
                      >
                        表示する
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            [
                              item.article || '',
                              item.cta || '',
                              item.thumbnail || '',
                              item.capcutTemplate || '',
                              item.profile || '',
                              item.noteLead || '',
                              Array.isArray(item.weeklyTemplates)
                                ? item.weeklyTemplates.join('\n')
                                : ''
                            ]
                              .filter(Boolean)
                              .join('\n\n'),
                            `history-${index}`
                          )
                        }
                        className="px-4 py-2 rounded-2xl bg-slate-800 text-white font-black text-sm"
                      >
                        追加生成まとめコピー
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
