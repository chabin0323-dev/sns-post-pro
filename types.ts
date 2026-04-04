export type Platform = 'TikTok' | 'X' | 'note' | 'Instagram' | 'YouTube';

export interface BuzzAnalysis {
  score: number;
  hookPower: number;
  readability: number;
  curiosity: number;
  conversion: number;
  reason: string[];
}

export interface VideoScene {
  id: number;
  duration: string;
  visual: string;
  telop: string;
  narration: string;
}

export interface GeneratedPost {
  id: string;
  platform: Platform;
  title: string;
  content: string;
  hashtags: string[];
  capcutScript: string;
  theme: string;
  target: string;
  cta: string;
  buzzScore: number;
  buzzAnalysis: BuzzAnalysis;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'ready' | 'posted';
  videoTitle: string;
  videoScenes: VideoScene[];
  videoDescription: string;
  thumbnailText: string;
}

export interface GenerateInput {
  theme: string;
  target: string;
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
  onGenerateIdeas: () => void;
  loading: boolean;
}

export interface ResultCardProps {
  item: GeneratedPost;
  onDelete: (id: string) => void;
  onBuildVideo: (id: string) => void;
}
