export interface Icon3DItem {
  id: string;
  name: string;
  src: string;
  category: 'ai' | 'social';
  tags: string[];
}

export const ICONS_3D: Icon3DItem[] = [
  // ── AI Tools ──
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    src: '/icons3d/chatgpt.png',
    category: 'ai',
    tags: ['chatgpt', 'openai', 'gpt', 'ai', 'bot', 'llm', 'chat'],
  },
  {
    id: 'claude',
    name: 'Claude',
    src: '/icons3d/claude.png',
    category: 'ai',
    tags: ['claude', 'anthropic', 'sonnet', 'opus', 'ai', 'assistant'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    src: '/icons3d/gemini.png',
    category: 'ai',
    tags: ['gemini', 'google', 'bard', 'flash', 'pro', 'ai', 'star'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    src: '/icons3d/deepseek.png',
    category: 'ai',
    tags: ['deepseek', 'r1', 'v3', 'whale', 'ai', 'code'],
  },
  {
    id: 'copilot',
    name: 'Copilot',
    src: '/icons3d/copilot.png',
    category: 'ai',
    tags: ['copilot', 'microsoft', 'bing', 'windows', 'ai'],
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    src: '/icons3d/meta-ai.png',
    category: 'ai',
    tags: ['meta', 'meta ai', 'llama', 'ring', 'ai'],
  },
  {
    id: 'grok',
    name: 'Grok',
    src: '/icons3d/grok.png',
    category: 'ai',
    tags: ['grok', 'xai', 'elon', 'musk', 'ai'],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    src: '/icons3d/perplexity.png',
    category: 'ai',
    tags: ['perplexity', 'search', 'research', 'ai', 'answer'],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    src: '/icons3d/midjourney.png',
    category: 'ai',
    tags: ['midjourney', 'mj', 'image', 'art', 'ai generator'],
  },

  // ── Social Media ──
  {
    id: 'instagram',
    name: 'Instagram',
    src: '/icons3d/instagram.png',
    category: 'social',
    tags: ['instagram', 'insta', 'ig', 'reels', 'story', 'post', 'social'],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    src: '/icons3d/whatsapp.png',
    category: 'social',
    tags: ['whatsapp', 'wa', 'chat', 'message', 'call', 'green'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    src: '/icons3d/youtube.png',
    category: 'social',
    tags: ['youtube', 'yt', 'video', 'shorts', 'stream', 'play', 'red'],
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    src: '/icons3d/x.png',
    category: 'social',
    tags: ['x', 'twitter', 'tweet', 'post', 'social'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    src: '/icons3d/linkedin.png',
    category: 'social',
    tags: ['linkedin', 'jobs', 'career', 'b2b', 'networking', 'blue'],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    src: '/icons3d/tiktok.png',
    category: 'social',
    tags: ['tiktok', 'short video', 'reels', 'viral', 'tok'],
  },
  {
    id: 'threads',
    name: 'Threads',
    src: '/icons3d/threads.png',
    category: 'social',
    tags: ['threads', 'meta', 'text', 'instagram threads'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    src: '/icons3d/facebook.png',
    category: 'social',
    tags: ['facebook', 'fb', 'meta', 'social network', 'blue'],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    src: '/icons3d/pinterest.png',
    category: 'social',
    tags: ['pinterest', 'pin', 'moodboard', 'aesthetic', 'red'],
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    src: '/icons3d/snapchat.png',
    category: 'social',
    tags: ['snapchat', 'snap', 'ghost', 'streak', 'yellow'],
  },
];
