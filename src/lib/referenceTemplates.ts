/**
 * REFERENCE-STYLE TEMPLATE PACK — 9 templates recreated from the user's
 * Instagram / Pinterest reference carousels.
 *
 *  1. Red Pill / Blue Pill     — Apple-minimal white, 3D pills + app icons
 *  2. Personal AI Automation   — cream portrait, sticker-outlined serif headline
 *  3. Brainrot Habits          — white canvas, floating 3D objects + tilted labels
 *  4. Design Inspo Sites       — grid paper, Figma selection box, browser mockup
 *  5. 4 Types Going Viral      — cinematic photo, orange grotesk + italic serif
 *  6. High-Retention Carousels — editorial grey, highlighted serif + iOS menus
 *  7. The Art of Viral         — sky portrait, giant condensed type + marker scribble
 *  8. Boring vs Viral          — dark studio portrait, purple tags, wide grotesk
 *  9. 5 Things You Can Do      — royal blue, outlined numeral, yellow accent
 *
 * Every word, shape and colour is a native canvas element. Photos are regular
 * image layers, so they can be swapped with "Replace Image" in the editor.
 * IDs use a non-UUID `ref-*` prefix (projects.template_id FK safety).
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
  italic?: boolean;
  stroke?: string;
  sw?: number;
  rot?: number;
  op?: number;
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
    lineHeight: o.lh ?? 1.2,
    textCase: o.upper ? 'uppercase' : 'none',
    textDecoration: o.underline ? 'underline' : 'none',
    fontStyle: o.italic ? 'italic' : 'normal',
    ...(o.stroke ? { strokeColor: o.stroke, strokeWidth: o.sw ?? 4 } : {}),
  },
});

interface SOpts { r?: number; stroke?: string; sw?: number; rot?: number; op?: number; locked?: boolean }

const shape = (shapeType: 'rectangle' | 'circle', x: number, y: number, w: number, h: number, fill: string, o: SOpts = {}): El => ({
  type: 'shape', x, y, width: w, height: h,
  rotation: o.rot ?? 0, opacity: o.op ?? 1, locked: !!o.locked, visible: true,
  properties: {
    shapeType,
    fill,
    ...(o.r ? { borderRadius: o.r } : {}),
    ...(o.stroke ? { stroke: o.stroke, strokeWidth: o.sw ?? 2 } : {}),
  },
});

const R = (x: number, y: number, w: number, h: number, fill: string, o: SOpts = {}): El => shape('rectangle', x, y, w, h, fill, o);
const C = (x: number, y: number, w: number, h: number, fill: string, o: SOpts = {}): El => shape('circle', x, y, w, h, fill, o);

interface IOpts { fit?: 'cover' | 'contain'; r?: number; rot?: number; op?: number }

/** Image layer — replaceable in the editor */
const I = (src: string, x: number, y: number, w: number, h: number, o: IOpts = {}): El => ({
  type: 'image', x, y, width: w, height: h,
  rotation: o.rot ?? 0, opacity: o.op ?? 1, locked: false, visible: true,
  properties: { src, alt: '', objectFit: o.fit ?? 'cover', ...(o.r ? { borderRadius: o.r } : {}) },
});

const pad = (n: number) => String(n).padStart(2, '0');

const IMG = {
  portrait: '/carousels/ref/portrait-glasses.jpg',
  field: '/carousels/ref/green-field.jpg',
  cap: '/carousels/ref/cap-selfie.jpg',
  visor: '/carousels/ref/visor-man.jpg',
  dark: '/carousels/ref/dark-portrait.jpg',
  blue: '/carousels/ref/blue-hand.jpg',
  clock: '/carousels/ref/obj-clock.jpg',
  coffee: '/carousels/ref/obj-coffee.jpg',
  chat: '/carousels/ref/obj-chat.jpg',
  pillow: '/carousels/ref/obj-pillow.jpg',
};

// ─── TEMPLATE BUILDER ────────────────────────────────────────────────────────

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
  sourceUrl: string;
  trending?: boolean;
  createdAt: string;
  slides: SlideDef[];
}

const build = (d: TplDef): Template => {
  const id = `ref-${d.key}`;
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
    isTrending: !!d.trending,
    isNew: true,
    sourceType: 'reference_inspired',
    sourcePlatform: d.platform,
    sourceUrl: d.sourceUrl,
    attributionRequired: false,
    status: 'published',
    useCount: 0,
    createdAt: d.createdAt,
    updatedAt: d.createdAt,
    slides,
  };
};

// ═════════════════════════════════════════════════════════════════════════════
// 1. RED PILL / BLUE PILL
// ═════════════════════════════════════════════════════════════════════════════

const BLUE_PILL = 'linear-gradient(180deg, #7DB2FF 0%, #2A63FF 42%, #0A2DB0 100%)';
const RED_PILL = 'linear-gradient(180deg, #FF9A8A 0%, #F2291D 42%, #A30C0C 100%)';

const pill = (x: number, y: number, w: number, h: number, grad: string, rot: number): El[] => [
  R(x, y, w, h, grad, { r: h / 2, rot }),
  R(x + w * 0.16, y + h * 0.15, w * 0.6, h * 0.2, 'rgba(255,255,255,0.55)', { r: h * 0.1, rot }),
];

/** Rounded app icon with a centred glyph */
const app = (x: number, y: number, s: number, bg: string, glyph: string, gc: string, fs: number, o: { stroke?: string; font?: string } = {}): El[] => [
  R(x, y, s, s, bg, { r: s * 0.23, ...(o.stroke ? { stroke: o.stroke, sw: 3 } : {}) }),
  T(glyph, x, y + s / 2 - fs * 0.62, s, fs * 1.3, fs, { font: o.font ?? 'Inter', weight: 800, color: gc, align: 'center', lh: 1.1, ls: -1 }),
];

/** Black settings panel with three toggles */
const togglePanel = (x: number, y: number, s: number): El[] => {
  const els: El[] = [R(x, y, s, s, '#0B0B0B', { r: s * 0.12 })];
  const on = [true, false, true];
  on.forEach((v, i) => {
    const ty = y + s * 0.16 + i * s * 0.26;
    els.push(R(x + s * 0.12, ty + s * 0.09, s * 0.4, 3, '#2A2A2A'));
    els.push(R(x + s * 0.6, ty, s * 0.28, s * 0.16, v ? '#34C759' : '#3A3A3C', { r: s * 0.08 }));
    els.push(C(x + (v ? s * 0.73 : s * 0.61), ty + s * 0.015, s * 0.13, s * 0.13, '#FFFFFF'));
  });
  return els;
};

const pillRow = (y: number, label: string, red: boolean): El[] => [
  ...pill(250, y + 24, 150, 60, red ? RED_PILL : BLUE_PILL, -12),
  T(label, 430, y, 440, 110, 92, { weight: 600, ls: -3, lh: 1.1 }),
];

const listRow = (y: number, icon: El[], text: string): El[] => [
  ...icon,
  T(text, 230, y + 22, 790, 70, 42, { weight: 500, ls: -1, lh: 1.2 }),
];

const pillChoice = build({
  key: 'pill-choice',
  name: 'Red Pill / Blue Pill',
  description: 'Apple-clean white carousel with glossy 3D pills and app icons — the "which pill are you taking?" founder format.',
  category: 'Business',
  tags: ['red pill', 'blue pill', 'founder', 'minimal', 'apple', 'apps'],
  style: 'Minimal',
  audience: 'Founders',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeRr-W5Kvtv/',
  trending: true,
  createdAt: '2026-10-15T10:00:00.000Z',
  slides: [
    {
      bg: '#FFFFFF',
      els: [
        T('Which pill are\nyou taking?', 60, 170, 960, 260, 104, { weight: 700, align: 'center', ls: -4, lh: 1.04 }),
        T('The red pill is fun… until you realise\nyour boss is now yourself.', 90, 450, 900, 110, 36, { color: '#6E6E73', align: 'center', lh: 1.35 }),
        ...pillRow(700, 'blue pill', false),
        ...togglePanel(-90, 880, 230),
        ...app(180, 880, 230, 'linear-gradient(135deg, #3BD089 0%, #107C41 100%)', 'X', '#FFFFFF', 120),
        ...app(450, 880, 230, '#0B5CFF', 'zoom', '#FFFFFF', 62),
        ...app(720, 880, 230, '#FFFFFF', '#', '#E01E5A', 150, { stroke: '#ECECEC' }),
        C(900, 858, 72, 72, '#F23B2E'),
        T('1', 900, 868, 72, 56, 44, { weight: 700, color: '#FFFFFF', align: 'center', lh: 1.1 }),
        ...app(990, 880, 230, '#FFFFFF', '17', '#1C1C1E', 110, { stroke: '#ECECEC' }),
        T('@yourhandle', 70, 1250, 500, 50, 28, { weight: 600, color: '#8E8E93' }),
        T('swipe →', 600, 1250, 410, 50, 28, { weight: 600, color: '#8E8E93', align: 'right' }),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        ...pillRow(110, 'blue pill', false),
        T('The comfortable choice', 70, 320, 940, 100, 76, { weight: 700, ls: -3, align: 'center' }),
        ...listRow(500, app(80, 500, 120, '#0B5CFF', 'zoom', '#FFFFFF', 32), 'Back-to-back meetings'),
        ...listRow(670, app(80, 670, 120, 'linear-gradient(135deg, #3BD089 0%, #107C41 100%)', 'X', '#FFFFFF', 64), 'Spreadsheets someone else designed'),
        ...listRow(840, app(80, 840, 120, '#FFFFFF', '#', '#E01E5A', 78, { stroke: '#ECECEC' }), '47 unread pings before lunch'),
        ...listRow(1010, app(80, 1010, 120, '#FFFFFF', '17', '#1C1C1E', 58, { stroke: '#ECECEC' }), 'Mondays you already dread'),
        T('02 / 06', 760, 1250, 250, 50, 28, { weight: 600, color: '#8E8E93', align: 'right' }),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        ...pillRow(110, 'red pill', true),
        T('The scary choice', 70, 320, 940, 100, 76, { weight: 700, ls: -3, align: 'center' }),
        ...listRow(500, app(80, 500, 120, '#635BFF', 'S', '#FFFFFF', 70), 'You invoice your own clients'),
        ...listRow(670, app(80, 670, 120, '#FFFFFF', 'N', '#111111', 70, { stroke: '#ECECEC', font: 'DM Serif Display' }), 'You build your own systems'),
        ...listRow(840, app(80, 840, 120, 'linear-gradient(135deg, #00C4CC 0%, #7B2FF7 100%)', 'C', '#FFFFFF', 70, { font: 'Caveat' }), 'You design your own brand'),
        ...listRow(1010, app(80, 1010, 120, '#95BF47', '🛍', '#FFFFFF', 58), 'You sell your own product'),
        T('03 / 06', 760, 1250, 250, 50, 28, { weight: 600, color: '#8E8E93', align: 'right' }),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        T('Same 24 hours.', 60, 140, 960, 110, 88, { weight: 700, ls: -4, align: 'center' }),
        T('Very different days.', 60, 250, 960, 70, 44, { color: '#6E6E73', align: 'center' }),
        R(60, 380, 465, 640, '#F2F6FF', { r: 44 }),
        ...pill(190, 440, 200, 76, BLUE_PILL, -12),
        T('blue pill', 60, 560, 465, 80, 60, { weight: 700, ls: -2, align: 'center' }),
        T('• Fixed salary\n• Boss sets goals\n• Safe & predictable\n• Growth: slow', 100, 680, 400, 400, 36, { weight: 500, color: '#2B2B30', lh: 1.75 }),
        R(555, 380, 465, 640, '#FFF2F1', { r: 44 }),
        ...pill(685, 440, 200, 76, RED_PILL, -12),
        T('red pill', 555, 560, 465, 80, 60, { weight: 700, ls: -2, align: 'center' }),
        T('• Uncapped income\n• You set goals\n• Risky & exciting\n• Growth: you decide', 595, 680, 400, 400, 36, { weight: 500, color: '#2B2B30', lh: 1.75 }),
        T('04 / 06', 760, 1250, 250, 50, 28, { weight: 600, color: '#8E8E93', align: 'right' }),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        T('The red pill is fun until you realise…', 70, 300, 940, 160, 60, { weight: 600, color: '#8E8E93', align: 'center', ls: -2, lh: 1.2 }),
        T('your boss is\nnow yourself.', 40, 520, 1000, 300, 124, { weight: 800, ls: -6, align: 'center', lh: 1.02 }),
        ...pill(440, 950, 200, 76, RED_PILL, -12),
        T('05 / 06', 760, 1250, 250, 50, 28, { weight: 600, color: '#8E8E93', align: 'right' }),
      ],
    },
    {
      bg: '#FFFFFF',
      els: [
        ...pill(300, 330, 260, 96, BLUE_PILL, -25),
        ...pill(520, 330, 260, 96, RED_PILL, 25),
        T('Which pill are\nyou taking?', 60, 560, 960, 240, 100, { weight: 700, align: 'center', ls: -4, lh: 1.04 }),
        T('Comment "PILL" and I\'ll send you\nmy solo-founder toolkit 💊', 90, 840, 900, 120, 40, { color: '#6E6E73', align: 'center', lh: 1.35 }),
        R(290, 1040, 500, 116, '#111111', { r: 58 }),
        T('Follow for more', 290, 1074, 500, 56, 40, { weight: 600, color: '#FFFFFF', align: 'center', lh: 1.2 }),
        T('@yourhandle', 70, 1250, 500, 50, 28, { weight: 600, color: '#8E8E93' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. PERSONAL AI AUTOMATION
// ═════════════════════════════════════════════════════════════════════════════

const CREAM = '#F6F1E6';
const PEACH = '#F4C98B';
const SERIF = 'Abril Fatface';

const aiStep = (n: number, title: string, body: string, tool: string): SlideDef => ({
  bg: CREAM,
  els: [
    T(pad(n), 600, 40, 420, 300, 260, { font: SERIF, color: '#EADDC4', align: 'right', lh: 1.1 }),
    R(70, 130, 220, 72, PEACH, { r: 22 }),
    T(`Step ${pad(n)}`, 70, 143, 220, 50, 36, { weight: 700, align: 'center', color: '#1A1A1A', lh: 1.2 }),
    T(title, 70, 300, 940, 300, 112, { font: SERIF, color: '#111111', stroke: '#FFFFFF', sw: 14, lh: 1.05 }),
    T(body, 70, 650, 920, 300, 42, { color: '#3A3A3A', lh: 1.45 }),
    R(70, 1000, 940, 150, '#FFFFFF', { r: 28, stroke: '#EADDC4', sw: 3 }),
    T(tool, 110, 1047, 860, 60, 40, { weight: 600, color: '#1A1A1A' }),
    T('@yourhandle', 70, 1250, 500, 50, 28, { weight: 600, color: '#8A8170' }),
    T(`${pad(n + 1)} / 06`, 760, 1250, 250, 50, 28, { weight: 600, color: '#8A8170', align: 'right' }),
  ],
});

const aiAutomation = build({
  key: 'ai-automation',
  name: 'Personal AI Automation',
  description: 'Cream editorial portrait cover with a sticker-outlined serif headline and peach tag — perfect for personal-brand AI tips.',
  category: 'AI',
  tags: ['ai', 'automation', 'personal brand', 'portrait', 'serif', 'cream'],
  style: 'Personal Brand',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeWIxmvEaN7/',
  trending: true,
  createdAt: '2026-10-15T10:00:01.000Z',
  slides: [
    {
      bg: CREAM,
      els: [
        I(IMG.portrait, 0, 0, 1080, 1350),
        R(0, 800, 1080, 550, 'linear-gradient(180deg, rgba(246,241,230,0) 0%, rgba(246,241,230,0.88) 50%, #F6F1E6 100%)'),
        R(60, 925, 290, 84, PEACH, { r: 22 }),
        T('Personal', 60, 938, 290, 60, 46, { weight: 700, align: 'center', color: '#1A1A1A', lh: 1.2 }),
        T('AI Automation', 20, 1000, 1040, 190, 132, { font: SERIF, color: '#111111', stroke: '#FBF7EE', sw: 26, align: 'center', ls: -1, lh: 1.15 }),
        T('for people who hate repetitive work', 90, 1180, 900, 60, 40, { weight: 500, align: 'center', color: '#3A3A3A' }),
        T('@yourhandle', 70, 1265, 500, 50, 28, { weight: 600, color: '#8A8170' }),
        T('swipe →', 600, 1265, 410, 50, 28, { weight: 600, color: '#8A8170', align: 'right' }),
      ],
    },
    aiStep(1, 'Automate\nyour inbox', 'Let AI sort, label and draft replies to the 80% of emails that look the same every week.', '🔧  Try: Gmail filters + Zapier AI'),
    aiStep(2, 'Never take\nnotes again', 'An AI note-taker joins your calls, writes the summary and sends action items to everyone.', '🎙  Try: Otter / Fireflies'),
    aiStep(3, 'Batch your\ncontent', 'Turn one long video into 10 posts, 5 carousels and a newsletter — in a single click.', '✍️  Try: SwappAI + ChatGPT'),
    aiStep(4, 'Invoices on\nautopilot', 'Payments trigger invoices, receipts and thank-you emails without you lifting a finger.', '💸  Try: Stripe + Make.com'),
    {
      bg: CREAM,
      els: [
        I(IMG.portrait, 300, 110, 480, 600, { r: 240 }),
        R(560, 600, 250, 76, PEACH, { r: 38, rot: -6 }),
        T('that\'s me 👋', 560, 613, 250, 50, 34, { weight: 700, align: 'center', color: '#1A1A1A', rot: -6, lh: 1.2 }),
        T('Want my AI\nautomation stack?', 40, 760, 1000, 260, 104, { font: SERIF, color: '#111111', stroke: '#FFFFFF', sw: 18, align: 'center', lh: 1.08 }),
        R(240, 1070, 600, 104, '#111111', { r: 52 }),
        T('Comment "AUTOMATE"', 240, 1097, 600, 56, 40, { weight: 700, color: '#FFFFFF', align: 'center', lh: 1.2 }),
        T('@yourhandle', 70, 1250, 500, 50, 28, { weight: 600, color: '#8A8170' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. BRAINROT HABITS
// ═════════════════════════════════════════════════════════════════════════════

const habit = (n: number, img: string, label: string, why: string, fix: string, rot: number): SlideDef => ({
  bg: '#FFFFFF',
  els: [
    T(`${pad(n)} / 04`, 70, 80, 300, 50, 30, { weight: 700, color: '#B0B0B0' }),
    T('brainrot', 710, 80, 300, 50, 30, { weight: 800, color: '#111111', align: 'right', ls: -1 }),
    I(img, 290, 200, 500, 500, { fit: 'contain', rot }),
    T(label, 60, 740, 960, 120, 88, { weight: 800, ls: -4, align: 'center', rot: -2, lh: 1.1 }),
    T('Why it fries your brain', 90, 890, 900, 50, 28, { weight: 700, color: '#E5352B', align: 'center', upper: true, ls: 3 }),
    T(why, 120, 950, 840, 170, 38, { color: '#444444', align: 'center', lh: 1.4 }),
    R(250, 1140, 580, 84, '#111111', { r: 42 }),
    T(fix, 250, 1160, 580, 50, 32, { weight: 600, color: '#FFFFFF', align: 'center', lh: 1.2 }),
  ],
});

const brainrot = build({
  key: 'brainrot-habits',
  name: 'Brainrot Habits',
  description: 'Clean white canvas with floating 3D objects, tilted labels and a giant bold title — the viral "habits" explainer look.',
  category: 'Productivity',
  tags: ['brainrot', 'habits', '3d objects', 'white', 'gen z', 'focus'],
  style: 'Playful',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DecdgtiFqs3/',
  trending: true,
  createdAt: '2026-10-15T10:00:02.000Z',
  slides: [
    {
      bg: '#FFFFFF',
      els: [
        I(IMG.clock, 50, 120, 310, 310, { fit: 'contain', rot: -8 }),
        T('Snoozing\nalarms', 60, 425, 320, 120, 46, { weight: 600, align: 'center', rot: -6, lh: 1.05, ls: -1 }),
        I(IMG.coffee, 700, 100, 300, 300, { fit: 'contain', rot: 6 }),
        T('Living on\ncaffeine 24/7', 650, 400, 390, 120, 46, { weight: 600, align: 'center', rot: 5, lh: 1.05, ls: -1 }),
        I(IMG.chat, 390, 540, 300, 280, { fit: 'contain', rot: 4 }),
        T('Group chat\naddiction', 370, 815, 340, 120, 46, { weight: 600, align: 'center', rot: -4, lh: 1.05, ls: -1 }),
        I(IMG.pillow, 770, 580, 250, 250, { fit: 'contain', rot: -10 }),
        T('Weekend\nsleep-ins', 760, 830, 280, 120, 44, { weight: 600, align: 'center', rot: 6, lh: 1.05, ls: -1 }),
        T('Brainrot', 20, 980, 1040, 250, 214, { weight: 900, ls: -10, align: 'center', lh: 1.1 }),
        T('habits quietly killing your focus →', 90, 1230, 900, 60, 36, { weight: 500, color: '#555555', align: 'center' }),
      ],
    },
    habit(1, IMG.clock, 'Snoozing alarms', 'Every snooze restarts a sleep cycle you never finish — so you wake up groggier, not fresher.', 'Fix: phone across the room', -6),
    habit(2, IMG.coffee, 'Caffeine 24/7', 'Coffee masks tiredness instead of fixing it. The 3 pm crash is your brain sending the bill.', 'Fix: no coffee after 1 pm', 6),
    habit(3, IMG.chat, 'Group chat addiction', 'Constant pings keep you in "half-attention" mode — you never go deep on anything.', 'Fix: mute & check twice a day', 4),
    habit(4, IMG.pillow, 'Weekend sleep-ins', 'Sleeping till noon on Sunday gives you jet lag on Monday without ever leaving home.', 'Fix: same wake time daily', -8),
    {
      bg: '#FFFFFF',
      els: [
        I(IMG.clock, 30, 60, 230, 230, { fit: 'contain', rot: -10 }),
        I(IMG.coffee, 820, 60, 230, 230, { fit: 'contain', rot: 8 }),
        I(IMG.chat, 30, 1040, 230, 230, { fit: 'contain', rot: 6 }),
        I(IMG.pillow, 820, 1050, 220, 220, { fit: 'contain', rot: -8 }),
        T('Which one are\nyou guilty of?', 40, 430, 1000, 260, 104, { weight: 900, ls: -5, align: 'center', lh: 1.05 }),
        T('Comment the number 👇', 90, 730, 900, 70, 46, { weight: 600, color: '#555555', align: 'center' }),
        R(290, 860, 500, 110, '#111111', { r: 55 }),
        T('Save for later', 290, 890, 500, 56, 40, { weight: 600, color: '#FFFFFF', align: 'center', lh: 1.2 }),
        T('@yourhandle', 290, 1000, 500, 50, 30, { weight: 600, color: '#9A9A9A', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. DESIGN INSPO SITES (grid paper + Figma selection + browser)
// ═════════════════════════════════════════════════════════════════════════════

const PAPER = '#F6F5EF';

const gridLines = (): El[] => {
  const els: El[] = [];
  for (let x = 60; x < 1080; x += 120) els.push(R(x, 0, 2, 1350, 'rgba(17,17,17,0.06)', { locked: true }));
  for (let y = 75; y < 1350; y += 120) els.push(R(0, y, 1080, 2, 'rgba(17,17,17,0.06)', { locked: true }));
  return els;
};

const selBox = (x: number, y: number, w: number, h: number): El[] => {
  const s = 26;
  return [
    R(x, y, w, h, 'rgba(0,0,0,0)', { stroke: '#111111', sw: 3 }),
    R(x - s / 2, y - s / 2, s, s, '#111111'),
    R(x + w - s / 2, y - s / 2, s, s, '#111111'),
    R(x - s / 2, y + h - s / 2, s, s, '#111111'),
    R(x + w - s / 2, y + h - s / 2, s, s, '#111111'),
  ];
};

const browser = (x: number, y: number, w: number, h: number, url: string, tiles: string[]): El[] => {
  const els: El[] = [
    R(x + 10, y + 16, w, h, 'rgba(17,17,17,0.08)', { r: 20 }),
    R(x, y, w, h, '#FFFFFF', { r: 20, stroke: '#E0DFD8', sw: 2 }),
    R(x + 2, y + 2, w - 4, 62, '#EEEDE7', { r: 18 }),
    R(x + 2, y + 44, w - 4, 22, '#EEEDE7'),
    C(x + 26, y + 22, 20, 20, '#FF5F57'),
    C(x + 56, y + 22, 20, 20, '#FEBC2E'),
    C(x + 86, y + 22, 20, 20, '#28C840'),
    R(x + 140, y + 14, w - 280, 38, '#FFFFFF', { r: 19 }),
    T(url, x + 160, y + 20, w - 320, 30, 22, { color: '#77766F', align: 'center' }),
  ];
  const cx = x + 24, cy = y + 88, cw = w - 48, ch = h - 112;
  const tw = (cw - 3 * 16) / 4, th = (ch - 16) / 2;
  tiles.slice(0, 8).forEach((fill, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    els.push(R(cx + col * (tw + 16), cy + row * (th + 16), tw, th, fill, { r: 10 }));
  });
  return els;
};

const PALETTES = [
  ['#3A5BFF', '#111111', '#F2E9DA', '#FF6A3D', '#C9D7FF', '#1D1D1D', '#E9E4FF', '#FF4D2E'],
  ['#E8E1D3', '#C6B79B', '#2B2B2B', '#F5F0E6', '#8D7B63', '#D9CFBF', '#111111', '#B9A88C'],
  ['#0E0E10', '#7CFF6B', '#1C1C22', '#FF3DCB', '#2E2EFF', '#0E0E10', '#FFE14D', '#151518'],
  ['#FFFFFF', '#F2F2F7', '#E5E5EA', '#007AFF', '#F2F2F7', '#34C759', '#FFFFFF', '#FF9500'],
  ['#FF5C39', '#FFF3E6', '#1B1B1B', '#FFD2C2', '#2D5BFF', '#F7F7F7', '#111111', '#FFB800'],
];

const siteSlide = (n: number, name: string, lead: string, desc: string, tiles: string[]): SlideDef => ({
  bg: PAPER,
  els: [
    ...gridLines(),
    ...selBox(160, 120, 760, 150),
    T(name, 160, 138, 760, 116, 92, { weight: 700, ls: -5, align: 'center', lh: 1.2 }),
    ...browser(90, 360, 900, 600, `https://${name}`, tiles),
    T(lead, 110, 1010, 860, 56, 40, { weight: 800, ls: -1 }),
    T(desc, 110, 1066, 860, 170, 34, { color: '#33322E', lh: 1.4 }),
    T('@yourhandle', 70, 1262, 500, 50, 26, { weight: 600, color: '#8B8A83' }),
    T(`${pad(n)} / 06`, 760, 1262, 250, 50, 26, { weight: 600, color: '#8B8A83', align: 'right' }),
  ],
});

const designSites = build({
  key: 'design-inspo-sites',
  name: 'Design Inspo Websites',
  description: 'Grid-paper canvas, Figma-style selection box titles and browser mockups — the "my favourite websites" save-bait format.',
  category: 'Creator',
  tags: ['design', 'websites', 'resources', 'figma', 'grid', 'browser mockup'],
  style: 'Minimal',
  audience: 'Creators',
  platform: 'instagram',
  sourceUrl: 'https://www.instagram.com/p/DeCesD3mguM/',
  createdAt: '2026-10-15T10:00:03.000Z',
  slides: [
    {
      bg: PAPER,
      els: [
        ...gridLines(),
        T('my favourite websites for', 0, 130, 1080, 60, 40, { color: '#55544E', align: 'center' }),
        ...selBox(150, 225, 780, 170),
        T('design inspo', 150, 246, 780, 130, 110, { weight: 700, ls: -5, align: 'center', lh: 1.15 }),
        T('⭐', 900, 140, 120, 110, 80, { align: 'center' }),
        ...browser(90, 480, 900, 580, 'your-next-favourite.site', PALETTES[0]),
        C(470, 690, 140, 140, 'rgba(255,255,255,0.92)'),
        T('▶', 470, 722, 150, 80, 64, { color: '#111111', align: 'center', lh: 1.1 }),
        T('Bookmark these before you start your next project.', 140, 1110, 800, 110, 38, { color: '#222222', align: 'center', lh: 1.35 }),
        T('@yourhandle', 70, 1262, 500, 50, 26, { weight: 600, color: '#8B8A83' }),
        T('swipe →', 600, 1262, 410, 50, 26, { weight: 600, color: '#8B8A83', align: 'right' }),
      ],
    },
    siteSlide(2, 'recent.design', 'A curated gallery', 'of the latest branding, packaging, web and graphic design projects from studios around the world.', PALETTES[0]),
    siteSlide(3, 'savee.com', 'A visual bookmark board', 'for saving and discovering beautiful imagery, typography and art direction from top designers.', PALETTES[1]),
    siteSlide(4, 'godly.website', 'Astronomically good web design', '— hand-picked landing pages with motion, so you can see how great sites actually move.', PALETTES[2]),
    siteSlide(5, 'mobbin.com', 'Real app screenshots', 'from thousands of iOS, Android and web apps — search any flow, from onboarding to checkout.', PALETTES[3]),
    {
      bg: PAPER,
      els: [
        ...gridLines(),
        ...selBox(200, 300, 680, 170),
        T('save this ⭐', 200, 322, 680, 130, 104, { weight: 700, ls: -5, align: 'center', lh: 1.15 }),
        T('Which one is your favourite?\nTell me in the comments 👇', 90, 560, 900, 140, 44, { color: '#222222', align: 'center', lh: 1.4 }),
        ...browser(240, 760, 600, 360, 'follow.for/more', PALETTES[4]),
        T('@yourhandle', 70, 1262, 500, 50, 26, { weight: 600, color: '#8B8A83' }),
        T('06 / 06', 760, 1262, 250, 50, 26, { weight: 600, color: '#8B8A83', align: 'right' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. 4 TYPES GOING VIRAL (cinematic photo + orange grotesk + italic serif)
// ═════════════════════════════════════════════════════════════════════════════

const ORANGE = '#F0461E';
const ISERIF = 'Instrument Serif';

const viralFooter = (): El[] => [
  T('@yourhandle', 60, 1255, 400, 50, 34, { font: ISERIF, italic: true, color: '#FFFFFF' }),
  T('🔖 save for later', 340, 1255, 400, 50, 34, { font: ISERIF, italic: true, color: '#FFFFFF', align: 'center' }),
  T('→', 860, 1218, 160, 100, 84, { weight: 300, color: '#FFFFFF', align: 'right', lh: 1.1 }),
];

const viralType = (n: number, title: string, body: string, stat: string): SlideDef => ({
  bg: '#16200F',
  els: [
    I(IMG.field, 0, 0, 1080, 1350),
    R(0, 0, 1080, 1350, 'rgba(8,12,6,0.72)'),
    T(`TYPE ${pad(n)}`, 90, 160, 900, 120, 104, { font: 'Archivo Black', color: ORANGE, lh: 1.1 }),
    T(title, 90, 290, 900, 220, 104, { font: ISERIF, italic: true, color: '#FFFFFF', lh: 1.0 }),
    R(90, 540, 120, 8, ORANGE),
    T(body, 90, 600, 900, 320, 44, { color: 'rgba(255,255,255,0.92)', lh: 1.45 }),
    R(90, 960, 520, 78, ORANGE, { r: 14 }),
    T(stat, 90, 979, 520, 44, 30, { weight: 700, color: '#FFFFFF', align: 'center', lh: 1.2 }),
    ...viralFooter(),
  ],
});

const viralTypes = build({
  key: 'viral-types',
  name: '4 Types Going Viral',
  description: 'Cinematic full-bleed photo with orange heavy grotesk, elegant italic serif and an engagement badge.',
  category: 'Marketing',
  tags: ['viral', 'cinematic', 'photo', 'italic serif', 'orange', 'carousel tips'],
  style: 'Editorial',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/21qhFImlv',
  trending: true,
  createdAt: '2026-10-15T10:00:04.000Z',
  slides: [
    {
      bg: '#16200F',
      els: [
        I(IMG.field, 0, 0, 1080, 1350),
        R(0, 0, 1080, 1350, 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.45) 100%)'),
        T('4 TYPES', 110, 290, 860, 150, 140, { font: 'Archivo Black', color: ORANGE, lh: 1.05 }),
        T('of carousels that are going', 110, 440, 920, 100, 76, { font: ISERIF, italic: true, color: '#FFFFFF', lh: 1.1 }),
        T('VIRAL', 100, 515, 940, 270, 250, { font: 'Archivo Black', color: ORANGE, ls: -6, lh: 1.05 }),
        T('IN', 300, 800, 220, 150, 130, { font: 'Archivo Black', color: '#FFFFFF', align: 'right', lh: 1.05 }),
        T('2026', 530, 735, 520, 240, 220, { font: ISERIF, italic: true, color: '#FFFFFF', lh: 1.0 }),
        R(560, 990, 350, 78, ORANGE, { r: 14 }),
        T('💬 100   ♥ 100   👤 100', 560, 1009, 350, 44, 28, { weight: 700, color: '#FFFFFF', align: 'center', lh: 1.2 }),
        ...viralFooter(),
      ],
    },
    viralType(1, 'The "Myth\nvs Fact"', 'Pick a belief your audience holds, then flip it slide by slide. Disagreement drives comments — and comments drive reach.', '🔥 avg 3× more comments'),
    viralType(2, 'The Before\n/ After', 'Show the messy "before", tease the result, then reveal the "after" on the last slide so people swipe all the way.', '🔥 highest completion rate'),
    viralType(3, 'The Hot\nTake', 'One bold opinion on the cover, receipts on every slide after. Be specific, be brave, never be vague.', '🔥 most shares per post'),
    viralType(4, 'The Step-\nby-Step', 'A clear process people can follow later. Number every slide — it\'s the format that gets saved the most.', '🔥 avg 4× more saves'),
    {
      bg: '#16200F',
      els: [
        I(IMG.field, 0, 0, 1080, 1350),
        R(0, 0, 1080, 1350, 'rgba(8,12,6,0.55)'),
        T('Comment', 90, 330, 900, 140, 120, { font: ISERIF, italic: true, color: '#FFFFFF', align: 'center', lh: 1.05 }),
        T('"VALUE"', 40, 470, 1000, 230, 200, { font: 'Archivo Black', color: ORANGE, align: 'center', ls: -4, lh: 1.05 }),
        T('and I\'ll send you my free\ncontent-idea generator', 90, 730, 900, 140, 48, { color: '#FFFFFF', align: 'center', lh: 1.35 }),
        R(365, 930, 350, 78, ORANGE, { r: 14 }),
        T('💬 100   ♥ 100   👤 100', 365, 949, 350, 44, 28, { weight: 700, color: '#FFFFFF', align: 'center', lh: 1.2 }),
        ...viralFooter(),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 6. HIGH-RETENTION CAROUSELS (editorial grey + highlight + iOS menus)
// ═════════════════════════════════════════════════════════════════════════════

const GREY = '#E5E4E0';
const IOS_BLUE = '#2F7BF6';
const HILITE = '#A7CBF2';

const profileHeader = (y: number): El[] => [
  C(290, y, 84, 84, '#111111'),
  T('YOU', 290, y + 27, 84, 32, 24, { font: SERIF, color: '#FFFFFF', align: 'center', lh: 1.2 }),
  T('YOUR CONTENT CLUB', 392, y + 8, 330, 36, 26, { weight: 700, color: '#111111' }),
  T('@yourhandle', 392, y + 44, 330, 32, 24, { color: '#555555' }),
  R(730, y + 14, 180, 54, '#4AA3F0', { r: 12 }),
  T('Follow', 730, y + 26, 180, 32, 24, { weight: 600, color: '#FFFFFF', align: 'center', lh: 1.2 }),
];

const highlightWord = (word: string, y: number, size: number): El[] => [
  R(70, y, 940, size * 1.08, HILITE, { op: 0.95 }),
  R(66, y - 12, 5, size * 1.08 + 24, IOS_BLUE),
  C(54, y + size * 1.08, 28, 28, IOS_BLUE),
  R(1009, y - 12, 5, size * 1.08 + 24, IOS_BLUE),
  C(997, y - 26, 28, 28, IOS_BLUE),
  T(word, 70, y - size * 0.04, 940, size * 1.16, size, { font: SERIF, color: '#1C1C1C', align: 'center', ls: -3, lh: 1.1 }),
];

const dashedNote = (x: number, y: number, w: number, h: number): El[] => {
  const s = 18;
  return [
    R(x, y, w, h, 'rgba(0,0,0,0)', { stroke: '#333333', sw: 3 }),
    R(x - s / 2, y - s / 2, s, s, '#222222'),
    R(x - s / 2, y + h - s / 2, s, s, '#222222'),
  ];
};

const retentionStep = (n: number, word: string, body: string, emoji: string, example: string): SlideDef => ({
  bg: GREY,
  els: [
    ...profileHeader(70),
    T(`STEP ${pad(n)}`, 80, 230, 400, 50, 34, { weight: 700, color: IOS_BLUE, ls: 4 }),
    ...highlightWord(word, 310, 150),
    T(body, 80, 540, 640, 300, 42, { color: '#222222', lh: 1.38 }),
    C(790, 560, 220, 220, '#F7F7F5'),
    T(emoji, 790, 610, 220, 130, 104, { align: 'center', lh: 1.15 }),
    ...dashedNote(80, 900, 920, 280),
    T(example, 120, 930, 860, 230, 44, { color: '#222222', underline: true, lh: 1.32 }),
    T(`${pad(n + 1)} / 06`, 760, 1255, 250, 50, 26, { weight: 600, color: '#77766F', align: 'right' }),
  ],
});

const retention = build({
  key: 'high-retention',
  name: 'High-Retention Carousels',
  description: 'Editorial grey collage with a highlighted serif keyword, text-selection handles, iOS context menus and emoji bubbles.',
  category: 'Creator',
  tags: ['editorial', 'ios', 'highlight', 'serif', 'collage', 'retention'],
  style: 'Editorial',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/4bnzJCHcy',
  trending: true,
  createdAt: '2026-10-15T10:00:05.000Z',
  slides: [
    {
      bg: GREY,
      els: [
        I(IMG.cap, -110, -60, 1300, 1460),
        ...profileHeader(60),
        R(0, 70, 96, 360, 'rgba(255,255,255,0.7)'),
        T('↩\n❐\n✎\n↪\n✕\n···', 0, 88, 96, 330, 34, { color: '#333333', align: 'center', lh: 1.55 }),
        T('ALL HIGH-RETENTION', 140, 260, 800, 80, 64, { color: '#222222', align: 'center', ls: -1 }),
        ...highlightWord('carousels', 370, 186),
        T('✨', 0, 360, 110, 110, 70, { align: 'center' }),
        T('have this in\ncommon', 140, 600, 420, 150, 58, { color: '#222222', ls: -1, lh: 1.1 }),
        T('YOU | HELPING\nCREATORS GROW', 680, 610, 320, 70, 20, { color: '#77766F', ls: 1, lh: 1.3 }),
        ...dashedNote(40, 800, 290, 190),
        T('The structure\nthat keeps\npeople swiping', 58, 815, 260, 170, 36, { color: '#222222', underline: true, lh: 1.3 }),
        R(800, 820, 250, 390, 'rgba(250,250,250,0.94)', { r: 20 }),
        T('Reply\nCopy\nEdit\nForward', 830, 845, 210, 250, 34, { color: '#111111', lh: 1.7 }),
        T('Delete', 830, 1088, 210, 50, 34, { color: '#E5352B' }),
        T('More…', 830, 1145, 210, 50, 34, { color: '#111111' }),
        C(70, 1040, 220, 220, '#F7F7F5'),
        T('😍', 70, 1090, 220, 130, 104, { align: 'center', lh: 1.15 }),
      ],
    },
    retentionStep(1, 'the hook', 'Slide 1 has one job: stop the scroll. Promise a clear payoff in under 8 words.', '🪝', 'Example:\n“I grew 10k followers with\nthis one boring format”'),
    retentionStep(2, 'the tension', 'Open a loop on slide 2 — a problem, a mistake, a question they need answered.', '😰', 'Example:\n“But 90% of creators get\nslide 2 completely wrong…”'),
    retentionStep(3, 'the payoff', 'Deliver the value in small, swipeable chunks. One idea per slide, no walls of text.', '🎁', 'Example:\n“Step 3: rewrite your hook\nas a question”'),
    retentionStep(4, 'the CTA', 'End with one clear action. Save, share or comment — never all three at once.', '👉', 'Example:\n“Save this for your next\ncarousel ✨”'),
    {
      bg: GREY,
      els: [
        I(IMG.cap, -110, -60, 1300, 1460),
        ...profileHeader(60),
        T('don\'t forget to', 140, 260, 800, 80, 64, { color: '#222222', align: 'center', ls: -1 }),
        ...highlightWord('save this', 370, 186),
        R(800, 820, 250, 290, 'rgba(250,250,250,0.94)', { r: 20 }),
        T('Save\nShare\nFollow', 830, 845, 210, 200, 34, { color: '#111111', lh: 1.7 }),
        T('Copy link', 830, 1040, 210, 50, 34, { color: IOS_BLUE }),
        C(70, 1040, 220, 220, '#F7F7F5'),
        T('💾', 70, 1090, 220, 130, 104, { align: 'center', lh: 1.15 }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 7. THE ART OF VIRAL (sky portrait + giant condensed type + marker scribble)
// ═════════════════════════════════════════════════════════════════════════════

const SKY = '#5D9BDB';
const PINK = '#FF2E88';
const MARKER = 'Permanent Marker';

const skyCorners = (bl: string, br: string): El[] => [
  T(bl, 60, 1270, 400, 40, 26, { color: '#FFFFFF' }),
  T(br, 620, 1270, 400, 40, 26, { color: '#FFFFFF', align: 'right' }),
];

const artRule = (n: number, title: string, body: string, note: string): SlideDef => ({
  bg: 'linear-gradient(180deg, #4C8FD8 0%, #93C0EA 100%)',
  els: [
    T('@yourhandle', 60, 50, 400, 40, 26, { color: '#FFFFFF' }),
    T('Art Direction', 620, 50, 400, 40, 26, { color: '#FFFFFF', align: 'right' }),
    T(pad(n), 560, 70, 480, 440, 420, { font: 'Anton', color: '#FFFFFF', align: 'right', op: 0.22, lh: 1.05 }),
    T(`RULE ${pad(n)}`, 70, 150, 600, 50, 36, { weight: 700, color: '#FFFFFF', ls: 4 }),
    T(title, 70, 220, 940, 360, 170, { font: 'Anton', color: '#FFFFFF', lh: 0.98 }),
    R(70, 640, 940, 320, 'rgba(255,255,255,0.18)', { r: 36, stroke: 'rgba(255,255,255,0.55)', sw: 2 }),
    T(body, 120, 690, 840, 250, 46, { weight: 500, color: '#FFFFFF', lh: 1.4 }),
    T(note, 600, 990, 420, 110, 64, { font: MARKER, color: PINK, rot: -6, align: 'center', lh: 1.2 }),
    ...skyCorners('Design', `${pad(n + 1)} / 06`),
  ],
});

const artViral = build({
  key: 'art-of-viral',
  name: 'The Art of Viral',
  description: 'Sky-blue portrait with giant condensed headline, hot-pink marker scribble and tiny corner labels — bold art-direction energy.',
  category: 'Marketing',
  tags: ['viral', 'portrait', 'condensed', 'marker', 'sky', 'art direction'],
  style: 'Bold',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/kz5b34I4o',
  trending: true,
  createdAt: '2026-10-15T10:00:06.000Z',
  slides: [
    {
      bg: SKY,
      els: [
        I(IMG.visor, 0, 330, 1080, 1020),
        R(0, 328, 1080, 240, 'linear-gradient(180deg, #5D9BDB 0%, rgba(93,155,219,0) 100%)'),
        T('@yourhandle', 60, 50, 400, 40, 26, { color: '#FFFFFF' }),
        T('Art Direction', 620, 50, 400, 40, 26, { color: '#FFFFFF', align: 'right' }),
        T('THE ART OF', 60, 95, 960, 150, 136, { font: 'Anton', color: '#FFFFFF', align: 'center', lh: 1.05 }),
        R(395, 165, 290, 12, PINK, { r: 6, rot: -6 }),
        T('ART', 400, 95, 300, 140, 104, { font: MARKER, color: PINK, align: 'center', rot: -8, lh: 1.2 }),
        T('VIRAL', 40, 205, 1000, 320, 300, { font: 'Anton', color: '#FFFFFF', align: 'center', lh: 1.02 }),
        T('carousels', 660, 450, 380, 110, 74, { font: MARKER, color: PINK, align: 'center', rot: -7, lh: 1.2 }),
        ...skyCorners('Design', 'Swipe →'),
      ],
    },
    artRule(1, 'HOOK IN\n3 WORDS', 'If your cover needs a full sentence, it\'s already too long. Three punchy words beat ten clever ones.', 'trust me'),
    artRule(2, 'ONE IDEA\nPER SLIDE', 'Each swipe should feel like a mini reward. Split big ideas into small, satisfying beats.', 'less = more'),
    artRule(3, 'DESIGN FOR\nTHE THUMB', 'Huge type, high contrast, zero clutter. If it\'s not readable at phone size, it doesn\'t exist.', 'zoom out!'),
    artRule(4, 'END WITH\nA LOOP', 'Make the last slide point back to the first. Rewatches and re-swipes are the secret signal.', '↺ again'),
    {
      bg: SKY,
      els: [
        I(IMG.visor, 0, 330, 1080, 1020),
        R(0, 328, 1080, 240, 'linear-gradient(180deg, #5D9BDB 0%, rgba(93,155,219,0) 100%)'),
        T('@yourhandle', 60, 50, 400, 40, 26, { color: '#FFFFFF' }),
        T('Art Direction', 620, 50, 400, 40, 26, { color: '#FFFFFF', align: 'right' }),
        T('NOW IT\'S', 60, 95, 960, 150, 136, { font: 'Anton', color: '#FFFFFF', align: 'center', lh: 1.05 }),
        T('YOUR TURN', 30, 225, 1020, 260, 210, { font: 'Anton', color: '#FFFFFF', align: 'center', lh: 1.02 }),
        T('save it!', 700, 440, 340, 110, 74, { font: MARKER, color: PINK, align: 'center', rot: -7, lh: 1.2 }),
        ...skyCorners('Follow for more', '06 / 06'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 8. BORING VS VIRAL (dark studio portrait + purple tags + wide grotesk)
// ═════════════════════════════════════════════════════════════════════════════

const PURPLE = '#7C4DFF';
const WIDE = 'Unbounded';

const darkPills = (): El[] => [
  R(70, 55, 140, 58, 'rgba(160,160,160,0.75)', { r: 29 }),
  T('let\'s', 70, 66, 140, 40, 30, { color: '#1A1A1A', align: 'center', lh: 1.2 }),
  R(870, 55, 140, 58, 'rgba(160,160,160,0.75)', { r: 29 }),
  T('go', 870, 66, 140, 40, 30, { color: '#1A1A1A', align: 'center', lh: 1.2 }),
];

const boringViral = (n: number, topic: string, boring: string, viral: string): SlideDef => ({
  bg: '#141414',
  els: [
    ...darkPills(),
    T(pad(n), 70, 160, 500, 200, 180, { font: WIDE, weight: 900, color: '#FFFFFF', lh: 1.1 }),
    T(topic, 70, 370, 940, 100, 60, { font: WIDE, weight: 700, color: '#FFFFFF', lh: 1.2 }),
    R(70, 500, 940, 300, '#232323', { r: 32 }),
    R(100, 530, 220, 64, '#3A3A3A', { r: 16 }),
    T('boring', 100, 542, 220, 44, 30, { font: WIDE, weight: 700, color: '#A0A0A0', align: 'center', lh: 1.2 }),
    T(boring, 100, 620, 880, 170, 40, { weight: 500, color: '#8A8A8A', lh: 1.35 }),
    R(70, 840, 940, 340, PURPLE, { r: 32 }),
    R(100, 870, 200, 64, '#FFFFFF', { r: 16 }),
    T('viral', 100, 882, 200, 44, 30, { font: WIDE, weight: 700, color: PURPLE, align: 'center', lh: 1.2 }),
    T(viral, 100, 960, 880, 200, 42, { weight: 700, color: '#FFFFFF', lh: 1.35 }),
    T('@yourhandle', 70, 1255, 500, 50, 26, { weight: 600, color: '#777777' }),
    T(`${pad(n + 1)} / 07`, 760, 1255, 250, 50, 26, { weight: 600, color: '#777777', align: 'right' }),
  ],
});

const boringVsViral = build({
  key: 'boring-vs-viral',
  name: 'Boring vs Viral',
  description: 'Moody dark studio portrait with a giant numeral, purple sticker tags and wide geometric type — compare-and-contrast format.',
  category: 'Marketing',
  tags: ['dark', 'portrait', 'versus', 'purple', 'comparison', 'ideas'],
  style: 'Dark',
  audience: 'Creators',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/7827x69Rf',
  trending: true,
  createdAt: '2026-10-15T10:00:07.000Z',
  slides: [
    {
      bg: '#141414',
      els: [
        I(IMG.dark, 0, 0, 1080, 1350),
        R(0, 640, 1080, 710, 'linear-gradient(180deg, rgba(20,20,20,0) 0%, rgba(20,20,20,0.75) 55%, #141414 100%)'),
        ...darkPills(),
        T('5', 290, 430, 500, 560, 560, { font: WIDE, weight: 900, color: '#FFFFFF', align: 'center', lh: 1.0 }),
        R(110, 905, 330, 130, PURPLE, { r: 24, rot: -5 }),
        T('boring', 110, 932, 330, 80, 60, { font: WIDE, weight: 700, color: '#FFFFFF', align: 'center', rot: -5, lh: 1.2 }),
        T('VS', 400, 890, 280, 170, 150, { font: WIDE, weight: 900, color: '#FFFFFF', align: 'center', lh: 1.05 }),
        R(645, 885, 300, 130, PURPLE, { r: 24, rot: 5 }),
        T('viral', 645, 912, 300, 80, 60, { font: WIDE, weight: 700, color: '#FFFFFF', align: 'center', rot: 5, lh: 1.2 }),
        T('carousel ideas', 60, 1075, 960, 100, 70, { font: WIDE, weight: 700, color: '#FFFFFF', align: 'center', lh: 1.2 }),
        T('@yourhandle', 0, 1255, 1080, 40, 26, { color: '#8A8A8A', align: 'center' }),
      ],
    },
    boringViral(1, 'Hooks', '“5 tips to grow on Instagram”', '“I posted every day for 90 days. Here\'s what nobody tells you.”'),
    boringViral(2, 'Visuals', 'Stock photo + centred text on a gradient.', 'Your own face, giant type, one bold colour you own.'),
    boringViral(3, 'Structure', 'Ten slides that all look and read the same.', 'Hook → tension → payoff → loop. Every swipe earns the next.'),
    boringViral(4, 'Storytelling', '“Consistency is key.”', '“I almost quit at 312 followers. Then this one post changed everything.”'),
    boringViral(5, 'CTA', '“Like, comment, share and follow!”', '“Comment VIRAL and I\'ll DM you my hook swipe-file.”'),
    {
      bg: '#141414',
      els: [
        I(IMG.dark, 0, 0, 1080, 1350),
        R(0, 0, 1080, 1350, 'linear-gradient(180deg, rgba(20,20,20,0.2) 0%, rgba(20,20,20,0.6) 50%, #141414 100%)'),
        ...darkPills(),
        T('Which one will\nyou try first?', 60, 760, 960, 200, 70, { font: WIDE, weight: 700, color: '#FFFFFF', align: 'center', lh: 1.2 }),
        R(240, 1010, 600, 120, PURPLE, { r: 28, rot: -3 }),
        T('Comment "VIRAL"', 240, 1042, 600, 60, 42, { font: WIDE, weight: 700, color: '#FFFFFF', align: 'center', rot: -3, lh: 1.2 }),
        T('@yourhandle', 0, 1255, 1080, 40, 26, { color: '#8A8A8A', align: 'center' }),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 9. 5 THINGS YOU CAN DO (royal blue + outlined numeral + yellow accent)
// ═════════════════════════════════════════════════════════════════════════════

const ROYAL = '#1F4FD1';
const YELLOW = '#FFD54A';
const POP = 'Poppins';

const brandLogo = (): El[] => [
  R(700, 96, 64, 64, '#FFFFFF', { r: 18 }),
  T('Y', 700, 104, 64, 50, 40, { font: POP, weight: 800, color: ROYAL, align: 'center', lh: 1.2 }),
  T('YourBrand', 778, 100, 280, 60, 40, { font: POP, weight: 700, color: '#FFFFFF', lh: 1.4 }),
];

const thingSlide = (n: number, title: string, chip: string, body: string): SlideDef => ({
  bg: ROYAL,
  els: [
    C(700, 900, 520, 520, 'rgba(0,0,0,0)', { stroke: 'rgba(255,255,255,0.22)', sw: 3 }),
    ...brandLogo(),
    T(pad(n), 50, 140, 600, 380, 340, { font: POP, weight: 800, color: 'rgba(0,0,0,0)', stroke: '#FFFFFF', sw: 5, lh: 1.05 }),
    T(title, 60, 540, 960, 200, 84, { font: POP, weight: 700, color: '#FFFFFF', lh: 1.1 }),
    R(60, 760, 380, 78, YELLOW, { r: 39 }),
    T(chip, 60, 774, 380, 50, 34, { font: POP, weight: 700, color: ROYAL, align: 'center', lh: 1.3 }),
    T(body, 60, 880, 860, 230, 40, { font: POP, color: '#DCE5FF', lh: 1.45 }),
    T('@yourhandle', 60, 1255, 500, 50, 26, { font: POP, weight: 600, color: 'rgba(255,255,255,0.7)' }),
    T(`${pad(n + 1)} / 07`, 760, 1255, 250, 50, 26, { font: POP, weight: 600, color: 'rgba(255,255,255,0.7)', align: 'right' }),
  ],
});

const fiveThings = build({
  key: 'five-things',
  name: '5 Things You Can Do',
  description: 'Royal-blue brand carousel with a giant outlined numeral, cut-out portrait energy and a sunny yellow accent.',
  category: 'Product',
  tags: ['brand', 'app', 'blue', 'yellow', 'outlined number', 'listicle'],
  style: 'Modern',
  audience: 'Businesses',
  platform: 'pinterest',
  sourceUrl: 'https://pin.it/4sV6eos7p',
  createdAt: '2026-10-15T10:00:08.000Z',
  slides: [
    {
      bg: ROYAL,
      els: [
        I(IMG.blue, 0, 0, 1080, 1350),
        ...brandLogo(),
        T('5', 40, 170, 440, 560, 560, { font: POP, weight: 800, color: 'rgba(0,0,0,0)', stroke: '#FFFFFF', sw: 5, align: 'center', lh: 1.0 }),
        T('things you\ncan do on', 470, 230, 600, 200, 84, { font: POP, weight: 700, color: '#FFFFFF', lh: 1.05 }),
        T('YOURBRAND', 470, 410, 600, 110, 82, { font: POP, weight: 800, color: YELLOW, lh: 1.2 }),
        T('👆', 900, 1170, 130, 130, 90, { align: 'center', lh: 1.2 }),
      ],
    },
    thingSlide(1, 'Discover\nhidden spots', 'near you 📍', 'Find cafés, rooftops and secret gems your friends haven\'t posted about yet.'),
    thingSlide(2, 'Plan group\nhangouts', 'in 2 minutes ⏱', 'Vote on places, pick a time and share one link — no more 200-message group chats.'),
    thingSlide(3, 'Save your\nfavourites', 'one tap ❤️', 'Build lists for date nights, brunch spots and weekend trips you actually remember.'),
    thingSlide(4, 'Unlock\nlocal deals', 'members only 🎟', 'Get exclusive discounts from places you already love, right inside the app.'),
    thingSlide(5, 'Make\nmemories', 'share them ✨', 'Turn every outing into a shareable recap with photos, places and the people you went with.'),
    {
      bg: ROYAL,
      els: [
        I(IMG.blue, 0, 0, 1080, 1350),
        ...brandLogo(),
        T('Ready to\nexplore?', 60, 200, 700, 260, 110, { font: POP, weight: 800, color: '#FFFFFF', lh: 1.05 }),
        R(60, 480, 400, 84, YELLOW, { r: 42 }),
        T('Link in bio 👆', 60, 496, 400, 56, 38, { font: POP, weight: 700, color: ROYAL, align: 'center', lh: 1.3 }),
        T('@yourhandle', 60, 1255, 500, 50, 26, { font: POP, weight: 600, color: 'rgba(255,255,255,0.8)' }),
      ],
    },
  ],
});

// ─── EXPORT ──────────────────────────────────────────────────────────────────

export const REFERENCE_TEMPLATES: Template[] = [
  pillChoice,
  aiAutomation,
  brainrot,
  designSites,
  viralTypes,
  retention,
  artViral,
  boringVsViral,
  fiveThings,
];
