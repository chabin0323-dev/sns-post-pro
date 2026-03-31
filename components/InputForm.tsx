// components/InputForm.tsx

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
  LinkIcon,
  TrashIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/solid';

interface InputFormProps {
  onGenerate: (
    theme: string,
    length: string,
    gender: string,
    age: string,
    templateText: string,
    templateUrl: string,
    tiktokTemplateText: string,
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

const TIKTOK_HOOK_OPTIONS: Record<string, string[]> = {
  恋愛: [
    '先に結論を言います',
    '実はみんな勘違いしています',
    'この一言で流れが変わります',
    '知らないままだと損です',
    '相手の反応が変わるのはここです',
    '恋愛が止まる人はここを外しています',
    'まずここだけ見てください',
    '本当に大事なのはここです',
    'やってしまう人が多いです',
    'この考え方で差がつきます'
  ],
  副業: [
    '知らないと損です',
    '先に結論を言います',
    'これで差がつきます',
    '稼げない人の共通点はこれです',
    '最初にここを外すと遠回りです',
    'やる順番を間違えないでください',
    'まずここだけ覚えてください',
    '伸びる人は最初にこれをやります',
    'この考え方で結果が変わります',
    '見落とすとかなりもったいないです'
  ],
  美容: [
    '先に結論を言います',
    'やってしまう人が多いです',
    'まずここだけ覚えてください',
    '実は逆効果になっています',
    'これだけで印象が変わります',
    '知らないと損です',
    'キレイな人ほどここを意識しています',
    '最初に見直すべきはここです',
    'この習慣で差が出ます',
    '見落としがちなポイントです'
  ],
  健康: [
    'まずここだけ覚えてください',
    '先に結論を言います',
    'やってしまう人が多いです',
    '実はここが原因です',
    '知らないと損です',
    '最初に見直すのはここです',
    'この習慣で変わります',
    '体調が整わない人はここを見落とします',
    '本当に大事なのはここです',
    '今すぐ意識してほしいです'
  ],
  SNS運用: [
    '先に結論を言います',
    '伸びない原因はここです',
    'これで差がつきます',
    '知らないと損です',
    '伸びる人は最初にこれをやります',
    'まずここだけ整えてください',
    'やってしまう人が多いです',
    '保存される投稿はここが違います',
    'バズる前に必要なのはこれです',
    '最初の3秒で決まります'
  ],
  汎用: [
    '先に結論を言います',
    '知らないと損です',
    '実はみんな勘違いしています',
    'まずここだけ見てください',
    'これで差がつきます',
    'やってしまう人が多いです',
    '本当に大事なのはここです',
    '最初にここを外さないでください',
    'この考え方で変わります',
    '見落とすともったいないです'
  ]
};

const TEMPLATE_TEXT_HISTORY_KEY = 'template_text_history';
const TEMPLATE_URL_HISTORY_KEY = 'template_url_history';
const TIKTOK_TEMPLATE_TEXT_HISTORY_KEY = 'tiktok_template_text_history';
const MAX_HISTORY = 10;

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

const readHistory = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
  } catch {
    return [];
  }
};

const writeHistory = (key: string, values: string[]) => {
  localStorage.setItem(key, JSON.stringify(values.slice(0, MAX_HISTORY)));
};

const addHistoryItem = (key: string, value: string): string[] => {
  const trimmed = value.trim();
  if (!trimmed) return readHistory(key);
  const current = readHistory(key);
  const next = [trimmed, ...current.filter((item) => item !== trimmed)].slice(0, MAX_HISTORY);
  writeHistory(key, next);
  return next;
};

const removeHistoryItem = (key: string, value: string): string[] => {
  const next = readHistory(key).filter((item) => item !== value);
  writeHistory(key, next);
  return next;
};

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  accent: string;
}> = ({ icon, title, subtitle, isOpen, onToggle, accent }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`w-full flex items-center justify-between gap-4 rounded-3xl border p-5 text-left transition-all ${accent}`}
  >
    <div className="flex items-center gap-4 min-w-0">
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="font-black text-base md:text-lg text-slate-800">{title}</div>
        <div className="text-xs md:text-sm text-slate-500 mt-1">{subtitle}</div>
      </div>
    </div>
    <div className="shrink-0 text-slate-500">
      {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
    </div>
  </button>
);

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
  const [tiktokTemplateText, setTiktokTemplateText] = useState(() => localStorage.getItem('form_tiktok_template_text') || '続きはプロフィールのリンクからどうぞ👇');
  const [tiktokHookGenre, setTiktokHookGenre] = useState(() => localStorage.getItem('form_tiktok_hook_genre') || '汎用');

  const [insertPosition, setInsertPosition] = useState<'start' | 'end'>(() => {
    const saved = localStorage.getItem('form_insert_position');
    return saved === 'start' ? 'start' : 'end';
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionPage, setSuggestionPage] = useState(0);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [templateTextHistory, setTemplateTextHistory] = useState<string[]>([]);
  const [templateUrlHistory, setTemplateUrlHistory] = useState<string[]>([]);
  const [tiktokTemplateTextHistory, setTiktokTemplateTextHistory] = useState<string[]>([]);

  const [openBasic, setOpenBasic] = useState(false);
  const [openCommon, setOpenCommon] = useState(false);
  const [openTiktok, setOpenTiktok] = useState(false);

  const ITEMS_PER_PAGE = 5;
  const isLoading = loadingState === LoadingState.LOADING;
  const tiktokGenreOptions = Object.keys(TIKTOK_HOOK_OPTIONS);
  const currentTiktokHookOptions = TIKTOK_HOOK_OPTIONS[tiktokHookGenre] || TIKTOK_HOOK_OPTIONS['汎用'];

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
    localStorage.setItem('form_tiktok_template_text', tiktokTemplateText);
  }, [tiktokTemplateText]);

  useEffect(() => {
    localStorage.setItem('form_tiktok_hook_genre', tiktokHookGenre);
  }, [tiktokHookGenre]);

  useEffect(() => {
    localStorage.setItem('form_insert_position', insertPosition);
  }, [insertPosition]);

  useEffect(() => {
    const saved = localStorage.getItem('theme_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch {
        setHistory([]);
      }
    }

    setTemplateTextHistory(readHistory(TEMPLATE_TEXT_HISTORY_KEY));
    setTemplateUrlHistory(readHistory(TEMPLATE_URL_HISTORY_KEY));
    setTiktokTemplateTextHistory(readHistory(TIKTOK_TEMPLATE_TEXT_HISTORY_KEY));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;

    const newHistory = [theme.trim(), ...history.filter((h) => h !== theme.trim())].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('theme_history', JSON.stringify(newHistory));

    setTemplateTextHistory(addHistoryItem(TEMPLATE_TEXT_HISTORY_KEY, templateText));
    setTemplateUrlHistory(addHistoryItem(TEMPLATE_URL_HISTORY_KEY, templateUrl));
    setTiktokTemplateTextHistory(addHistoryItem(TIKTOK_TEMPLATE_TEXT_HISTORY_KEY, tiktokTemplateText));

    onGenerate(
      theme,
      length,
      gender,
      age,
      templateText,
      templateUrl,
      tiktokTemplateText,
      insertPosition
    );

    setSuggestions([]);
    setShowHistory(false);
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

  const renderHistoryChips = (
    items: string[],
    onSelect: (value: string) => void,
    onDelete: (value: string) => void
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-2 max-w-full"
          >
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors break-all text-left"
            >
              {item}
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-[40px] shadow-2xl p-5 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-xs font-black tracking-widest uppercase">
              <SparklesIcon className="w-4 h-4" />
              Quick Post Generator
            </div>
            <h3 className="text-2xl md:text-3xl font-black leading-tight">
              テーマを入れて、<br className="md:hidden" />
              すぐ投稿できる形に。
            </h3>
            <p className="text-sm md:text-base text-white/75">
              最初はテーマだけ入力。必要な設定だけ下で開いて調整できます。
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-indigo-100 bg-indigo-50/50 p-5 md:p-6 space-y-4">
          <label className="text-sm font-black text-slate-700">投稿テーマ</label>

          <div className="relative">
            <SparklesIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="例：恋愛、ダイエット、副業、SNS運用"
              className="w-full pl-14 pr-32 py-5 bg-white border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-xs font-black tracking-tighter">
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
            <div className="flex flex-wrap gap-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-inner">
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
                    className="px-4 py-2 bg-slate-50 text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:border-indigo-500 border border-slate-200 transition-all"
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 p-4 bg-white rounded-2xl border border-indigo-100/50">
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
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-full shadow-sm hover:shadow-md transition-all border border-indigo-100"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <SectionHeader
            icon={<div className="p-3 rounded-2xl bg-slate-100"><UserIcon className="w-5 h-5 text-slate-700" /></div>}
            title="投稿設定"
            subtitle="性別・年代・文字数を設定"
            isOpen={openBasic}
            onToggle={() => setOpenBasic(!openBasic)}
            accent="bg-white border-slate-200 hover:border-slate-300"
          />

          {openBasic && (
            <div className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-5 md:p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500">筆者プロフィール</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-5 bg-white rounded-2xl border border-slate-200 outline-none font-medium appearance-none cursor-pointer"
                      disabled={isLoading}
                    >
                      <option>男性</option>
                      <option>女性</option>
                      <option>指定なし</option>
                    </select>
                    <select
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full p-5 bg-white rounded-2xl border border-slate-200 outline-none font-medium appearance-none cursor-pointer"
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
                  <label className="text-sm font-bold text-slate-500">文字数（目標）</label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full p-5 bg-white rounded-2xl border border-slate-200 outline-none font-medium appearance-none cursor-pointer"
                    disabled={isLoading}
                  >
                    <option>100文字 (短文)</option>
                    <option>200文字 (サクッと)</option>
                    <option>300文字 (標準)</option>
                    <option>400文字 (充実)</option>
                    <option>500文字 (長文)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <SectionHeader
            icon={<div className="p-3 rounded-2xl bg-indigo-100"><DocumentTextIcon className="w-5 h-5 text-indigo-700" /></div>}
            title="note・X 用の共通設定"
            subtitle="決まり文・URL・挿入位置を設定"
            isOpen={openCommon}
            onToggle={() => setOpenCommon(!openCommon)}
            accent="bg-indigo-50/60 border-indigo-100 hover:border-indigo-200"
          />

          {openCommon && (
            <div className="rounded-[28px] border border-indigo-100 bg-indigo-50/60 p-5 md:p-6 space-y-4">
              <input
                type="text"
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                placeholder="例：詳しくはこちら👇"
                className="w-full p-5 bg-white rounded-2xl border border-indigo-100 outline-none font-medium"
                disabled={isLoading}
              />

              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) setTemplateText(e.target.value);
                }}
                className="w-full p-4 bg-white rounded-2xl border border-indigo-100 outline-none font-medium appearance-none cursor-pointer"
                disabled={isLoading || templateTextHistory.length === 0}
              >
                <option value="">
                  {templateTextHistory.length === 0 ? '決まり文の履歴はまだありません' : '決まり文の履歴から選択'}
                </option>
                {templateTextHistory.map((item, index) => (
                  <option key={`${item}-${index}`} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {renderHistoryChips(
                templateTextHistory,
                (value) => setTemplateText(value),
                (value) => setTemplateTextHistory(removeHistoryItem(TEMPLATE_TEXT_HISTORY_KEY, value))
              )}

              <input
                type="text"
                value={templateUrl}
                onChange={(e) => setTemplateUrl(e.target.value)}
                placeholder="例：https://example.com"
                className="w-full p-5 bg-white rounded-2xl border border-indigo-100 outline-none font-medium"
                disabled={isLoading}
              />

              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) setTemplateUrl(e.target.value);
                }}
                className="w-full p-4 bg-white rounded-2xl border border-indigo-100 outline-none font-medium appearance-none cursor-pointer"
                disabled={isLoading || templateUrlHistory.length === 0}
              >
                <option value="">
                  {templateUrlHistory.length === 0 ? 'リンクの履歴はまだありません' : 'リンクの履歴から選択'}
                </option>
                {templateUrlHistory.map((item, index) => (
                  <option key={`${item}-${index}`} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {renderHistoryChips(
                templateUrlHistory,
                (value) => setTemplateUrl(value),
                (value) => setTemplateUrlHistory(removeHistoryItem(TEMPLATE_URL_HISTORY_KEY, value))
              )}

              <select
                value={insertPosition}
                onChange={(e) => setInsertPosition(e.target.value as 'start' | 'end')}
                className="w-full p-5 bg-white rounded-2xl border border-indigo-100 outline-none font-medium appearance-none cursor-pointer"
                disabled={isLoading}
              >
                <option value="start">最初に挿入</option>
                <option value="end">最後に挿入</option>
              </select>
            </div>
          )}

          <SectionHeader
            icon={<div className="p-3 rounded-2xl bg-cyan-100"><VideoCameraIcon className="w-5 h-5 text-cyan-700" /></div>}
            title="TikTok 専用設定"
            subtitle="おすすめ語句から選んで、専用の決まり文を作成"
            isOpen={openTiktok}
            onToggle={() => setOpenTiktok(!openTiktok)}
            accent="bg-cyan-50/60 border-cyan-100 hover:border-cyan-200"
          />

          {openTiktok && (
            <div className="rounded-[28px] border border-cyan-100 bg-cyan-50/60 p-5 md:p-6 space-y-4">
              <select
                value={tiktokHookGenre}
                onChange={(e) => setTiktokHookGenre(e.target.value)}
                className="w-full p-5 bg-white rounded-2xl border border-cyan-100 outline-none font-medium appearance-none cursor-pointer"
                disabled={isLoading}
              >
                {tiktokGenreOptions.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}向けおすすめ
                  </option>
                ))}
              </select>

              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) setTiktokTemplateText(e.target.value);
                }}
                className="w-full p-5 bg-white rounded-2xl border border-cyan-100 outline-none font-medium appearance-none cursor-pointer"
                disabled={isLoading}
              >
                <option value="">おすすめ10個から選択</option>
                {currentTiktokHookOptions.map((item, index) => (
                  <option key={`${item}-${index}`} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={tiktokTemplateText}
                onChange={(e) => setTiktokTemplateText(e.target.value)}
                placeholder="例：続きはプロフィールのリンクからどうぞ👇"
                className="w-full p-5 bg-white rounded-2xl border border-cyan-100 outline-none font-medium"
                disabled={isLoading}
              />

              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) setTiktokTemplateText(e.target.value);
                }}
                className="w-full p-4 bg-white rounded-2xl border border-cyan-100 outline-none font-medium appearance-none cursor-pointer"
                disabled={isLoading || tiktokTemplateTextHistory.length === 0}
              >
                <option value="">
                  {tiktokTemplateTextHistory.length === 0 ? 'TikTok決まり文の履歴はまだありません' : 'TikTok決まり文の履歴から選択'}
                </option>
                {tiktokTemplateTextHistory.map((item, index) => (
                  <option key={`${item}-${index}`} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {renderHistoryChips(
                tiktokTemplateTextHistory,
                (value) => setTiktokTemplateText(value),
                (value) => setTiktokTemplateTextHistory(removeHistoryItem(TIKTOK_TEMPLATE_TEXT_HISTORY_KEY, value))
              )}
            </div>
          )}
        </div>

        <div className="space-y-6 pt-2">
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
              <span className="text-xl">生成する</span>
              <PaperAirplaneIcon className="w-5 h-5" />
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
