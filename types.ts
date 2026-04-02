export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GeneratedPost {
  title: string;
  content: string;
  hashtags: string[];
  capcutScript: string;
  xPost: string;
  instagramPost: string;
  youtubePost: string;

  article?: string;
  cta?: string;
  thumbnail?: string;
  capcutTemplate?: string;
  profile?: string;
  noteLead?: string;
  weeklyTemplates?: string[];
  buzzScore?: number;

  theme?: string;
  generatedLength?: string;
  generatedGender?: string;
  generatedAge?: string;
  timestamp?: Date | string;
}
