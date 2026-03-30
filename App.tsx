import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { UserGuide } from './components/UserGuide';
import { LoadingState, GeneratedPost } from './types';
import { generateSNSPostContent } from './services/localPostGenerator';

const DAILY_LIMIT = 5;
const STORAGE_KEY = 'latest_generated_post';

const App: React.FC = () => {

  const [currentPost, setCurrentPost] = useState<GeneratedPost | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [usage, setUsage] = useState(() => {
    const saved = localStorage.getItem('daily_usage');
    const today = new Date().toLocaleDateString('ja-JP');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) return parsed;
    }
    return { date: today, count: 0 };
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
    if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);
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

  // 🔥ここが今回の修正ポイント（APIなし版）
  const handleGenerate = (theme: string, length: string, gender: string, age: string) => {
    if (usage.count >= DAILY_LIMIT) return;

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

      setUsage((prev: { date: string; count: number }) => ({
        ...prev,
        count: prev.count + 1
      }));

      setLoadingState(LoadingState.SUCCESS);
      stopProgress();
    }, 500);
  };

  const handleCancel = () => {
    setLoadingState(LoadingState.IDLE);
    stopProgress();
  };

  const remainingCount = DAILY_LIMIT - usage.count;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header onToggleGuide={() => setShowGuide(!showGuide)} />
      
      <main className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-12 flex-grow w-full">

        {lastSaved && (
          <div className="fixed top-20 right-4 z-50">
            <div className="flex items-center gap-2 bg-emerald-500 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-[10px] font-black text-white">
                Auto-Saved
              </span>
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-white">
            SNS投稿生成ツール
          </h2>
        </div>

        {showGuide && (
          <UserGuide onClose={() => setShowGuide(false)} />
        )}

        <InputForm 
          onGenerate={handleGenerate} 
          onCancel={handleCancel} 
          loadingState={loadingState} 
          progress={progress}
          remainingCount={remainingCount}
          isLimitReached={usage.count >= DAILY_LIMIT}
        />
        
        {(loadingState === LoadingState.SUCCESS || (currentPost && loadingState === LoadingState.IDLE)) && currentPost && (
          <ResultCard post={currentPost} />
        )}

        {loadingState === LoadingState.ERROR && (
          <div className="p-6 bg-red-500 text-white rounded-2xl text-center">
            生成に失敗しました
          </div>
        )}
      </main>

      <footer className="w-full py-10 flex justify-center text-white/30">
        SNS Generator
      </footer>
    </div>
  );
};

export default App;
