import React, { useState } from 'react';
import { LoadingState } from '../types';
import {
  SparklesIcon,
  PaperAirplaneIcon,
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
    insertPosition: 'start' | 'end',
    tiktokInsertPosition: 'start' | 'end' | 'both'
  ) => void;
  onCancel: () => void;
  loadingState: LoadingState;
  progress: number;
}

export const InputForm: React.FC<InputFormProps> = ({
  onGenerate,
  loadingState
}) => {

  const [theme, setTheme] = useState('');
  const [gender, setGender] = useState('男性');
  const [age, setAge] = useState('30代');
  const [length, setLength] = useState('300文字');

  const [templateText, setTemplateText] = useState('詳しくはこちら👇');
  const [templateUrl, setTemplateUrl] = useState('');

  const [tiktokTemplateText, setTiktokTemplateText] = useState('続きはプロフィールから👇');

  const [insertPosition, setInsertPosition] = useState<'start' | 'end'>('end');
  const [tiktokInsertPosition, setTiktokInsertPosition] = useState<'start' | 'end' | 'both'>('start');

  const [openBasic, setOpenBasic] = useState(false);
  const [openCommon, setOpenCommon] = useState(false);
  const [openTiktok, setOpenTiktok] = useState(false);

  const isLoading = loadingState === LoadingState.LOADING;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim()) return;

    onGenerate(
      theme,
      length,
      gender,
      age,
      templateText,
      templateUrl,
      tiktokTemplateText,
      insertPosition,
      tiktokInsertPosition
    );
  };

  return (
    <div className="w-full bg-white rounded-[40px] shadow-2xl p-6 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ===== タイトル ===== */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black">
            SNS投稿を一瞬で作成
          </h2>
          <p className="text-sm text-gray-500">
            テーマを入れるだけで投稿完成
          </p>
        </div>

        {/* ===== テーマ入力 ===== */}
        <div className="bg-indigo-50 p-6 rounded-3xl">
          <label className="font-bold">投稿テーマ</label>

          <div className="relative mt-3">
            <SparklesIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="例：恋愛、副業、ダイエット"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border outline-none"
            />
          </div>
        </div>

        {/* ===== 投稿設定 ===== */}
        <div>
          <button
            type="button"
            onClick={() => setOpenBasic(!openBasic)}
            className="w-full flex justify-between items-center p-4 bg-gray-100 rounded-2xl"
          >
            投稿設定
            {openBasic ? <ChevronUpIcon className="w-5"/> : <ChevronDownIcon className="w-5"/>}
          </button>

          {openBasic && (
            <div className="p-4 space-y-4 bg-gray-50 rounded-2xl mt-2">

              <select value={gender} onChange={(e)=>setGender(e.target.value)} className="w-full p-3 rounded-xl border">
                <option>男性</option>
                <option>女性</option>
              </select>

              <select value={age} onChange={(e)=>setAge(e.target.value)} className="w-full p-3 rounded-xl border">
                <option>20代</option>
                <option>30代</option>
                <option>40代</option>
              </select>

              <select value={length} onChange={(e)=>setLength(e.target.value)} className="w-full p-3 rounded-xl border">
                <option>200文字</option>
                <option>300文字</option>
                <option>500文字</option>
              </select>

            </div>
          )}
        </div>

        {/* ===== note・X ===== */}
        <div>
          <button
            type="button"
            onClick={() => setOpenCommon(!openCommon)}
            className="w-full flex justify-between items-center p-4 bg-indigo-100 rounded-2xl"
          >
            note・X設定
            {openCommon ? <ChevronUpIcon className="w-5"/> : <ChevronDownIcon className="w-5"/>}
          </button>

          {openCommon && (
            <div className="p-4 space-y-4 bg-indigo-50 rounded-2xl mt-2">

              <input
                value={templateText}
                onChange={(e)=>setTemplateText(e.target.value)}
                className="w-full p-3 rounded-xl border"
              />

              <input
                value={templateUrl}
                onChange={(e)=>setTemplateUrl(e.target.value)}
                placeholder="URL"
                className="w-full p-3 rounded-xl border"
              />

              <select
                value={insertPosition}
                onChange={(e)=>setInsertPosition(e.target.value as any)}
                className="w-full p-3 rounded-xl border"
              >
                <option value="start">最初</option>
                <option value="end">最後</option>
              </select>

            </div>
          )}
        </div>

        {/* ===== TikTok ===== */}
        <div>
          <button
            type="button"
            onClick={() => setOpenTiktok(!openTiktok)}
            className="w-full flex justify-between items-center p-4 bg-cyan-100 rounded-2xl"
          >
            TikTok設定
            {openTiktok ? <ChevronUpIcon className="w-5"/> : <ChevronDownIcon className="w-5"/>}
          </button>

          {openTiktok && (
            <div className="p-4 space-y-4 bg-cyan-50 rounded-2xl mt-2">

              <input
                value={tiktokTemplateText}
                onChange={(e)=>setTiktokTemplateText(e.target.value)}
                className="w-full p-3 rounded-xl border"
              />

              <select
                value={tiktokInsertPosition}
                onChange={(e)=>setTiktokInsertPosition(e.target.value as any)}
                className="w-full p-3 rounded-xl border"
              >
                <option value="start">最初（おすすめ）</option>
                <option value="end">最後</option>
                <option value="both">最初＋最後</option>
              </select>

            </div>
          )}
        </div>

        {/* ===== ボタン ===== */}
        <button
          type="submit"
          disabled={!theme}
          className="w-full py-4 bg-indigo-600 text-white rounded-3xl font-bold flex justify-center items-center gap-2"
        >
          生成する
          <PaperAirplaneIcon className="w-5"/>
        </button>

      </form>
    </div>
  );
};
