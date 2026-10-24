/**
 * VIRAL TRENDING 10 CAROUSEL TEMPLATE PACK
 *
 * Generated with Claude 5.5 (Claude Opus 5.5 via OxionAI).
 * Inspired by the top-performing 2026 Instagram & Pinterest carousel formats:
 * 1. Brutally Honest Truths (Editorial Self-Growth)
 * 2. 5 Costly Profile Mistakes (Creator Debunker)
 * 3. Steal My 5-Step System (Pinterest High-Save Playbook)
 * 4. Soft Reset & Glow Up (Aesthetic Warm Moodboard)
 * 5. Deep Focus & Dopamine Protocol (Dark Tech Productivity)
 * 6. Psychology of Brand Colors (Visual Design Guide)
 * 7. The 7-Figure Offer Blueprint (SaaS / Agency Breakdown)
 * 8. 5 Viral Hook Formulas (Canary Highlighter Masterclass)
 * 9. Myth vs Science (Split Diagnostic Debunker)
 * 10. The 30-Day Solopreneur Roadmap (Step-by-Step Milestones)
 *
 * All slides: 1080x1350 (4:5 canvas). 100% native editable text and shapes.
 */

import {
  Template, Slide, CanvasElement, TemplateCategory, TemplateStyle, TemplateAudience,
} from '../types';

// ─── ELEMENT BUILDERS ────────────────────────────────────────────────────────

type El = Omit<CanvasElement, 'id' | 'zIndex'> & { zIndex?: number };

interface TOpts {
  font?: string;
  weight?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  ls?: number;
  lh?: number;
  upper?: boolean;
  underline?: boolean;
  rot?: number;
  op?: number;
  fontStyle?: 'normal' | 'italic';
}

const T = (text: string, x: number, y: number, w: number, h: number, size: number, o: TOpts = {}): El => ({
  type: 'text', x, y, width: w, height: h,
  rotation: o.rot ?? 0, opacity: o.op ?? 1, locked: false, visible: true,
  properties: {
    text,
    fontFamily: o.font ?? 'Inter',
    fontSize: size,
    fontWeight: o.weight ?? 400,
    color: o.color ?? '#111111',
    alignment: o.align ?? 'left',
    letterSpacing: o.ls ?? 0,
    lineHeight: o.lh ?? 1.25,
    textCase: o.upper ? 'uppercase' : 'none',
    textDecoration: o.underline ? 'underline' : 'none',
    fontStyle: o.fontStyle ?? 'normal',
  },
});

interface SOpts { r?: number; stroke?: string; sw?: number; rot?: number; op?: number }

const shape = (shapeType: 'rectangle' | 'circle', x: number, y: number, w: number, h: number, fill: string, o: SOpts = {}): El => ({
  type: 'shape', x, y, width: w, height: h,
  rotation: o.rot ?? 0, opacity: o.op ?? 1, locked: false, visible: true,
  properties: {
    shapeType,
    fill,
    ...(o.r ? { borderRadius: o.r } : {}),
    ...(o.stroke ? { stroke: o.stroke, strokeWidth: o.sw ?? 2 } : {}),
  },
});

const R = (x: number, y: number, w: number, h: number, fill: string, o: SOpts = {}): El => shape('rectangle', x, y, w, h, fill, o);
const C = (x: number, y: number, w: number, h: number, fill: string, o: SOpts = {}): El => shape('circle', x, y, w, h, fill, o);

const pad = (n: number) => String(n).padStart(2, '0');
const pager = (i: number, n: number, color: string, font = 'Space Grotesk'): El =>
  T(`${pad(i)} / ${pad(n)}`, 800, 1260, 210, 40, 24, { font, weight: 700, color, align: 'right', ls: 2 });

const handle = (color: string, font = 'Inter', text = '@yourhandle'): El =>
  T(text, 70, 1260, 500, 40, 24, { font, weight: 600, color });

// ─── TEMPLATE FACTORY ────────────────────────────────────────────────────────

interface SlideDef { bg: string; els: El[] }

interface TplDef {
  key: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  style: TemplateStyle;
  audience: TemplateAudience;
  platform: 'instagram' | 'pinterest';
  slides: SlideDef[];
}

const build = (d: TplDef): Template => {
  const id = `trending-${d.key}`;
  const now = '2026-10-24T12:00:00Z';
  const slides: Slide[] = d.slides.map((s, si) => ({
    id: `${id}-s${si + 1}`,
    order: si,
    width: 1080,
    height: 1350,
    background: { type: 'solid', value: s.bg },
    elements: s.els.map((e, ei) => ({
      ...e,
      id: `${id}-s${si + 1}-e${ei + 1}`,
      zIndex: e.zIndex ?? ei + 1,
    })) as CanvasElement[],
  }));

  return {
    id,
    name: d.name,
    description: d.description,
    category: d.category,
    tags: d.tags,
    style: d.style,
    audience: d.audience,
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: slides.length,
    isTrending: true,
    isNew: true,
    sourceType: 'reference_inspired',
    sourcePlatform: d.platform,
    attributionRequired: false,
    status: 'published',
    useCount: 142,
    createdAt: now,
    updatedAt: now,
    slides,
  };
};

// ─── 1. BRUTALLY HONEST TRUTHS (Self-Growth Editorial) ──────────────────────
const TPL_1 = build({
  key: 'honest-truths',
  name: 'Brutally Honest Truths — Editorial Minimal',
  description: 'High-save personal development carousel with warm cream tones, serif title and caramel accents.',
  category: 'Personal Brand',
  tags: ['viral', 'mindset', 'editorial', 'honest-truths', 'pinterest-aesthetic'],
  style: 'Editorial',
  audience: 'Creators',
  platform: 'pinterest',
  slides: [
    {
      bg: '#FFF9F5',
      els: [
        R(70, 100, 260, 48, '#C08B5C', { r: 24 }),
        T('HARSH REALITY', 95, 112, 210, 28, 16, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', upper: true, ls: 2 }),
        T('10 Brutal Truths\nI Wish Someone\nTold Me at 22.', 70, 220, 940, 320, 84, { font: 'Playfair Display', weight: 900, color: '#1A1A1A', lh: 1.1 }),
        R(70, 580, 120, 4, '#C08B5C'),
        T('Most people spend their 20s pleasing people who will not matter in their 30s. Swipe through for the uncomfortable blueprint.', 70, 630, 940, 140, 32, { font: 'Inter', weight: 400, color: '#4A4A4A', lh: 1.4 }),
        R(70, 840, 940, 220, '#F6EDE6', { r: 24 }),
        T('SAVE THIS', 110, 880, 200, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#C08B5C', upper: true, ls: 2 }),
        T('Re-read this every time you feel lost or behind in life.', 110, 930, 860, 80, 30, { font: 'Inter', weight: 600, color: '#1A1A1A' }),
        handle('#8C827A'),
        pager(1, 5, '#8C827A'),
      ],
    },
    {
      bg: '#FFF9F5',
      els: [
        T('TRUTH 01 & 02', 70, 100, 400, 30, 18, { font: 'Space Grotesk', weight: 700, color: '#C08B5C', upper: true, ls: 2 }),
        R(70, 180, 940, 440, '#FFFFFF', { r: 28, stroke: '#EADFD7', sw: 2 }),
        T('01', 120, 230, 100, 60, 52, { font: 'Playfair Display', weight: 900, color: '#C08B5C' }),
        T('Nobody is coming to save you.', 120, 300, 840, 70, 42, { font: 'Playfair Display', weight: 800, color: '#1A1A1A' }),
        T('Your dream career, health, and peace are 100% on you. Waiting for the right timing or a savior is the most comfortable trap.', 120, 380, 840, 180, 28, { font: 'Inter', weight: 400, color: '#4A4A4A', lh: 1.4 }),
        R(70, 680, 940, 440, '#FFFFFF', { r: 28, stroke: '#EADFD7', sw: 2 }),
        T('02', 120, 730, 100, 60, 52, { font: 'Playfair Display', weight: 900, color: '#C08B5C' }),
        T('Consistency > Motivation.', 120, 800, 840, 70, 42, { font: 'Playfair Display', weight: 800, color: '#1A1A1A' }),
        T('The day you don’t feel like doing the work is the only day that actually moves the needle. Anyone can work on high energy days.', 120, 880, 840, 180, 28, { font: 'Inter', weight: 400, color: '#4A4A4A', lh: 1.4 }),
        handle('#8C827A'),
        pager(2, 5, '#8C827A'),
      ],
    },
    {
      bg: '#FFF9F5',
      els: [
        T('TRUTH 03 & 04', 70, 100, 400, 30, 18, { font: 'Space Grotesk', weight: 700, color: '#C08B5C', upper: true, ls: 2 }),
        R(70, 180, 940, 440, '#FFFFFF', { r: 28, stroke: '#EADFD7', sw: 2 }),
        T('03', 120, 230, 100, 60, 52, { font: 'Playfair Display', weight: 900, color: '#C08B5C' }),
        T('Saying Yes means saying No.', 120, 300, 840, 70, 42, { font: 'Playfair Display', weight: 800, color: '#1A1A1A' }),
        T('Every time you accept an unnecessary meeting or toxic gathering, you are saying No to your own deep work and mental sanity.', 120, 380, 840, 180, 28, { font: 'Inter', weight: 400, color: '#4A4A4A', lh: 1.4 }),
        R(70, 680, 940, 440, '#FFFFFF', { r: 28, stroke: '#EADFD7', sw: 2 }),
        T('04', 120, 730, 100, 60, 52, { font: 'Playfair Display', weight: 900, color: '#C08B5C' }),
        T('Comparison is a thief of joy.', 120, 800, 840, 70, 42, { font: 'Playfair Display', weight: 800, color: '#1A1A1A' }),
        T('You are judging someone’s highlight reel against your behind-the-scenes. Run your own race at your own sustainable pace.', 120, 880, 840, 180, 28, { font: 'Inter', weight: 400, color: '#4A4A4A', lh: 1.4 }),
        handle('#8C827A'),
        pager(3, 5, '#8C827A'),
      ],
    },
    {
      bg: '#FFF9F5',
      els: [
        T('THE ONE THING TO REMEMBER', 70, 100, 600, 30, 18, { font: 'Space Grotesk', weight: 700, color: '#C08B5C', upper: true, ls: 2 }),
        R(70, 180, 940, 880, '#2C221E', { r: 32 }),
        T('The Rule of 3 Years', 130, 260, 820, 70, 48, { font: 'Playfair Display', weight: 800, color: '#FFF9F5' }),
        T('Nothing meaningful happens in 3 months.\nEverything transforms in 3 years.', 130, 350, 820, 140, 38, { font: 'Playfair Display', weight: 600, color: '#E8B993', lh: 1.3 }),
        R(130, 520, 820, 2, '#4A3B35'),
        T('• Year 1: You feel foolish, make mistakes, and nobody cares.\n• Year 2: Systems click, competence compounds.\n• Year 3: The exponential hockey-stick returns begin.\n\nDon’t quit when you are still in Year 1.', 130, 570, 820, 380, 30, { font: 'Inter', weight: 400, color: '#D4C5BE', lh: 1.6 }),
        handle('#8C827A'),
        pager(4, 5, '#8C827A'),
      ],
    },
    {
      bg: '#FFF9F5',
      els: [
        C(440, 240, 200, 200, '#F6EDE6'),
        T('✦', 510, 280, 100, 100, 80, { font: 'Inter', color: '#C08B5C', align: 'center' }),
        T('Which truth hit\nyou hardest?', 70, 500, 940, 180, 72, { font: 'Playfair Display', weight: 900, color: '#1A1A1A', align: 'center', lh: 1.15 }),
        T('Drop your thoughts in the comments.\nSave this post so you have it when you need courage.', 120, 720, 840, 120, 30, { font: 'Inter', weight: 400, color: '#4A4A4A', align: 'center', lh: 1.5 }),
        R(240, 900, 600, 90, '#C08B5C', { r: 45 }),
        T('FOLLOW FOR DAILY TRUTHS', 260, 930, 560, 40, 24, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', align: 'center', upper: true, ls: 2 }),
        handle('#8C827A'),
        pager(5, 5, '#8C827A'),
      ],
    },
  ],
});

// ─── 2. 5 INSTAGRAM BIO MISTAKES (Viral Creator Debunker) ────────────────────
const TPL_2 = build({
  key: 'bio-mistakes',
  name: '5 Bio Mistakes Costing You Followers',
  description: 'Lavender aesthetic mistake-fixer carousel with pill badges and actionable side-by-side solutions.',
  category: 'Marketing',
  tags: ['instagram-growth', 'creator-tips', 'social-media', 'viral-bio', 'mistake-fixer'],
  style: 'Modern',
  audience: 'Creators',
  platform: 'instagram',
  slides: [
    {
      bg: '#F2F0FF',
      els: [
        R(70, 100, 260, 48, '#EF4444', { r: 24 }),
        T('AUDIT YOUR PROFILE', 95, 112, 210, 28, 15, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', upper: true, ls: 2 }),
        T('5 Bio Mistakes\nCosting You\n1,000s of Followers.', 70, 210, 940, 320, 80, { font: 'Plus Jakarta Sans', weight: 900, color: '#1E1B4B', lh: 1.1 }),
        T('People visit your profile and leave within 3 seconds.\nHere is the exact framework to turn views into followers.', 70, 570, 940, 120, 32, { font: 'Inter', weight: 400, color: '#475569', lh: 1.4 }),
        R(70, 760, 940, 320, '#FFFFFF', { r: 28, stroke: '#DDD6FE', sw: 2 }),
        T('THE 3-SECOND TEST', 120, 810, 400, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#6366F1', upper: true, ls: 2 }),
        T('1. Who are you for?\n2. What problem do you solve?\n3. Why should they trust you?', 120, 860, 840, 180, 34, { font: 'Plus Jakarta Sans', weight: 700, color: '#1E1B4B', lh: 1.5 }),
        handle('#6366F1'),
        pager(1, 5, '#6366F1'),
      ],
    },
    {
      bg: '#F2F0FF',
      els: [
        R(70, 100, 180, 44, '#EF4444', { r: 22 }),
        T('MISTAKE #1', 95, 110, 140, 26, 16, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Vague, Poetry Headlines', 70, 180, 940, 70, 52, { font: 'Plus Jakarta Sans', weight: 900, color: '#1E1B4B' }),
        R(70, 280, 940, 340, '#FEE2E2', { r: 24, stroke: '#FCA5A5', sw: 2 }),
        T('❌ WRONG (Vague & Confusing)', 120, 320, 600, 30, 20, { font: 'Space Grotesk', weight: 800, color: '#B91C1C' }),
        T('"Spreading vibes and living my passion daily ✨💫"', 120, 380, 840, 100, 34, { font: 'Inter', weight: 600, color: '#7F1D1D', fontStyle: 'italic' }),
        T('Nobody knows what you offer or why to care.', 120, 490, 840, 80, 24, { font: 'Inter', weight: 500, color: '#991B1B' }),
        R(70, 680, 940, 380, '#DCFCE7', { r: 24, stroke: '#86EFAC', sw: 2 }),
        T('✅ FIX (Clear Positioning)', 120, 720, 600, 30, 20, { font: 'Space Grotesk', weight: 800, color: '#15803D' }),
        T('"I help founders scale to 100k views on LinkedIn with zero ad spend."', 120, 780, 840, 140, 36, { font: 'Plus Jakarta Sans', weight: 800, color: '#14532D' }),
        T('Specific niche + tangible outcome = instant follow.', 120, 940, 840, 60, 24, { font: 'Inter', weight: 600, color: '#166534' }),
        handle('#6366F1'),
        pager(2, 5, '#6366F1'),
      ],
    },
    {
      bg: '#F2F0FF',
      els: [
        R(70, 100, 180, 44, '#EF4444', { r: 22 }),
        T('MISTAKE #2', 95, 110, 140, 26, 16, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Zero Search Keywords in Name', 70, 180, 940, 70, 48, { font: 'Plus Jakarta Sans', weight: 900, color: '#1E1B4B' }),
        R(70, 280, 940, 400, '#FFFFFF', { r: 28, stroke: '#DDD6FE', sw: 2 }),
        T('THE NAME FIELD IS SEO RANKED', 120, 330, 600, 30, 18, { font: 'Space Grotesk', weight: 800, color: '#6366F1', upper: true }),
        T('Your "Name" field (not username) is searchable by Instagram algorithms.', 120, 380, 840, 100, 30, { font: 'Inter', weight: 500, color: '#334155', lh: 1.4 }),
        R(120, 490, 840, 130, '#EEF2FF', { r: 16 }),
        T('Instead of: "Alex"', 150, 520, 780, 30, 24, { font: 'Inter', weight: 500, color: '#64748B' }),
        T('Use: "Alex | Carousel Design & AI"', 150, 560, 780, 40, 30, { font: 'Plus Jakarta Sans', weight: 800, color: '#4338CA' }),
        R(70, 740, 940, 360, '#FFFFFF', { r: 28, stroke: '#DDD6FE', sw: 2 }),
        T('RESULT', 120, 790, 400, 30, 18, { font: 'Space Grotesk', weight: 800, color: '#10B981', upper: true }),
        T('You show up on top when users search for your niche in the Explore tab.', 120, 840, 840, 140, 32, { font: 'Plus Jakarta Sans', weight: 700, color: '#1E1B4B', lh: 1.4 }),
        handle('#6366F1'),
        pager(3, 5, '#6366F1'),
      ],
    },
    {
      bg: '#F2F0FF',
      els: [
        R(70, 100, 260, 44, '#6366F1', { r: 22 }),
        T('MISTAKES 3, 4 & 5', 95, 110, 220, 26, 16, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Quick-Fire Audit Checklist', 70, 180, 940, 70, 50, { font: 'Plus Jakarta Sans', weight: 900, color: '#1E1B4B' }),
        R(70, 280, 940, 230, '#FFFFFF', { r: 24, stroke: '#DDD6FE', sw: 2 }),
        T('03. Linktree with 14 links', 120, 320, 800, 40, 32, { font: 'Plus Jakarta Sans', weight: 800, color: '#1E1B4B' }),
        T('Decision fatigue kills clicks. Give ONE clear call-to-action link only.', 120, 370, 800, 90, 24, { font: 'Inter', weight: 400, color: '#64748B', lh: 1.3 }),
        R(70, 540, 940, 230, '#FFFFFF', { r: 24, stroke: '#DDD6FE', sw: 2 }),
        T('04. Dark, blurry avatar', 120, 580, 800, 40, 32, { font: 'Plus Jakarta Sans', weight: 800, color: '#1E1B4B' }),
        T('High-contrast face photo with bright background increases tap-through by 38%.', 120, 630, 800, 90, 24, { font: 'Inter', weight: 400, color: '#64748B', lh: 1.3 }),
        R(70, 800, 940, 230, '#FFFFFF', { r: 24, stroke: '#DDD6FE', sw: 2 }),
        T('05. No Lead Magnet CTA', 120, 840, 800, 40, 32, { font: 'Plus Jakarta Sans', weight: 800, color: '#1E1B4B' }),
        T('Point down to your link with a free cheat-sheet or starter kit.', 120, 890, 800, 90, 24, { font: 'Inter', weight: 400, color: '#64748B', lh: 1.3 }),
        handle('#6366F1'),
        pager(4, 5, '#6366F1'),
      ],
    },
    {
      bg: '#1E1B4B',
      els: [
        T('READY TO FIX YOURS?', 70, 220, 940, 40, 22, { font: 'Space Grotesk', weight: 800, color: '#A5B4FC', align: 'center', upper: true, ls: 3 }),
        T('Audit Your Bio in\nUnder 60 Seconds.', 70, 300, 940, 200, 72, { font: 'Plus Jakarta Sans', weight: 900, color: '#FFFFFF', align: 'center', lh: 1.15 }),
        T('Drop your handle below and I will review your bio in the DMs for free.', 120, 540, 840, 100, 32, { font: 'Inter', weight: 400, color: '#C7D2FE', align: 'center', lh: 1.5 }),
        R(240, 720, 600, 90, '#6366F1', { r: 45 }),
        T('COMMENT "AUDIT" BELOW', 260, 750, 560, 40, 24, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', align: 'center', upper: true, ls: 2 }),
        handle('#A5B4FC'),
        pager(5, 5, '#A5B4FC'),
      ],
    },
  ],
});

// ─── 3. STEAL MY 5-STEP SYSTEM (Pinterest Viral Playbook) ────────────────────
const TPL_3 = build({
  key: 'content-system',
  name: 'Steal My 5-Step System — Clean Playbook',
  description: 'Pinterest #1 saved format with stark white background, jet black typography and neon emerald accents.',
  category: 'Creator',
  tags: ['playbook', 'pinterest-viral', 'content-system', 'framework', 'swipe-file'],
  style: 'Bold',
  audience: 'Creators',
  platform: 'pinterest',
  slides: [
    {
      bg: '#FFFFFF',
      els: [
        R(70, 90, 220, 46, '#10B981', { r: 23 }),
        T('FREE PLAYBOOK', 95, 102, 170, 26, 16, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', upper: true, ls: 2 }),
        T('Steal My 5-Step\nContent System.', 70, 190, 940, 220, 84, { font: 'Space Grotesk', weight: 900, color: '#0A0A0A', lh: 1.1 }),
        T('Gained 54,000 targeted followers and $18,400 in revenue in 45 days. Complete workflow inside.', 70, 440, 940, 110, 32, { font: 'Inter', weight: 400, color: '#52525B', lh: 1.4 }),
        R(70, 600, 940, 480, '#F4F4F5', { r: 32 }),
        T('SYSTEM BREAKDOWN', 120, 650, 400, 30, 18, { font: 'Space Grotesk', weight: 800, color: '#10B981', upper: true, ls: 2 }),
        T('Step 1: Idea Mining (Reddit + Quora)\nStep 2: 3-Hook Ideation Formula\nStep 3: Visual Template Hierarchy\nStep 4: Smart Repurposing Engine\nStep 5: Comment Community Funnel', 120, 710, 840, 320, 32, { font: 'Space Grotesk', weight: 700, color: '#18181B', lh: 1.8 }),
        handle('#71717A'),
        pager(1, 5, '#71717A'),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        T('STEP 01 & 02', 70, 90, 300, 30, 18, { font: 'Space Grotesk', weight: 800, color: '#10B981', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#FAFAFA', { r: 28, stroke: '#E4E4E7', sw: 2 }),
        R(110, 200, 130, 40, '#0A0A0A', { r: 12 }),
        T('STEP 1', 130, 210, 90, 22, 16, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Mining Unfiltered Pain Points', 110, 270, 860, 60, 40, { font: 'Space Grotesk', weight: 900, color: '#0A0A0A' }),
        T('Stop brainstorming out of thin air. Search top subreddits in your niche and sort by "Top - Past Year". The top questions become your carousel titles.', 110, 350, 860, 160, 28, { font: 'Inter', weight: 400, color: '#52525B', lh: 1.4 }),
        R(70, 680, 940, 480, '#FAFAFA', { r: 28, stroke: '#E4E4E7', sw: 2 }),
        R(110, 720, 130, 40, '#10B981', { r: 12 }),
        T('STEP 2', 130, 730, 90, 22, 16, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Write 5 Hooks Before The Body', 110, 790, 860, 60, 40, { font: 'Space Grotesk', weight: 900, color: '#0A0A0A' }),
        T('If slide 1 fails, slide 2 never gets seen. Spend 50% of your creation time testing negative hooks, curiosity gaps, and contrarian claims.', 110, 870, 860, 160, 28, { font: 'Inter', weight: 400, color: '#52525B', lh: 1.4 }),
        handle('#71717A'),
        pager(2, 5, '#71717A'),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        T('STEP 03 & 04', 70, 90, 300, 30, 18, { font: 'Space Grotesk', weight: 800, color: '#10B981', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#FAFAFA', { r: 28, stroke: '#E4E4E7', sw: 2 }),
        R(110, 200, 130, 40, '#0A0A0A', { r: 12 }),
        T('STEP 3', 130, 210, 90, 22, 16, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('1 Idea Per Slide. Zero Fluff.', 110, 270, 860, 60, 40, { font: 'Space Grotesk', weight: 900, color: '#0A0A0A' }),
        T('Keep font sizes bold (minimum 32px for body, 50px for headlines). Every slide must deliver one clear dopamine hit or revelation.', 110, 350, 860, 160, 28, { font: 'Inter', weight: 400, color: '#52525B', lh: 1.4 }),
        R(70, 680, 940, 480, '#FAFAFA', { r: 28, stroke: '#E4E4E7', sw: 2 }),
        R(110, 720, 130, 40, '#10B981', { r: 12 }),
        T('STEP 4', 130, 730, 90, 22, 16, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Repurpose Across 3 Platforms', 110, 790, 860, 60, 40, { font: 'Space Grotesk', weight: 900, color: '#0A0A0A' }),
        T('1 Instagram Carousel = 1 LinkedIn Document PDF = 5 Pinterest Idea Pins = 1 X/Twitter Thread. Create once, publish everywhere.', 110, 870, 860, 160, 28, { font: 'Inter', weight: 400, color: '#52525B', lh: 1.4 }),
        handle('#71717A'),
        pager(3, 5, '#71717A'),
      ],
    },
    {
      bg: '#0A0A0A',
      els: [
        R(70, 100, 160, 44, '#10B981', { r: 22 }),
        T('STEP 5', 95, 110, 120, 26, 16, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('The Conversion Loop', 70, 180, 940, 70, 52, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        T('Views mean nothing if they don’t convert into email subscribers or customers.', 70, 270, 940, 90, 30, { font: 'Inter', weight: 400, color: '#A1A1AA', lh: 1.4 }),
        R(70, 400, 940, 660, '#18181B', { r: 28 }),
        T('THE VIRAL CTA FORMULA', 120, 460, 500, 30, 18, { font: 'Space Grotesk', weight: 800, color: '#10B981', upper: true, ls: 2 }),
        T('1. "Comment [KEYWORD] for the template"\n2. Automation sends DM within 10 seconds\n3. DM links to Notion / PDF download\n4. Download page captures email', 120, 530, 840, 300, 34, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', lh: 1.7 }),
        R(120, 880, 840, 120, '#27272A', { r: 20 }),
        T('Avg Conversion: 34% comment-to-email opt-in.', 150, 920, 780, 40, 26, { font: 'Inter', weight: 600, color: '#10B981' }),
        handle('#A1A1AA'),
        pager(4, 5, '#A1A1AA'),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        C(440, 240, 200, 200, '#ECFDF5'),
        T('⚡', 510, 280, 100, 100, 80, { font: 'Inter', color: '#10B981', align: 'center' }),
        T('Steal this whole\ncheat-sheet now.', 70, 500, 940, 180, 72, { font: 'Space Grotesk', weight: 900, color: '#0A0A0A', align: 'center', lh: 1.15 }),
        T('Hit SAVE so you can reference these 5 steps when building your next carousel.', 120, 720, 840, 100, 30, { font: 'Inter', weight: 400, color: '#52525B', align: 'center', lh: 1.5 }),
        R(240, 880, 600, 90, '#0A0A0A', { r: 45 }),
        T('SAVE THIS PLAYBOOK', 260, 910, 560, 40, 24, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', align: 'center', upper: true, ls: 2 }),
        handle('#71717A'),
        pager(5, 5, '#71717A'),
      ],
    },
  ],
});

// ─── 4. SOFT RESET & GLOW UP (Aesthetic Warm Pinterest Moodboard) ────────────
const TPL_4 = build({
  key: 'soft-reset',
  name: 'Sunday Soft Reset — Aesthetic Moodboard',
  description: 'Warm terracotta and linen tones, gentle serif headers, high-save Pinterest wellness routine.',
  category: 'Personal Brand',
  tags: ['soft-girl', 'sunday-reset', 'pinterest-aesthetic', 'glow-up', 'wellness'],
  style: 'Editorial',
  audience: 'Creators',
  platform: 'pinterest',
  slides: [
    {
      bg: '#FDF6F0',
      els: [
        T('WEEKLY RITUAL', 70, 120, 300, 30, 16, { font: 'Space Grotesk', weight: 700, color: '#E07A5F', upper: true, ls: 3 }),
        T('The Sunday\nSoft Reset.', 70, 200, 940, 220, 90, { font: 'Playfair Display', weight: 900, color: '#3E2723', lh: 1.1 }),
        R(70, 460, 140, 3, '#E07A5F'),
        T('5 gentle habits to close the week with gratitude and wake up Monday ahead of 99% of people.', 70, 510, 940, 140, 32, { font: 'Inter', weight: 400, color: '#5D4037', lh: 1.5 }),
        R(70, 720, 940, 360, '#F5EBE1', { r: 32 }),
        T('✦ WHAT THIS IS NOT:', 120, 770, 500, 30, 18, { font: 'Space Grotesk', weight: 800, color: '#E07A5F' }),
        T('Not toxic hustle. Not waking up at 4 AM.\nJust calm intentionality to protect your peace.', 120, 830, 840, 160, 34, { font: 'Playfair Display', weight: 700, color: '#3E2723', lh: 1.4 }),
        handle('#8D6E63'),
        pager(1, 5, '#8D6E63'),
      ],
    },
    {
      bg: '#FDF6F0',
      els: [
        T('MORNING STEPS', 70, 100, 300, 30, 16, { font: 'Space Grotesk', weight: 700, color: '#E07A5F', upper: true, ls: 2 }),
        R(70, 170, 940, 450, '#FFFFFF', { r: 28, stroke: '#EADFD7', sw: 2 }),
        T('01 / Physical Environment', 120, 220, 840, 50, 36, { font: 'Playfair Display', weight: 800, color: '#3E2723' }),
        T('Change your bed sheets. Open every window for 20 minutes of fresh airflow. Clear your desk surface completely so your brain has zero visual noise.', 120, 300, 840, 200, 28, { font: 'Inter', weight: 400, color: '#5D4037', lh: 1.5 }),
        R(70, 660, 940, 450, '#FFFFFF', { r: 28, stroke: '#EADFD7', sw: 2 }),
        T('02 / Digital Brain Dump', 120, 710, 840, 50, 36, { font: 'Playfair Display', weight: 800, color: '#3E2723' }),
        T('Open Notes app or paper journal. Write down every open loop in your head: unpaid bills, unanswered texts, upcoming deadlines. Close the mental tabs.', 120, 790, 840, 200, 28, { font: 'Inter', weight: 400, color: '#5D4037', lh: 1.5 }),
        handle('#8D6E63'),
        pager(2, 5, '#8D6E63'),
      ],
    },
    {
      bg: '#FDF6F0',
      els: [
        T('AFTERNOON STEPS', 70, 100, 300, 30, 16, { font: 'Space Grotesk', weight: 700, color: '#E07A5F', upper: true, ls: 2 }),
        R(70, 170, 940, 450, '#FFFFFF', { r: 28, stroke: '#EADFD7', sw: 2 }),
        T('03 / The 3 Priority List', 120, 220, 840, 50, 36, { font: 'Playfair Display', weight: 800, color: '#3E2723' }),
        T('Do not make a 25-item to-do list for Monday. Choose exactly 3 high-impact wins. Everything else is secondary bonus.', 120, 300, 840, 200, 28, { font: 'Inter', weight: 400, color: '#5D4037', lh: 1.5 }),
        R(70, 660, 940, 450, '#FFFFFF', { r: 28, stroke: '#EADFD7', sw: 2 }),
        T('04 / Low-Dopamine Sunset', 120, 710, 840, 50, 36, { font: 'Playfair Display', weight: 800, color: '#3E2723' }),
        T('Put phones in another room 2 hours before bed. Warm shower, herbal tea, read 15 pages of physical fiction book.', 120, 790, 840, 200, 28, { font: 'Inter', weight: 400, color: '#5D4037', lh: 1.5 }),
        handle('#8D6E63'),
        pager(3, 5, '#8D6E63'),
      ],
    },
    {
      bg: '#3E2723',
      els: [
        T('SUNDAY AFFIRMATION', 70, 120, 400, 30, 16, { font: 'Space Grotesk', weight: 700, color: '#E07A5F', upper: true, ls: 3 }),
        T('"I do not have to rush\nto prove my worth."', 70, 200, 940, 220, 68, { font: 'Playfair Display', weight: 900, color: '#FDF6F0', lh: 1.2 }),
        R(70, 460, 120, 3, '#E07A5F'),
        T('A peaceful nervous system attracts better opportunities than a panicked mind ever will. Breathe, reset, and trust your timing.', 70, 520, 940, 160, 32, { font: 'Inter', weight: 400, color: '#D7CCC8', lh: 1.6 }),
        R(70, 740, 940, 320, '#4E342E', { r: 28 }),
        T('THE MONDAY PROMISE', 120, 790, 500, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#E07A5F', upper: true }),
        T('Enter tomorrow as the observer, not the victim of circumstances.', 120, 840, 840, 120, 34, { font: 'Playfair Display', weight: 700, color: '#FDF6F0', lh: 1.4 }),
        handle('#D7CCC8'),
        pager(4, 5, '#D7CCC8'),
      ],
    },
    {
      bg: '#FDF6F0',
      els: [
        C(440, 260, 200, 200, '#F5EBE1'),
        T('🌿', 510, 300, 100, 100, 80, { font: 'Inter', color: '#E07A5F', align: 'center' }),
        T('Save this for\nyour Sunday.', 70, 520, 940, 160, 76, { font: 'Playfair Display', weight: 900, color: '#3E2723', align: 'center', lh: 1.15 }),
        T('Share this with someone who needs a gentle reminder to slow down this weekend.', 120, 720, 840, 100, 30, { font: 'Inter', weight: 400, color: '#5D4037', align: 'center', lh: 1.5 }),
        R(240, 880, 600, 90, '#E07A5F', { r: 45 }),
        T('SAVE THIS RITUAL', 260, 910, 560, 40, 24, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', align: 'center', upper: true, ls: 2 }),
        handle('#8D6E63'),
        pager(5, 5, '#8D6E63'),
      ],
    },
  ],
});

// ─── 5. DEEP FOCUS & DOPAMINE PROTOCOL (Dark Mode Tech Productivity) ─────────
const TPL_5 = build({
  key: 'dopamine-focus',
  name: 'Deep Focus Protocol — Dark Cyan Tech',
  description: 'Ultra-clean dark mode terminal style productivity rules with neon cyan accents.',
  category: 'Productivity',
  tags: ['deep-work', 'focus', 'tech', 'productivity', 'dopamine-reset'],
  style: 'Dark',
  audience: 'Founders',
  platform: 'instagram',
  slides: [
    {
      bg: '#0D0F12',
      els: [
        R(70, 90, 240, 46, '#06B6D4', { r: 23 }),
        T('FOCUS ENGINE 2.0', 95, 102, 190, 26, 15, { font: 'Space Grotesk', weight: 800, color: '#0D0F12', upper: true, ls: 2 }),
        T('The 4-Hour\nDeep Focus\nProtocol.', 70, 190, 940, 320, 88, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF', lh: 1.05 }),
        T('How to produce 8 hours of high-leverage creative output before 12 PM with zero burnout.', 70, 560, 940, 120, 32, { font: 'Inter', weight: 400, color: '#94A3B8', lh: 1.4 }),
        R(70, 740, 940, 340, '#161B22', { r: 28, stroke: '#1E293B', sw: 2 }),
        T('THE SCIENCE', 120, 790, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#06B6D4', upper: true, ls: 2 }),
        T('Every context switch costs 23 minutes of focus recovery. Protect the first 4 hours of your morning at all costs.', 120, 850, 840, 160, 32, { font: 'Inter', weight: 500, color: '#F1F5F9', lh: 1.5 }),
        handle('#64748B'),
        pager(1, 5, '#64748B'),
      ],
    },
    {
      bg: '#0D0F12',
      els: [
        T('PILLAR 01 & 02', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#06B6D4', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#161B22', { r: 28, stroke: '#1E293B', sw: 2 }),
        T('01 / Zero Inputs Before 10 AM', 120, 210, 840, 50, 38, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('No Slack. No emails. No Instagram. No news. When you consume someone else’s thoughts before creating your own, you enter reactive defense mode.', 120, 290, 840, 200, 28, { font: 'Inter', weight: 400, color: '#94A3B8', lh: 1.5 }),
        R(70, 680, 940, 480, '#161B22', { r: 28, stroke: '#1E293B', sw: 2 }),
        T('02 / The 90-Minute Ultradian Block', 120, 730, 840, 50, 38, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('The human brain operates on 90-minute ultradian rhythms. Work with ruthless focus for 90 minutes, then take a full 15-minute screen-free walk.', 120, 810, 840, 200, 28, { font: 'Inter', weight: 400, color: '#94A3B8', lh: 1.5 }),
        handle('#64748B'),
        pager(2, 5, '#64748B'),
      ],
    },
    {
      bg: '#0D0F12',
      els: [
        T('PILLAR 03 & 04', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#06B6D4', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#161B22', { r: 28, stroke: '#1E293B', sw: 2 }),
        T('03 / Physical Phone Distance', 120, 210, 840, 50, 38, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Studies show that having your smartphone on your desk—even turned face down—reduces cognitive processing power by 14%. Keep it in another room.', 120, 290, 840, 200, 28, { font: 'Inter', weight: 400, color: '#94A3B8', lh: 1.5 }),
        R(70, 680, 940, 480, '#161B22', { r: 28, stroke: '#1E293B', sw: 2 }),
        T('04 / Single-Tasking Rigor', 120, 730, 840, 50, 38, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Multitasking is an illusion of competence. Full screen your IDE or writing editor. Close the remaining 40 browser tabs.', 120, 810, 840, 200, 28, { font: 'Inter', weight: 400, color: '#94A3B8', lh: 1.5 }),
        handle('#64748B'),
        pager(3, 5, '#64748B'),
      ],
    },
    {
      bg: '#0D0F12',
      els: [
        T('THE DAILY SCHEDULE', 70, 90, 400, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#06B6D4', upper: true, ls: 2 }),
        T('The Ideal Deep Work Day', 70, 160, 940, 70, 52, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        R(70, 270, 940, 800, '#161B22', { r: 32, stroke: '#1E293B', sw: 2 }),
        T('07:30 - 08:00  | Sunlight + Hydration\n08:00 - 09:30  | DEEP BLOCK 1 (Hardest Problem)\n09:30 - 09:45  | Nature walk + stretch\n09:45 - 11:15  | DEEP BLOCK 2 (Creative Output)\n11:15 - 12:00  | Lunch + Complete rest\n12:00 - 14:00  | Shallow admin, messages & calls', 120, 350, 840, 450, 32, { font: 'Space Grotesk', weight: 700, color: '#06B6D4', lh: 1.8 }),
        R(120, 870, 840, 130, '#0D0F12', { r: 20 }),
        T('Key: All real value is created before noon.', 150, 915, 780, 40, 26, { font: 'Inter', weight: 600, color: '#F1F5F9' }),
        handle('#64748B'),
        pager(4, 5, '#64748B'),
      ],
    },
    {
      bg: '#06B6D4',
      els: [
        T('READY TO LEVEL UP?', 70, 240, 940, 40, 22, { font: 'Space Grotesk', weight: 800, color: '#0D0F12', align: 'center', upper: true, ls: 3 }),
        T('Build Your Focus\nSuperpower.', 70, 320, 940, 200, 76, { font: 'Space Grotesk', weight: 900, color: '#0D0F12', align: 'center', lh: 1.1 }),
        T('In an age of distraction, deep focus is the ultimate competitive advantage. Save this protocol.', 120, 560, 840, 100, 32, { font: 'Inter', weight: 500, color: '#0E7490', align: 'center', lh: 1.5 }),
        R(240, 740, 600, 90, '#0D0F12', { r: 45 }),
        T('SAVE THIS POST', 260, 770, 560, 40, 24, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', align: 'center', upper: true, ls: 2 }),
        handle('#0E7490'),
        pager(5, 5, '#0E7490'),
      ],
    },
  ],
});

// ─── 6. PSYCHOLOGY OF BRAND COLORS (Designer Pinterest Guide) ───────────────
const TPL_6 = build({
  key: 'color-psychology',
  name: 'Psychology of Color in Branding — Pinterest Visual Guide',
  description: 'Color swatches, emotional triggers and hex palettes designed for high-save Pinterest feeds.',
  category: 'Marketing',
  tags: ['branding', 'color-palette', 'pinterest-design', 'graphic-design', 'visual-identity'],
  style: 'Editorial',
  audience: 'Founders',
  platform: 'pinterest',
  slides: [
    {
      bg: '#F8FAFC',
      els: [
        R(70, 90, 240, 46, '#3B82F6', { r: 23 }),
        T('DESIGN CHEAT-SHEET', 95, 102, 190, 26, 14, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', upper: true, ls: 2 }),
        T('The Psychology\nof Brand Colors.', 70, 190, 940, 220, 86, { font: 'Space Grotesk', weight: 900, color: '#0F172A', lh: 1.1 }),
        T('90% of snap product judgments are based on color alone. Here is what your brand palette is subliminally whispering to customers.', 70, 450, 940, 120, 32, { font: 'Inter', weight: 400, color: '#475569', lh: 1.4 }),
        R(70, 620, 940, 480, '#FFFFFF', { r: 32, stroke: '#E2E8F0', sw: 2 }),
        R(120, 670, 180, 80, '#3B82F6', { r: 16 }),
        R(330, 670, 180, 80, '#10B981', { r: 16 }),
        R(540, 670, 180, 80, '#F59E0B', { r: 16 }),
        R(750, 670, 180, 80, '#EF4444', { r: 16 }),
        T('SWIPE TO LEARN\nEVERY EMOTION', 120, 800, 840, 140, 44, { font: 'Space Grotesk', weight: 800, color: '#0F172A', lh: 1.2 }),
        handle('#64748B'),
        pager(1, 5, '#64748B'),
      ],
    },
    {
      bg: '#F8FAFC',
      els: [
        T('COLOR CATEGORY 01 & 02', 70, 90, 400, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#3B82F6', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#FFFFFF', { r: 28, stroke: '#E2E8F0', sw: 2 }),
        R(120, 200, 160, 50, '#3B82F6', { r: 12 }),
        T('BLUE', 170, 212, 100, 26, 18, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Trust, Logic & Security', 120, 280, 840, 50, 38, { font: 'Space Grotesk', weight: 800, color: '#0F172A' }),
        T('Associated with calmness and dependability. Used by banks, tech giants, and healthcare where trust is non-negotiable.\nExamples: Stripe, Twitter, PayPal, Intel.', 120, 360, 840, 160, 28, { font: 'Inter', weight: 400, color: '#475569', lh: 1.5 }),
        R(70, 680, 940, 480, '#FFFFFF', { r: 28, stroke: '#E2E8F0', sw: 2 }),
        R(120, 720, 160, 50, '#10B981', { r: 12 }),
        T('GREEN', 160, 732, 100, 26, 18, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Growth, Health & Wealth', 120, 800, 840, 50, 38, { font: 'Space Grotesk', weight: 800, color: '#0F172A' }),
        T('Signals prosperity, sustainability, and vitality. Used by fintech apps, organic foods, and wellness platforms.\nExamples: Spotify, Robinhood, Whole Foods.', 120, 880, 840, 160, 28, { font: 'Inter', weight: 400, color: '#475569', lh: 1.5 }),
        handle('#64748B'),
        pager(2, 5, '#64748B'),
      ],
    },
    {
      bg: '#F8FAFC',
      els: [
        T('COLOR CATEGORY 03 & 04', 70, 90, 400, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#F59E0B', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#FFFFFF', { r: 28, stroke: '#E2E8F0', sw: 2 }),
        R(120, 200, 160, 50, '#F59E0B', { r: 12 }),
        T('YELLOW', 150, 212, 100, 26, 18, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Optimism, Warmth & Clarity', 120, 280, 840, 50, 38, { font: 'Space Grotesk', weight: 800, color: '#0F172A' }),
        T('Stimulates mental activity and creates excitement. Catches the eye faster than any other color.\nExamples: Snapchat, McDonald’s, Bumble, Ferrari.', 120, 360, 840, 160, 28, { font: 'Inter', weight: 400, color: '#475569', lh: 1.5 }),
        R(70, 680, 940, 480, '#FFFFFF', { r: 28, stroke: '#E2E8F0', sw: 2 }),
        R(120, 720, 160, 50, '#EF4444', { r: 12 }),
        T('RED', 170, 732, 100, 26, 18, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Urgency, Passion & Appetite', 120, 800, 840, 50, 38, { font: 'Space Grotesk', weight: 800, color: '#0F172A' }),
        T('Increases heart rate and prompts immediate impulse action. Perfect for clearance sales and entertainment.\nExamples: Netflix, YouTube, Coca-Cola, Target.', 120, 880, 840, 160, 28, { font: 'Inter', weight: 400, color: '#475569', lh: 1.5 }),
        handle('#64748B'),
        pager(3, 5, '#64748B'),
      ],
    },
    {
      bg: '#0F172A',
      els: [
        T('THE 60-30-10 RULE', 70, 90, 400, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#38BDF8', upper: true, ls: 2 }),
        T('The Formula for\nPerfect Balance', 70, 160, 940, 70, 54, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        R(70, 280, 940, 220, '#1E293B', { r: 24 }),
        T('60% Dominant Base', 120, 320, 500, 40, 32, { font: 'Space Grotesk', weight: 800, color: '#38BDF8' }),
        T('Usually clean neutral background (White, Slate, or Charcoal).', 120, 370, 840, 80, 26, { font: 'Inter', weight: 400, color: '#94A3B8' }),
        R(70, 530, 940, 220, '#1E293B', { r: 24 }),
        T('30% Secondary Structure', 120, 570, 500, 40, 32, { font: 'Space Grotesk', weight: 800, color: '#A78BFA' }),
        T('Cards, borders, subheaders, and brand presence elements.', 120, 620, 840, 80, 26, { font: 'Inter', weight: 400, color: '#94A3B8' }),
        R(70, 780, 940, 220, '#1E293B', { r: 24 }),
        T('10% Accent Call-To-Action', 120, 820, 500, 40, 32, { font: 'Space Grotesk', weight: 800, color: '#F43F5E' }),
        T('Buttons, badges, highlights. High contrast so it jumps immediately.', 120, 870, 840, 80, 26, { font: 'Inter', weight: 400, color: '#94A3B8' }),
        handle('#94A3B8'),
        pager(4, 5, '#94A3B8'),
      ],
    },
    {
      bg: '#F8FAFC',
      els: [
        C(440, 240, 200, 200, '#EFF6FF'),
        T('🎨', 510, 280, 100, 100, 80, { font: 'Inter', color: '#3B82F6', align: 'center' }),
        T('Save this design\npalette guide.', 70, 500, 940, 160, 72, { font: 'Space Grotesk', weight: 900, color: '#0F172A', align: 'center', lh: 1.15 }),
        T('Never guess brand colors again. Pin this to your design board or save to your Instagram collection.', 120, 700, 840, 100, 30, { font: 'Inter', weight: 400, color: '#475569', align: 'center', lh: 1.5 }),
        R(240, 860, 600, 90, '#3B82F6', { r: 45 }),
        T('SAVE COLOR GUIDE', 260, 890, 560, 40, 24, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', align: 'center', upper: true, ls: 2 }),
        handle('#64748B'),
        pager(5, 5, '#64748B'),
      ],
    },
  ],
});

// ─── 7. THE 7-FIGURE OFFER BREAKDOWN (SaaS / Agency Blueprint) ──────────────
const TPL_7 = build({
  key: '7figure-offer',
  name: 'The 7-Figure Offer Blueprint — Dark Luxe',
  description: 'Deep navy and amber gold metrics breakdown for high-ticket agency and SaaS founders.',
  category: 'Business',
  tags: ['business', 'saas', 'agency', 'offer-creation', 'scaling'],
  style: 'Luxury',
  audience: 'Founders',
  platform: 'instagram',
  slides: [
    {
      bg: '#0B132B',
      els: [
        R(70, 90, 220, 46, '#F59E0B', { r: 23 }),
        T('OFFER BLUEPRINT', 95, 102, 170, 26, 15, { font: 'Space Grotesk', weight: 800, color: '#0B132B', upper: true, ls: 2 }),
        T('The Anatomy of a\n$1,000,000\nIrresistible Offer.', 70, 190, 940, 320, 84, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF', lh: 1.05 }),
        T('Why clients say YES without asking for a discount. The exact value equation broken down.', 70, 560, 940, 120, 32, { font: 'Inter', weight: 400, color: '#94A3B8', lh: 1.4 }),
        R(70, 720, 940, 340, '#1C2541', { r: 28, stroke: '#3A506B', sw: 2 }),
        T('THE CORE RULE', 120, 770, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#F59E0B', upper: true, ls: 2 }),
        T('Make the offer so ridiculously valuable that clients feel foolish saying NO.', 120, 830, 840, 140, 36, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', lh: 1.4 }),
        handle('#94A3B8'),
        pager(1, 5, '#94A3B8'),
      ],
    },
    {
      bg: '#0B132B',
      els: [
        T('VARIABLE 1 & 2', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#F59E0B', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#1C2541', { r: 28, stroke: '#3A506B', sw: 2 }),
        T('01 / Dream Outcome Clarity', 120, 210, 840, 50, 38, { font: 'Space Grotesk', weight: 800, color: '#F59E0B' }),
        T('Clients do not buy your product or service. They buy the future version of themselves. Clarify the tangible, measurable transformation in 1 sentence.', 120, 290, 840, 200, 28, { font: 'Inter', weight: 400, color: '#CBD5E1', lh: 1.5 }),
        R(70, 680, 940, 480, '#1C2541', { r: 28, stroke: '#3A506B', sw: 2 }),
        T('02 / Perceived Likelihood of Achievement', 120, 730, 840, 50, 36, { font: 'Space Grotesk', weight: 800, color: '#F59E0B' }),
        T('Social proof, specific case studies, and ironclad guarantees. If they believe 99% that you will deliver, price sensitivity drops to zero.', 120, 810, 840, 200, 28, { font: 'Inter', weight: 400, color: '#CBD5E1', lh: 1.5 }),
        handle('#94A3B8'),
        pager(2, 5, '#94A3B8'),
      ],
    },
    {
      bg: '#0B132B',
      els: [
        T('VARIABLE 3 & 4', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#F59E0B', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#1C2541', { r: 28, stroke: '#3A506B', sw: 2 }),
        T('03 / Time Delay to First Win', 120, 210, 840, 50, 38, { font: 'Space Grotesk', weight: 800, color: '#F59E0B' }),
        T('How fast can they get their first micro-victory? If your service takes 6 months to see results, invent a 48-hour quick win to build instant momentum.', 120, 290, 840, 200, 28, { font: 'Inter', weight: 400, color: '#CBD5E1', lh: 1.5 }),
        R(70, 680, 940, 480, '#1C2541', { r: 28, stroke: '#3A506B', sw: 2 }),
        T('04 / Effort & Sacrifice Elimination', 120, 730, 840, 50, 36, { font: 'Space Grotesk', weight: 800, color: '#F59E0B' }),
        T('Take the heavy lifting off their shoulders. Done-With-You beats DIY, and Done-For-You beats Done-With-You. Eliminate their headaches.', 120, 810, 840, 200, 28, { font: 'Inter', weight: 400, color: '#CBD5E1', lh: 1.5 }),
        handle('#94A3B8'),
        pager(3, 5, '#94A3B8'),
      ],
    },
    {
      bg: '#0B132B',
      els: [
        T('THE VALUE EQUATION', 70, 90, 400, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#F59E0B', upper: true, ls: 2 }),
        T('The Mathematical Formula', 70, 160, 940, 70, 52, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        R(70, 270, 940, 400, '#1C2541', { r: 28, stroke: '#F59E0B', sw: 2 }),
        T('(Dream Outcome) × (Perceived Likelihood)', 120, 330, 840, 50, 34, { font: 'Space Grotesk', weight: 800, color: '#F59E0B', align: 'center' }),
        R(120, 420, 840, 4, '#F59E0B'),
        T('(Time Delay) × (Effort & Sacrifice)', 120, 460, 840, 50, 34, { font: 'Space Grotesk', weight: 800, color: '#94A3B8', align: 'center' }),
        T('Maximize the top. Minimize the bottom. When you do both, you can charge 10x market rates.', 120, 540, 840, 90, 28, { font: 'Inter', weight: 500, color: '#E2E8F0', align: 'center' }),
        R(70, 720, 940, 360, '#111D4A', { r: 28 }),
        T('EXAMPLE', 120, 770, 200, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#F59E0B' }),
        T('"We build your outbound sales engine in 14 days and guarantee 15 booked enterprise calls or you pay $0."', 120, 820, 840, 180, 34, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', lh: 1.4 }),
        handle('#94A3B8'),
        pager(4, 5, '#94A3B8'),
      ],
    },
    {
      bg: '#F59E0B',
      els: [
        T('THE FOUNDER PLAYBOOK', 70, 240, 940, 40, 22, { font: 'Space Grotesk', weight: 800, color: '#0B132B', align: 'center', upper: true, ls: 3 }),
        T('Scale Your Offer to\n7 Figures.', 70, 320, 940, 200, 76, { font: 'Space Grotesk', weight: 900, color: '#0B132B', align: 'center', lh: 1.1 }),
        T('Want the complete offer audit worksheet? Save this post and comment "OFFER" below.', 120, 560, 840, 100, 32, { font: 'Inter', weight: 500, color: '#78350F', align: 'center', lh: 1.5 }),
        R(240, 740, 600, 90, '#0B132B', { r: 45 }),
        T('GET OFFER WORKSHEET', 260, 770, 560, 40, 24, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', align: 'center', upper: true, ls: 2 }),
        handle('#78350F'),
        pager(5, 5, '#78350F'),
      ],
    },
  ],
});

// ─── 8. 5 VIRAL HOOK FORMULAS (Canary Highlighter Masterclass) ──────────────
const TPL_8 = build({
  key: 'viral-hooks',
  name: '5 Viral Hook Formulas That Never Fail',
  description: 'Canary highlighter yellow on dark slate with sticky callout cards for maximum scroll stopping.',
  category: 'Creator',
  tags: ['viral-hooks', 'copywriting', 'content-creation', 'instagram-reels', 'highlighter'],
  style: 'Bold',
  audience: 'Creators',
  platform: 'instagram',
  slides: [
    {
      bg: '#18181B',
      els: [
        R(70, 90, 240, 48, '#FEF08A', { r: 12 }),
        T('HOOK MASTERCLASS', 95, 102, 190, 26, 16, { font: 'Space Grotesk', weight: 900, color: '#18181B', upper: true, ls: 2 }),
        T('5 Viral Hooks\nThat Stop The\nScroll Every Time.', 70, 190, 940, 320, 84, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF', lh: 1.05 }),
        T('90% of content fails on slide 1. Use these 5 battle-tested copywriting formulas to 10x your view time.', 70, 560, 940, 120, 32, { font: 'Inter', weight: 400, color: '#A1A1AA', lh: 1.4 }),
        R(70, 740, 940, 340, '#27272A', { r: 28, stroke: '#3F3F46', sw: 2 }),
        T('THE GOLDEN RATIO', 120, 790, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#FEF08A', upper: true, ls: 2 }),
        T('Curiosity + High Stakes + Specific Timeframe = Uncontrollable Desire to Swipe.', 120, 850, 840, 160, 34, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', lh: 1.4 }),
        handle('#A1A1AA'),
        pager(1, 5, '#A1A1AA'),
      ],
    },
    {
      bg: '#18181B',
      els: [
        T('FORMULA 01 & 02', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#FEF08A', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#27272A', { r: 28, stroke: '#3F3F46', sw: 2 }),
        R(110, 200, 220, 42, '#FEF08A', { r: 8 }),
        T('1. THE CONTRARIAN', 125, 210, 190, 22, 14, { font: 'Space Grotesk', weight: 900, color: '#18181B' }),
        T('"Stop Doing [Common Advice]. Do This Instead."', 110, 270, 860, 90, 36, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Why it works: Challenges their worldview and makes them feel like everyone else has been misled.\nExample: "Stop posting 3 reels a day. Post 1 deep carousel."', 110, 380, 860, 180, 26, { font: 'Inter', weight: 400, color: '#D4D4D8', lh: 1.4 }),
        R(70, 680, 940, 480, '#27272A', { r: 28, stroke: '#3F3F46', sw: 2 }),
        R(110, 720, 220, 42, '#FEF08A', { r: 8 }),
        T('2. THE CONFESSION', 125, 730, 190, 22, 14, { font: 'Space Grotesk', weight: 900, color: '#18181B' }),
        T('"I Wasted [Time] Doing [Mistake]. Here’s The Fix."', 110, 790, 860, 90, 36, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Why it works: Vulnerability builds instant connection and empathy.\nExample: "I wasted 2 years learning code before discovering no-code AI tools."', 110, 900, 860, 180, 26, { font: 'Inter', weight: 400, color: '#D4D4D8', lh: 1.4 }),
        handle('#A1A1AA'),
        pager(2, 5, '#A1A1AA'),
      ],
    },
    {
      bg: '#18181B',
      els: [
        T('FORMULA 03 & 04', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#FEF08A', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#27272A', { r: 28, stroke: '#3F3F46', sw: 2 }),
        R(110, 200, 220, 42, '#FEF08A', { r: 8 }),
        T('3. THE STEAL THIS', 125, 210, 190, 22, 14, { font: 'Space Grotesk', weight: 900, color: '#18181B' }),
        T('"Steal My Exact [Tool/Template] (Zero Fluff)."', 110, 270, 860, 90, 36, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Why it works: Offers immediate utility. People love saving shortcuts.\nExample: "Steal my exact Notion client onboarding portal."', 110, 380, 860, 180, 26, { font: 'Inter', weight: 400, color: '#D4D4D8', lh: 1.4 }),
        R(70, 680, 940, 480, '#27272A', { r: 28, stroke: '#3F3F46', sw: 2 }),
        R(110, 720, 220, 42, '#FEF08A', { r: 8 }),
        T('4. THE NEGATIVE HOOK', 125, 730, 190, 22, 14, { font: 'Space Grotesk', weight: 900, color: '#18181B' }),
        T('"How To Never [Pain Point] Ever Again."', 110, 790, 860, 90, 36, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF' }),
        T('Why it works: Humans are 2x more motivated to avoid pain than seek gain.\nExample: "How to never run out of carousel ideas ever again."', 110, 900, 860, 180, 26, { font: 'Inter', weight: 400, color: '#D4D4D8', lh: 1.4 }),
        handle('#A1A1AA'),
        pager(3, 5, '#A1A1AA'),
      ],
    },
    {
      bg: '#18181B',
      els: [
        T('FORMULA 05', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#FEF08A', upper: true, ls: 2 }),
        T('5. The "Illegal Feeling" Framework', 70, 160, 940, 70, 48, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        R(70, 260, 940, 800, '#27272A', { r: 32, stroke: '#3F3F46', sw: 2 }),
        T('"AI Tools That Feel Completely Illegal to Know"', 120, 320, 840, 80, 36, { font: 'Space Grotesk', weight: 800, color: '#FEF08A' }),
        T('Why it triggers massive engagement:', 120, 420, 840, 40, 24, { font: 'Inter', weight: 700, color: '#FFFFFF' }),
        T('1. Implies insider secret knowledge\n2. High curiosity gap (what makes it illegal?)\n3. Extreme save rate for future reference\n4. Shareable with teammates and friends', 120, 480, 840, 260, 30, { font: 'Inter', weight: 400, color: '#D4D4D8', lh: 1.7 }),
        R(120, 800, 840, 180, '#3F3F46', { r: 20 }),
        T('Pro Tip: Deliver 100% on the promise. Never clickbait with underwhelming tools.', 150, 840, 780, 100, 26, { font: 'Inter', weight: 600, color: '#FEF08A', lh: 1.4 }),
        handle('#A1A1AA'),
        pager(4, 5, '#A1A1AA'),
      ],
    },
    {
      bg: '#FEF08A',
      els: [
        T('STEAL ALL 5 HOOKS', 70, 240, 940, 40, 22, { font: 'Space Grotesk', weight: 900, color: '#18181B', align: 'center', upper: true, ls: 3 }),
        T('Save This Hook\nSwipe-File.', 70, 320, 940, 200, 80, { font: 'Space Grotesk', weight: 900, color: '#18181B', align: 'center', lh: 1.1 }),
        T('Next time you are stuck on slide 1, open this saved carousel and pick one formula.', 120, 560, 840, 100, 32, { font: 'Inter', weight: 500, color: '#451A03', align: 'center', lh: 1.5 }),
        R(240, 740, 600, 90, '#18181B', { r: 45 }),
        T('SAVE THIS SWIPE FILE', 260, 770, 560, 40, 24, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', align: 'center', upper: true, ls: 2 }),
        handle('#713F12'),
        pager(5, 5, '#713F12'),
      ],
    },
  ],
});

// ─── 9. MYTH VS FACT (Diagnostic Split Debunker) ────────────────────────────
const TPL_9 = build({
  key: 'myth-vs-fact',
  name: 'Myth vs Fact — Visual Debunker',
  description: 'Slate grey background with bold red MYTH vs green FACT side-by-side diagnostic cards.',
  category: 'Education',
  tags: ['education', 'myth-busting', 'science', 'fitness-myths', 'split-card'],
  style: 'Educational',
  audience: 'Educators',
  platform: 'instagram',
  slides: [
    {
      bg: '#0F172A',
      els: [
        R(70, 90, 260, 48, '#EF4444', { r: 24 }),
        T('DEBUNKING POP SCIENCE', 95, 102, 210, 26, 14, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', upper: true, ls: 2 }),
        T('Stop Believing\nThese 5 Common\nHealth Myths.', 70, 190, 940, 320, 84, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF', lh: 1.1 }),
        T('What the science actually proves vs what the fitness industry sold you for 20 years.', 70, 560, 940, 120, 32, { font: 'Inter', weight: 400, color: '#94A3B8', lh: 1.4 }),
        R(70, 740, 940, 340, '#1E293B', { r: 28, stroke: '#334155', sw: 2 }),
        T('THE PURPOSE', 120, 790, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#10B981', upper: true, ls: 2 }),
        T('Clear up mental confusion so you can get maximum health return with minimum wasted effort.', 120, 850, 840, 160, 32, { font: 'Inter', weight: 500, color: '#F1F5F9', lh: 1.5 }),
        handle('#94A3B8'),
        pager(1, 5, '#94A3B8'),
      ],
    },
    {
      bg: '#0F172A',
      els: [
        T('MYTH #1 DEBUNKED', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#EF4444', upper: true, ls: 2 }),
        R(70, 160, 940, 450, '#1E293B', { r: 28, stroke: '#EF4444', sw: 2 }),
        R(110, 200, 140, 38, '#EF4444', { r: 8 }),
        T('MYTH', 145, 208, 80, 22, 16, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        T('"Eating after 8 PM makes you gain fat."', 110, 270, 860, 70, 38, { font: 'Space Grotesk', weight: 800, color: '#FCA5A5' }),
        T('Your body does not have a magical clock that turns calories into fat after sunset. Calories in vs calories out is what determines weight over a 24-hour cycle.', 110, 360, 860, 180, 28, { font: 'Inter', weight: 400, color: '#CBD5E1', lh: 1.4 }),
        R(70, 660, 940, 480, '#1E293B', { r: 28, stroke: '#10B981', sw: 2 }),
        R(110, 700, 140, 38, '#10B981', { r: 8 }),
        T('FACT', 150, 708, 80, 22, 16, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        T('"Total energy balance is king."', 110, 770, 860, 70, 38, { font: 'Space Grotesk', weight: 800, color: '#86EFAC' }),
        T('Late snacking often leads to excess calorie consumption, but timing alone does not dictate fat storage. Focus on sleep quality and total daily intake.', 110, 860, 860, 180, 28, { font: 'Inter', weight: 400, color: '#CBD5E1', lh: 1.4 }),
        handle('#94A3B8'),
        pager(2, 5, '#94A3B8'),
      ],
    },
    {
      bg: '#0F172A',
      els: [
        T('MYTH #2 DEBUNKED', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#EF4444', upper: true, ls: 2 }),
        R(70, 160, 940, 450, '#1E293B', { r: 28, stroke: '#EF4444', sw: 2 }),
        R(110, 200, 140, 38, '#EF4444', { r: 8 }),
        T('MYTH', 145, 208, 80, 22, 16, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        T('"More sweat = more fat burned."', 110, 270, 860, 70, 38, { font: 'Space Grotesk', weight: 800, color: '#FCA5A5' }),
        T('Sweat is simply your body’s cooling mechanism to regulate temperature, not a metric of adipose tissue oxidation. Water weight is replenished immediately.', 110, 360, 860, 180, 28, { font: 'Inter', weight: 400, color: '#CBD5E1', lh: 1.4 }),
        R(70, 660, 940, 480, '#1E293B', { r: 28, stroke: '#10B981', sw: 2 }),
        R(110, 700, 140, 38, '#10B981', { r: 8 }),
        T('FACT', 150, 708, 80, 22, 16, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        T('"Progressive overload burns fat long-term."', 110, 770, 860, 70, 38, { font: 'Space Grotesk', weight: 800, color: '#86EFAC' }),
        T('Building dense muscle tissue elevates your Basal Metabolic Rate (BMR), allowing you to burn significantly more calories even while resting.', 110, 860, 860, 180, 28, { font: 'Inter', weight: 400, color: '#CBD5E1', lh: 1.4 }),
        handle('#94A3B8'),
        pager(3, 5, '#94A3B8'),
      ],
    },
    {
      bg: '#0F172A',
      els: [
        T('THE SCIENTIFIC HIERARCHY', 70, 90, 400, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#38BDF8', upper: true, ls: 2 }),
        T('What Actually Moves The Needle', 70, 160, 940, 70, 48, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        R(70, 260, 940, 800, '#1E293B', { r: 32, stroke: '#334155', sw: 2 }),
        T('1. Sleep (7-9 Hours Nightly)\n   Regulates cortisol, hunger hormones (ghrelin/leptin)\n\n2. Protein Intake (1.6 - 2.2g per kg)\n   Prevents muscle breakdown, high satiety\n\n3. Resistance Training 3-4x Weekly\n   Bone density, insulin sensitivity, muscle mass\n\n4. Daily Steps (8,000 - 10,000)\n   Low-impact NEAT calorie burn', 120, 320, 840, 600, 30, { font: 'Space Grotesk', weight: 700, color: '#F1F5F9', lh: 1.8 }),
        R(120, 880, 840, 120, '#0F172A', { r: 16 }),
        T('Everything else (supplements, detox teas) is 2% optimization.', 150, 920, 780, 40, 24, { font: 'Inter', weight: 500, color: '#94A3B8' }),
        handle('#94A3B8'),
        pager(4, 5, '#94A3B8'),
      ],
    },
    {
      bg: '#10B981',
      els: [
        T('EVIDENCE OVER HYPE', 70, 240, 940, 40, 22, { font: 'Space Grotesk', weight: 900, color: '#0F172A', align: 'center', upper: true, ls: 3 }),
        T('Save & Share This\nTruth Guide.', 70, 320, 940, 200, 76, { font: 'Space Grotesk', weight: 900, color: '#0F172A', align: 'center', lh: 1.1 }),
        T('Help a friend escape fitness misinformation. Save this post to your wellness folder.', 120, 560, 840, 100, 32, { font: 'Inter', weight: 500, color: '#064E3B', align: 'center', lh: 1.5 }),
        R(240, 740, 600, 90, '#0F172A', { r: 45 }),
        T('SAVE THIS DEBUNKER', 260, 770, 560, 40, 24, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', align: 'center', upper: true, ls: 2 }),
        handle('#064E3B'),
        pager(5, 5, '#064E3B'),
      ],
    },
  ],
});

// ─── 10. THE 30-DAY SOLOPRENEUR ROADMAP (Step-by-Step Milestones) ───────────
const TPL_10 = build({
  key: 'solopreneur-roadmap',
  name: 'The 30-Day Solopreneur Roadmap — Timeline Grid',
  description: 'Indigo and electric violet timeline milestones for launching a profitable digital product.',
  category: 'Business',
  tags: ['solopreneur', 'roadmap', 'milestones', 'digital-product', 'entrepreneur'],
  style: 'Modern',
  audience: 'Founders',
  platform: 'pinterest',
  slides: [
    {
      bg: '#F8FAFC',
      els: [
        R(70, 90, 220, 46, '#4F46E5', { r: 23 }),
        T('30-DAY ROADMAP', 95, 102, 170, 26, 15, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', upper: true, ls: 2 }),
        T('From $0 to Your First\n$1,000 Online in\n30 Days Flat.', 70, 190, 940, 320, 84, { font: 'Space Grotesk', weight: 900, color: '#0F172A', lh: 1.05 }),
        T('The day-by-day checklist to launch your first digital product with zero initial audience.', 70, 560, 940, 120, 32, { font: 'Inter', weight: 400, color: '#475569', lh: 1.4 }),
        R(70, 720, 940, 340, '#FFFFFF', { r: 28, stroke: '#E2E8F0', sw: 2 }),
        T('THE MILESTONE PHASES', 120, 770, 400, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#4F46E5', upper: true, ls: 2 }),
        T('• Days 1-7: Validation & Pre-sale\n• Days 8-15: Minimum Viable Asset Creation\n• Days 16-22: Content & Organic Funnel\n• Days 23-30: Launch & Customer Delivery', 120, 830, 840, 180, 30, { font: 'Space Grotesk', weight: 700, color: '#0F172A', lh: 1.5 }),
        handle('#64748B'),
        pager(1, 5, '#64748B'),
      ],
    },
    {
      bg: '#F8FAFC',
      els: [
        T('PHASE 1 (DAYS 1-10)', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#4F46E5', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#FFFFFF', { r: 28, stroke: '#E2E8F0', sw: 2 }),
        T('Days 01-05: Validation Before Building', 120, 210, 840, 50, 36, { font: 'Space Grotesk', weight: 800, color: '#0F172A' }),
        T('Do NOT spend 3 months building a course nobody wants. Write a 1-page Notion outline. Post on X and Instagram: "Building this, who wants beta access for $19?" If 5 people pay, build it.', 120, 290, 840, 220, 28, { font: 'Inter', weight: 400, color: '#475569', lh: 1.5 }),
        R(70, 680, 940, 480, '#FFFFFF', { r: 28, stroke: '#E2E8F0', sw: 2 }),
        T('Days 06-10: The 24-Hour MVP', 120, 730, 840, 50, 36, { font: 'Space Grotesk', weight: 800, color: '#4F46E5' }),
        T('Build the solution in the fastest format possible: a curated Airtable directory, a 30-minute Loom video teardown, or a clean Notion operating template. Fast delivery wins.', 120, 810, 840, 220, 28, { font: 'Inter', weight: 400, color: '#475569', lh: 1.5 }),
        handle('#64748B'),
        pager(2, 5, '#64748B'),
      ],
    },
    {
      bg: '#F8FAFC',
      els: [
        T('PHASE 2 (DAYS 11-20)', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#4F46E5', upper: true, ls: 2 }),
        R(70, 160, 940, 480, '#FFFFFF', { r: 28, stroke: '#E2E8F0', sw: 2 }),
        T('Days 11-15: The Checkout Engine', 120, 210, 840, 50, 36, { font: 'Space Grotesk', weight: 800, color: '#0F172A' }),
        T('Set up Lemon Squeezy, Stripe, or Gumroad. 1 clean product image, 3 bullet points of what’s inside, and a 100% money-back guarantee. Launch in under 2 hours.', 120, 290, 840, 220, 28, { font: 'Inter', weight: 400, color: '#475569', lh: 1.5 }),
        R(70, 680, 940, 480, '#FFFFFF', { r: 28, stroke: '#E2E8F0', sw: 2 }),
        T('Days 16-20: Build In Public', 120, 730, 840, 50, 36, { font: 'Space Grotesk', weight: 800, color: '#4F46E5' }),
        T('Share screenshots of your progress, lessons learned, and why you are creating this tool. Building in public converts observers into enthusiastic launch day buyers.', 120, 810, 840, 220, 28, { font: 'Inter', weight: 400, color: '#475569', lh: 1.5 }),
        handle('#64748B'),
        pager(3, 5, '#64748B'),
      ],
    },
    {
      bg: '#0F172A',
      els: [
        T('PHASE 3 (DAYS 21-30)', 70, 90, 300, 30, 16, { font: 'Space Grotesk', weight: 800, color: '#818CF8', upper: true, ls: 2 }),
        T('Launch & Feedback Loop', 70, 160, 940, 70, 52, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF' }),
        R(70, 260, 940, 800, '#1E293B', { r: 32, stroke: '#334155', sw: 2 }),
        T('Days 21-25: The 48-Hour Early Bird Launch\n• Send email / post announcement\n• Offer early-bird discount (e.g. $29 instead of $49)\n• Cap it at first 50 customers to create real scarcity\n\nDays 26-30: Overdeliver & Collect Testimonials\n• Personally DM every customer\n• Ask: "What was the 1 most useful part?"\n• Turn their answers into screenshots for your sales page', 120, 320, 840, 600, 30, { font: 'Space Grotesk', weight: 700, color: '#F1F5F9', lh: 1.8 }),
        R(120, 880, 840, 120, '#0F172A', { r: 16 }),
        T('You now have a validated, cash-flowing digital asset.', 150, 920, 780, 40, 26, { font: 'Inter', weight: 600, color: '#818CF8' }),
        handle('#94A3B8'),
        pager(4, 5, '#94A3B8'),
      ],
    },
    {
      bg: '#4F46E5',
      els: [
        T('START YOUR 30 DAYS', 70, 240, 940, 40, 22, { font: 'Space Grotesk', weight: 800, color: '#FFFFFF', align: 'center', upper: true, ls: 3 }),
        T('Stop Planning.\nStart Building.', 70, 320, 940, 200, 80, { font: 'Space Grotesk', weight: 900, color: '#FFFFFF', align: 'center', lh: 1.1 }),
        T('Save this roadmap to your career board. Today is Day 1.', 120, 560, 840, 100, 32, { font: 'Inter', weight: 400, color: '#C7D2FE', align: 'center', lh: 1.5 }),
        R(240, 740, 600, 90, '#FFFFFF', { r: 45 }),
        T('SAVE THIS ROADMAP', 260, 770, 560, 40, 24, { font: 'Space Grotesk', weight: 800, color: '#4F46E5', align: 'center', upper: true, ls: 2 }),
        handle('#C7D2FE'),
        pager(5, 5, '#C7D2FE'),
      ],
    },
  ],
});

// ─── EXPORT ALL 10 TEMPLATES ─────────────────────────────────────────────────
export const VIRAL_TRENDING_10_TEMPLATES: Template[] = [
  TPL_1,
  TPL_2,
  TPL_3,
  TPL_4,
  TPL_5,
  TPL_6,
  TPL_7,
  TPL_8,
  TPL_9,
  TPL_10,
];
