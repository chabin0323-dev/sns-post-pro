export type Platform = 'TikTok' | 'X' | 'note' | 'Instagram' | 'YouTube';

export type Gender = '指定なし' | '男性向け' | '女性向け';

export interface BuzzAnalysis {
  score: number;
  hookPower: number;
  readability: number;
  curiosity: number;
  conversion: number;
  reason: string[];
}

export interface GeneratedPost {
  id: string;
  platform: Platform;
  title: string;
  content: string;
  hashtags: string[];
  theme: string;
  target: string;
  gender: Gender;
  cta: string;
  buzzScore: number;
  buzzAnalysis: BuzzAnalysis;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'ready' | 'posted';
}

export interface GenerateInput {
  theme: string;
  target: string;
  gender: Gender;
  platforms: Platform[];
  tone: 'soft' | 'normal' | 'strong';
  goal: 'engagement' | 'sales' | 'followers' | 'lead';
  includeHashtags: boolean;
  includeFixedHashtags: boolean;
  hashtagMode: 'auto' | 'none';
  ctaMode: 'soft' | 'normal' | 'strong';
  includeUrgency: boolean;
  includeOffer: boolean;
}

export interface TrendIdea {
  id: string;
  angle: string;
  title: string;
  hook: string;
  reason: string;
}

export interface InputFormProps {
  value: GenerateInput;
  onChange: (next: GenerateInput) => void;
  onGenerate: () => void;
  onGenerateTrends: () => void;
  loading: boolean;
  themeHistory: string[];
  targetHistory: string[];
  onApplyThemeSuggestion: (theme: string) => void;
  onApplyTargetSuggestion: (target: string) => void;
}

export interface ResultCardProps {
  item: GeneratedPost;
  onDelete: (id: string) => void;
}
