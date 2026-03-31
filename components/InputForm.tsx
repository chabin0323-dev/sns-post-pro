import React, { useState, useEffect } from 'react';
import { LoadingState } from '../types';
import {
  SparklesIcon,
  UserIcon,
  AdjustmentsHorizontalIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  ClockIcon,
  LightBulbIcon,
  XMarkIcon,
  LinkIcon
} from '@heroicons/react/24/solid';

interface InputFormProps {
  onGenerate: (
    theme: string,
    length: string,
    gender: string,
    age: string,
    templateText: string,
    templateUrl: string,
    insertPosition: 'start' | 'end'
  ) => void;
  onCancel: () => void;
  loadingState: LoadingState;
  progress: number;
}

const LOCAL_KEYWORD_MAP: Record<string, string[]> = {
  恋愛: ['片想い', '復縁', '告白', '脈あり', '本音', '恋愛心理', '忘れられない人', '距離感', '好き避け', '連絡頻度'],
  美容: ['スキンケア', '毛穴', '乾燥対策', 'エイジングケア', '垢抜け', 'メイク時短', '美容習慣', '小顔', 'UV対策', '美肌'],
  ダイエット: ['食事改善', '痩せ習慣', 'リバウンド', '代謝アップ', 'ながら運動', '脂肪燃焼', '腸活', 'むくみ改善', '間食対策', '朝活'],
  副業: ['在宅ワーク', 'SNS集客', '初心者副業', '収益化', 'コンテンツ販売', '時短副業', 'AI活用', 'スキル販売', '継続力', '仕組み化'],
  SNS: ['バズ投稿', '伸びる書き方', '保存される投稿', '投稿ネタ', 'フォロワー増加', 'リール戦略', '導線設計', 'プロフィール改善', '毎日投稿', '共感文章'],
  仕事: ['人間関係', '評価される人', '習慣改善', '時間管理', 'モチベーション', '会話術', '信頼構築', 'キャリア', '転職不安', '成長戦略'],
  子育て: ['声かけ', '自己肯定感', '親子関係', '習慣づくり', '朝の支度', 'イライラ対策', '共感育児', '見守り', '叱り方', '家庭時間'],
  健康: ['睡眠改善', '疲労回復', '自律神経', '腸内環境', '肩こり対策', 'ストレス解消', '朝習慣', '温活', '姿勢改善', '生活改善'],
};

const COMMON_KEYWORDS = [
  '初心者向け',
  '知らないと損',
  '今すぐできる',
  '習慣化',
  'やってはいけない',
  '続けるコツ',
  '選ばれる方法',
  '失敗しない考え方',
  'おすすめの始め方',
  '結果が変わるコツ',
  '伸びる型',
  '売れる導線',
  '共感される書き方',
  '保存したくなる内容',
  '行動したくなる一言'
];

const getRelatedKeywordsLocal = (theme: string): string[] => {
  const trimmed = theme.trim();
  if (!trimmed) return [];

  const matchedEntry = Object.entries(LOCAL_KEYWORD_MAP).find(([key]) =>
    trimmed.includes(key)
  );

  const base = matchedEntry ? matchedEntry[1] : [];
  const merged = [
    ...base,
    `${trimmed} 初心者`,
    `${trimmed} コツ`,
    `${trimmed} やり方`,
    `${trimmed} テンプレ`,
    `${trimmed} 失敗`,
    `${trimmed} 改善`,
    `${trimmed} 投稿例`,
    ...COMMON_KEYWORDS
  ];

  return Array.from(new Set(merged)).slice(0, 15);
};

export const InputForm: React.FC<InputFormProps> = ({
  onGenerate,
  onCancel,
  loadingState,
  progress
}) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('form_theme') || '');
  const [gender, setGender] = useState(() => localStorage.getItem('form_gender') || '男性');
  const [age, setAge] = useState(() => localStorage.getItem('form_age') || '50代以上');
  const [length, setLength] = useState(() => localStorage.getItem('form_length') || '500文字 (長文)');
  const [templateText, setTemplateText] = useState(() => localStorage.getItem('form_template_text') || '詳しくはこちら👇');
  const [templateUrl, setTemplateUrl] = useState(() => localStorage.getItem('form_template_url') || '');
  const [insertPosition, setInsertPosition] = useState<'start' | 'end'>(() => {
    const saved = localStorage.getItem('form_insert_position');
    return saved === 'start' ? 'start' : 'end';
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionPage, setSuggestionPage] = useState(0);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    localStorage.setItem('form_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('form_gender', gender);
  }, [gender]);

  useEffect(() => {
    localStorage.setItem('form_age', age);
  }, [age]);

  useEffect(() => {
    localStorage.setItem('form_length', length);
  }, [length]);

  useEffect(() => {
    localStorage.setItem('form_template_text', templateText);
  }, [templateText]);

  useEffect(() => {
    localStorage.setItem('form_template_url', templateUrl);
  }, [templateUrl]);

  useEffect(() => {
    localStorage.setItem('form_insert_position', insertPosition);
  }, [insertPosition]);

  useEffect(() => {
    const saved = localStorage.getItem('theme_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (theme.trim()) {
      const newHistory = [theme, ...history.filter((h) => h !== theme)].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('theme_history', JSON.stringify(newHistory));

      onGenerate(
        theme,
        length,
        gender,
        age,
        templateText,
        templateUrl,
        insertPosition
      );
      setSuggestions([]);
      setShowHistory(false);
    }
  };

  const handleSuggest = async () => {
    if (!theme.trim()) return;

    setIsSuggesting(true);
    setSuggestionPage(0);

    try {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const keywords = getRelatedKeywordsLocal(theme);
      setSuggestions(keywords);
      setShowHistory(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSuggesting(false);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    setSuggestions([]);
  };

  const selectKeyword = (kw: string) => {
    setTheme(kw);
    setSuggestions([]);
    setShowHistory(false);
  };

  const nextPage = () => {
    if ((suggestionPage + 1) * ITEMS_PER_PAGE < suggestions.length) {
      setSuggestionPage(suggestionPage + 1);
    } else {
      setSuggestionPage(0);
    }
  };

  const prevPage = () => {
    if (suggestionPage > 0) {
      setSuggestionPage(suggestionPage - 1);
    } else {
      setSuggestionPage(Math.floor((suggestions.length - 1) / ITEMS_PER_PAGE));
    }
  };

  const currentSuggestions = suggestions.slice(
    suggestionPage * ITEMS_PER_PAGE,
    (suggestionPage + 1) * ITEMS_PER_PAGE
  );

  const isLoading = loadingState === LoadingState.LOADING;

  return (
    <div className="w-full bg-white rounded-[40px] shadow-2xl p-8 md:p-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500">投稿のテーマ</label>
          <div className="relative">
            <SparklesIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="例：旅行（単語だけでもOK！）"
              className="w-full pl-14 pr-32 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-xs font-black tracking-tighter">
              <button
                type="button"
                onClick={handleSuggest}
                disabled={!theme.trim() || isSuggesting}
                className={`transition-colors ${theme.trim() ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-300 pointer-events-none'}`}
              >
                {isSuggesting ? '...' : '提案'}
              </button>
              <span className="text-slate-200">|</span>
              <button
                type="button"
                onClick={toggleHistory}
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                履歴
              </button>
            </div>
          </div>

          {showHistory && history.length > 0 && (
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
              <div className="w-full text-[10px] font-black text-slate-400 mb-2 flex items-center justify-between uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" /> 最近の入力テーマ
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistory(false)}
                  className="hover:text-red-500 transition-colors"
                >
                  閉じる
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectKeyword(h)}
                    className="px-4 py-2 bg-white text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:border-indigo-500 border border-slate-200 transition-all"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
              <div className="w-full text-[10px] font-bold text-indigo-400 mb-2 flex items-center justify-between uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <LightBulbIcon className="w-3 h-3" /> おすすめのキーワード
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={prevPage} className="text-slate-500 hover:text-indigo-600 transition-colors">
                    戻る
                  </button>
                  <span className="text-indigo-200">|</span>
                  <button type="button" onClick={nextPage} className="text-slate-500 hover:text-indigo-600 transition-colors">
                    次
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentSuggestions.map((kw, i) => (
                  <button
                    key={`${suggestionPage}-${i}`}
                    type="button"
                    onClick={() => selectKeyword(kw)}
                    className="px-4 py-2 bg-white text-indigo-600 text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all border border-indigo-100"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <UserIcon className="w-4 h-4" /> 筆者プロフィール
          </label>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-medium appearance-none cursor-pointer"
              disabled={isLoading}
            >
              <option>男性</option>
              <option>女性</option>
              <option>指定なし</option>
            </select>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-medium appearance-none cursor-pointer"
              disabled={isLoading}
            >
              <option>50代以上</option>
              <option>40代</option>
              <option>30代</option>
              <option>20代</option>
              <option>10代</option>
              <option>指定なし</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-4 h-4" /> 文字数（目標）
          </label>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-medium appearance-none cursor-pointer"
            disabled={isLoading}
          >
            <option>100文字 (短文)</option>
            <option>200文字 (サクッと)</option>
            <option>300文字 (標準)</option>
            <option>400文字 (充実)</option>
            <option>500文字 (長文)</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> 決まり文挿入
          </label>

          <input
            type="text"
            value={templateText}
            onChange={(e) => setTemplateText(e.target.value)}
            placeholder="例：詳しくはこちら👇"
            className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-medium"
            disabled={isLoading}
          />

          <input
            type="text"
            value={templateUrl}
            onChange={(e) => setTemplateUrl(e.target.value)}
            placeholder="例：https://example.com"
            className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-medium"
            disabled={isLoading}
          />

          <select
            value={insertPosition}
            onChange={(e) => setInsertPosition(e.target.value as 'start' | 'end')}
            className="w-full p-5 bg-slate-50 rounded-2xl border-none outline-none font-medium appearance-none cursor-pointer"
            disabled={isLoading}
          >
            <option value="start">最初に挿入</option>
            <option value="end">最後に挿入</option>
          </select>
        </div>

        <div className="space-y-6">
          {!isLoading ? (
            <button
              type="submit"
              disabled={!theme.trim()}
              className={`w-full py-5 rounded-3xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                theme.trim()
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 active:scale-[0.98]'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              <>
                <span className="text-xl">生成する</span>
                <PaperAirplaneIcon className="w-5 h-5" />
              </>
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative flex-grow bg-slate-100 rounded-3xl p-1 h-[72px] overflow-hidden flex items-center border border-slate-200 shadow-inner">
                <div
                  className="absolute left-1 top-1 bottom-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl transition-all duration-300 ease-out"
                  style={{ width: `calc(${progress}% - 8px)`, minWidth: '1%' }}
                />
                <div className="relative w-full flex items-center justify-center gap-3 font-black italic">
                  <ArrowPathIcon className="w-6 h-6 animate-spin text-white drop-shadow-md" />
                  <span className="text-2xl text-white drop-shadow-md tracking-tighter">
                    {Math.round(progress)}% <span className="text-sm not-italic opacity-80">執筆中...</span>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="w-[72px] h-[72px] bg-red-500 text-white rounded-3xl flex items-center justify-center hover:bg-red-600 transition-all shadow-lg active:scale-95"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
