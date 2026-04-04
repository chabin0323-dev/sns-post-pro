import React, { useMemo, useState } from 'react';
import type {
  GenerateInput,
  InputFormProps,
  Platform,
  InsertPosition,
  TiktokInsertPosition,
  LengthMode
} from '../types';

const ALL_PLATFORMS: Platform[] = ['TikTok', 'X', 'note', 'Instagram', 'YouTube'];

const TITLE_SUGGESTIONS_BASE = [
  '実はこれ、浮気のサインです',
  '好きな人が出している脈ありサイン',
  'この行動、恋愛が終わる前兆です',
  '告白で失敗する人の共通点',
  '復縁したい人が最初にやるべきこと',
  '片想いが進まない人の特徴',
  '脈なしっぽい時にやってはいけないこと',
  '恋愛心理で差がつくポイント',
  '実はこれ、好き避けの可能性です',
  '連絡が減った時に見るべきポイント'
];

const TARGET_PRESETS = [
  '初心者',
  '20代女性',
  '30代女性',
  '40代女性',
  '男性',
  '副業初心者',
  '片想い中の人',
  'ママ層',
  '経営者',
  '在宅ワーカー'
];

const wrapper: React.CSSProperties = {
  display: 'grid',
  gap: 18
};

const card: React.CSSProperties = {
  background: '#f4f5f7',
  border: '1px solid #d7dde9',
  borderRadius: 22,
  padding: 18
};

const headerCard: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(247,240,249,0.92), rgba(235,248,250,0.92))',
  border: '1px solid rgba(181,191,255,0.55)',
  borderRadius: 28,
  padding: 24
};

const titleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: '#12223d',
  marginBottom: 8
};

const sectionHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  background: '#f4f5f7',
  border: '1px solid #d7dde9',
  borderRadius: 18,
  padding: '16px 18px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '15px 16px',
  borderRadius: 14,
  border: '1px solid #d7dde9',
  background: '#fff',
  color: '#18263d',
  fontSize: 15,
  boxSizing: 'border-box',
  outline: 'none'
};

const chipStyle: React.CSSProperties = {
  border: '1px solid #d1d8e6',
  background: '#ffffff',
  color: '#263b59',
  borderRadius: 999,
  padding: '10px 14px',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8
};

const primaryButton: React.CSSProperties = {
  border: 'none',
  borderRadius: 18,
  padding: '18px 18px',
  fontWeight: 800,
  cursor: 'pointer',
  fontSize: 22,
  color: '#fff',
  background: 'linear-gradient(90deg, #4f46e5 0%, #5b4df0 100%)'
};

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}

function scoreSuggestion(item: string, keyword: string) {
  const a = normalizeText(item);
  const b = normalizeText(keyword);

  if (!b) return 1;
  if (a.includes(b)) return 100;

  let partial = 0;
  for (const ch of b) {
    if (a.includes(ch)) partial += 1;
  }
  return partial;
}

function makeThemeBasedTitleSuggestions(theme: string): string[] {
  const t = theme.trim();
  if (!t) return TITLE_SUGGESTIONS_BASE;

  return [
    `実はこれ、${t}のサインです`,
    `${t}で失敗する人の共通点`,
    `${t}がうまくいかない理由`,
    `${t}でやってはいけない行動`,
    `${t}で結果が変わる人の特徴`,
    `${t}で差がつくポイント`,
    `${t}で見落としがちな事実`,
    `${t}で逆転する方法`,
    `${t}で一番大事なこと`,
    `${t}で損している人の特徴`
  ];
}

export default function InputForm({
  value,
  onChange,
  onGenerate,
  onGenerateTrends,
  loading,
  themeHistory,
  targetHistory,
  onApplyThemeSuggestion,
  onApplyTargetSuggestion
}: InputFormProps) {
  const [themeMode, setThemeMode] = useState<'suggestion' | 'history'>('suggestion');
  const [openPostSettings, setOpenPostSettings] = useState(true);
  const [openNoteX, setOpenNoteX] = useState(true);
  const [openTikTok, setOpenTikTok] = useState(true);

  const setField = <K extends keyof GenerateInput>(key: K, fieldValue: GenerateInput[K]) => {
    onChange({
      ...value,
      [key]: fieldValue
    });
  };

  const togglePlatform = (platform: Platform) => {
    const exists = value.platforms.includes(platform);
    const next = exists
      ? value.platforms.filter((p) => p !== platform)
      : [...value.platforms, platform];

    onChange({
      ...value,
      platforms: next.length > 0 ? next : ['TikTok']
    });
  };

  const themeSuggestions = useMemo(() => {
    const merged = [...makeThemeBasedTitleSuggestions(value.theme), ...themeHistory, ...TITLE_SUGGESTIONS_BASE];
    const unique = Array.from(new Set(merged.map((x) => x.trim()).filter(Boolean)));
    const keyword = value.theme.trim();

    return unique
      .map((item) => ({
        item,
        score: scoreSuggestion(item, keyword)
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item)
      .slice(0, 10);
  }, [themeHistory, value.theme]);

  const themeHistoryList = useMemo(() => {
    return Array.from(new Set(themeHistory.map((x) => x.trim()).filter(Boolean))).slice(0, 10);
  }, [themeHistory]);

  const targetSuggestions = useMemo(() => {
    const merged = [...TARGET_PRESETS, ...targetHistory];
    const unique = Array.from(new Set(merged.map((x) => x.trim()).filter(Boolean)));
    const keyword = value.target.trim();

    if (!keyword) return unique.slice(0, 8);

    return unique
      .map((item) => ({
        item,
        score: scoreSuggestion(item, keyword)
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item)
      .slice(0, 8);
  }, [targetHistory, value.target]);

  const visibleThemeChips = themeMode === 'suggestion' ? themeSuggestions : themeHistoryList;

  const phraseHistory = useMemo(() => {
    const items = [value.noteXPhrase, value.tiktokPhrase].filter(Boolean);
    return Array.from(new Set(items)).slice(0, 8);
  }, [value.noteXPhrase, value.tiktokPhrase]);

  const urlHistory = useMemo(() => {
    return value.noteXUrl ? [value.noteXUrl] : [];
  }, [value.noteXUrl]);

  const insertHistory = useMemo(() => {
    return Array.from(
      new Set([
        value.noteXInsertPosition,
        value.tiktokInsertPosition === 'start' ? 'start' : '',
        value.tiktokInsertPosition === 'end' ? 'end' : '',
        value.tiktokInsertPosition === 'both' ? 'start+end' : ''
      ].filter(Boolean))
    );
  }, [value.noteXInsertPosition, value.tiktokInsertPosition]);

  return (
    <div style={wrapper}>
      <div style={headerCard}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...titleStyle, fontSize: 18, marginBottom: 0 }}>投稿テーマ</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginBottom: 10 }}>
          <button
            type="button"
            onClick={() => setThemeMode('suggestion')}
            style={{
              border: 'none',
              background: 'transparent',
              color: themeMode === 'suggestion' ? '#5b58ff' : '#6d7e99',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            提案
          </button>
          <button
            type="button"
            onClick={() => setThemeMode('history')}
            style={{
              border: 'none',
              background: 'transparent',
              color: themeMode === 'history' ? '#5b58ff' : '#6d7e99',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            履歴
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <input
            style={inputStyle}
            value={value.theme}
            onChange={(e) => {
              setField('theme', e.target.value);
              setThemeMode('suggestion');
            }}
            placeholder="投稿テーマを入力"
          />
        </div>

        <div style={card}>
          <div style={{ color: '#54657f', fontSize: 13, fontWeight: 800, marginBottom: 12 }}>
            ● {themeMode === 'suggestion' ? 'テーマ提案' : 'テーマ履歴'}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {visibleThemeChips.length === 0 ? (
              <div style={{ color: '#7b8ba5', fontSize: 13 }}>まだありません</div>
            ) : (
              visibleThemeChips.map((item) => (
                <button
                  key={item}
                  type="button"
                  style={chipStyle}
                  onClick={() => onApplyThemeSuggestion(item)}
                >
                  {item}
                  {themeMode === 'history' && <span style={{ color: '#90a0b8' }}>×</span>}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={sectionHeader} onClick={() => setOpenPostSettings((v) => !v)}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#18263d' }}>投稿設定</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>性別・年代表現・文字数・ハッシュタグ</div>
        </div>
        <div style={{ fontSize: 22, color: '#64748b' }}>{openPostSettings ? '⌃' : '⌄'}</div>
      </div>

      {openPostSettings && (
        <div style={card}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <div style={titleStyle}>ターゲット</div>
              <select
                style={inputStyle}
                value={value.target}
                onChange={(e) => setField('target', e.target.value)}
              >
                {TARGET_PRESETS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <div style={titleStyle}>性別</div>
              <select
                style={inputStyle}
                value={value.gender}
                onChange={(e) => setField('gender', e.target.value as GenerateInput['gender'])}
              >
                <option value="指定なし">指定なし</option>
                <option value="男性向け">男性向け</option>
                <option value="女性向け">女性向け</option>
              </select>
            </div>

            <div>
              <div style={titleStyle}>文字数</div>
              <select
                style={inputStyle}
                value={value.lengthMode}
                onChange={(e) => setField('lengthMode', Number(e.target.value) as LengthMode)}
              >
                <option value={100}>100文字</option>
                <option value={200}>200文字</option>
                <option value={300}>300文字</option>
                <option value={400}>400文字</option>
                <option value={500}>500文字</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <div style={titleStyle}>文章の強さ</div>
              <select
                style={inputStyle}
                value={value.tone}
                onChange={(e) => setField('tone', e.target.value as GenerateInput['tone'])}
              >
                <option value="soft">やさしめ</option>
                <option value="normal">標準</option>
                <option value="strong">強め</option>
              </select>
            </div>

            <div>
              <div style={titleStyle}>目的</div>
              <select
                style={inputStyle}
                value={value.goal}
                onChange={(e) => setField('goal', e.target.value as GenerateInput['goal'])}
              >
                <option value="engagement">反応を取る</option>
                <option value="sales">販売導線</option>
                <option value="followers">フォロワー増加</option>
                <option value="lead">保存・見込み客獲得</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={titleStyle}>ターゲット候補</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {targetSuggestions.slice(0, 6).map((item) => (
                <button
                  key={item}
                  type="button"
                  style={chipStyle}
                  onClick={() => onApplyTargetSuggestion(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={titleStyle}>対応SNS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {ALL_PLATFORMS.map((platform) => {
                const active = value.platforms.includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    style={{
                      ...chipStyle,
                      background: active ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : '#fff',
                      color: active ? '#fff' : '#263b59',
                      border: active ? 'none' : '1px solid #d1d8e6'
                    }}
                  >
                    {platform}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={titleStyle}>ハッシュタグ</div>
              <select
                style={inputStyle}
                value={value.hashtagMode}
                onChange={(e) => {
                  const mode = e.target.value as GenerateInput['hashtagMode'];
                  setField('hashtagMode', mode);
                  setField('includeHashtags', mode !== 'none');
                }}
              >
                <option value="auto">自動最適化あり</option>
                <option value="none">なし</option>
              </select>
            </div>

            <div>
              <div style={titleStyle}>固定タグ</div>
              <select
                style={inputStyle}
                value={value.includeFixedHashtags ? 'yes' : 'no'}
                onChange={(e) => setField('includeFixedHashtags', e.target.value === 'yes')}
              >
                <option value="yes">あり</option>
                <option value="no">なし</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div style={sectionHeader} onClick={() => setOpenNoteX((v) => !v)}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#18263d' }}>note・X設定</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>決まり文・URL・挿入位置</div>
        </div>
        <div style={{ fontSize: 22, color: '#64748b' }}>{openNoteX ? '⌃' : '⌄'}</div>
      </div>

      {openNoteX && (
        <div style={{ ...card, background: '#eef0ff', borderColor: '#c8cff7' }}>
          <div style={{ marginBottom: 14 }}>
            <input
              style={inputStyle}
              value={value.noteXPhrase}
              onChange={(e) => setField('noteXPhrase', e.target.value)}
              placeholder="詳しくはこちら👇"
            />
          </div>

          <div style={{ ...card, marginBottom: 14 }}>
            <div style={{ color: '#54657f', fontSize: 13, fontWeight: 800, marginBottom: 12 }}>● 決まり文履歴</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {phraseHistory.length === 0 ? (
                <div style={{ color: '#7b8ba5', fontSize: 13 }}>まだありません</div>
              ) : (
                phraseHistory.map((item) => (
                  <button
                    key={item}
                    type="button"
                    style={chipStyle}
                    onClick={() => setField('noteXPhrase', item)}
                  >
                    {item}
                    <span style={{ color: '#90a0b8' }}>×</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <input
              style={inputStyle}
              value={value.noteXUrl}
              onChange={(e) => setField('noteXUrl', e.target.value)}
              placeholder="URL"
            />
          </div>

          <div style={{ ...card, marginBottom: 14 }}>
            <div style={{ color: '#54657f', fontSize: 13, fontWeight: 800, marginBottom: 12 }}>● URL履歴</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {urlHistory.length === 0 ? (
                <div style={{ color: '#7b8ba5', fontSize: 13 }}>まだありません</div>
              ) : (
                urlHistory.map((item) => (
                  <button
                    key={item}
                    type="button"
                    style={chipStyle}
                    onClick={() => setField('noteXUrl', item)}
                  >
                    {item}
                    <span style={{ color: '#90a0b8' }}>×</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <select
              style={inputStyle}
              value={value.noteXInsertPosition}
              onChange={(e) => setField('noteXInsertPosition', e.target.value as InsertPosition)}
            >
              <option value="start">最初</option>
              <option value="end">最後</option>
            </select>
          </div>

          <div style={card}>
            <div style={{ color: '#54657f', fontSize: 13, fontWeight: 800, marginBottom: 12 }}>● 挿入位置履歴</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {insertHistory
                .filter((x) => x === 'start' || x === 'end')
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    style={chipStyle}
                    onClick={() => setField('noteXInsertPosition', item as InsertPosition)}
                  >
                    {item}
                    <span style={{ color: '#90a0b8' }}>×</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      <div style={sectionHeader} onClick={() => setOpenTikTok((v) => !v)}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#18263d' }}>TikTok設定</div>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>専用決まり文・挿入位置</div>
        </div>
        <div style={{ fontSize: 22, color: '#64748b' }}>{openTikTok ? '⌃' : '⌄'}</div>
      </div>

      {openTikTok && (
        <div style={{ ...card, background: '#e8fbff', borderColor: '#9fe7f5' }}>
          <div style={{ marginBottom: 14 }}>
            <input
              style={inputStyle}
              value={value.tiktokPhrase}
              onChange={(e) => setField('tiktokPhrase', e.target.value)}
              placeholder="続きはプロフィールから👇"
            />
          </div>

          <div style={{ ...card, marginBottom: 14 }}>
            <div style={{ color: '#54657f', fontSize: 13, fontWeight: 800, marginBottom: 12 }}>● TikTok決まり文履歴</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {phraseHistory.length === 0 ? (
                <div style={{ color: '#7b8ba5', fontSize: 13 }}>まだありません</div>
              ) : (
                phraseHistory.map((item) => (
                  <button
                    key={item}
                    type="button"
                    style={chipStyle}
                    onClick={() => setField('tiktokPhrase', item)}
                  >
                    {item}
                    <span style={{ color: '#90a0b8' }}>×</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <select
              style={inputStyle}
              value={value.tiktokInsertPosition}
              onChange={(e) => setField('tiktokInsertPosition', e.target.value as TiktokInsertPosition)}
            >
              <option value="start">最初（おすすめ）</option>
              <option value="end">最後</option>
              <option value="both">最初＋最後</option>
            </select>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onGenerate}
        disabled={loading}
        style={primaryButton}
      >
        {loading ? '生成中...' : '生成する ➤'}
      </button>

      <button
        type="button"
        onClick={onGenerateTrends}
        style={{
          ...primaryButton,
          fontSize: 16,
          background: '#ffffff',
          color: '#31445f',
          border: '1px solid #d2dae8'
        }}
      >
        トレンド生成
      </button>
    </div>
  );
}
