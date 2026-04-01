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
  theme?: string;
  timestamp?: Date;
}
