import type { GeneratedPost } from '../types';

export interface ImagePrompt {
  id: string;
  label: string;
  prompt: string;
}

type ThemeVisual = {
  subjects: string[];
  moods: string[];
  environments: string[];
  styles: string[];
  lightings: string[];
};

const THEME_VISUALS: Record<string, ThemeVisual> = {
  恋愛: {
    subjects: [
      'two silhouettes almost touching hands',
      'a woman sitting alone looking at her phone with a soft smile',
      'close-up of intertwined fingers',
      'couple walking on a city street at dusk',
      'a person gazing out a window with longing eyes'
    ],
    moods: ['romantic', 'bittersweet', 'tender', 'hopeful', 'melancholic'],
    environments: ['city lights bokeh background', 'cherry blossom park', 'cozy cafe interior', 'rainy window', 'sunset beach'],
    styles: ['cinematic', 'soft film grain', 'dreamy pastel', 'moody editorial', 'warm vintage'],
    lightings: ['golden hour side light', 'soft window light', 'neon reflection', 'candlelight glow', 'blue hour ambient']
  },
  告白: {
    subjects: [
      'a nervous person holding flowers behind their back',
      'two people facing each other with tension',
      'close-up of a trembling hand reaching out',
      'a person taking a deep breath before speaking',
      'eye contact between two people in soft focus'
    ],
    moods: ['nervous', 'hopeful', 'emotional', 'tense', 'heartfelt'],
    environments: ['school rooftop at sunset', 'quiet park path', 'empty corridor', 'under a street lamp at night', 'autumn leaves background'],
    styles: ['cinematic portrait', 'shallow depth of field', 'warm color grade', 'emotional close-up', 'soft blur'],
    lightings: ['warm golden backlight', 'soft diffused light', 'dusk rim light', 'street lamp glow', 'overcast natural light']
  },
  復縁: {
    subjects: [
      'a person staring at old photos on their phone',
      'empty park bench where two used to sit',
      'a hand hesitating over a phone screen',
      'person walking alone in a place full of memories',
      'reflection of a person in a rain-soaked window'
    ],
    moods: ['nostalgic', 'longing', 'melancholic', 'uncertain', 'hopeful'],
    environments: ['rainy city street', 'empty cafe booth', 'foggy morning park', 'night city alone', 'old photo album setting'],
    styles: ['moody cinematic', 'desaturated film look', 'blue-toned drama', 'hazy soft focus', 'emotional realism'],
    lightings: ['cold blue tone', 'rain reflection light', 'dim indoor lamp', 'overcast grey light', 'fading sunset']
  },
  ダイエット: {
    subjects: [
      'a confident woman in activewear doing yoga at sunrise',
      'healthy colorful meal prep on a clean kitchen counter',
      'person jogging along a scenic morning path',
      'before-and-after transformation visual split screen',
      'close-up of strong hands gripping a water bottle'
    ],
    moods: ['motivated', 'energetic', 'fresh', 'empowering', 'clean'],
    environments: ['bright modern gym', 'outdoor park morning', 'minimalist kitchen', 'yoga studio', 'rooftop at sunrise'],
    styles: ['clean lifestyle editorial', 'bright airy aesthetic', 'high-energy sports visual', 'minimal wellness', 'vibrant color pop'],
    lightings: ['bright natural morning light', 'soft studio light', 'vibrant midday sun', 'clean white ambient', 'warm sunrise glow']
  },
  美容: {
    subjects: [
      'close-up of glowing dewy skin with soft bokeh',
      'elegant woman applying skincare in a mirror',
      'beauty flat lay with skincare products on marble',
      'person with perfect skin in soft natural light',
      'hair flowing in slow motion against pastel background'
    ],
    moods: ['luxurious', 'fresh', 'elegant', 'glowing', 'serene'],
    environments: ['marble bathroom', 'pastel studio', 'natural light vanity', 'floral background', 'minimalist white setting'],
    styles: ['beauty editorial', 'soft pastel aesthetic', 'luxury cosmetic ad', 'fresh natural look', 'high-fashion portrait'],
    lightings: ['soft ring light', 'natural window diffuse light', 'pink warm glow', 'clean bright studio', 'golden morning light']
  },
  副業: {
    subjects: [
      'person working on a laptop in a stylish cafe',
      'hands typing on keyboard with multiple income charts',
      'freelancer celebrating success at a clean desk setup',
      'money and laptop on a minimalist white desk',
      'person smiling at phone notification of earnings'
    ],
    moods: ['ambitious', 'confident', 'focused', 'successful', 'free'],
    environments: ['modern home office', 'trendy cafe', 'rooftop workspace', 'minimalist desk setup', 'open laptop by window'],
    styles: ['business lifestyle', 'clean modern aesthetic', 'success visual', 'motivational editorial', 'tech minimalism'],
    lightings: ['bright clean natural light', 'warm desk lamp glow', 'morning window light', 'professional studio', 'afternoon soft light']
  },
  集客: {
    subjects: [
      'crowd of people gravitating toward glowing sign',
      'phone screen showing rapidly growing followers count',
      'confident entrepreneur speaking to an engaged audience',
      'social media notification explosion on a phone screen',
      'person standing out from the crowd in bright spotlight'
    ],
    moods: ['energetic', 'magnetic', 'powerful', 'viral', 'impactful'],
    environments: ['dark dramatic stage', 'neon city backdrop', 'social media abstract', 'modern event space', 'digital grid background'],
    styles: ['bold graphic editorial', 'neon cyberpunk', 'high contrast drama', 'modern marketing visual', 'dynamic motion'],
    lightings: ['dramatic spotlight', 'neon color light', 'high contrast backlight', 'electric blue tone', 'glowing screen light']
  },
  SNS運用: {
    subjects: [
      'phone displaying viral content with engagement numbers',
      'content creator filming themselves with ring light setup',
      'analytics dashboard showing explosive growth curve',
      'person editing short video on phone with stylus',
      'flat lay of content creation tools phone camera notes'
    ],
    moods: ['creative', 'strategic', 'viral', 'professional', 'inspired'],
    environments: ['neon-lit studio', 'clean creator workspace', 'abstract digital space', 'modern apartment with good lighting', 'social media visual grid'],
    styles: ['creator lifestyle', 'digital aesthetic', 'modern tech visual', 'clean minimal branding', 'vibrant social media style'],
    lightings: ['ring light warm glow', 'neon accent light', 'clean studio white', 'colorful LED backdrop', 'bright daylight']
  },
  占い: {
    subjects: [
      'mystical tarot cards spread on dark velvet',
      'glowing crystal ball with swirling mist inside',
      'close-up of an eye with galaxy reflection',
      'hands holding glowing orb in moonlight',
      'zodiac symbols floating in cosmic stardust'
    ],
    moods: ['mystical', 'ethereal', 'mysterious', 'cosmic', 'magical'],
    environments: ['dark starry cosmos', 'moonlit forest', 'candlelit mystical room', 'galaxy nebula background', 'ancient temple ruins'],
    styles: ['fantasy art', 'dark mystical editorial', 'cosmic surrealism', 'magical realism', 'celestial aesthetic'],
    lightings: ['purple cosmic glow', 'candlelight warm flicker', 'moonlight blue silver', 'neon mystical aura', 'starlight diffuse']
  }
};

const DEFAULT_VISUAL: ThemeVisual = {
  subjects: [
    'person standing confidently against abstract background',
    'close-up of determined eyes with shallow depth of field',
    'journey path leading to bright horizon',
    'hands holding key symbolizing success',
    'dramatic silhouette against vibrant sky'
  ],
  moods: ['inspiring', 'powerful', 'motivational', 'bold', 'emotional'],
  environments: ['abstract gradient background', 'dramatic open sky', 'minimalist studio', 'urban night city', 'misty mountain path'],
  styles: ['cinematic portrait', 'bold editorial', 'emotional storytelling', 'dynamic composition', 'high-impact visual'],
  lightings: ['dramatic side light', 'golden hour glow', 'moody backlight', 'vibrant color tone', 'soft diffused light']
};

function detectVisual(theme: string): ThemeVisual {
  const keys = Object.keys(THEME_VISUALS);
  for (const key of keys) {
    if (theme.includes(key)) return THEME_VISUALS[key];
  }
  return DEFAULT_VISUAL;
}

function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const LABELS = ['シーン①', 'シーン②', 'シーン③', 'シーン④', 'シーン⑤'];

const STYLE_SUFFIXES = [
  'vertical 9:16 aspect ratio, CapCut short video thumbnail, ultra-realistic, 4K quality, no text',
  'vertical portrait 9:16, TikTok-style cinematic frame, photorealistic, high detail, no watermark',
  '9:16 vertical composition, social media video still, professional photography, vivid colors, no text',
  'portrait orientation 9:16, short-form video aesthetic, editorial quality, sharp focus, no text overlay',
  'vertical 9:16 video frame, CapCut cinematic style, high resolution, visually striking, no text'
];

export function generateImagePrompts(post: GeneratedPost): ImagePrompt[] {
  const visual = detectVisual(post.theme);

  return Array.from({ length: 5 }, (_, i) => {
    const subject = visual.subjects[i % visual.subjects.length];
    const mood = visual.moods[i % visual.moods.length];
    const environment = visual.environments[i % visual.environments.length];
    const style = visual.styles[i % visual.styles.length];
    const lighting = visual.lightings[i % visual.lightings.length];
    const suffix = STYLE_SUFFIXES[i];

    const prompt = `${subject}, ${mood} atmosphere, ${environment}, ${lighting}, ${style} photography, ${suffix}`;

    return {
      id: generateId(),
      label: LABELS[i],
      prompt
    };
  });
}
