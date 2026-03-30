// App.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { UserGuide } from './components/UserGuide';
import { LoadingState, GeneratedPost } from './types';
import { generateSNSPostContent } from './services/localPostGenerator';

const STORAGE_KEY = 'latest_generated_post';

const App: React.FC = () => {
  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [showGuide, setShowGuide] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentPost) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPost));
      setLastSaved(new Date());
    }
  }, [currentPost]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loadingState === LoadingState.LOADING) {
        e.preventDefault();
        e.returnValue = '入力内容が消去されますがよろしいですか？';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [loadingState]);

  const startProgress = () => {
    setProgress(0);

    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.5;
        return Math.min(prev + increment, 95);
      });
    }, 150);
  };

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
  };

  const handleGenerate = (theme: string, length: string, gender: string, age: string) => {
    setLoadingState(LoadingState.LOADING);
    setShowGuide(false);
    startProgress();

    setTimeout(() => {
      const result = generateSNSPostContent(theme, length, gender, age);

      setCurrentPost({
        ...result,
        theme,
        timestamp: new Date()
      });

      setLoadingState(LoadingState.SUCCESS);
      stopProgress();
    }, 500);
  };

  const handleCancel = () => {
    setLoadingState(LoadingState.IDLE);
    stopProgress();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header onToggleGuide={() => setShowGuide(!showGuide)} />

      <main className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-12 flex-grow w-full">
        {lastSaved && (
          <div className="fixed top-20 right-4 z-50 animate-fade-in">
            <div className="flex items-center gap-2 bg-emerald-500/90 backdrop-blur px-3 py-1.5 rounded-full border border-emerald-400/50 shadow-lg shadow-emerald-500/20">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                Auto-Saved {lastSaved.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            AIで、魅力的な<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">SNS投稿</span>を。
          </h2>
        </div>

        {showGuide && (
          <div className="animate-in fade-in zoom-in duration-300">
            <UserGuide onClose={() => setShowGuide(false)} />
          </div>
        )}

        <InputForm
          onGenerate={handleGenerate}
          onCancel={handleCancel}
          loadingState={loadingState}
          progress={progress}
        />

        {(loadingState === LoadingState.SUCCESS || (currentPost && loadingState === LoadingState.IDLE)) && currentPost && (
          <div className="space-y-6">
            <ResultCard post={currentPost} />
          </div>
        )}

        {loadingState === LoadingState.ERROR && (
          <div className="p-6 bg-red-500/10 text-red-400 rounded-2xl text-center font-bold border border-red-500/20">
            生成に失敗しました。もう一度お試しください。
          </div>
        )}
      </main>

      <footer className="w-full py-20 flex justify-center items-center select-none">
        <div className="flex items-center gap-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-500 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
              Mike
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mt-1">
              ver.4
            </span>
          </div>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </footer>
    </div>
  );
};

export default App;
