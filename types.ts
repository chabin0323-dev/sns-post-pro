export type Platform =
  | 'TikTok'
  | 'Instagram Reels'
  | 'Instagram Feed'
  | 'X'
  | 'note'
  | 'YouTube Shorts';

export type TemplateMode = 'none' | 'start' | 'end' | 'both';

export interface TikTokSettings {
  hookStyle: 'strong' | 'soft' | 'emotional';
  duration: '15秒' | '30秒' | '60秒';
  includeCaptionIdea: boolean;
}

export interface GeneratedPost {
  id: string;
  theme: string;
  platform: Platform;
  title: string;
  content: string;
  hashtags: string[];
  capcutScript: string;
  createdAt: string;
  templateMode: TemplateMode;
  isPremiumGenerated: boolean;
}

export interface GenerateInput {
  theme: string;
  platform: Platform;
  tone: string;
  audience: string;
  purpose: string;
  templateMode: TemplateMode;
  templateStart: string;
  templateEnd: string;
  useEmoji: boolean;
  includeHashtags: boolean;
  includeCTA: boolean;
  tiktokSettings: TikTokSettings;
}

export interface ThemeSuggestion {
  id: string;
  label: string;
  category: string;
  premium?: boolean;
}
