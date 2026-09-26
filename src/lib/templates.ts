import { Template, Slide, CanvasElement } from '../types';

// ─── HELPER to create text elements ──────────────────────────────────────────
const textEl = (
  id: string,
  text: string,
  x: number, y: number, w: number, h: number,
  fontSize: number,
  fontWeight: number,
  color: string,
  alignment: 'left' | 'center' | 'right' = 'left',
  zIndex = 2,
  letterSpacing = 0,
  extra: Partial<CanvasElement> = {}
): CanvasElement => ({
  id, type: 'text', x, y, width: w, height: h,
  rotation: 0, opacity: 1, zIndex,
  locked: false, visible: true,
  properties: {
    text, fontFamily: 'Inter', fontSize, fontWeight,
    color, alignment, letterSpacing, lineHeight: 1.2, textCase: 'none'
  },
  ...extra
});

const shapeEl = (
  id: string, shapeType: 'rectangle' | 'circle' | 'line',
  x: number, y: number, w: number, h: number,
  fill: string, zIndex = 1, extra: Partial<CanvasElement> = {}
): CanvasElement => ({
  id, type: 'shape', x, y, width: w, height: h,
  rotation: 0, opacity: 1, zIndex,
  locked: false, visible: true,
  properties: { shapeType, fill },
  ...extra
});

const imgEl = (
  id: string, src: string,
  x: number, y: number, w: number, h: number,
  zIndex = 1, extra: Partial<CanvasElement> = {}
): CanvasElement => ({
  id, type: 'image', x, y, width: w, height: h,
  rotation: 0, opacity: 1, zIndex,
  locked: false, visible: true,
  properties: { src, alt: '', objectFit: 'cover' },
  ...extra
});

// ─── SEED TEMPLATES ───────────────────────────────────────────────────────────

export const SEED_TEMPLATES: Template[] = [

  // ── 1. 7 AI TOOLS (Bold Editorial) ──────────────────────────────────────────
  {
    id: 'tpl_01',
    name: '7 AI Tools Every Creator Needs',
    description: 'A bold editorial carousel covering essential AI tools. Strong typography, high contrast.',
    category: 'AI',
    tags: ['AI', 'tools', 'creator', 'productivity'],
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: 7,
    isTrending: true,
    isNew: false,
    sourceType: 'original',
    attributionRequired: false,
    status: 'published',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    slides: [
      {
        id: 'tpl_01_s1', order: 0, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          shapeEl('e1', 'rectangle', 60, 60, 6, 120, '#FF5A00', 1),
          textEl('e2', '7 AI TOOLS', 90, 80, 900, 200, 96, 800, '#F7F5F0', 'left', 2, -2),
          textEl('e3', 'EVERY CREATOR\nNEEDS IN 2025', 90, 290, 900, 220, 72, 800, '#F7F5F0', 'left', 2, -2),
          textEl('e4', 'A quick guide to the tools reshaping\nhow creators work, create and grow.', 90, 560, 840, 100, 22, 400, 'rgba(247,245,240,0.6)', 'left', 3),
          textEl('e5', '01 / 07', 90, 1260, 300, 40, 13, 500, 'rgba(247,245,240,0.4)', 'left', 3, 2),
          shapeEl('e6', 'rectangle', 0, 1200, 1080, 2, 'rgba(247,245,240,0.1)', 1),
        ]
      },
      {
        id: 'tpl_01_s2', order: 1, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', '01.', 80, 80, 200, 120, 100, 800, 'rgba(17,17,17,0.08)', 'left', 1),
          textEl('e2', 'ChatGPT', 80, 160, 900, 100, 64, 700, '#111111', 'left', 2, -1),
          shapeEl('e3', 'rectangle', 80, 276, 120, 4, '#FF5A00', 1),
          textEl('e4', 'Your always-on writing partner.', 80, 316, 840, 60, 26, 500, '#111111', 'left', 2),
          textEl('e5', 'Write emails, scripts, captions, outlines and long-form content in seconds. The baseline tool every creator needs in their stack.', 80, 420, 840, 180, 20, 400, '#6B6B67', 'left', 2),
          textEl('e6', 'USE IT FOR:', 80, 660, 400, 40, 13, 600, '#FF5A00', 'left', 2, 2),
          textEl('e7', '→ Content repurposing\n→ Caption writing\n→ Email sequences\n→ Idea generation', 80, 710, 840, 200, 20, 400, '#111111', 'left', 2),
          textEl('e8', '02 / 07', 80, 1280, 300, 40, 13, 500, 'rgba(17,17,17,0.3)', 'left', 2, 2),
        ]
      },
      {
        id: 'tpl_01_s3', order: 2, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', '02.', 80, 80, 200, 120, 100, 800, 'rgba(17,17,17,0.08)', 'left', 1),
          textEl('e2', 'Midjourney', 80, 160, 900, 100, 64, 700, '#111111', 'left', 2, -1),
          shapeEl('e3', 'rectangle', 80, 276, 120, 4, '#FF5A00', 1),
          textEl('e4', 'Visuals on demand.', 80, 316, 840, 60, 26, 500, '#111111', 'left', 2),
          textEl('e5', 'Generate stunning images for your content without a photographer, designer or stock library. Great for thumbnails, covers and social posts.', 80, 420, 840, 180, 20, 400, '#6B6B67', 'left', 2),
          textEl('e6', 'USE IT FOR:', 80, 660, 400, 40, 13, 600, '#FF5A00', 'left', 2, 2),
          textEl('e7', '→ Carousel cover images\n→ YouTube thumbnails\n→ Brand visuals\n→ Newsletter graphics', 80, 710, 840, 200, 20, 400, '#111111', 'left', 2),
          textEl('e8', '03 / 07', 80, 1280, 300, 40, 13, 500, 'rgba(17,17,17,0.3)', 'left', 2, 2),
        ]
      },
      {
        id: 'tpl_01_s4', order: 3, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', '03.', 80, 80, 200, 120, 100, 800, 'rgba(247,245,240,0.05)', 'left', 1),
          textEl('e2', 'Notion AI', 80, 160, 900, 100, 64, 700, '#F7F5F0', 'left', 2, -1),
          shapeEl('e3', 'rectangle', 80, 276, 120, 4, '#FF5A00', 1),
          textEl('e4', 'Think less. Organize more.', 80, 316, 840, 60, 26, 500, '#F7F5F0', 'left', 2),
          textEl('e5', 'Summarize notes, generate content plans, auto-fill templates and turn raw ideas into structured documents — all inside your workspace.', 80, 420, 840, 180, 20, 400, 'rgba(247,245,240,0.6)', 'left', 2),
          textEl('e6', 'USE IT FOR:', 80, 660, 400, 40, 13, 600, '#FF5A00', 'left', 2, 2),
          textEl('e7', '→ Content calendars\n→ Meeting summaries\n→ SOPs and wikis\n→ Project planning', 80, 710, 840, 200, 20, 400, '#F7F5F0', 'left', 2),
          textEl('e8', '04 / 07', 80, 1280, 300, 40, 13, 500, 'rgba(247,245,240,0.3)', 'left', 2, 2),
        ]
      },
      {
        id: 'tpl_01_s5', order: 4, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', '04.', 80, 80, 200, 120, 100, 800, 'rgba(17,17,17,0.08)', 'left', 1),
          textEl('e2', 'ElevenLabs', 80, 160, 900, 100, 64, 700, '#111111', 'left', 2, -1),
          shapeEl('e3', 'rectangle', 80, 276, 120, 4, '#FF5A00', 1),
          textEl('e4', 'Voice that sounds real.', 80, 316, 840, 60, 26, 500, '#111111', 'left', 2),
          textEl('e5', 'Generate ultra-realistic voiceovers for your video content. No studio, no mic setup. Clone your own voice or pick from a library of natural-sounding AI voices.', 80, 420, 840, 180, 20, 400, '#6B6B67', 'left', 2),
          textEl('e6', 'USE IT FOR:', 80, 660, 400, 40, 13, 600, '#FF5A00', 'left', 2, 2),
          textEl('e7', '→ Video voiceovers\n→ Podcast intros\n→ Content localization\n→ Audiobook creation', 80, 710, 840, 200, 20, 400, '#111111', 'left', 2),
          textEl('e8', '05 / 07', 80, 1280, 300, 40, 13, 500, 'rgba(17,17,17,0.3)', 'left', 2, 2),
        ]
      },
      {
        id: 'tpl_01_s6', order: 5, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', '05.', 80, 80, 200, 120, 100, 800, 'rgba(17,17,17,0.08)', 'left', 1),
          textEl('e2', 'Descript', 80, 160, 900, 100, 64, 700, '#111111', 'left', 2, -1),
          shapeEl('e3', 'rectangle', 80, 276, 120, 4, '#FF5A00', 1),
          textEl('e4', 'Edit video like a doc.', 80, 316, 840, 60, 26, 500, '#111111', 'left', 2),
          textEl('e5', 'Record, transcribe and edit video by editing text. Remove filler words, silence and mistakes automatically. Ideal for podcast and video creators.', 80, 420, 840, 180, 20, 400, '#6B6B67', 'left', 2),
          textEl('e6', '06 / 07', 80, 1280, 300, 40, 13, 500, 'rgba(17,17,17,0.3)', 'left', 2, 2),
        ]
      },
      {
        id: 'tpl_01_s7', order: 6, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          shapeEl('e1', 'rectangle', 60, 60, 6, 120, '#FF5A00', 1),
          textEl('e2', 'WHICH ONE\nWILL YOU TRY\nFIRST?', 90, 80, 900, 400, 80, 800, '#F7F5F0', 'left', 2, -2),
          textEl('e3', 'Save this carousel and come back\nwhen you are ready to level up your\ncreator workflow.', 90, 560, 840, 160, 22, 400, 'rgba(247,245,240,0.6)', 'left', 3),
          textEl('e4', 'Follow for more AI creator tips →', 90, 780, 840, 60, 20, 600, '#FF5A00', 'left', 3),
          textEl('e5', '07 / 07', 90, 1280, 300, 40, 13, 500, 'rgba(247,245,240,0.3)', 'left', 3, 2),
        ]
      },
    ]
  },

  // ── 2. 5 SYSTEMS FOUNDERS (Minimal White) ───────────────────────────────────
  {
    id: 'tpl_02',
    name: '5 Systems That Save Founders Hours',
    description: 'Clean minimal white carousel. Perfect for founders sharing systems and frameworks.',
    category: 'Business',
    tags: ['founder', 'systems', 'productivity', 'business'],
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: 6,
    isTrending: true,
    isNew: false,
    sourceType: 'original',
    attributionRequired: false,
    status: 'published',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    slides: [
      {
        id: 'tpl_02_s1', order: 0, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'FOUNDERS', 80, 100, 920, 80, 13, 600, '#FF5A00', 'left', 2, 4),
          textEl('e2', '5 Systems\nThat Save\nYou Hours.', 80, 180, 920, 440, 90, 800, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 660, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Systems every founder should steal\nbefore they scale.', 80, 700, 840, 100, 22, 400, '#6B6B67', 'left', 2),
          shapeEl('e5', 'rectangle', 80, 1280, 120, 4, '#FF5A00', 1),
          textEl('e6', '1 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_02_s2', order: 1, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'SYSTEM 01', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'The Weekly\nReview System', 80, 170, 920, 260, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 460, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Every Sunday, spend 30 minutes reviewing what moved the needle and what didn\'t. Founders who review weekly grow 3× faster than those who wing it.', 80, 500, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', 'THE FRAMEWORK:', 80, 760, 400, 40, 12, 700, '#111111', 'left', 2, 2),
          textEl('e6', '① What shipped?\n② What got blocked?\n③ What\'s the one priority this week?', 80, 820, 920, 180, 20, 400, '#111111', 'left', 2),
          textEl('e7', '2 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_02_s3', order: 2, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'SYSTEM 02', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'The 3-Priority\nRule', 80, 170, 920, 240, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 440, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'You can\'t have 10 priorities. Each morning, pick three. Only three. When those are done, you are done — or you move to lower-priority work.', 80, 480, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '3 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_02_s4', order: 3, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'SYSTEM 03', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'The Content\nBatch System', 80, 170, 920, 240, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 440, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'One day per month, create all your content. Record 8-12 videos, write 20 posts, repurpose everything. Then schedule it and stop thinking about content.', 80, 480, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '4 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_02_s5', order: 4, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'SYSTEM 04', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'The SOP\nLibrary', 80, 170, 920, 240, 72, 700, '#F7F5F0', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 440, 920, 1, 'rgba(255,255,255,0.1)', 1),
          textEl('e4', 'Document every repeatable task once. The moment you do something twice — write the SOP. Delegate it. Free your brain for high-leverage work only.', 80, 480, 920, 200, 21, 400, 'rgba(247,245,240,0.6)', 'left', 2),
          textEl('e5', '5 / 6', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_02_s6', order: 5, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'SYSTEM 05', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'The Founder\nDebrief', 80, 170, 920, 240, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 440, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'At the end of every month, ask yourself: what worked, what didn\'t, and what would I tell my past self? This 30-minute habit compounds over time.', 80, 480, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', 'Save this.\nShare it with a founder who needs it.', 80, 780, 920, 100, 22, 500, '#111111', 'left', 2),
          textEl('e6', '6 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
    ]
  },

  // ── 3. WHY YOUR CONTENT ISN'T SAVED (Marketing) ─────────────────────────────
  {
    id: 'tpl_03',
    name: "Why Your Content Isn't Getting Saved",
    description: 'High-impact marketing carousel for content creators. Bold copy, dark slides.',
    category: 'Marketing',
    tags: ['content', 'marketing', 'creator', 'engagement'],
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: 5,
    isTrending: true,
    isNew: true,
    sourceType: 'original',
    attributionRequired: false,
    status: 'published',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    slides: [
      {
        id: 'tpl_03_s1', order: 0, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'CONTENT STRATEGY', 80, 100, 900, 50, 12, 600, '#FF5A00', 'left', 2, 4),
          textEl('e2', 'Why Your\nContent\nIsn\'t Getting\nSaved.', 80, 180, 900, 620, 86, 800, '#F7F5F0', 'left', 2, -2),
          textEl('e3', '(And what to do about it.)', 80, 860, 900, 60, 24, 400, 'rgba(247,245,240,0.5)', 'left', 2),
          textEl('e4', '1 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_03_s2', order: 1, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'REASON 01', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'You\'re creating\ncontent to impress,\nnot to be useful.', 80, 180, 920, 360, 60, 700, '#111111', 'left', 2, -1),
          shapeEl('e3', 'rectangle', 80, 570, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Saves happen when someone thinks "I need this later." If your content is entertainment-only, it won\'t get saved — it\'ll be scrolled past.', 80, 610, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', 'FIX: Make every post answer a real question your audience has.', 80, 900, 920, 100, 20, 600, '#111111', 'left', 2),
          textEl('e6', '2 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_03_s3', order: 2, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'REASON 02', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'You\'re burying\nthe value.', 80, 180, 920, 260, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'The most valuable insight in your carousel should be visible in the first 2 slides. If people have to scroll to slide 6 to get the value — they won\'t.', 80, 510, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', 'FIX: Lead with the payoff. Explain later.', 80, 800, 920, 80, 20, 600, '#111111', 'left', 2),
          textEl('e6', '3 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_03_s4', order: 3, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'REASON 03', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'The design\ndoesn\'t match\nthe copy.', 80, 180, 920, 340, 72, 700, '#F7F5F0', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 550, 920, 1, 'rgba(255,255,255,0.1)', 1),
          textEl('e4', 'Good copy with bad design = mistrust. Bad copy with good design = confusion. Both need to work together. Most carousels have one but not the other.', 80, 590, 920, 200, 21, 400, 'rgba(247,245,240,0.6)', 'left', 2),
          textEl('e5', '4 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_03_s5', order: 4, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'THE FIX', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Make content\npeople bookmark,\nnot just like.', 80, 180, 920, 340, 70, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 550, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', '① Lead with the value\n② Design like it matters\n③ End with a clear CTA', 80, 590, 920, 200, 22, 400, '#111111', 'left', 2),
          textEl('e5', 'Save this to remember it. Share it with someone who needs it.', 80, 880, 920, 100, 20, 500, '#6B6B67', 'left', 2),
          textEl('e6', '5 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
    ]
  },

  // ── 4. BUILD A PERSONAL BRAND (Personal Brand) ───────────────────────────────
  {
    id: 'tpl_04',
    name: 'Build a Personal Brand People Remember',
    description: 'Orange-accented personal branding guide carousel with bold editorial typography.',
    category: 'Personal Brand',
    tags: ['personal brand', 'creator', 'marketing', 'social media'],
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: 6,
    isTrending: false,
    isNew: true,
    sourceType: 'original',
    attributionRequired: false,
    status: 'published',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    slides: [
      {
        id: 'tpl_04_s1', order: 0, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FF5A00' },
        elements: [
          textEl('e1', 'PERSONAL BRAND', 80, 100, 900, 50, 12, 600, 'rgba(255,255,255,0.7)', 'left', 2, 4),
          textEl('e2', 'Build a Brand\nPeople\nRemember.', 80, 180, 900, 540, 90, 800, '#FFFFFF', 'left', 2, -2),
          textEl('e3', 'The 6-part framework for standing out in a crowded feed.', 80, 800, 900, 100, 22, 400, 'rgba(255,255,255,0.75)', 'left', 2),
          textEl('e4', '1 / 6', 920, 1280, 80, 40, 13, 500, 'rgba(255,255,255,0.5)', 'right', 2),
        ]
      },
      {
        id: 'tpl_04_s2', order: 1, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'PART 01', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Pick a lane.\nStay in it.', 80, 180, 920, 260, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'The brands that grow fastest are known for one thing. Not three. Not "content about content and business and mindset." One clear niche. Own it.', 80, 510, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '2 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_04_s3', order: 2, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'PART 02', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Have a\nrecognizable\naesthetic.', 80, 180, 920, 340, 68, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 550, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Colors, fonts, cover styles — these should be consistent. When someone scrolls past your post, they should know it\'s you before they read a word.', 80, 590, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '3 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_04_s4', order: 3, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'PART 03', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Post with a\nperspective.', 80, 180, 920, 260, 72, 700, '#F7F5F0', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(255,255,255,0.1)', 1),
          textEl('e4', 'You don\'t have to be controversial. You have to have an opinion. "Here\'s what I think about X" is 10× more engaging than "Here\'s information about X."', 80, 510, 920, 200, 21, 400, 'rgba(247,245,240,0.6)', 'left', 2),
          textEl('e5', '4 / 6', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_04_s5', order: 4, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'PART 04', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Be consistent,\nnot perfect.', 80, 180, 920, 260, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'The creator who posts every week beats the creator who posts perfect content once a month. Algorithms reward consistency. So does your audience.', 80, 510, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '5 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_04_s6', order: 5, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FF5A00' },
        elements: [
          textEl('e1', 'THE SUMMARY', 80, 100, 400, 50, 12, 600, 'rgba(255,255,255,0.7)', 'left', 2, 3),
          textEl('e2', 'A brand is what\npeople say about\nyou when you\'re\nnot in the room.', 80, 180, 920, 540, 72, 800, '#FFFFFF', 'left', 2, -2),
          textEl('e3', 'Make sure they\'re saying something worth hearing.', 80, 800, 920, 100, 22, 500, 'rgba(255,255,255,0.8)', 'left', 2),
          textEl('e6', '6 / 6', 920, 1280, 80, 40, 13, 500, 'rgba(255,255,255,0.5)', 'right', 2),
        ]
      },
    ]
  },

  // ── 5. SAAS GROWTH PLAYBOOK ──────────────────────────────────────────────────
  {
    id: 'tpl_05',
    name: 'The SaaS Growth Playbook',
    description: 'Data-driven SaaS growth strategies. Clean, professional, numbers-forward.',
    category: 'SaaS',
    tags: ['SaaS', 'growth', 'startup', 'business'],
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: 5,
    isTrending: false,
    isNew: true,
    sourceType: 'original',
    attributionRequired: false,
    status: 'published',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    slides: [
      {
        id: 'tpl_05_s1', order: 0, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'SAAS GROWTH', 80, 100, 900, 50, 12, 600, '#FF5A00', 'left', 2, 4),
          textEl('e2', 'The Growth\nPlaybook\nFounders\nSwear By.', 80, 180, 900, 600, 84, 800, '#F7F5F0', 'left', 2, -2),
          textEl('e3', 'Five growth levers. Zero fluff.', 80, 860, 900, 60, 22, 400, 'rgba(247,245,240,0.5)', 'left', 2),
          textEl('e4', '1 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_05_s2', order: 1, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'LEVER 01', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Reduce time-\nto-value.', 80, 180, 920, 240, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 450, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'The faster users experience your product\'s core value, the higher your activation rate. Most SaaS products bury the "aha moment" under 7 steps of onboarding.', 80, 490, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '2 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_05_s3', order: 2, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'LEVER 02', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Build a\npowerful free\ntier.', 80, 180, 920, 320, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 530, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Freemium done right creates distribution. Canva, Notion, Linear — all built massive user bases through a generous free tier before converting to paid.', 80, 570, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '3 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_05_s4', order: 3, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'LEVER 03', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Make sharing\na feature.', 80, 180, 920, 240, 72, 700, '#F7F5F0', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 450, 920, 1, 'rgba(255,255,255,0.1)', 1),
          textEl('e4', 'Viral loops don\'t happen by accident. Design your product so that using it creates natural sharing moments. "Made with X" watermarks aren\'t lazy — they\'re strategy.', 80, 490, 920, 200, 21, 400, 'rgba(247,245,240,0.6)', 'left', 2),
          textEl('e5', '4 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_05_s5', order: 4, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FF5A00' },
        elements: [
          textEl('e1', 'THE PLAYBOOK', 80, 100, 900, 50, 12, 600, 'rgba(255,255,255,0.7)', 'left', 2, 3),
          textEl('e2', '① Reduce time-to-value\n② Build a powerful free tier\n③ Make sharing a feature\n④ Invest in onboarding\n⑤ Talk to churned users', 80, 180, 900, 600, 36, 600, '#FFFFFF', 'left', 2, -1),
          textEl('e3', '5 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(255,255,255,0.5)', 'right', 2),
        ]
      },
    ]
  },

  // ── 6. FINANCE BASICS ────────────────────────────────────────────────────────
  {
    id: 'tpl_06',
    name: '6 Money Rules Everyone Should Know',
    description: 'Finance fundamentals carousel. Minimal, authoritative, educational.',
    category: 'Finance',
    tags: ['finance', 'money', 'investing', 'education'],
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: 6,
    isTrending: false,
    isNew: false,
    sourceType: 'original',
    attributionRequired: false,
    status: 'published',
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
    slides: [
      {
        id: 'tpl_06_s1', order: 0, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'PERSONAL FINANCE', 80, 100, 900, 50, 12, 600, '#FF5A00', 'left', 2, 4),
          textEl('e2', '6 Money Rules\nEveryone Should\nKnow By 30.', 80, 180, 920, 480, 80, 800, '#111111', 'left', 2, -2),
          textEl('e3', 'No financial advisor speak. Just the fundamentals.', 80, 740, 920, 80, 22, 400, '#6B6B67', 'left', 2),
          shapeEl('e4', 'rectangle', 80, 1280, 120, 4, '#FF5A00', 1),
          textEl('e5', '1 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_06_s2', order: 1, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'RULE 01', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Spend less\nthan you earn.', 80, 180, 920, 260, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Not glamorous. Not new. But still the most violated rule in personal finance. The gap between income and spending is where wealth is built.', 80, 510, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '2 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_06_s3', order: 2, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'RULE 02', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Build a 3-month\nemergency fund first.', 80, 180, 920, 300, 64, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 510, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Before investing. Before paying off debt. Build a cash cushion. 3 months of expenses. This prevents one bad month from destroying years of progress.', 80, 550, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '3 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_06_s4', order: 3, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'RULE 03', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Invest\nearly.\nAlways.', 80, 180, 920, 420, 86, 800, '#F7F5F0', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 640, 920, 1, 'rgba(255,255,255,0.1)', 1),
          textEl('e4', 'Time in the market beats timing the market. $500/month at 22 beats $2000/month at 35. Compounding is the closest thing to financial magic.', 80, 680, 920, 200, 21, 400, 'rgba(247,245,240,0.6)', 'left', 2),
          textEl('e5', '4 / 6', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_06_s5', order: 4, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'RULE 04', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Avoid lifestyle\ncreep.', 80, 180, 920, 240, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 450, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Every time your income goes up, resist the urge to upgrade your lifestyle proportionally. Invest the raise. Drive the same car. Your future self will thank you.', 80, 490, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '5 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_06_s6', order: 5, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'SAVE THIS', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'The best time\nto start was\nyesterday.', 80, 180, 920, 380, 72, 800, '#111111', 'left', 2, -2),
          textEl('e3', 'The second best time is right now.', 80, 600, 920, 80, 26, 500, '#111111', 'left', 2),
          textEl('e4', 'Share this with someone who needs to hear it.', 80, 740, 920, 80, 20, 400, '#6B6B67', 'left', 2),
          textEl('e5', '6 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
    ]
  },

  // ── 7. EDUCATION FRAMEWORK ───────────────────────────────────────────────────
  {
    id: 'tpl_07',
    name: 'The Learning Acceleration Framework',
    description: 'Education-focused carousel. Clean white slides with structured learning content.',
    category: 'Education',
    tags: ['education', 'learning', 'framework', 'skills'],
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: 5,
    isTrending: false,
    isNew: false,
    sourceType: 'original',
    attributionRequired: false,
    status: 'published',
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z',
    slides: [
      {
        id: 'tpl_07_s1', order: 0, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'LEARN FASTER', 80, 100, 900, 50, 12, 600, '#FF5A00', 'left', 2, 4),
          textEl('e2', 'How to Learn\nAnything in\nHalf the Time.', 80, 180, 900, 480, 80, 800, '#111111', 'left', 2, -2),
          textEl('e3', 'The framework top performers use to learn at 2× speed.', 80, 740, 900, 100, 22, 400, '#6B6B67', 'left', 2),
          textEl('e4', '1 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_07_s2', order: 1, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'STEP 01', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Teach it to\nsomeone else.', 80, 180, 920, 260, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'The Feynman Technique: if you can\'t explain it simply, you don\'t understand it yet. Teach as you learn. Writing is the best forcing function.', 80, 510, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '2 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_07_s3', order: 2, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'STEP 02', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Use spaced\nrepetition.', 80, 180, 920, 260, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Review new material at increasing intervals: 1 day, 3 days, 7 days, 21 days. Your brain locks in information better when it\'s slightly forgotten and recalled.', 80, 510, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '3 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_07_s4', order: 3, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'STEP 03', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Apply before\nyou feel ready.', 80, 180, 920, 260, 72, 700, '#F7F5F0', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(255,255,255,0.1)', 1),
          textEl('e4', 'Waiting until you know everything is a trap. Start applying what you\'ve learned at 70% readiness. The remaining 30% comes from doing, not reading.', 80, 510, 920, 200, 21, 400, 'rgba(247,245,240,0.6)', 'left', 2),
          textEl('e5', '4 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_07_s5', order: 4, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'THE FRAMEWORK', 80, 100, 900, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Teach → Space → Apply → Repeat.', 80, 180, 920, 200, 52, 700, '#111111', 'left', 2, -1),
          shapeEl('e3', 'rectangle', 80, 420, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'This is the loop. Most people do none of these. The ones who do grow faster than everyone else — at everything.', 80, 460, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', 'Save this. Share it. Then go use it.', 80, 740, 920, 80, 20, 500, '#111111', 'left', 2),
          textEl('e6', '5 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
    ]
  },

  // ── 8. QUOTE CAROUSEL ────────────────────────────────────────────────────────
  {
    id: 'tpl_08',
    name: 'Mindset Quotes for Builders',
    description: 'Bold quote carousel. High-contrast, editorial typography on alternating dark and light slides.',
    category: 'Motivation',
    tags: ['quotes', 'mindset', 'motivation', 'builder'],
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: 5,
    isTrending: false,
    isNew: true,
    sourceType: 'original',
    attributionRequired: false,
    status: 'published',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
    slides: [
      {
        id: 'tpl_08_s1', order: 0, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', '"', 80, 60, 200, 200, 200, 800, '#FF5A00', 'left', 1),
          textEl('e2', 'Build things\npeople need.\nNot things\nyou think are\ncool.', 80, 220, 920, 680, 72, 700, '#F7F5F0', 'left', 2, -1),
          shapeEl('e3', 'rectangle', 80, 1200, 920, 1, 'rgba(255,255,255,0.1)', 1),
          textEl('e4', 'MINDSET FOR BUILDERS', 80, 1230, 900, 40, 11, 600, 'rgba(247,245,240,0.4)', 'left', 2, 3),
          textEl('e5', '1 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_08_s2', order: 1, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', '"', 80, 60, 200, 200, 200, 800, '#FF5A00', 'left', 1),
          textEl('e2', 'Momentum\nis a product\nfeature.', 80, 220, 920, 520, 80, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 1200, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'MINDSET FOR BUILDERS', 80, 1230, 900, 40, 11, 600, 'rgba(17,17,17,0.3)', 'left', 2, 3),
          textEl('e5', '2 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_08_s3', order: 2, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FF5A00' },
        elements: [
          textEl('e1', '"', 80, 60, 200, 200, 200, 800, 'rgba(255,255,255,0.3)', 'left', 1),
          textEl('e2', 'The best\nmarketing is\na product that\nworks.', 80, 220, 920, 600, 80, 700, '#FFFFFF', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 1200, 920, 1, 'rgba(255,255,255,0.2)', 1),
          textEl('e4', 'MINDSET FOR BUILDERS', 80, 1230, 900, 40, 11, 600, 'rgba(255,255,255,0.5)', 'left', 2, 3),
          textEl('e5', '3 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(255,255,255,0.5)', 'right', 2),
        ]
      },
      {
        id: 'tpl_08_s4', order: 3, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', '"', 80, 60, 200, 200, 200, 800, '#FF5A00', 'left', 1),
          textEl('e2', 'Ship ugly.\nIterate fast.\nWin slowly.', 80, 220, 920, 520, 80, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 1200, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'MINDSET FOR BUILDERS', 80, 1230, 900, 40, 11, 600, 'rgba(17,17,17,0.3)', 'left', 2, 3),
          textEl('e5', '4 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_08_s5', order: 4, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', '"', 80, 60, 200, 200, 200, 800, '#FF5A00', 'left', 1),
          textEl('e2', 'Distribution\neats product\nfor breakfast.', 80, 220, 920, 520, 80, 700, '#F7F5F0', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 1200, 920, 1, 'rgba(255,255,255,0.1)', 1),
          textEl('e4', 'MINDSET FOR BUILDERS', 80, 1230, 900, 40, 11, 600, 'rgba(247,245,240,0.3)', 'left', 2, 3),
          textEl('e5', '5 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
    ]
  },

  // ── 9. CREATOR GROWTH ────────────────────────────────────────────────────────
  {
    id: 'tpl_09',
    name: 'Grow Your Audience in 90 Days',
    description: 'Step-by-step creator growth carousel. Bold hooks, clear actions, strong CTA.',
    category: 'Creator',
    tags: ['creator', 'audience growth', 'content', 'social media'],
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: 6,
    isTrending: true,
    isNew: false,
    sourceType: 'original',
    attributionRequired: false,
    status: 'published',
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z',
    slides: [
      {
        id: 'tpl_09_s1', order: 0, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'AUDIENCE GROWTH', 80, 100, 900, 50, 12, 600, '#FF5A00', 'left', 2, 4),
          textEl('e2', 'Grow Your\nAudience in\n90 Days.', 80, 180, 900, 500, 86, 800, '#111111', 'left', 2, -2),
          textEl('e3', 'The exact approach I used to go from 0 to 10K in three months.', 80, 760, 900, 100, 22, 400, '#6B6B67', 'left', 2),
          textEl('e4', '1 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_09_s2', order: 1, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'DAYS 1–30', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Define who\nyou\'re talking to.', 80, 180, 920, 260, 68, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Most creators fail because they\'re talking to everyone. Narrow down to one specific person — their job, their problem, their goal. Make every post feel like it was written for them.', 80, 510, 920, 220, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '2 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_09_s3', order: 2, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'DAYS 31–60', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Post every day.\nNo exceptions.', 80, 180, 920, 260, 68, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'The algorithm doesn\'t reward quality. It rewards consistency. For 30 days, post every single day. This teaches you more than any course. You discover what works through volume.', 80, 510, 920, 220, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '3 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_09_s4', order: 3, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'DAYS 61–90', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Double down\non what works.', 80, 180, 920, 260, 68, 700, '#F7F5F0', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(255,255,255,0.1)', 1),
          textEl('e4', 'By day 60, you\'ll know which 3–4 content formats get 80% of your results. Stop experimenting. Start repeating. Systematize what\'s working and scale it.', 80, 510, 920, 220, 21, 400, 'rgba(247,245,240,0.6)', 'left', 2),
          textEl('e5', '4 / 6', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_09_s5', order: 4, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'THE SECRET', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Engagement\nbeats reach.', 80, 180, 920, 240, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 450, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', '100 people who comment, save and share your post are worth more than 10,000 passive views. Focus obsessively on depth of connection, not width of reach.', 80, 490, 920, 220, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '5 / 6', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_09_s6', order: 5, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FF5A00' },
        elements: [
          textEl('e1', 'YOUR TURN', 80, 100, 900, 50, 12, 600, 'rgba(255,255,255,0.7)', 'left', 2, 3),
          textEl('e2', 'Day 1 starts\nwhen you\ndecide it does.', 80, 180, 900, 500, 80, 800, '#FFFFFF', 'left', 2, -2),
          textEl('e3', 'Save this. Start today.', 80, 760, 900, 80, 22, 600, 'rgba(255,255,255,0.8)', 'left', 2),
          textEl('e4', '6 / 6', 920, 1280, 80, 40, 13, 500, 'rgba(255,255,255,0.5)', 'right', 2),
        ]
      },
    ]
  },

  // ── 10. PRODUCTIVITY SYSTEM ──────────────────────────────────────────────────
  {
    id: 'tpl_10',
    name: 'The Deep Work System',
    description: 'Productivity framework carousel. Clean, structured, actionable.',
    category: 'Productivity',
    tags: ['productivity', 'deep work', 'focus', 'habits'],
    thumbnailUrl: '',
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: 5,
    isTrending: true,
    isNew: false,
    sourceType: 'original',
    attributionRequired: false,
    status: 'published',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    slides: [
      {
        id: 'tpl_10_s1', order: 0, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'DEEP WORK', 80, 100, 900, 50, 12, 600, '#FF5A00', 'left', 2, 4),
          textEl('e2', 'The System That\nTripled My\nOutput.', 80, 180, 900, 500, 86, 800, '#F7F5F0', 'left', 2, -2),
          textEl('e3', 'No hustle culture. No 5am club. Just focused work that actually moves things forward.', 80, 760, 900, 120, 22, 400, 'rgba(247,245,240,0.55)', 'left', 2),
          textEl('e4', '1 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
      {
        id: 'tpl_10_s2', order: 1, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'PRINCIPLE 01', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Schedule deep\nwork like\na meeting.', 80, 180, 920, 340, 68, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 550, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'If it\'s not in the calendar, it doesn\'t happen. Block 2-4 hours of uninterrupted focus time. Treat it as unmovable. No exceptions.', 80, 590, 920, 200, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '2 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_10_s3', order: 2, width: 1080, height: 1350,
        background: { type: 'solid', value: '#FFFFFF' },
        elements: [
          textEl('e1', 'PRINCIPLE 02', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'One tab.\nOne task.', 80, 180, 920, 240, 72, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 450, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'Context switching is cognitive poison. Every time you switch tasks, your brain spends 20+ minutes recovering. The cost of multitasking is measured in hours, not minutes.', 80, 490, 920, 220, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '3 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_10_s4', order: 3, width: 1080, height: 1350,
        background: { type: 'solid', value: '#F7F5F0' },
        elements: [
          textEl('e1', 'PRINCIPLE 03', 80, 100, 400, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Protect your\nfirst 2 hours.', 80, 180, 920, 260, 68, 700, '#111111', 'left', 2, -2),
          shapeEl('e3', 'rectangle', 80, 470, 920, 1, 'rgba(17,17,17,0.1)', 1),
          textEl('e4', 'The first 2 hours of your workday are the most cognitively powerful. Don\'t waste them on email and Slack. Do your hardest, most important work first.', 80, 510, 920, 220, 21, 400, '#6B6B67', 'left', 2),
          textEl('e5', '4 / 5', 920, 1280, 80, 40, 13, 500, '#6B6B67', 'right', 2),
        ]
      },
      {
        id: 'tpl_10_s5', order: 4, width: 1080, height: 1350,
        background: { type: 'solid', value: '#111111' },
        elements: [
          textEl('e1', 'REMEMBER THIS', 80, 100, 900, 50, 12, 600, '#FF5A00', 'left', 2, 3),
          textEl('e2', 'Busy is not\nproductive.\nFocused is.', 80, 180, 920, 440, 80, 800, '#F7F5F0', 'left', 2, -2),
          textEl('e3', 'Save this. One principle. This week. Try it.', 80, 700, 920, 80, 22, 500, 'rgba(247,245,240,0.7)', 'left', 2),
          textEl('e4', '5 / 5', 920, 1280, 80, 40, 13, 500, 'rgba(247,245,240,0.3)', 'right', 2),
        ]
      },
    ]
  },
];

// ─── CUSTOM TEMPLATES STORAGE ────────────────────────────────────────────────
const CUSTOM_TEMPLATES_KEY = 'swapp_custom_templates';

export function getCustomTemplates(): Template[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse custom templates:', err);
    return [];
  }
}

export function saveCustomTemplate(template: Template): void {
  try {
    const existing = getCustomTemplates();
    const idx = existing.findIndex(t => t.id === template.id);
    const updated: Template = { ...template, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      existing[idx] = updated;
    } else {
      existing.unshift(updated);
    }
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save custom template:', err);
  }
}

export function deleteCustomTemplate(id: string): void {
  try {
    const existing = getCustomTemplates().filter(t => t.id !== id);
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to delete custom template:', err);
  }
}

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

export const getAllTemplates = (): Template[] => {
  const custom = getCustomTemplates();
  // Avoid any duplicate IDs
  const customIds = new Set(custom.map(t => t.id));
  const filteredSeed = SEED_TEMPLATES.filter(t => !customIds.has(t.id));
  return [...custom, ...filteredSeed];
};

export const getPublishedTemplates = (): Template[] =>
  getAllTemplates().filter(t => t.status === 'published');

export const getTemplateById = (id: string): Template | undefined =>
  getAllTemplates().find(t => t.id === id);

export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === 'All') return getPublishedTemplates();
  if (category === 'Trending') return getPublishedTemplates().filter(t => t.isTrending);
  if (category === 'New') return getPublishedTemplates().filter(t => t.isNew);
  return getPublishedTemplates().filter(t => t.category === category);
};

