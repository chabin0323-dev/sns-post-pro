
import React, { useState } from 'react';
import { GeneratedPost } from '../types';
import { ClipboardDocumentIcon, VideoCameraIcon, DocumentTextIcon, CheckIcon, ClockIcon, Bars3BottomLeftIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

export const ResultCard: React.FC<{ post: GeneratedPost }> = ({ post }) => {
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopy = async (text: string, type: 'content' | 'script') => {
    try {
      let textToCopy = text;
      if (type === 'script') {
        textToCopy = text.split('\n').filter(line => !line.trim().startsWith('#')).join('\n').trim();
      }
      await navigator.clipboard.writeText(textToCopy);
      if (type === 'content') {
        setCopiedContent(true);
        setTimeout(() => setCopiedContent(false), 2000);
      } else {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
      }
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const characterCount = post.content.length;
  const calculateReadingTime = (text: string) => {
    const totalSeconds = Math.ceil(text.length / 5.5);
    return totalSeconds < 60 ? `約${totalSeconds}秒` : `約${Math.floor(totalSeconds / 60)}分${totalSeconds % 60}秒`;
  };
  const estimatedTime = calculateReadingTime(post.content);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
      {/* メイン記事カード */}
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1 text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                <DocumentTextIcon className="w-3 h-3" />
                SNS POST
              </span>
              <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 uppercase tracking-wider">
                <Bars3BottomLeftIcon className="w-3 h-3" />
                {characterCount} 文字
              </span>
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-wider animate-pulse">
                <CloudArrowUpIcon className="w-3 h-3" />
                自動保存済み
              </span>
            </div>
          </div>

          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg mb-10 font-medium border-l-4 border-indigo-100 pl-6 py-2 bg-slate-50/30 rounded-r-2xl">
            {post.content}
          </div>

          <button 
            onClick={() => handleCopy(post.content, 'content')} 
            className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg ${
              copiedContent ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {copiedContent ? <><CheckIcon className="w-6 h-6" /> コピー完了！</> : <><ClipboardDocumentIcon className="w-6 h-6" /> SNS投稿としてコピー</>}
          </button>
        </div>
      </div>

      {/* CapCut台本カード */}
      <div className="bg-slate-900 rounded-[40px] p-8 md:p-10 shadow-2xl border border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="flex items-center justify-between mb-8 relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-xl self-start"><VideoCameraIcon className="w-6 h-6 text-cyan-400" /></div>
            <div>
              <span className="text-white font-black tracking-tight text-xl block leading-none mb-2">CapCut Script View</span>
              <div className="flex items-center gap-1.5 text-cyan-400/90 text-[10px] font-black uppercase tracking-widest"><ClockIcon className="w-3 h-3" /><span>再生目安: {estimatedTime}</span></div>
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-400 italic">*15-char Limit</span>
        </div>
        <div className="whitespace-pre-wrap font-mono text-cyan-50 bg-slate-950/50 p-6 md:p-8 rounded-3xl border border-slate-800 mb-8 text-base leading-loose max-h-[600px] overflow-y-auto relative">
          {post.capcutScript}
        </div>
        <button onClick={() => handleCopy(post.capcutScript, 'script')} className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${copiedScript ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 shadow-lg shadow-black/20'}`}>
          {copiedScript ? <><CheckIcon className="w-5 h-5" /> コピー完了！</> : <><ClipboardDocumentIcon className="w-5 h-5" /> 動画台本としてコピー</>}
        </button>
      </div>
    </div>
  );
};
