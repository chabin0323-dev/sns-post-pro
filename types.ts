export type Platform = 'TikTok' | 'X' | 'note' | 'Instagram' | 'YouTube';

export type Gender = '指定なし' | '男性向け' | '女性向け';

export interface GeneratedPost {
  id: string;
  platform: Platform;
  title: string;
  content: string;
  hashtags: string[];
  theme: string;
  target: string;
  gender: Gender;
  buzzScore: number;
  buzzAnalysis: {
    score: number;
    hookPower: number;
    readability: number;
    curiosity: number;
    conversion: number;
    reason: string[];
  };
  createdAt: string;
  updatedAt: string;
  status: 'ready';
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
