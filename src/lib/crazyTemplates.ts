/**
 * CRAZY CAROUSEL TEMPLATE PACK — 20 fully editable templates.
 *
 * Each template is inspired by viral Instagram / Pinterest carousel aesthetics
 * (neo-brutalism, Y2K, Swiss grid, notes-app, tweet cards, magazine covers,
 * terminal, receipts, comic pop-art, wrapped-style stats, zen minimal, etc.).
 *
 * Everything is built from native canvas elements (text / shape) so every
 * slide renders identically in previews, the editor and PNG/JPG export, and
 * every word, color and position stays editable in the canvas.
 *
 * IDs intentionally use a non-UUID `crazy-*` prefix so projects created from
 * them never violate the `projects.template_id` foreign key in Supabase.
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
}

/** Text element */
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

/** Rectangle */
const R = (x: number, y: number, w: number, h: number, fill: string, o: SOpts = {}): El => shape('rectangle', x, y, w, h, fill, o);
/** Circle / ellipse */
const C = (x: number, y: number, w: number, h: number, fill: string, o: SOpts = {}): El => shape('circle', x, y, w, h, fill, o);

const pad = (n: number) => String(n).padStart(2, '0');

/** "02 / 06" page counter, bottom-right */
const pager = (i: number, n: number, color: string, font = 'Space Grotesk'): El =>
  T(`${pad(i)} / ${pad(n)}`, 760, 1250, 250, 50, 28, { font, weight: 700, color, align: 'right', ls: 2 });

/** "@yourhandle" bottom-left */
const handle = (color: string, font = 'Space Grotesk', text = '@yourhandle'): El =>
  T(text, 70, 1250, 600, 50, 28, { font, weight: 700, color });

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
  trending?: boolean;
  createdAt: string;
  slides: SlideDef[];
}

const build = (d: TplDef): Template => {
  const id = `crazy-${d.key}`;
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
    attributionRequired: false,
    status: 'published',
    useCount: 0,
    createdAt: d.createdAt,
    updatedAt: d.createdAt,
    slides,
  };
};

// ═════════════════════════════════════════════════════════════════════════════
// 01 — STOP SCROLLING (Neon Brutalist)
// ═════════════════════════════════════════════════════════════════════════════
const NEON = { ink: '#0A0A0A', lime: '#D4FF00', white: '#FFFFFF', grey: '#BDBDBD' };

const neonHook = (n: number, hook: string, why: string, use: string, dark: boolean): SlideDef => {
  const bg = dark ? NEON.ink : NEON.lime;
  const fg = dark ? NEON.lime : NEON.ink;
  const cardBg = dark ? NEON.lime : NEON.ink;
  const cardFg = dark ? NEON.ink : NEON.lime;
  const whyFg = dark ? NEON.ink : NEON.white;
  return {
    bg,
    els: [
      T(pad(n), 600, 30, 410, 330, 320, { font: 'Anton', color: dark ? 'rgba(212,255,0,0.12)' : 'rgba(10,10,10,0.12)', align: 'right', lh: 1 }),
      T(`HOOK #${pad(n)}`, 70, 90, 600, 100, 80, { font: 'Anton', color: fg, ls: 2, lh: 1.1 }),
      R(70, 380, 940, 520, cardBg),
      T(hook, 120, 430, 840, 330, 64, { font: 'Archivo Black', color: cardFg, lh: 1.15 }),
      T(why, 120, 800, 840, 70, 28, { font: 'Space Grotesk', weight: 700, color: whyFg, upper: true, ls: 1 }),
      T(use, 70, 960, 940, 120, 36, { font: 'Space Grotesk', weight: 500, color: dark ? NEON.white : NEON.ink, lh: 1.3 }),
      handle(dark ? NEON.grey : NEON.ink),
      pager(n + 1, 5, fg),
    ],
  };
};

const TPL_NEON_BRUTAL = build({
  key: 'stop-scrolling',
  name: 'Stop Scrolling — Neon Brutalist Hooks',
  description: 'Acid-lime brutalist carousel with giant condensed type. 3 copy-paste viral hooks + save CTA.',
  category: 'Marketing',
  tags: ['hooks', 'viral', 'brutalist', 'neon', 'bold', 'copywriting', 'instagram'],
  style: 'Bold',
  audience: 'Creators',
  platform: 'instagram',
  trending: true,
  createdAt: '2026-10-15T10:20:00.000Z',
  slides: [
    {
      bg: NEON.ink,
      els: [
        R(0, 0, 1080, 90, NEON.lime),
        T('★ VIRAL HOOK FORMULA ★ STEAL THIS ★', 0, 22, 1080, 50, 34, { font: 'Anton', color: NEON.ink, align: 'center', ls: 3, lh: 1.2 }),
        T('STOP', 70, 150, 940, 270, 260, { font: 'Anton', color: NEON.white, lh: 1 }),
        T('SCROLL', 70, 395, 940, 270, 260, { font: 'Anton', color: NEON.lime, lh: 1 }),
        T('ING.', 70, 640, 940, 270, 260, { font: 'Anton', color: NEON.white, lh: 1 }),
        R(70, 950, 560, 10, NEON.lime),
        T('3 hooks that made my last 10 posts go viral (steal them)', 70, 990, 700, 150, 40, { font: 'Space Grotesk', weight: 500, color: NEON.grey, lh: 1.3 }),
        C(820, 1060, 190, 190, NEON.lime),
        T('SWIPE\n→', 820, 1100, 190, 120, 44, { font: 'Anton', color: NEON.ink, align: 'center', lh: 1.1 }),
        handle(NEON.grey),
      ],
    },
    neonHook(1, '"I tried ___ for 30 days. Here\'s what nobody tells you."', 'Why it works → curiosity gap + personal proof', 'Use it for: challenges, experiments, transformations.', false),
    neonHook(2, '"Stop doing ___. Do this instead."', 'Why it works → pattern interrupt + instant value', 'Use it for: tips, mistakes, better alternatives.', true),
    neonHook(3, '"7 things I wish I knew before ___ (#4 hurts)"', 'Why it works → numbered list + open loop', 'Use it for: lessons, career stories, beginner advice.', false),
    {
      bg: NEON.ink,
      els: [
        T('SAVE', 70, 170, 940, 270, 260, { font: 'Anton', color: NEON.white, lh: 1 }),
        T('THIS.', 70, 415, 940, 270, 260, { font: 'Anton', color: NEON.lime, lh: 1 }),
        R(70, 740, 940, 6, NEON.lime),
        T('Follow for daily hooks that actually convert.', 70, 790, 940, 140, 54, { font: 'Space Grotesk', weight: 700, color: NEON.white, lh: 1.2 }),
        R(70, 1010, 430, 110, NEON.lime, { r: 55 }),
        T('FOLLOW +', 70, 1035, 430, 64, 52, { font: 'Anton', color: NEON.ink, align: 'center', lh: 1.1, ls: 2 }),
        R(530, 1010, 480, 110, 'transparent', { r: 55, stroke: NEON.lime, sw: 4 }),
        T('@yourhandle', 530, 1042, 480, 50, 38, { font: 'Space Grotesk', weight: 700, color: NEON.lime, align: 'center' }),
        pager(5, 5, NEON.lime),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 02 — MAIN CHARACTER (Y2K Dreamy Gradient)
// ═════════════════════════════════════════════════════════════════════════════
const Y2K = { plum: '#2B0B4B', plum2: '#3D1A63', white: '#FFFFFF' };
const y2kBgs = [
  'linear-gradient(160deg, #FF9EE5 0%, #B8A4FF 50%, #7DE2FF 100%)',
  'linear-gradient(200deg, #FFC6F0 0%, #C9B6FF 55%, #9EEBFF 100%)',
  'linear-gradient(135deg, #B8A4FF 0%, #FF9EE5 60%, #FFD6A5 100%)',
  'linear-gradient(180deg, #7DE2FF 0%, #B8A4FF 50%, #FF9EE5 100%)',
  'linear-gradient(120deg, #FFD6A5 0%, #FF9EE5 45%, #B8A4FF 100%)',
];
const glow = 'radial-gradient(circle, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)';

const y2kSign = (n: number, total: number, emoji: string, title: string, body: string): SlideDef => ({
  bg: y2kBgs[n % y2kBgs.length],
  els: [
    C(-200, -200, 640, 640, glow),
    C(680, 860, 640, 640, glow),
    R(70, 150, 940, 1040, 'rgba(255,255,255,0.35)', { r: 60, stroke: 'rgba(255,255,255,0.85)', sw: 4 }),
    C(130, 220, 200, 200, Y2K.plum),
    T(pad(n), 130, 268, 200, 110, 90, { font: 'Syne', weight: 800, color: Y2K.white, align: 'center', lh: 1 }),
    T(emoji, 760, 220, 200, 200, 150, { align: 'center', lh: 1.1 }),
    T(title, 130, 480, 820, 300, 64, { font: 'Syne', weight: 800, color: Y2K.plum, lh: 1.08 }),
    T(body, 130, 810, 820, 280, 38, { font: 'Space Grotesk', weight: 500, color: Y2K.plum2, lh: 1.4 }),
    T('✦', 900, 1090, 80, 80, 64, { color: Y2K.white, lh: 1 }),
    pager(n + 1, total, Y2K.plum),
  ],
});

const TPL_Y2K = build({
  key: 'main-character-y2k',
  name: 'Main Character Energy — Y2K Dream',
  description: 'Pastel holographic gradients, glassy cards and sparkles. A relatable "signs you are…" carousel built for shares.',
  category: 'Creator',
  tags: ['y2k', 'aesthetic', 'pastel', 'gradient', 'relatable', 'lifestyle', 'pinterest'],
  style: 'Playful',
  audience: 'Influencers',
  platform: 'pinterest',
  trending: true,
  createdAt: '2026-10-15T10:19:00.000Z',
  slides: [
    {
      bg: y2kBgs[0],
      els: [
        C(-150, -150, 620, 620, glow),
        C(680, 880, 620, 620, glow),
        T('✦', 840, 130, 130, 130, 110, { color: Y2K.white, lh: 1 }),
        T('✧', 880, 760, 90, 90, 70, { color: Y2K.plum, lh: 1 }),
        T('✧', 110, 1010, 110, 110, 90, { color: Y2K.white, lh: 1 }),
        R(70, 120, 380, 64, Y2K.plum, { r: 32 }),
        T('★ Y2K ENERGY ★', 70, 136, 380, 36, 26, { font: 'Space Grotesk', weight: 700, color: Y2K.white, align: 'center', ls: 3 }),
        T("4 signs\nyou're the\nmain\ncharacter", 70, 240, 940, 460, 100, { font: 'Syne', weight: 800, color: Y2K.plum, lh: 1.02 }),
        R(70, 960, 660, 100, Y2K.white, { r: 50 }),
        T("(and why it's a good thing) 💅", 70, 988, 660, 50, 34, { font: 'Space Grotesk', weight: 700, color: Y2K.plum, align: 'center' }),
        T('swipe ✧', 760, 1250, 250, 50, 32, { font: 'Syne', weight: 700, color: Y2K.plum, align: 'right' }),
      ],
    },
    y2kSign(1, 6, '☕', 'You romanticize\nthe mundane', 'Coffee runs feel like a movie scene. Your playlist has a soundtrack for every single mood.'),
    y2kSign(2, 6, '🎬', 'Your plot twists\nare elite', 'You treat setbacks as character development. Every L is just season-two lore.'),
    y2kSign(3, 6, '👠', 'You dress for\nthe vibe', 'Outfits are planned around the energy you want to attract — not the weather forecast.'),
    y2kSign(4, 6, '💖', 'Your circle is\nsmall but iconic', 'Supporting cast? Hand-picked. Every friend has a full character arc.'),
    {
      bg: y2kBgs[4],
      els: [
        C(-150, 800, 700, 700, glow),
        C(600, -200, 700, 700, glow),
        T('✦', 120, 140, 120, 120, 100, { color: Y2K.white, lh: 1 }),
        T("tag your\nmain character\nbestie 💌", 70, 380, 940, 320, 78, { font: 'Syne', weight: 800, color: Y2K.plum, align: 'center', lh: 1.1 }),
        R(240, 860, 600, 110, Y2K.plum, { r: 55 }),
        T('follow for more ✧', 240, 890, 600, 56, 42, { font: 'Syne', weight: 700, color: Y2K.white, align: 'center' }),
        T('@yourhandle', 240, 1010, 600, 50, 34, { font: 'Space Grotesk', weight: 700, color: Y2K.plum, align: 'center' }),
        pager(6, 6, Y2K.plum),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 03 — LESS, BUT BETTER (Swiss Grid Editorial)
// ═════════════════════════════════════════════════════════════════════════════
const SW = { paper: '#F2EFE9', red: '#E63322', ink: '#111111', body: '#333333' };
const swissGrid = (): El[] => [
  R(360, 0, 2, 1350, 'rgba(17,17,17,0.12)'),
  R(720, 0, 2, 1350, 'rgba(17,17,17,0.12)'),
  R(0, 450, 1080, 2, 'rgba(17,17,17,0.12)'),
  R(0, 900, 1080, 2, 'rgba(17,17,17,0.12)'),
];
const swissPrinciple = (n: number, title: string, body: string): SlideDef => ({
  bg: SW.paper,
  els: [
    ...swissGrid(),
    T(pad(n), 50, 60, 700, 380, 360, { font: 'Inter', weight: 900, color: SW.red, lh: 1, ls: -18 }),
    R(70, 470, 940, 6, SW.ink),
    T(title, 70, 510, 940, 310, 96, { weight: 900, color: SW.ink, lh: 1.0, ls: -3 }),
    T('PRINCIPLE', 70, 850, 300, 40, 24, { font: 'Space Mono', weight: 700, color: SW.red, ls: 3 }),
    T(body, 430, 850, 580, 330, 32, { color: SW.body, lh: 1.45 }),
    handle(SW.ink, 'Space Mono', '@yourstudio'),
    pager(n + 1, 6, SW.ink, 'Space Mono'),
  ],
});

const TPL_SWISS = build({
  key: 'swiss-less-better',
  name: 'Less, But Better — Swiss Grid',
  description: 'International Typographic Style: red sun, strict grid, monster numerals. Perfect for principles, frameworks & manifestos.',
  category: 'Business',
  tags: ['swiss', 'editorial', 'design', 'grid', 'principles', 'minimal', 'pinterest'],
  style: 'Editorial',
  audience: 'Agencies',
  platform: 'pinterest',
  createdAt: '2026-10-15T10:18:00.000Z',
  slides: [
    {
      bg: SW.paper,
      els: [
        ...swissGrid(),
        C(420, 110, 580, 580, SW.red),
        T('Nº 01', 70, 80, 300, 50, 28, { font: 'Space Mono', weight: 700, color: SW.ink }),
        T('DESIGN\nSERIES', 70, 130, 300, 90, 28, { font: 'Space Mono', color: SW.ink, lh: 1.3 }),
        T('LESS,\nBUT\nBETTER.', 60, 620, 960, 480, 170, { weight: 900, color: SW.ink, lh: 0.9, ls: -7 }),
        T('Dieter Rams’ principles of good design,\nrevisited for 2026 →', 70, 1130, 760, 100, 30, { weight: 500, color: SW.ink, lh: 1.4 }),
        pager(1, 6, SW.ink, 'Space Mono'),
      ],
    },
    swissPrinciple(1, 'Good design is\ninnovative.', 'It never copies. It uses new technology to solve old problems in ways nobody has tried before.'),
    swissPrinciple(2, 'Good design is\nhonest.', 'It does not make a product look more valuable than it is. No fake promises, no dark patterns.'),
    swissPrinciple(3, 'Good design is\nunobtrusive.', 'Products are tools, not art pieces. Leave room for the user to express themselves.'),
    swissPrinciple(4, 'Good design is\nas little design\nas possible.', 'Back to purity, back to simplicity. Concentrate on the essential.'),
    {
      bg: SW.red,
      els: [
        R(360, 0, 2, 1350, 'rgba(242,239,233,0.2)'),
        R(720, 0, 2, 1350, 'rgba(242,239,233,0.2)'),
        T('Save this\nfor your\nnext brief.', 60, 180, 960, 560, 150, { weight: 900, color: SW.paper, lh: 0.95, ls: -5 }),
        C(700, 860, 300, 300, SW.ink),
        T('→', 700, 925, 300, 170, 150, { weight: 900, color: SW.paper, align: 'center', lh: 1 }),
        T('Follow for weekly\ndesign theory.', 70, 900, 560, 120, 40, { weight: 700, color: SW.paper, lh: 1.25 }),
        handle(SW.paper, 'Space Mono', '@yourstudio'),
        pager(6, 6, SW.paper, 'Space Mono'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 04 — NOTES APP CONFESSION
// ═════════════════════════════════════════════════════════════════════════════
const NOTES = { bg: '#F7F6F2', gold: '#E0A800', ink: '#111111', body: '#333333', grey: '#9A9A9A', hl: '#FFE27A' };
const notesChrome = (): El[] => [
  T('‹ Notes', 50, 70, 300, 60, 40, { weight: 500, color: NOTES.gold }),
  T('Done', 780, 70, 250, 60, 40, { weight: 600, color: NOTES.gold, align: 'right' }),
  T('October 15, 2026 at 9:41 PM', 0, 165, 1080, 40, 26, { color: NOTES.grey, align: 'center' }),
  R(0, 1190, 1080, 2, '#E5E3DC'),
];
const notesItem = (n: number, title: string, highlight: string, body: string): SlideDef => ({
  bg: NOTES.bg,
  els: [
    ...notesChrome(),
    T(`${n}.`, 70, 230, 220, 140, 120, { weight: 800, color: NOTES.gold, lh: 1.1 }),
    T(title, 70, 390, 940, 190, 72, { weight: 800, color: NOTES.ink, lh: 1.15 }),
    R(62, 616, 956, 74, NOTES.hl, { r: 8, op: 0.85 }),
    T(highlight, 80, 628, 920, 56, 42, { weight: 700, color: NOTES.ink }),
    T(body, 70, 740, 940, 420, 40, { color: NOTES.body, lh: 1.5 }),
    T('swipe →', 70, 1240, 600, 60, 34, { weight: 600, color: NOTES.gold }),
    pager(n + 1, 6, NOTES.grey, 'Inter'),
  ],
});

const TPL_NOTES = build({
  key: 'notes-app-confession',
  name: 'Notes App Confession',
  description: 'The viral iPhone Notes-app look. Raw, personal, highly shareable — ideal for lessons, confessions and lists.',
  category: 'Personal Brand',
  tags: ['notes app', 'iphone', 'personal', 'storytelling', 'minimal', 'relatable', 'instagram'],
  style: 'Minimal',
  audience: 'Creators',
  platform: 'instagram',
  trending: true,
  createdAt: '2026-10-15T10:17:00.000Z',
  slides: [
    {
      bg: NOTES.bg,
      els: [
        ...notesChrome(),
        T('things i stopped\ndoing in my 20s\n(that changed\neverything)', 70, 250, 940, 400, 82, { weight: 800, color: NOTES.ink, lh: 1.15 }),
        T('— a list for anyone who needs it 🤍', 70, 680, 940, 60, 38, { color: '#555555' }),
        T('1. people pleasing\n2. checking my ex\'s stories\n3. saying yes to everything\n4. waiting to feel "ready"', 70, 790, 940, 300, 44, { color: '#222222', lh: 1.6 }),
        T('swipe for the full list →', 70, 1240, 940, 60, 34, { weight: 600, color: NOTES.gold, align: 'right' }),
      ],
    },
    notesItem(1, 'people pleasing', 'your peace > their approval', 'I used to say yes just to avoid awkward silence. Now I let people be disappointed. Turns out, the right ones stay anyway.'),
    notesItem(2, "checking my ex's\nstories", 'closure is a decision, not a DM', "Every tap was me reopening a wound. Muted, archived, healed. You can't move forward while looking back."),
    notesItem(3, 'saying yes to\neverything', 'every yes is a no to something else', 'Busy is not the same as productive. I protect my calendar like it\'s my bank account now.'),
    notesItem(4, 'waiting to feel\n"ready"', 'confidence comes AFTER action', 'Nobody feels ready. You start scared, you get reps, and one day you look back and realise you became the person.'),
    {
      bg: NOTES.bg,
      els: [
        ...notesChrome(),
        T('if this hit,\nsend it to\nsomeone who\nneeds it 🤍', 70, 300, 940, 420, 88, { weight: 800, color: NOTES.ink, lh: 1.15 }),
        R(62, 800, 956, 74, NOTES.hl, { r: 8, op: 0.85 }),
        T('saved to my notes forever.', 80, 812, 920, 56, 42, { weight: 700, color: NOTES.ink }),
        T('follow @yourhandle for more\nunfiltered notes ✍️', 70, 930, 940, 130, 40, { color: NOTES.body, lh: 1.5 }),
        pager(6, 6, NOTES.grey, 'Inter'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 05 — UNPOPULAR OPINIONS (Tweet Cards)
// ═════════════════════════════════════════════════════════════════════════════
const TW = { ink: '#0F1419', grey: '#536471', line: '#EFF3F4', bg: 'linear-gradient(135deg, #1D9BF0 0%, #7B61FF 100%)' };
const tweetCard = (y: number, h: number, text: string, size = 48, stats = true): El[] => [
  R(80 + 14, y + 18, 920, h, 'rgba(15,20,25,0.25)', { r: 40 }),
  R(80, y, 920, h, '#FFFFFF', { r: 40 }),
  C(130, y + 50, 110, 110, 'linear-gradient(135deg, #FF8A00 0%, #FF2E93 100%)'),
  T('Your Name', 270, y + 60, 500, 50, 38, { weight: 800, color: TW.ink }),
  T('@yourhandle · 2h', 270, y + 112, 600, 40, 30, { color: TW.grey }),
  T('𝕏', 860, y + 60, 100, 60, 48, { weight: 900, color: TW.ink, align: 'right' }),
  T(text, 130, y + 200, 820, h - (stats ? 330 : 240), size, { weight: 500, color: TW.ink, lh: 1.35 }),
  ...(stats
    ? [
        R(130, y + h - 110, 820, 2, TW.line),
        T('💬 1.2K     🔁 4.8K     ❤️ 21.3K     📊 2.1M', 130, y + h - 80, 820, 50, 30, { weight: 500, color: TW.grey }),
      ]
    : []),
];
const tweetSlide = (n: number, text: string): SlideDef => ({
  bg: TW.bg,
  els: [
    T(`UNPOPULAR OPINION #${n}`, 80, 170, 920, 80, 56, { font: 'Anton', color: '#FFFFFF', ls: 2 }),
    ...tweetCard(290, 820, text, 52),
    pager(n + 1, 6, '#FFFFFF'),
  ],
});

const TPL_TWEET = build({
  key: 'unpopular-opinions-tweets',
  name: 'Unpopular Opinions — Tweet Cards',
  description: 'Screenshot-style tweet cards on an electric gradient. Spicy takes that drive comments and debates.',
  category: 'Creator',
  tags: ['tweet', 'twitter', 'x', 'opinions', 'thread', 'engagement', 'instagram'],
  style: 'Modern',
  audience: 'Creators',
  platform: 'instagram',
  trending: true,
  createdAt: '2026-10-15T10:16:00.000Z',
  slides: [
    {
      bg: TW.bg,
      els: [
        C(620, -180, 640, 640, 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)'),
        T('unpopular\nopinions\nabout building\nonline 🌶️', 80, 150, 920, 520, 104, { weight: 900, color: '#FFFFFF', lh: 1.02, ls: -2 }),
        ...tweetCard(760, 380, 'Most of these will make you mad. Good. 👇', 44, false),
        pager(1, 6, '#FFFFFF'),
      ],
    },
    tweetSlide(1, "Consistency is overrated. Posting daily garbage won't beat one banger a week."),
    tweetSlide(2, "You don't need a niche. You need a point of view."),
    tweetSlide(3, 'Your first 1,000 followers should feel like friends, not numbers.'),
    tweetSlide(4, 'Going viral is luck. Staying relevant is a system.'),
    {
      bg: TW.bg,
      els: [
        T('YOUR TURN 👇', 80, 170, 920, 80, 56, { font: 'Anton', color: '#FFFFFF', ls: 2 }),
        ...tweetCard(290, 820, 'If you agree with at least 2 of these, follow me.\n\nIf you disagree with all 4… definitely follow me. 😂', 50),
        pager(6, 6, '#FFFFFF'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 06 — MUSE (Magazine Cover Editorial)
// ═════════════════════════════════════════════════════════════════════════════
const MAG = { paper: '#EFE8DC', ink: '#1A1A1A', rust: '#8C2F1C', body: '#3A3A3A' };
const barcode = (x: number, y: number, color: string): El[] =>
  [4, 2, 6, 2, 3, 8, 2, 4, 2, 6, 3, 2].map((w, i, arr) => {
    const offset = arr.slice(0, i).reduce((a, b) => a + b + 4, 0);
    return R(x + offset, y, w, 60, color);
  });
const magRule = (n: number, title: string, body: string): SlideDef => ({
  bg: MAG.paper,
  els: [
    T(`RULE Nº ${pad(n)}`, 70, 90, 500, 50, 30, { font: 'Space Mono', weight: 700, color: MAG.rust, ls: 3 }),
    R(70, 160, 940, 2, MAG.ink),
    T('“', 640, 560, 380, 420, 440, { font: 'Playfair Display', weight: 900, color: 'rgba(140,47,28,0.14)', align: 'right', lh: 1 }),
    T(title, 70, 220, 940, 400, 124, { font: 'Playfair Display', weight: 900, color: MAG.ink, lh: 1.0, ls: -3 }),
    R(70, 690, 120, 6, MAG.rust),
    T(body, 70, 740, 640, 380, 36, { color: MAG.body, lh: 1.5 }),
    T('MUSE · THE PERSONAL BRAND ISSUE', 70, 1255, 700, 40, 22, { font: 'Space Mono', color: MAG.ink, ls: 2 }),
    pager(n + 1, 6, MAG.ink, 'Space Mono'),
  ],
});

const TPL_MAGAZINE = build({
  key: 'muse-magazine',
  name: 'MUSE — Magazine Cover Editorial',
  description: 'High-fashion magazine cover with masthead, cover lines and barcode, followed by editorial rule pages.',
  category: 'Personal Brand',
  tags: ['magazine', 'editorial', 'vogue', 'serif', 'luxury', 'fashion', 'pinterest'],
  style: 'Luxury',
  audience: 'Influencers',
  platform: 'pinterest',
  trending: true,
  createdAt: '2026-10-15T10:15:00.000Z',
  slides: [
    {
      bg: MAG.paper,
      els: [
        T('MUSE', 30, 20, 1020, 310, 300, { font: 'Playfair Display', weight: 900, color: MAG.ink, align: 'center', ls: -6, lh: 1 }),
        R(70, 335, 940, 3, MAG.ink),
        T('THE OCTOBER ISSUE  ·  Nº10  ·  2026', 70, 352, 940, 40, 24, { font: 'Space Mono', color: MAG.ink, align: 'center', ls: 3 }),
        R(300, 440, 480, 720, 'linear-gradient(180deg, #D9B38C 0%, #8C5E3C 100%)', { r: 240 }),
        T('you.', 300, 700, 480, 200, 170, { font: 'Playfair Display', weight: 900, color: MAG.paper, align: 'center', lh: 1 }),
        T('THE\nPERSONAL\nBRAND\nISSUE', 60, 470, 230, 280, 36, { weight: 900, color: MAG.ink, lh: 1.1 }),
        T('12 rules\nfor being\nunforgettable', 60, 790, 230, 170, 30, { font: 'Playfair Display', weight: 700, color: MAG.rust, lh: 1.15 }),
        T('“Stop\nblending\nin.”', 800, 470, 220, 240, 44, { font: 'Playfair Display', weight: 900, color: MAG.rust, align: 'right', lh: 1.05 }),
        T('EXCLUSIVE\nINTERVIEW\nWITH YOUR\nFUTURE\nSELF', 800, 770, 220, 250, 28, { weight: 800, color: MAG.ink, align: 'right', lh: 1.2 }),
        T('THE ONLY GUIDE YOU NEED THIS SEASON', 70, 1190, 940, 50, 30, { weight: 800, color: MAG.ink, align: 'center', ls: 4 }),
        ...barcode(70, 1260, MAG.ink),
        pager(1, 6, MAG.ink, 'Space Mono'),
      ],
    },
    magRule(1, 'Be known\nfor one\nthing.', 'Confused audiences don’t follow. Pick the one idea you want to own and say it a hundred different ways.'),
    magRule(2, 'Taste is\nyour moat.', 'Anyone can copy your format. Nobody can copy your eye. Curate ruthlessly — what you leave out defines you.'),
    magRule(3, 'Show the\nprocess.', 'The polished result earns likes. The messy middle earns trust. Document, don’t just display.'),
    magRule(4, 'Repeat\nyourself.', 'By the time you’re sick of saying it, your audience is just starting to hear it.'),
    {
      bg: MAG.ink,
      els: [
        T('MUSE', 30, 60, 1020, 310, 300, { font: 'Playfair Display', weight: 900, color: MAG.paper, align: 'center', ls: -6, lh: 1 }),
        R(70, 380, 940, 2, MAG.paper),
        T('Subscribe\nto your own\nevolution.', 70, 480, 940, 400, 116, { font: 'Playfair Display', weight: 900, color: MAG.paper, align: 'center', lh: 1.05 }),
        T('FOLLOW @YOURHANDLE FOR THE NEXT ISSUE', 70, 1000, 940, 50, 28, { font: 'Space Mono', weight: 700, color: '#D9B38C', align: 'center', ls: 2 }),
        ...barcode(70, 1240, MAG.paper),
        pager(6, 6, MAG.paper, 'Space Mono'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 07 — PROMPT TERMINAL (Retro Hacker)
// ═════════════════════════════════════════════════════════════════════════════
const TERM = { bg: '#0B0F0A', win: '#0F1A0E', bar: '#14261A', green: '#39FF14', dim: '#5FAF5A', soft: '#C8FFC0', amber: '#FFB000' };
const termChrome = (): El[] => [
  R(60, 80, 960, 1150, TERM.win, { r: 24, stroke: '#1F3D1C', sw: 3 }),
  R(63, 83, 954, 70, TERM.bar, { r: 22 }),
  R(63, 130, 954, 23, TERM.bar),
  C(100, 106, 24, 24, '#FF5F57'),
  C(140, 106, 24, 24, '#FEBC2E'),
  C(180, 106, 24, 24, '#28C840'),
  T('swapp@ai: ~ — zsh', 60, 100, 960, 36, 24, { font: 'Space Mono', color: TERM.dim, align: 'center' }),
];
const termPrompt = (n: number, label: string, prompt: string, output: string): SlideDef => ({
  bg: TERM.bg,
  els: [
    ...termChrome(),
    T(`$ prompt --id ${pad(n)}`, 110, 200, 860, 50, 36, { font: 'Space Mono', weight: 700, color: TERM.green }),
    T(`// ${label}`, 110, 265, 860, 50, 30, { font: 'Space Mono', color: TERM.dim }),
    R(110, 350, 860, 580, '#0A140A', { r: 12, stroke: '#1F6F1A', sw: 2 }),
    T(prompt, 150, 390, 780, 510, 34, { font: 'Space Mono', color: TERM.soft, lh: 1.5 }),
    T(`> output: ${output}`, 110, 975, 860, 120, 30, { font: 'Space Mono', color: TERM.amber, lh: 1.5 }),
    T(`[${pad(n + 1)}/06]`, 110, 1130, 860, 50, 28, { font: 'Space Mono', weight: 700, color: TERM.dim }),
    handle(TERM.dim, 'Space Mono'),
    pager(n + 1, 6, TERM.green, 'Space Mono'),
  ],
});

const TPL_TERMINAL = build({
  key: 'prompt-terminal',
  name: 'Prompt Terminal — Retro Hacker',
  description: 'Green-phosphor terminal window with copy-paste AI prompts. Nerdy, premium and insanely saveable.',
  category: 'AI',
  tags: ['ai', 'prompts', 'chatgpt', 'terminal', 'hacker', 'dark', 'tech'],
  style: 'Dark',
  audience: 'Founders',
  platform: 'instagram',
  trending: true,
  createdAt: '2026-10-15T10:14:00.000Z',
  slides: [
    {
      bg: TERM.bg,
      els: [
        ...termChrome(),
        T('$ ./unlock --prompts', 110, 200, 860, 50, 36, { font: 'Space Mono', weight: 700, color: TERM.green }),
        T('> loading 4 prompts...\n> [██████████] 100%', 110, 265, 860, 110, 32, { font: 'Space Mono', color: '#1FAF1A', lh: 1.5 }),
        T('4 AI\nPROMPTS\nTHAT 10X\nYOUR WORK', 110, 420, 860, 540, 128, { font: 'Space Mono', weight: 700, color: TERM.green, lh: 1.02 }),
        T('> swipe to execute_', 110, 1110, 860, 60, 36, { font: 'Space Mono', weight: 700, color: TERM.amber }),
        handle(TERM.dim, 'Space Mono'),
        pager(1, 6, TERM.green, 'Space Mono'),
      ],
    },
    termPrompt(1, 'for: viral hooks', 'Act as a top 1% copywriter. Give me 10 scroll-stopping hooks for a post about [TOPIC]. Use curiosity, numbers and bold claims. Max 12 words each.', '10 hooks in 8 seconds'),
    termPrompt(2, 'for: repurposing', 'Turn this blog post into a 7-slide carousel. Slide 1 = hook, slides 2–6 = one idea each, slide 7 = CTA. Max 25 words per slide: [PASTE]', 'a week of content from 1 post'),
    termPrompt(3, 'for: brutal feedback', 'Roast my landing page like a skeptical investor. List the 5 biggest reasons a visitor would bounce, then rewrite my headline 3 ways: [TEXT]', 'conversion fixes you missed'),
    termPrompt(4, 'for: deep work', 'I have [X] hours today. My tasks: [LIST]. Prioritise by impact, batch similar work and build a time-blocked schedule with breaks.', 'a calm, focused day'),
    {
      bg: TERM.bg,
      els: [
        ...termChrome(),
        T('$ follow @yourhandle', 110, 200, 860, 50, 36, { font: 'Space Mono', weight: 700, color: TERM.green }),
        T('PROCESS\nCOMPLETE.', 110, 360, 860, 300, 128, { font: 'Space Mono', weight: 700, color: TERM.green, lh: 1.05 }),
        T('> save this post before it gets buried\n> share with 1 friend who needs it\n> exit 0', 110, 760, 860, 220, 34, { font: 'Space Mono', color: TERM.amber, lh: 1.6 }),
        handle(TERM.dim, 'Space Mono'),
        pager(6, 6, TERM.green, 'Space Mono'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 08 — LEARN 2X FASTER (Neo-Brutalism Cards)
// ═════════════════════════════════════════════════════════════════════════════
const NB = { cream: '#FFF4E0', ink: '#111111', coral: '#FF6B6B', teal: '#4ECDC4', yellow: '#FFE66D', violet: '#A28BFE' };
const nbCard = (x: number, y: number, w: number, h: number, fill: string, r = 24): El[] => [
  R(x + 16, y + 16, w, h, NB.ink, { r }),
  R(x, y, w, h, fill, { r, stroke: NB.ink, sw: 6 }),
];
const nbTechnique = (n: number, color: string, emoji: string, title: string, body: string): SlideDef => ({
  bg: NB.cream,
  els: [
    ...nbCard(70, 100, 300, 300, color),
    T(pad(n), 70, 160, 300, 190, 170, { font: 'Archivo Black', color: NB.ink, align: 'center', lh: 1 }),
    T(emoji, 440, 150, 220, 220, 170, { lh: 1.1 }),
    T(title, 70, 470, 940, 240, 96, { font: 'Archivo Black', color: NB.ink, lh: 1.02 }),
    ...nbCard(70, 760, 920, 400, '#FFFFFF'),
    T(body, 110, 800, 840, 330, 38, { font: 'Space Grotesk', weight: 500, color: NB.ink, lh: 1.4 }),
    pager(n + 1, 6, NB.ink),
  ],
});

const TPL_NEO_BRUTAL = build({
  key: 'learn-faster-neobrutal',
  name: 'Learn 2X Faster — Neo-Brutalism',
  description: 'Chunky black outlines, hard offset shadows and candy colors. The neo-brutalist look for educational carousels.',
  category: 'Education',
  tags: ['neo brutalism', 'education', 'study', 'learning', 'colorful', 'cards', 'pinterest'],
  style: 'Educational',
  audience: 'Educators',
  platform: 'pinterest',
  createdAt: '2026-10-15T10:13:00.000Z',
  slides: [
    {
      bg: NB.cream,
      els: [
        ...nbCard(70, 110, 520, 110, NB.yellow, 55),
        T('📚 STUDY HACKS', 70, 138, 520, 60, 44, { font: 'Archivo Black', color: NB.ink, align: 'center' }),
        T('HOW TO\nLEARN\nANYTHING\n2X FASTER', 70, 290, 940, 560, 136, { font: 'Archivo Black', color: NB.ink, lh: 0.98 }),
        ...nbCard(70, 910, 600, 200, NB.coral),
        T('backed by\ncognitive science 🧠', 100, 940, 540, 140, 44, { font: 'Space Grotesk', weight: 700, color: NB.ink, lh: 1.2 }),
        ...nbCard(730, 910, 260, 200, NB.teal),
        T('→', 730, 935, 260, 150, 130, { font: 'Archivo Black', color: NB.ink, align: 'center', lh: 1 }),
        pager(1, 6, NB.ink),
      ],
    },
    nbTechnique(1, NB.coral, '🧠', 'ACTIVE\nRECALL', 'Close the book and explain it from memory. Struggling to remember is exactly what builds the memory. Re-reading feels productive — it isn’t.'),
    nbTechnique(2, NB.teal, '📅', 'SPACED\nREPETITION', 'Review after 1 day, 3 days, 7 days and 21 days. Each review right before you forget locks it in. Use Anki or a simple calendar.'),
    nbTechnique(3, NB.yellow, '🧒', 'THE FEYNMAN\nTECHNIQUE', 'Teach it to a 12-year-old. Where you stumble is where your understanding breaks. Go back, simplify, repeat.'),
    nbTechnique(4, NB.violet, '🔀', 'INTERLEAVE\nTOPICS', 'Mix related subjects in one session instead of blocking. It feels harder, but your brain learns to tell concepts apart.'),
    {
      bg: NB.violet,
      els: [
        ...nbCard(70, 140, 940, 640, NB.yellow, 40),
        T('SAVE IT.\nTRY ONE\nTODAY.', 120, 200, 840, 520, 140, { font: 'Archivo Black', color: NB.ink, lh: 1.0 }),
        ...nbCard(70, 880, 560, 130, '#FFFFFF', 65),
        T('FOLLOW FOR MORE', 70, 920, 560, 60, 44, { font: 'Archivo Black', color: NB.ink, align: 'center' }),
        ...nbCard(690, 880, 320, 130, NB.coral, 65),
        T('SHARE ↗', 690, 920, 320, 60, 44, { font: 'Archivo Black', color: NB.ink, align: 'center' }),
        handle(NB.ink),
        pager(6, 6, NB.ink),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 09 — MONEY MOVES (Emerald & Gold Finance)
// ═════════════════════════════════════════════════════════════════════════════
const MONEY = { bg: 'linear-gradient(160deg, #0B3D2E 0%, #04140F 100%)', gold: '#E8C872', mint: '#9FE2BF', cream: '#F5EFE0', deep: '#04140F', green: '#2E7D5B', body: '#D8E5DD' };
const moneyBucket = (n: number, pct: string, color: string, textColor: string, name: string, body: string, example: string): SlideDef => ({
  bg: MONEY.bg,
  els: [
    T('₹', 620, -40, 460, 620, 600, { font: 'Playfair Display', weight: 900, color: 'rgba(232,200,114,0.06)', align: 'right', lh: 1 }),
    C(70, 110, 260, 260, color),
    T(pct, 70, 190, 260, 110, 92, { font: 'Playfair Display', weight: 900, color: textColor, align: 'center', lh: 1 }),
    T(`BUCKET ${pad(n)}`, 380, 160, 600, 40, 26, { font: 'Space Mono', weight: 700, color: MONEY.gold, ls: 3 }),
    T(name, 380, 210, 640, 140, 110, { font: 'Playfair Display', weight: 900, color: MONEY.cream, lh: 1 }),
    R(70, 440, 940, 2, 'rgba(232,200,114,0.3)'),
    T(body, 70, 490, 940, 290, 40, { color: MONEY.body, lh: 1.45 }),
    R(70, 830, 940, 300, 'rgba(232,200,114,0.08)', { r: 24, stroke: 'rgba(232,200,114,0.35)', sw: 2 }),
    T('EXAMPLE · ₹1,00,000 SALARY', 110, 870, 860, 40, 24, { font: 'Space Mono', weight: 700, color: MONEY.gold, ls: 2 }),
    T(example, 110, 935, 860, 160, 58, { font: 'Playfair Display', weight: 700, color: MONEY.cream, lh: 1.2 }),
    handle(MONEY.gold, 'Space Mono'),
    pager(n + 1, 6, MONEY.gold, 'Space Mono'),
  ],
});

const TPL_MONEY = build({
  key: 'money-moves',
  name: 'Money Moves — Emerald & Gold',
  description: 'Private-bank aesthetic in deep emerald and gold. A 4-bucket money system with real rupee examples.',
  category: 'Finance',
  tags: ['finance', 'money', 'budget', 'investing', 'wealth', 'luxury', 'india'],
  style: 'Luxury',
  audience: 'General',
  platform: 'instagram',
  trending: true,
  createdAt: '2026-10-15T10:12:00.000Z',
  slides: [
    {
      bg: MONEY.bg,
      els: [
        T('₹', 580, -60, 500, 700, 680, { font: 'Playfair Display', weight: 900, color: 'rgba(232,200,114,0.08)', align: 'right', lh: 1 }),
        R(70, 120, 300, 56, 'transparent', { r: 28, stroke: MONEY.gold, sw: 2 }),
        T('WEALTH 101', 70, 132, 300, 36, 24, { font: 'Space Mono', weight: 700, color: MONEY.gold, align: 'center', ls: 3 }),
        T('The 50/30/20\nrule is dead.', 70, 230, 940, 270, 120, { font: 'Playfair Display', weight: 900, color: MONEY.cream, lh: 1.05 }),
        T('Try the 4-bucket system instead.', 70, 520, 940, 70, 50, { font: 'Playfair Display', color: MONEY.gold }),
        C(70, 700, 200, 200, MONEY.gold),
        T('40%', 70, 762, 200, 80, 64, { font: 'Playfair Display', weight: 900, color: MONEY.deep, align: 'center', lh: 1 }),
        C(310, 700, 200, 200, MONEY.mint),
        T('30%', 310, 762, 200, 80, 64, { font: 'Playfair Display', weight: 900, color: MONEY.deep, align: 'center', lh: 1 }),
        C(550, 700, 200, 200, MONEY.cream),
        T('20%', 550, 762, 200, 80, 64, { font: 'Playfair Display', weight: 900, color: MONEY.deep, align: 'center', lh: 1 }),
        C(790, 700, 200, 200, MONEY.green),
        T('10%', 790, 762, 200, 80, 64, { font: 'Playfair Display', weight: 900, color: MONEY.cream, align: 'center', lh: 1 }),
        T('NEEDS', 70, 930, 200, 40, 24, { font: 'Space Mono', weight: 700, color: MONEY.gold, align: 'center', ls: 2 }),
        T('INVEST', 310, 930, 200, 40, 24, { font: 'Space Mono', weight: 700, color: MONEY.gold, align: 'center', ls: 2 }),
        T('FUN', 550, 930, 200, 40, 24, { font: 'Space Mono', weight: 700, color: MONEY.gold, align: 'center', ls: 2 }),
        T('SAFETY', 790, 930, 200, 40, 24, { font: 'Space Mono', weight: 700, color: MONEY.gold, align: 'center', ls: 2 }),
        T('swipe to build yours →', 70, 1250, 600, 50, 28, { font: 'Space Mono', weight: 700, color: MONEY.gold }),
        pager(1, 6, MONEY.gold, 'Space Mono'),
      ],
    },
    moneyBucket(1, '40%', MONEY.gold, MONEY.deep, 'Needs', 'Rent, groceries, EMIs, bills, insurance. If this is above 50%, the fix is income or lifestyle — not another budgeting app.', '₹40,000 → rent, food, bills'),
    moneyBucket(2, '30%', MONEY.mint, MONEY.deep, 'Invest', 'Index funds, SIPs, retirement. Automate it on salary day so you never even "see" this money.', '₹30,000 → SIP on day 1'),
    moneyBucket(3, '20%', MONEY.cream, MONEY.deep, 'Fun', 'Travel, dinners, hobbies, that sneaker drop. Spend it guilt-free — this bucket is what makes the system sustainable.', '₹20,000 → guilt-free spending'),
    moneyBucket(4, '10%', MONEY.green, MONEY.cream, 'Safety', 'Build an emergency fund until it covers 6 months of expenses. After that, redirect this bucket into upskilling.', '₹10,000 → liquid fund'),
    {
      bg: MONEY.bg,
      els: [
        C(290, 140, 500, 500, 'radial-gradient(circle, rgba(232,200,114,0.35) 0%, rgba(232,200,114,0) 70%)'),
        T('Pay yourself\nfirst.', 70, 260, 940, 300, 130, { font: 'Playfair Display', weight: 900, color: MONEY.cream, align: 'center', lh: 1.05 }),
        R(440, 640, 200, 3, MONEY.gold),
        T('Save this. Share it with someone\nwho just got their first salary 💸', 70, 700, 940, 140, 42, { color: MONEY.body, align: 'center', lh: 1.45 }),
        R(290, 920, 500, 110, MONEY.gold, { r: 55 }),
        T('FOLLOW FOR MORE', 290, 954, 500, 44, 32, { font: 'Space Mono', weight: 700, color: MONEY.deep, align: 'center', ls: 2 }),
        handle(MONEY.gold, 'Space Mono'),
        pager(6, 6, MONEY.gold, 'Space Mono'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 10 — SUNDAY RESET (Sticky Notes Cork Board)
// ═════════════════════════════════════════════════════════════════════════════
const CORK = 'radial-gradient(circle at 30% 20%, #DDB892 0%, #B08968 100%)';
const note = (x: number, y: number, w: number, h: number, color: string, rot: number): El[] => [
  R(x + 12, y + 16, w, h, 'rgba(60,35,10,0.25)', { rot, r: 6 }),
  R(x, y, w, h, color, { rot, r: 6 }),
  C(x + w / 2 - 18, y + 8, 36, 36, '#E63946', { stroke: '#9B1D27', sw: 3 }),
];
const stepNote = (x: number, y: number, color: string, rot: number, n: number, title: string, body: string): El[] => [
  ...note(x, y, 560, 520, color, rot),
  T(`step ${n}`, x + 40, y + 50, 480, 60, 46, { font: 'Caveat', weight: 700, color: '#8A6D3B', rot }),
  T(title, x + 40, y + 110, 480, 170, 76, { font: 'Caveat', weight: 700, color: '#2B2B2B', lh: 1.0, rot }),
  T(body, x + 40, y + 290, 480, 210, 48, { font: 'Caveat', color: '#3A3A3A', lh: 1.15, rot }),
];

const TPL_STICKY = build({
  key: 'sunday-reset-sticky',
  name: 'Sunday Reset — Sticky Notes Board',
  description: 'Handwritten sticky notes pinned on a cork board. Cozy, tactile and perfect for routines & checklists.',
  category: 'Productivity',
  tags: ['sticky notes', 'routine', 'handwritten', 'cozy', 'productivity', 'cork board', 'pinterest'],
  style: 'Playful',
  audience: 'General',
  platform: 'pinterest',
  createdAt: '2026-10-15T10:11:00.000Z',
  slides: [
    {
      bg: CORK,
      els: [
        ...note(110, 130, 860, 580, '#FFF27A', -3),
        T('my sunday\nreset routine', 150, 250, 780, 330, 136, { font: 'Caveat', weight: 700, color: '#2B2B2B', align: 'center', lh: 1.0, rot: -3 }),
        ...note(120, 790, 400, 400, '#FF9FC5', 4),
        T('6 steps\nto start\nthe week\ncalm ✨', 150, 850, 340, 320, 64, { font: 'Caveat', weight: 700, color: '#2B2B2B', align: 'center', lh: 1.05, rot: 4 }),
        ...note(580, 830, 400, 360, '#9FE7FF', -5),
        T('swipe →', 600, 950, 360, 140, 96, { font: 'Caveat', weight: 700, color: '#2B2B2B', align: 'center', rot: -5 }),
      ],
    },
    {
      bg: CORK,
      els: [
        ...stepNote(80, 110, '#FFF27A', -4, 1, 'brain dump', 'write every open loop on paper. empty your head.'),
        ...stepNote(440, 720, '#B9FBC0', 3, 2, 'clean 1 space', 'just your desk. visual calm = mental calm.'),
        pager(2, 5, '#3B2412', 'Space Mono'),
      ],
    },
    {
      bg: CORK,
      els: [
        ...stepNote(440, 110, '#FF9FC5', 4, 3, 'review the week', 'what worked? what drained you? 3 lines max.'),
        ...stepNote(80, 720, '#9FE7FF', -3, 4, 'pick 3 big rocks', "only 3 priorities for the week. that's it."),
        pager(3, 5, '#3B2412', 'Space Mono'),
      ],
    },
    {
      bg: CORK,
      els: [
        ...stepNote(80, 110, '#FFD6A5', -3, 5, 'prep your fuel', 'groceries + 2 easy meals ready to go.'),
        ...stepNote(440, 720, '#CDB4DB', 4, 6, 'protect monday', 'no meetings before 11am. deep work first.'),
        pager(4, 5, '#3B2412', 'Space Mono'),
      ],
    },
    {
      bg: CORK,
      els: [
        ...note(110, 180, 860, 560, '#FFF27A', 2),
        T('save this for\nsunday 📌', 150, 300, 780, 320, 128, { font: 'Caveat', weight: 700, color: '#2B2B2B', align: 'center', lh: 1.05, rot: 2 }),
        ...note(260, 830, 560, 340, '#FF9FC5', -4),
        T('follow for more\ncalm routines ♡\n@yourhandle', 290, 880, 500, 260, 60, { font: 'Caveat', weight: 700, color: '#2B2B2B', align: 'center', lh: 1.1, rot: -4 }),
        pager(5, 5, '#3B2412', 'Space Mono'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 11 — GENTLE REMINDERS (Aura Gradient)
// ═════════════════════════════════════════════════════════════════════════════
const AURA = { ink: '#2A1F2D', soft: '#5A4A5E' };
const aura = (a: string, b: string, c: string, base = '#FDF6EC') =>
  `radial-gradient(circle at 20% 20%, ${a} 0%, rgba(255,255,255,0) 55%), radial-gradient(circle at 85% 35%, ${b} 0%, rgba(255,255,255,0) 55%), radial-gradient(circle at 50% 90%, ${c} 0%, rgba(255,255,255,0) 60%), ${base}`;
const auraBgs = [
  aura('#FFB4A2', '#CDB4DB', '#A2D2FF'),
  aura('#FFC8DD', '#BDE0FE', '#FFE5B4'),
  aura('#CDB4DB', '#FFAFCC', '#B9FBC0'),
  aura('#A2D2FF', '#FFD6A5', '#FFB4A2'),
  aura('#FFE5B4', '#CDB4DB', '#FFC8DD'),
  aura('#B9FBC0', '#A2D2FF', '#FFAFCC'),
];
const auraQuote = (n: number, quote: string): SlideDef => ({
  bg: auraBgs[n % auraBgs.length],
  els: [
    R(90, 250, 900, 850, 'rgba(255,255,255,0.35)', { r: 48, stroke: 'rgba(255,255,255,0.75)', sw: 3 }),
    T(`reminder no. ${n}`, 90, 320, 900, 40, 28, { font: 'Space Grotesk', weight: 500, color: AURA.soft, align: 'center', ls: 4 }),
    T(quote, 140, 420, 800, 500, 96, { font: 'Instrument Serif', color: AURA.ink, align: 'center', lh: 1.05 }),
    T('✦', 90, 960, 900, 60, 44, { color: AURA.soft, align: 'center' }),
    pager(n + 1, 6, AURA.soft),
  ],
});

const TPL_AURA = build({
  key: 'gentle-reminders-aura',
  name: 'Gentle Reminders — Aura Gradient',
  description: 'Dreamy aura mesh gradients with glass cards and soft serif type. Calm, emotional, made for shares & saves.',
  category: 'Motivation',
  tags: ['aura', 'gradient', 'soft', 'affirmations', 'self care', 'serif', 'pinterest'],
  style: 'Minimal',
  audience: 'General',
  platform: 'pinterest',
  trending: true,
  createdAt: '2026-10-15T10:10:00.000Z',
  slides: [
    {
      bg: auraBgs[0],
      els: [
        T('gentle reminders', 0, 120, 1080, 50, 32, { font: 'Space Grotesk', weight: 500, color: AURA.soft, align: 'center', ls: 8, upper: true }),
        T('for when\nyou feel\nbehind', 0, 360, 1080, 520, 176, { font: 'Instrument Serif', color: AURA.ink, align: 'center', lh: 0.95, ls: -4 }),
        C(490, 980, 100, 100, 'rgba(255,255,255,0.6)', { stroke: 'rgba(42,31,45,0.2)', sw: 2 }),
        T('→', 490, 995, 100, 70, 52, { weight: 300, color: AURA.ink, align: 'center', lh: 1.2 }),
        pager(1, 6, AURA.soft),
      ],
    },
    auraQuote(1, "you are not\nlate. you're\non your own\ntimeline."),
    auraQuote(2, 'rest is\nproductive\ntoo.'),
    auraQuote(3, 'small steps\nstill move\nyou forward.'),
    auraQuote(4, "you've\nsurvived 100%\nof your\nhard days."),
    {
      bg: auraBgs[5],
      els: [
        T('send this to\nsomeone who\nneeds it today', 0, 340, 1080, 480, 128, { font: 'Instrument Serif', color: AURA.ink, align: 'center', lh: 1.05 }),
        T('🤍', 0, 860, 1080, 110, 90, { align: 'center', lh: 1.2 }),
        T('follow @yourhandle for softer days', 0, 1030, 1080, 50, 32, { font: 'Space Grotesk', weight: 500, color: AURA.soft, align: 'center', ls: 1 }),
        pager(6, 6, AURA.soft),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 12 — BEFORE / AFTER COPY (Split Screen)
// ═════════════════════════════════════════════════════════════════════════════
const BA = { red: '#FF4D4D', green: '#00D67A', ink: '#111111', redSoft: '#FFE5E5', greenSoft: '#DFFFEF', redText: '#7A3A3A', greenText: '#0B3D25', greenDeep: '#00B864' };
const baExample = (n: number, type: string, before: string, after: string): SlideDef => ({
  bg: BA.redSoft,
  els: [
    R(0, 675, 1080, 675, BA.greenSoft),
    R(70, 80, 270, 64, BA.red, { r: 32 }),
    T('✕  BEFORE', 70, 90, 270, 46, 34, { font: 'Anton', color: '#FFFFFF', align: 'center', ls: 2 }),
    T(type, 360, 94, 650, 40, 28, { font: 'Space Grotesk', weight: 700, color: BA.redText, align: 'right', ls: 2, upper: true }),
    T(before, 70, 200, 940, 380, 56, { weight: 500, color: BA.redText, lh: 1.3 }),
    C(470, 605, 140, 140, BA.ink),
    T('↓', 470, 622, 140, 110, 86, { weight: 900, color: '#FFFFFF', align: 'center', lh: 1.1 }),
    R(70, 780, 270, 64, BA.greenDeep, { r: 32 }),
    T('✓  AFTER', 70, 790, 270, 46, 34, { font: 'Anton', color: '#FFFFFF', align: 'center', ls: 2 }),
    T(after, 70, 890, 940, 330, 60, { weight: 900, color: BA.greenText, lh: 1.2 }),
    pager(n + 1, 6, BA.greenText),
  ],
});

const TPL_BEFORE_AFTER = build({
  key: 'before-after-copy',
  name: 'Before / After — Split Screen',
  description: 'Red vs green split-screen comparisons. Turn boring copy into converting copy — instantly understandable.',
  category: 'Marketing',
  tags: ['before after', 'copywriting', 'comparison', 'split', 'marketing', 'conversion', 'instagram'],
  style: 'Bold',
  audience: 'Marketers',
  platform: 'instagram',
  createdAt: '2026-10-15T10:09:00.000Z',
  slides: [
    {
      bg: BA.red,
      els: [
        R(0, 675, 1080, 675, BA.green),
        T('BEFORE', 70, 60, 600, 130, 120, { font: 'Anton', color: BA.ink, ls: 4, lh: 1.05 }),
        T('Boring\ncopy 😴', 450, 230, 570, 230, 88, { font: 'Archivo Black', color: BA.ink, align: 'right', lh: 1.05 }),
        T('Copy that\nsells 💸', 450, 880, 570, 230, 88, { font: 'Archivo Black', color: BA.ink, align: 'right', lh: 1.05 }),
        T('AFTER', 70, 1160, 600, 130, 120, { font: 'Anton', color: BA.ink, ls: 4, lh: 1.05 }),
        C(390, 525, 300, 300, BA.ink),
        T('VS', 390, 590, 300, 170, 150, { font: 'Anton', color: '#FFFFFF', align: 'center', lh: 1.1 }),
        pager(1, 6, BA.ink),
      ],
    },
    baExample(1, 'Headline', 'We offer high-quality marketing solutions for businesses of all sizes.', "Get 3x more leads in 30 days — or you don't pay."),
    baExample(2, 'CTA Button', 'Submit', 'Send me my free growth plan →'),
    baExample(3, 'Instagram Bio', 'Entrepreneur | Dreamer | Coffee lover ☕', 'I help coaches hit ₹10L/month with content. 2,000+ clients.'),
    baExample(4, 'Email Subject', 'Our October Newsletter', 'I was wrong about this (sorry)'),
    {
      bg: BA.ink,
      els: [
        T('Which one\nare YOU\nwriting?', 70, 220, 940, 560, 170, { font: 'Anton', color: '#FFFFFF', lh: 1.02 }),
        R(70, 860, 440, 120, BA.red, { r: 60 }),
        T('✕ BEFORE', 70, 893, 440, 60, 50, { font: 'Anton', color: BA.ink, align: 'center', ls: 2 }),
        R(570, 860, 440, 120, BA.green, { r: 60 }),
        T('✓ AFTER', 570, 893, 440, 60, 50, { font: 'Anton', color: BA.ink, align: 'center', ls: 2 }),
        T('Comment "COPY" and I\'ll rewrite your headline 👇', 70, 1040, 940, 120, 40, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', lh: 1.3 }),
        handle('#9A9A9A'),
        pager(6, 6, BA.green),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 13 — LIFE RECEIPT (Thermal Receipt)
// ═════════════════════════════════════════════════════════════════════════════
const RC = { bg: '#E9E4DA', paper: '#FFFEFA', ink: '#1A1A1A', grey: '#666666' };
const DASH = '- - - - - - - - - - - - - - - - - - - - - - -';
const row = (l: string, r: string, width = 30) => l + '.'.repeat(Math.max(2, width - l.length - r.length)) + r;
const receiptPaper = (): El[] => [
  R(182, 96, 740, 1170, 'rgba(0,0,0,0.12)'),
  R(170, 80, 740, 1170, RC.paper),
];
const receiptSlide = (n: number, heading: string, rows: [string, string][], totalL: string, totalR: string): SlideDef => ({
  bg: RC.bg,
  els: [
    ...receiptPaper(),
    T('★ LIFE STORE ★', 170, 140, 740, 60, 44, { font: 'Space Mono', weight: 700, color: RC.ink, align: 'center' }),
    T(DASH, 170, 215, 740, 40, 28, { font: 'Space Mono', color: RC.grey, align: 'center' }),
    T(heading, 170, 270, 740, 90, 72, { font: 'Space Mono', weight: 700, color: RC.ink, align: 'center' }),
    T(row('ITEM', 'COST'), 210, 390, 660, 40, 30, { font: 'Space Mono', weight: 700, color: RC.grey, align: 'center' }),
    T(rows.map(([l, r]) => row(l, r)).join('\n'), 210, 450, 660, 440, 30, { font: 'Space Mono', color: RC.ink, align: 'center', lh: 1.9 }),
    T(DASH, 170, 920, 740, 40, 28, { font: 'Space Mono', color: RC.grey, align: 'center' }),
    T(row(totalL, totalR, 26), 210, 980, 660, 50, 36, { font: 'Space Mono', weight: 700, color: RC.ink, align: 'center' }),
    T(DASH, 170, 1050, 740, 40, 28, { font: 'Space Mono', color: RC.grey, align: 'center' }),
    T('*SWIPE*', 170, 1100, 740, 110, 96, { font: 'Libre Barcode 39 Text', color: RC.ink, align: 'center', lh: 1 }),
    pager(n + 1, 5, RC.ink, 'Space Mono'),
  ],
});

const TPL_RECEIPT = build({
  key: 'life-receipt',
  name: 'Life Receipt — Thermal Print',
  description: 'A thermal receipt that audits your life: regrets, worth-it purchases and priceless moments. Monospace + barcode.',
  category: 'Personal Brand',
  tags: ['receipt', 'storytelling', 'monospace', 'minimal', 'personal', 'lessons', 'pinterest'],
  style: 'Minimal',
  audience: 'Creators',
  platform: 'pinterest',
  createdAt: '2026-10-15T10:08:00.000Z',
  slides: [
    {
      bg: RC.bg,
      els: [
        ...receiptPaper(),
        T('★ LIFE STORE ★', 170, 150, 740, 60, 48, { font: 'Space Mono', weight: 700, color: RC.ink, align: 'center' }),
        T('RECEIPT #2026-10\nCASHIER: YOU\nDATE: 15/10/2026', 170, 230, 740, 140, 28, { font: 'Space Mono', color: RC.grey, align: 'center', lh: 1.5 }),
        T(DASH, 170, 390, 740, 40, 28, { font: 'Space Mono', color: RC.grey, align: 'center' }),
        T('WHAT I\nSPENT MY\n20s ON', 190, 450, 700, 360, 108, { font: 'Space Mono', weight: 700, color: RC.ink, align: 'center', lh: 1.05 }),
        T(DASH, 170, 840, 740, 40, 28, { font: 'Space Mono', color: RC.grey, align: 'center' }),
        T('(an honest audit)', 170, 900, 740, 50, 34, { font: 'Space Mono', color: RC.ink, align: 'center' }),
        T('*SWIPE*', 170, 990, 740, 130, 110, { font: 'Libre Barcode 39 Text', color: RC.ink, align: 'center', lh: 1 }),
        T('THANK YOU, COME AGAIN →', 170, 1160, 740, 40, 26, { font: 'Space Mono', weight: 700, color: RC.ink, align: 'center' }),
        pager(1, 5, RC.ink, 'Space Mono'),
      ],
    },
    receiptSlide(1, 'REGRETS ✕', [['OVERTHINKING', '4 YRS'], ['PEOPLE PLEASING', '6 YRS'], ['WRONG FRIENDS', '3 YRS'], ['DOOMSCROLLING', '9000 HRS'], ['WAITING FOR MONDAY', 'FOREVER']], 'SUBTOTAL', 'TOO MUCH'),
    receiptSlide(2, 'WORTH IT ✓', [['SOLO TRAVEL', '₹80K'], ['THERAPY', '₹60K'], ['LEARNING TO CODE', '600 HRS'], ['GOOD SHOES', '₹8K'], ['GYM AT 6AM', '1000 DAYS']], 'SUBTOTAL', 'NO REGRETS'),
    receiptSlide(3, 'PRICELESS', [["MOM'S CALLS", 'FREE'], ['LATE NIGHT TALKS', 'FREE'], ['SAYING NO', 'FREE'], ['FIRST CLIENT', '₹5K'], ['SUNSETS', 'FREE']], 'TOTAL', 'A LIFE I LOVE'),
    {
      bg: RC.bg,
      els: [
        ...receiptPaper(),
        T('★ LIFE STORE ★', 170, 150, 740, 60, 48, { font: 'Space Mono', weight: 700, color: RC.ink, align: 'center' }),
        T(DASH, 170, 240, 740, 40, 28, { font: 'Space Mono', color: RC.grey, align: 'center' }),
        T('RETURNS NOT\nACCEPTED.', 190, 320, 700, 220, 84, { font: 'Space Mono', weight: 700, color: RC.ink, align: 'center', lh: 1.15 }),
        T('time is non-refundable.\nspend it on what matters.', 190, 580, 700, 120, 34, { font: 'Space Mono', color: RC.grey, align: 'center', lh: 1.5 }),
        T(DASH, 170, 740, 740, 40, 28, { font: 'Space Mono', color: RC.grey, align: 'center' }),
        T('*FOLLOW*', 170, 810, 740, 140, 120, { font: 'Libre Barcode 39 Text', color: RC.ink, align: 'center', lh: 1 }),
        T('@YOURHANDLE', 170, 1000, 740, 60, 44, { font: 'Space Mono', weight: 700, color: RC.ink, align: 'center', ls: 2 }),
        T('SAVE YOUR RECEIPT ↓', 170, 1120, 740, 40, 28, { font: 'Space Mono', color: RC.grey, align: 'center' }),
        pager(5, 5, RC.ink, 'Space Mono'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 14 — WORDS THAT REWIRED MY BRAIN (Bold Quote Poster)
// ═════════════════════════════════════════════════════════════════════════════
const QP = { orange: '#FF5A1F', ink: '#1A0A00', cream: '#FFE8D6', navy: '#0E2A47' };
const quotePoster = (n: number, bg: string, accent: string, fg: string, quote: string, author: string): SlideDef => ({
  bg,
  els: [
    T('“', 50, 0, 420, 420, 480, { font: 'DM Serif Display', color: accent, lh: 1 }),
    T(quote, 70, 380, 940, 620, 88, { font: 'DM Serif Display', color: fg, lh: 1.1, ls: -1 }),
    R(70, 1080, 120, 6, accent),
    T(`— ${author}`, 70, 1110, 900, 60, 40, { font: 'Space Grotesk', weight: 700, color: accent }),
    pager(n + 1, 6, accent),
  ],
});

const TPL_QUOTE_POSTER = build({
  key: 'quote-poster',
  name: 'Words That Rewired My Brain — Quote Poster',
  description: 'Poster-grade serif quotes with giant quotation marks in bold color blocks. Made to be screenshotted.',
  category: 'Quotes',
  tags: ['quotes', 'poster', 'serif', 'typography', 'mindset', 'bold color', 'instagram'],
  style: 'Typography',
  audience: 'General',
  platform: 'instagram',
  createdAt: '2026-10-15T10:07:00.000Z',
  slides: [
    {
      bg: QP.orange,
      els: [
        T('“', 30, -80, 640, 640, 720, { font: 'DM Serif Display', color: QP.ink, lh: 1 }),
        T('Words that\nrewired\nmy brain.', 70, 500, 940, 460, 144, { font: 'DM Serif Display', color: QP.ink, lh: 1.0, ls: -3 }),
        R(70, 1000, 200, 8, QP.ink),
        T('4 quotes I read every single morning', 70, 1040, 800, 120, 44, { font: 'Space Grotesk', weight: 500, color: QP.ink, lh: 1.25 }),
        pager(1, 6, QP.ink),
      ],
    },
    quotePoster(1, QP.ink, QP.orange, QP.cream, 'The best time to plant a tree was 20 years ago. The second best time is now.', 'Chinese proverb'),
    quotePoster(2, QP.cream, QP.orange, QP.ink, 'You do not rise to the level of your goals. You fall to the level of your systems.', 'James Clear'),
    quotePoster(3, QP.orange, QP.ink, QP.ink, 'We suffer more often in imagination than in reality.', 'Seneca'),
    quotePoster(4, QP.navy, '#FFB38A', QP.cream, 'Comparison is the thief of joy.', 'Theodore Roosevelt'),
    {
      bg: QP.ink,
      els: [
        T('Which one\nhit hardest?', 70, 300, 940, 340, 150, { font: 'DM Serif Display', color: QP.cream, lh: 1.05, ls: -2 }),
        T('Comment the number 👇', 70, 700, 940, 70, 52, { font: 'Space Grotesk', weight: 700, color: QP.orange }),
        R(70, 860, 520, 110, QP.orange, { r: 55 }),
        T('Follow for daily words', 70, 893, 520, 50, 36, { font: 'Space Grotesk', weight: 700, color: QP.ink, align: 'center' }),
        handle(QP.cream),
        pager(6, 6, QP.orange),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 15 — GYM MYTHS (Myth vs Fact)
// ═════════════════════════════════════════════════════════════════════════════
const MF = { bg: '#0E0E10', card: '#1A1A1E', red: '#FF3B3B', green: '#2BFF88', text: '#E6E6EA', grey: '#A0A0A8' };
const mythFact = (n: number, myth: string, fact: string): SlideDef => ({
  bg: MF.bg,
  els: [
    R(70, 110, 940, 500, MF.card, { r: 32, stroke: MF.red, sw: 4 }),
    R(110, 150, 230, 64, MF.red, { r: 32 }),
    T('✕ MYTH', 110, 158, 230, 52, 44, { font: 'Bebas Neue', color: '#FFFFFF', align: 'center', ls: 2 }),
    T(myth, 110, 250, 860, 330, 84, { font: 'Bebas Neue', color: '#FFFFFF', lh: 1.0 }),
    R(70, 660, 940, 540, MF.card, { r: 32, stroke: MF.green, sw: 4 }),
    R(110, 700, 230, 64, MF.green, { r: 32 }),
    T('✓ FACT', 110, 708, 230, 52, 44, { font: 'Bebas Neue', color: MF.bg, align: 'center', ls: 2 }),
    T(fact, 110, 800, 860, 370, 40, { font: 'Space Grotesk', weight: 500, color: MF.text, lh: 1.4 }),
    handle(MF.grey),
    pager(n + 1, 6, MF.green),
  ],
});

const TPL_MYTH_FACT = build({
  key: 'gym-myth-fact',
  name: 'Gym Myths — Myth vs Fact',
  description: 'Dark, high-contrast myth vs fact cards with red ✕ and neon ✓. Built for debunking in any niche.',
  category: 'Education',
  tags: ['myth vs fact', 'fitness', 'gym', 'education', 'dark', 'debunk', 'instagram'],
  style: 'Bold',
  audience: 'Coaches',
  platform: 'instagram',
  createdAt: '2026-10-15T10:06:00.000Z',
  slides: [
    {
      bg: MF.bg,
      els: [
        T('GYM\nMYTHS', 70, 110, 940, 440, 240, { font: 'Bebas Neue', color: '#FFFFFF', lh: 0.9 }),
        R(70, 580, 660, 130, MF.red, { rot: -3 }),
        T('THAT ARE KILLING', 70, 600, 660, 100, 88, { font: 'Bebas Neue', color: '#FFFFFF', align: 'center', rot: -3, ls: 2 }),
        T('YOUR GAINS 💀', 70, 750, 940, 140, 130, { font: 'Bebas Neue', color: MF.green, lh: 1.0 }),
        T('Myth vs. fact — backed by research.', 70, 925, 940, 60, 40, { font: 'Space Grotesk', weight: 500, color: MF.grey }),
        C(740, 1010, 170, 170, MF.red),
        T('✕', 740, 1040, 170, 110, 100, { weight: 900, color: '#FFFFFF', align: 'center', lh: 1.1 }),
        C(850, 1080, 170, 170, MF.green),
        T('✓', 850, 1110, 170, 110, 100, { weight: 900, color: MF.bg, align: 'center', lh: 1.1 }),
        handle(MF.grey),
      ],
    },
    mythFact(1, 'You need to feel sore\nfor a workout to count', 'Soreness (DOMS) is a poor indicator of muscle growth. Progressive overload — adding weight or reps over time — is what actually matters.'),
    mythFact(2, 'Lifting heavy makes\nwomen bulky', 'Building significant muscle takes years of targeted training and a calorie surplus. Strength training mostly makes you stronger and leaner.'),
    mythFact(3, 'Cardio is the best way\nto lose fat', 'Fat loss is driven by a calorie deficit. Strength training preserves muscle while you diet; cardio is a helpful tool, not a requirement.'),
    mythFact(4, 'Crunches burn\nbelly fat', "You can't choose where you lose fat. Crunches strengthen your abs, but overall body-fat level decides whether you see them."),
    {
      bg: MF.bg,
      els: [
        T('SHARE WITH\nYOUR GYM\nBRO 💪', 70, 200, 940, 560, 190, { font: 'Bebas Neue', color: '#FFFFFF', lh: 0.95 }),
        R(70, 840, 940, 6, MF.green),
        T('Follow for science-based training, minus the bro-science.', 70, 890, 940, 140, 44, { font: 'Space Grotesk', weight: 700, color: MF.text, lh: 1.3 }),
        handle(MF.grey),
        pager(6, 6, MF.green),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 16 — $0 → $1M ARR (SaaS Metrics)
// ═════════════════════════════════════════════════════════════════════════════
const SAAS = { bg: 'linear-gradient(180deg, #0A0F2C 0%, #050816 100%)', blue: '#4F7CFF', cyan: '#00E0FF', violet: '#B76BFF', soft: '#8FA3D9', body: '#B9C4E6' };
const saasGlow = (x: number, y: number) => C(x, y, 800, 800, 'radial-gradient(circle, rgba(79,124,255,0.4) 0%, rgba(79,124,255,0) 70%)');
const saasLesson = (n: number, metric: string, metricLabel: string, title: string, body: string): SlideDef => ({
  bg: SAAS.bg,
  els: [
    saasGlow(400, -300),
    T(`LESSON ${pad(n)}`, 70, 120, 600, 40, 28, { font: 'Space Mono', weight: 700, color: SAAS.cyan, ls: 4 }),
    T(metric, 60, 180, 960, 260, 230, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', lh: 1.05, ls: -8 }),
    T(metricLabel, 70, 450, 940, 60, 40, { font: 'Space Grotesk', weight: 500, color: SAAS.soft }),
    R(70, 560, 940, 2, 'rgba(143,163,217,0.25)'),
    T(title, 70, 610, 940, 200, 80, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', lh: 1.05 }),
    T(body, 70, 840, 940, 320, 38, { color: SAAS.body, lh: 1.45 }),
    handle(SAAS.soft, 'Space Mono'),
    pager(n + 1, 6, SAAS.cyan, 'Space Mono'),
  ],
});
const barFill = 'linear-gradient(180deg, #00E0FF 0%, #4F7CFF 100%)';

const TPL_SAAS = build({
  key: 'saas-1m-arr',
  name: '$0 → $1M ARR — SaaS Metrics',
  description: 'Dark-mode founder story with glowing bar chart and monster metrics. Built-in-public lessons that build authority.',
  category: 'SaaS',
  tags: ['saas', 'startup', 'metrics', 'build in public', 'founder', 'dark', 'data'],
  style: 'Data',
  audience: 'Founders',
  platform: 'instagram',
  createdAt: '2026-10-15T10:05:00.000Z',
  slides: [
    {
      bg: SAAS.bg,
      els: [
        saasGlow(450, -260),
        R(70, 120, 380, 60, 'rgba(79,124,255,0.15)', { r: 30, stroke: 'rgba(79,124,255,0.6)', sw: 2 }),
        T('● BUILD IN PUBLIC', 70, 134, 380, 36, 26, { font: 'Space Grotesk', weight: 700, color: '#8FB0FF', align: 'center', ls: 2 }),
        T('$0 → $1M\nARR', 60, 230, 960, 340, 170, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', lh: 0.98, ls: -6 }),
        T('in 14 months.\nNo VC. 3 people.', 70, 590, 940, 170, 64, { font: 'Space Grotesk', weight: 500, color: SAAS.soft, lh: 1.2 }),
        R(70, 1120, 120, 80, barFill, { r: 16 }),
        R(230, 1080, 120, 120, barFill, { r: 16 }),
        R(390, 1030, 120, 170, barFill, { r: 16 }),
        R(550, 960, 120, 240, barFill, { r: 16 }),
        R(710, 880, 120, 320, barFill, { r: 16 }),
        R(870, 790, 120, 410, 'linear-gradient(180deg, #B76BFF 0%, #4F7CFF 100%)', { r: 16 }),
        handle(SAAS.soft, 'Space Mono'),
        pager(1, 6, SAAS.cyan, 'Space Mono'),
      ],
    },
    saasLesson(1, '62%', 'of revenue came from just 1 channel', 'Pick one channel\nand dominate it.', 'We tried 7 channels in month one. Only SEO compounded. We killed the rest and went all in.'),
    saasLesson(2, '9 days', 'from idea to first paying user', 'Charge from\nday one.', 'A waitlist proves curiosity. A credit card proves pain. Pre-sell before you write a line of code.'),
    saasLesson(3, '3.2%', 'monthly churn (down from 11%)', 'Onboarding is\nthe product.', 'We rebuilt the first 5 minutes four times. Activation doubled and churn dropped by 70%.'),
    saasLesson(4, '$0', 'spent on paid ads', 'Build in\npublic.', 'Sharing real numbers every week built trust faster than any ad campaign ever could.'),
    {
      bg: SAAS.bg,
      els: [
        saasGlow(140, 200),
        T('Follow the\njourney.', 70, 330, 940, 360, 160, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', align: 'center', lh: 1.0, ls: -5 }),
        T('$1M → $10M next. Real numbers every Friday.', 70, 740, 940, 70, 40, { font: 'Space Grotesk', weight: 500, color: SAAS.soft, align: 'center' }),
        R(290, 880, 500, 120, 'linear-gradient(90deg, #4F7CFF 0%, #B76BFF 100%)', { r: 60 }),
        T('FOLLOW →', 290, 918, 500, 50, 40, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', align: 'center', ls: 2 }),
        handle(SAAS.soft, 'Space Mono'),
        pager(6, 6, SAAS.cyan, 'Space Mono'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 17 — 30-DAY GLOW UP (Checklist)
// ═════════════════════════════════════════════════════════════════════════════
const GU = { bg: '#EDE7FF', violet: '#7B5CFF', pink: '#FFD6EA', lilac: '#D9CCFF', ink: '#1E1446' };
const checkRow = (y: number, label: string, checked: boolean): El[] => [
  R(120, y, 70, 70, checked ? GU.violet : '#FFFFFF', { r: 18, stroke: GU.violet, sw: 5 }),
  ...(checked ? [T('✓', 120, y + 8, 70, 56, 46, { weight: 900, color: '#FFFFFF', align: 'center', lh: 1.1 })] : []),
  T(label, 230, y + 8, 740, 120, 42, { font: 'Space Grotesk', weight: 500, color: GU.ink, lh: 1.2 }),
];
const glowCategory = (n: number, cat: string, items: string[]): SlideDef => ({
  bg: GU.bg,
  els: [
    C(760, -160, 480, 480, GU.pink),
    T(pad(n), 70, 100, 300, 120, 100, { font: 'Syne', weight: 800, color: GU.violet, lh: 1.1 }),
    T(cat, 70, 210, 940, 190, 160, { font: 'Instrument Serif', color: GU.ink, lh: 1 }),
    R(70, 430, 940, 760, '#FFFFFF', { r: 40 }),
    ...items.flatMap((it, k) => checkRow(490 + k * 170, it, k < 2)),
    pager(n + 1, 6, GU.violet, 'Syne'),
  ],
});

const TPL_GLOW_UP = build({
  key: 'glow-up-checklist',
  name: '30-Day Glow Up — Checklist',
  description: 'Lavender checklist carousel with real tick boxes. Mind, body, space and money habits — the ultimate save-bait.',
  category: 'Productivity',
  tags: ['checklist', 'glow up', 'habits', 'self improvement', 'lavender', 'aesthetic', 'pinterest'],
  style: 'Modern',
  audience: 'Influencers',
  platform: 'pinterest',
  trending: true,
  createdAt: '2026-10-15T10:04:00.000Z',
  slides: [
    {
      bg: GU.bg,
      els: [
        C(-120, 880, 620, 620, GU.lilac),
        C(720, -150, 500, 500, GU.pink),
        T('30-DAY', 70, 170, 940, 120, 110, { font: 'Syne', weight: 800, color: GU.violet, ls: 2, lh: 1.05 }),
        T('glow up\nchecklist', 70, 290, 940, 340, 170, { font: 'Instrument Serif', color: GU.ink, lh: 0.95 }),
        ...['mind', 'body', 'space', 'money'].flatMap((label, k) => [
          R(70, 720 + k * 100, 64, 64, GU.violet, { r: 16 }),
          T('✓', 70, 726 + k * 100, 64, 52, 42, { weight: 900, color: '#FFFFFF', align: 'center', lh: 1.1 }),
          T(label, 160, 722 + k * 100, 500, 64, 50, { font: 'Syne', weight: 700, color: GU.ink }),
        ]),
        pager(1, 6, GU.violet, 'Syne'),
      ],
    },
    glowCategory(1, 'mind', ['journal 3 lines every night', 'read 10 pages a day', 'delete 1 app that drains you', 'no phone for the first hour']),
    glowCategory(2, 'body', ['8,000 steps, every day', '2L water before 6pm', 'sleep by 11, wake by 7', 'move for 30 minutes']),
    glowCategory(3, 'space', ['make your bed instantly', 'declutter one drawer daily', 'fresh sheets every sunday', 'add one plant to your room']),
    glowCategory(4, 'money', ['track every expense', 'cancel unused subscriptions', 'automate a monthly SIP', 'no-spend weekend challenge']),
    {
      bg: GU.violet,
      els: [
        C(-160, -160, 600, 600, 'rgba(255,255,255,0.12)'),
        C(700, 950, 600, 600, 'rgba(255,255,255,0.12)'),
        T('start today,\nnot monday.', 70, 360, 940, 360, 150, { font: 'Instrument Serif', color: '#FFFFFF', align: 'center', lh: 1.0 }),
        R(240, 820, 600, 110, '#FFFFFF', { r: 55 }),
        T('save + screenshot 📌', 240, 852, 600, 50, 40, { font: 'Syne', weight: 700, color: GU.violet, align: 'center' }),
        T('@yourhandle', 240, 980, 600, 50, 34, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF', align: 'center' }),
        pager(6, 6, '#FFFFFF', 'Syne'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 18 — POW! CONTENT IDEAS (Comic Pop Art)
// ═════════════════════════════════════════════════════════════════════════════
const COMIC = { ink: '#111111', red: '#FF3B3B', yellow: '#FFE14D' };
const burst = (x: number, y: number, size: number, fill: string): El[] => [
  R(x, y, size, size, fill, { stroke: COMIC.ink, sw: 8 }),
  R(x, y, size, size, fill, { stroke: COMIC.ink, sw: 8, rot: 45 }),
  R(x + 8, y + 8, size - 16, size - 16, fill),
  R(x + 8, y + 8, size - 16, size - 16, fill, { rot: 45 }),
];
const shadowText = (text: string, x: number, y: number, w: number, h: number, size: number, color: string, rot = 0, shadow = COMIC.ink): El[] => [
  T(text, x + 8, y + 8, w, h, size, { font: 'Bangers', color: shadow, align: 'center', rot, lh: 1, ls: 2 }),
  T(text, x, y, w, h, size, { font: 'Bangers', color, align: 'center', rot, lh: 1, ls: 2 }),
];
const comicBgs = ['#FFE14D', '#5CE1E6', '#FF7EB6', '#B6FF5C', '#FFB84D'];
const comicIdea = (n: number, title: string, sfx: string, body: string): SlideDef => ({
  bg: comicBgs[(n - 1) % comicBgs.length],
  els: [
    C(700, -120, 520, 520, 'rgba(0,0,0,0.06)'),
    C(-160, 1000, 520, 520, 'rgba(0,0,0,0.06)'),
    R(60, 60, 960, 1230, 'transparent', { stroke: COMIC.ink, sw: 10 }),
    T(`IDEA #${n}`, 100, 100, 600, 120, 110, { font: 'Bangers', color: COMIC.ink, ls: 3, lh: 1 }),
    R(220, 730, 90, 90, '#FFFFFF', { rot: 45, stroke: COMIC.ink, sw: 8 }),
    R(100, 250, 880, 520, '#FFFFFF', { r: 60, stroke: COMIC.ink, sw: 8 }),
    T(title, 150, 340, 780, 340, 120, { font: 'Bangers', color: COMIC.ink, align: 'center', lh: 1.05, ls: 3 }),
    T(body, 100, 880, 500, 330, 38, { font: 'Space Grotesk', weight: 700, color: COMIC.ink, lh: 1.3 }),
    ...shadowText(sfx, 600, 900, 380, 200, 140, COMIC.red, -10),
    pager(n + 1, 7, COMIC.ink),
  ],
});

const TPL_COMIC = build({
  key: 'comic-pop-ideas',
  name: 'POW! Content Ideas — Comic Pop Art',
  description: 'Comic-book panels, speech bubbles, starbursts and SFX lettering. Loud, fun and impossible to scroll past.',
  category: 'Creator',
  tags: ['comic', 'pop art', 'playful', 'content ideas', 'colorful', 'fun', 'instagram'],
  style: 'Playful',
  audience: 'Creators',
  platform: 'instagram',
  trending: true,
  createdAt: '2026-10-15T10:03:00.000Z',
  slides: [
    {
      bg: 'radial-gradient(circle at 50% 45%, #FFF27A 0%, #FFB800 100%)',
      els: [
        C(-120, -120, 420, 420, 'rgba(0,0,0,0.06)'),
        C(800, 1050, 420, 420, 'rgba(0,0,0,0.06)'),
        ...burst(260, 210, 560, COMIC.red),
        ...shadowText('POW!', 240, 370, 600, 260, 230, COMIC.yellow, -8),
        R(60, 50, 460, 150, '#FFFFFF', { r: 75, stroke: COMIC.ink, sw: 6 }),
        T('psst… 5 of them', 60, 93, 460, 70, 54, { font: 'Bangers', color: COMIC.ink, align: 'center', ls: 2 }),
        T("CONTENT IDEAS FOR WHEN\nYOU'RE STUCK!", 50, 1010, 980, 200, 84, { font: 'Bangers', color: COMIC.ink, align: 'center', ls: 2, lh: 1.08 }),
        pager(1, 7, COMIC.ink),
      ],
    },
    comicIdea(1, 'BEHIND THE SCENES', 'WHOA!', 'Show the messy middle. People connect with process, not perfection.'),
    comicIdea(2, 'MYTH BUSTING', 'BAM!', 'Pick one belief everyone in your niche repeats. Prove it wrong.'),
    comicIdea(3, 'YOUR BIGGEST FAIL', 'OOF!', 'Vulnerability + lesson learned = the most saved post type.'),
    comicIdea(4, 'YOUR TOOL STACK', 'ZAP!', 'List the 5 apps you use daily and why. Instant saves.'),
    comicIdea(5, 'THE HOT TAKE', 'KAPOW!', 'An unpopular opinion with a strong reason. Let the comments cook.'),
    {
      bg: 'radial-gradient(circle at 50% 40%, #7EF0F4 0%, #2BB5C0 100%)',
      els: [
        ...burst(260, 180, 560, COMIC.yellow),
        ...shadowText('FOLLOW!', 240, 360, 600, 220, 160, COMIC.red, 6),
        T('for more content\nsuperpowers ⚡', 70, 990, 940, 200, 80, { font: 'Bangers', color: COMIC.ink, align: 'center', ls: 2, lh: 1.1 }),
        handle(COMIC.ink),
        pager(7, 7, COMIC.ink),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 19 — YOUR 2026 WRAPPED (Stats Story)
// ═════════════════════════════════════════════════════════════════════════════
const WR = { ink: '#121212', green: '#1ED760', pink: '#FF4FD8', violet: '#5038ED', yellow: '#FFD23F' };
const wrappedStat = (n: number, bg: string, blob: string, fg: string, label: string, big: string, bigSize: number, sub: string): SlideDef => ({
  bg,
  els: [
    C(620, 880, 600, 600, blob),
    C(-180, -180, 420, 420, blob),
    C(680, 1000, 460, 460, 'transparent', { stroke: fg, sw: 6, op: 0.35 }),
    T(label, 70, 150, 940, 160, 64, { weight: 800, color: fg, lh: 1.1 }),
    T(big, 50, 330, 980, 380, bigSize, { weight: 900, color: fg, lh: 1, ls: -14 }),
    T(sub, 70, 760, 760, 260, 54, { weight: 700, color: fg, lh: 1.18 }),
    T('#YourWrapped', 70, 1250, 600, 50, 30, { font: 'Space Grotesk', weight: 700, color: fg }),
    pager(n + 1, 6, fg),
  ],
});

const TPL_WRAPPED = build({
  key: 'your-wrapped',
  name: 'Your 2026 Wrapped — Stats Story',
  description: 'Year-in-review stats in loud duotone blocks and giant numbers, inspired by the famous "Wrapped" format.',
  category: 'Personal Brand',
  tags: ['wrapped', 'year in review', 'stats', 'bold', 'colorful', 'recap', 'instagram'],
  style: 'Bold',
  audience: 'Creators',
  platform: 'instagram',
  trending: true,
  createdAt: '2026-10-15T10:02:00.000Z',
  slides: [
    {
      bg: WR.ink,
      els: [
        C(-220, -220, 720, 720, WR.green),
        C(600, 860, 720, 720, WR.pink),
        C(680, -80, 300, 300, WR.yellow),
        T('YOUR', 70, 400, 940, 180, 170, { weight: 900, color: '#FFFFFF', ls: -6, lh: 1 }),
        T('2026', 50, 560, 980, 340, 320, { weight: 900, color: '#FFFFFF', ls: -16, lh: 1 }),
        T('WRAPPED', 70, 890, 940, 180, 170, { weight: 900, color: '#FFFFFF', ls: -6, lh: 1 }),
        T('creator edition', 70, 1250, 600, 50, 32, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF' }),
        pager(1, 6, '#FFFFFF'),
      ],
    },
    wrappedStat(1, WR.green, '#17B04F', WR.ink, 'You posted', '247', 340, "times this year. That's more consistent than 98% of creators."),
    wrappedStat(2, WR.pink, '#E03BBE', WR.ink, 'Your most saved post', '12.4K', 250, 'saves on "How I plan a month of content in 2 hours"'),
    wrappedStat(3, WR.violet, '#3B25C9', '#FFFFFF', 'Your top era', 'Q3', 360, 'when you posted carousels every day and grew +38K followers.'),
    {
      bg: WR.yellow,
      els: [
        C(620, 880, 600, 600, '#F2C200'),
        C(-180, -180, 420, 420, '#F2C200'),
        T('Your top 5 topics', 70, 150, 940, 90, 64, { weight: 800, color: WR.ink, lh: 1.1 }),
        T('1  Content systems\n2  Personal brand\n3  AI tools\n4  Productivity\n5  Storytelling', 70, 320, 940, 560, 76, { weight: 800, color: WR.ink, lh: 1.4, ls: -1 }),
        T('#YourWrapped', 70, 1250, 600, 50, 30, { font: 'Space Grotesk', weight: 700, color: WR.ink }),
        pager(5, 6, WR.ink),
      ],
    },
    {
      bg: WR.ink,
      els: [
        C(-200, 900, 700, 700, WR.violet),
        C(650, -200, 600, 600, WR.green),
        T('Thanks for\nbeing here\nthis year 💚', 70, 360, 940, 520, 140, { weight: 900, color: '#FFFFFF', lh: 1.02, ls: -4 }),
        R(70, 960, 520, 110, WR.green, { r: 55 }),
        T('SHARE YOURS', 70, 994, 520, 50, 40, { weight: 900, color: WR.ink, align: 'center', ls: 1 }),
        T('@yourhandle', 70, 1250, 600, 50, 30, { font: 'Space Grotesk', weight: 700, color: '#FFFFFF' }),
        pager(6, 6, '#FFFFFF'),
      ],
    },
  ],
});

// ═════════════════════════════════════════════════════════════════════════════
// 20 — IKIGAI (Japanese Zen Minimal)
// ═════════════════════════════════════════════════════════════════════════════
const ZEN = { paper: '#F4EFE6', red: '#D7322B', ink: '#1A1A1A', body: '#333333', grey: '#888888' };
const JP_FONT = 'Hiragino Mincho ProN, Yu Mincho, serif';
const zenCircle = (n: number, kanji: string, title: string, question: string, prompt: string): SlideDef => ({
  bg: ZEN.paper,
  els: [
    T(kanji, 700, 60, 330, 330, 280, { font: JP_FONT, color: 'rgba(26,26,26,0.08)', align: 'right', lh: 1.1 }),
    C(70, 100, 60, 60, ZEN.red),
    T(pad(n), 160, 105, 300, 50, 30, { font: 'Space Mono', weight: 700, color: ZEN.ink, ls: 4 }),
    T(title, 70, 420, 940, 260, 112, { font: 'DM Serif Display', color: ZEN.ink, lh: 1.05 }),
    R(70, 720, 80, 4, ZEN.red),
    T(question, 70, 770, 860, 200, 46, { font: 'Space Grotesk', color: ZEN.body, lh: 1.4 }),
    T(prompt, 70, 1010, 860, 140, 30, { font: 'Space Mono', color: ZEN.grey, lh: 1.5 }),
    pager(n + 1, 6, ZEN.ink, 'Space Mono'),
  ],
});

const TPL_ZEN = build({
  key: 'ikigai-zen',
  name: 'Ikigai — Japanese Zen Minimal',
  description: 'Washi-paper minimalism with a red sun, vertical kanji and calm serif type. Deep, reflective, beautifully quiet.',
  category: 'Motivation',
  tags: ['japanese', 'zen', 'minimal', 'ikigai', 'purpose', 'calm', 'pinterest'],
  style: 'Minimal',
  audience: 'Coaches',
  platform: 'pinterest',
  createdAt: '2026-10-15T10:01:00.000Z',
  slides: [
    {
      bg: ZEN.paper,
      els: [
        C(300, 240, 480, 480, ZEN.red),
        T('生\nき\nが\nい', 900, 110, 120, 460, 90, { font: JP_FONT, color: ZEN.ink, align: 'center', lh: 1.2 }),
        T('IKIGAI', 70, 800, 940, 200, 180, { font: 'DM Serif Display', color: ZEN.ink, align: 'center', ls: 20, lh: 1.05 }),
        T('the japanese art of finding\nyour reason for being', 70, 1030, 940, 110, 36, { font: 'Space Grotesk', color: '#555555', align: 'center', lh: 1.4 }),
        R(490, 1190, 100, 3, ZEN.red),
        pager(1, 6, ZEN.ink, 'Space Mono'),
      ],
    },
    zenCircle(1, '好', 'What you\nlove', 'What makes you lose track of time?', "prompt: list 10 things you'd do for free."),
    zenCircle(2, '得', "What you're\ngood at", 'What do people always ask you for help with?', 'prompt: ask 3 friends what you do effortlessly.'),
    zenCircle(3, '要', 'What the world\nneeds', 'Which problem makes you angry enough to fix?', 'prompt: note 5 problems you notice this week.'),
    zenCircle(4, '払', 'What you can\nbe paid for', 'Where do your skills meet real demand?', 'prompt: find 3 people already paid for it.'),
    {
      bg: ZEN.paper,
      els: [
        C(240, 160, 400, 400, 'transparent', { stroke: ZEN.ink, sw: 3 }),
        C(440, 160, 400, 400, 'transparent', { stroke: ZEN.ink, sw: 3 }),
        C(240, 360, 400, 400, 'transparent', { stroke: ZEN.ink, sw: 3 }),
        C(440, 360, 400, 400, 'transparent', { stroke: ZEN.ink, sw: 3 }),
        C(500, 420, 80, 80, ZEN.red),
        T('LOVE', 250, 250, 160, 40, 26, { font: 'Space Mono', weight: 700, color: ZEN.ink, align: 'center', ls: 2 }),
        T('SKILL', 670, 250, 160, 40, 26, { font: 'Space Mono', weight: 700, color: ZEN.ink, align: 'center', ls: 2 }),
        T('NEED', 250, 630, 160, 40, 26, { font: 'Space Mono', weight: 700, color: ZEN.ink, align: 'center', ls: 2 }),
        T('PAID', 670, 630, 160, 40, 26, { font: 'Space Mono', weight: 700, color: ZEN.ink, align: 'center', ls: 2 }),
        T('where all four\nmeet, you find\nyour ikigai.', 70, 850, 940, 240, 64, { font: 'DM Serif Display', color: ZEN.ink, align: 'center', lh: 1.15 }),
        T('save this & reflect tonight 🌙', 70, 1150, 940, 40, 28, { font: 'Space Mono', color: ZEN.red, align: 'center' }),
        pager(6, 6, ZEN.ink, 'Space Mono'),
      ],
    },
  ],
});

// ─── EXPORT ──────────────────────────────────────────────────────────────────

export const CRAZY_TEMPLATES: Template[] = [
  TPL_NEON_BRUTAL,
  TPL_Y2K,
  TPL_SWISS,
  TPL_NOTES,
  TPL_TWEET,
  TPL_MAGAZINE,
  TPL_TERMINAL,
  TPL_NEO_BRUTAL,
  TPL_MONEY,
  TPL_STICKY,
  TPL_AURA,
  TPL_BEFORE_AFTER,
  TPL_RECEIPT,
  TPL_QUOTE_POSTER,
  TPL_MYTH_FACT,
  TPL_SAAS,
  TPL_GLOW_UP,
  TPL_COMIC,
  TPL_WRAPPED,
  TPL_ZEN,
];
