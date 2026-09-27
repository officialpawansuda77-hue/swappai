import { Template, Slide, CanvasElement } from '../types';
import { supabase } from './supabase';

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

// ─── REAL TEMPLATES (Zero Mockups / Zero Unreal Demo Templates) ───────────────

const AI_TOOLS_ID = 'a5bcbff9-667d-42df-90eb-98219d6ba24b';
const VIRAL_CAROUSELS_ID = 'c1000000-0000-0000-0000-000000000001';

export const TEMPLATE_AI_TOOLS: Template = {
  id: AI_TOOLS_ID,
  name: 'AI Tools',
  description: 'Essential AI tools every modern creator needs in 2025. 5 complete editable slides.',
  category: 'AI',
  tags: ['AI', 'tools', 'creator', 'productivity', 'software', 'tech'],
  thumbnailUrl: '/carousels/c1/slide1.png',
  aspectRatio: '4:5',
  width: 1080,
  height: 1350,
  slideCount: 5,
  isTrending: true,
  isNew: true,
  sourceType: 'original',
  attributionRequired: false,
  status: 'published',
  createdAt: '2026-09-27T08:05:08.491Z',
  updatedAt: '2026-09-27T08:09:44.689Z',
  slides: [
    {
      id: 'ai_s1',
      order: 0,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#0D0D11' },
      previewUrl: '/carousels/c1/slide1.png',
      elements: [
        shapeEl('el_badge', 'rectangle', 80, 120, 220, 50, '#FF5A00', 1, {
          properties: { shapeType: 'rectangle', fill: '#FF5A00', borderRadius: 25 }
        }),
        textEl('el_badgetext', 'AI TOOLS 2025', 100, 132, 180, 30, 16, 800, '#FFFFFF', 'center', 2),
        textEl('el_title', '5 AI Tools That\nReplace a Whole\nAgency Team.', 80, 220, 920, 340, 72, 900, '#FFFFFF', 'left', 2, 0, {
          properties: { text: '5 AI Tools That\nReplace a Whole\nAgency Team.', color: '#FFFFFF', fontSize: 72, alignment: 'left', fontFamily: 'Inter', fontWeight: 900, lineHeight: 1.15 }
        }),
        textEl('el_sub', 'Curated workflow stack for creators, founders & marketers who need to move 10x faster.', 80, 620, 880, 120, 28, 400, 'rgba(255,255,255,0.7)', 'left', 2, 0, {
          properties: { text: 'Curated workflow stack for creators, founders & marketers who need to move 10x faster.', color: 'rgba(255,255,255,0.7)', fontSize: 28, alignment: 'left', fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.4 }
        }),
        textEl('el_swipe', 'SWIPE FOR THE STACK →', 80, 1200, 400, 40, 18, 700, '#FF5A00', 'left', 2, 2)
      ]
    },
    {
      id: 'ai_s2',
      order: 1,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#121217' },
      previewUrl: '/carousels/c1/slide2.png',
      elements: [
        textEl('el_num1', '01', 80, 120, 200, 80, 64, 900, '#FF5A00', 'left', 1),
        textEl('el_tool1', 'ChatGPT & Claude', 80, 220, 920, 100, 56, 800, '#FFFFFF', 'left', 2),
        textEl('el_desc1', 'Use Claude 3.5 Sonnet for long-form reasoning, deep synthesis and code.\nUse ChatGPT for ideation, copywriting angles and social hooks.', 80, 350, 880, 200, 26, 400, 'rgba(255,255,255,0.75)', 'left', 2, 0, {
          properties: { text: 'Use Claude 3.5 Sonnet for long-form reasoning, deep synthesis and code.\nUse ChatGPT for ideation, copywriting angles and social hooks.', color: 'rgba(255,255,255,0.75)', fontSize: 26, alignment: 'left', fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.5 }
        })
      ]
    },
    {
      id: 'ai_s3',
      order: 2,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#121217' },
      previewUrl: '/carousels/c1/slide3.png',
      elements: [
        textEl('el_num2', '02', 80, 120, 200, 80, 64, 900, '#FF5A00', 'left', 1),
        textEl('el_tool2', 'Midjourney v6 & FLUX', 80, 220, 920, 100, 56, 800, '#FFFFFF', 'left', 2),
        textEl('el_desc2', 'Generate studio-grade product mockups, 3D assets, and photorealistic cover imagery on demand without hiring photographers.', 80, 350, 880, 200, 26, 400, 'rgba(255,255,255,0.75)', 'left', 2, 0, {
          properties: { text: 'Generate studio-grade product mockups, 3D assets, and photorealistic cover imagery on demand without hiring photographers.', color: 'rgba(255,255,255,0.75)', fontSize: 26, alignment: 'left', fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.5 }
        })
      ]
    },
    {
      id: 'ai_s4',
      order: 3,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#121217' },
      previewUrl: '/carousels/c1/slide4.png',
      elements: [
        textEl('el_num3', '03', 80, 120, 200, 80, 64, 900, '#FF5A00', 'left', 1),
        textEl('el_tool3', 'ElevenLabs & Descript', 80, 220, 920, 100, 56, 800, '#FFFFFF', 'left', 2),
        textEl('el_desc3', 'Ultra-realistic voice cloning and text-based video editing. Remove filler words in one click and create multilingual content effortlessly.', 80, 350, 880, 200, 26, 400, 'rgba(255,255,255,0.75)', 'left', 2, 0, {
          properties: { text: 'Ultra-realistic voice cloning and text-based video editing. Remove filler words in one click and create multilingual content effortlessly.', color: 'rgba(255,255,255,0.75)', fontSize: 26, alignment: 'left', fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.5 }
        })
      ]
    },
    {
      id: 'ai_s5',
      order: 4,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#0D0D11' },
      previewUrl: '/carousels/c1/slide5.png',
      elements: [
        textEl('el_callout', 'Ready to build\nyour carousel?', 80, 240, 920, 200, 64, 900, '#FFFFFF', 'left', 2, 0, {
          properties: { text: 'Ready to build\nyour carousel?', color: '#FFFFFF', fontSize: 64, alignment: 'left', fontFamily: 'Inter', fontWeight: 900, lineHeight: 1.2 }
        }),
        textEl('el_final', 'Open this template in SWAPP canvas editor to customize text, fonts, colors, and branding.', 80, 480, 880, 140, 26, 400, 'rgba(255,255,255,0.75)', 'left', 2, 0, {
          properties: { text: 'Open this template in SWAPP canvas editor to customize text, fonts, colors, and branding.', color: 'rgba(255,255,255,0.75)', fontSize: 26, alignment: 'left', fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.5 }
        })
      ]
    }
  ]
};

export const TEMPLATE_VIRAL_CAROUSELS: Template = {
  id: VIRAL_CAROUSELS_ID,
  name: 'The Art of Viral Carousels',
  description: 'High-performing viral carousel structure by @marketingharry. Proven hook, high retention and save rate.',
  category: 'Marketing',
  tags: ['marketing', 'viral', 'instagram', 'linkedin', 'growth', 'creator'],
  thumbnailUrl: '/carousels/c1/slide1.png',
  aspectRatio: '4:5',
  width: 1080,
  height: 1350,
  slideCount: 5,
  isTrending: true,
  isNew: false,
  sourceType: 'original',
  sourcePlatform: 'instagram',
  attributionRequired: false,
  status: 'published',
  createdAt: '2026-09-27T08:00:00.000Z',
  updatedAt: '2026-09-27T08:00:00.000Z',
  slides: [
    // ── SLIDE 1: HOOK / HERO ──
    {
      id: 'c1_s1',
      order: 0,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#3B82C4' },
      previewUrl: '/carousels/c1/slide1.png',
      elements: [
        imgEl('c1_s1_statue', '/carousels/c1/statue_hero_clean.jpg', 60, 420, 960, 930, 1, {
          properties: { src: '/carousels/c1/statue_hero_clean.jpg', objectFit: 'contain' }
        }),
        textEl('c1_s1_eyebrow', 'Social Media Marketing | @marketingharry', 140, 50, 800, 40, 22, 700, 'rgba(255,255,255,0.9)', 'center', 2),
        textEl('c1_s1_the', 'THE', 80, 130, 260, 120, 105, 900, '#FFFFFF', 'left', 2),
        textEl('c1_s1_art', 'ART', 340, 120, 280, 130, 115, 900, '#FF1493', 'center', 2),
        textEl('c1_s1_ofviral', 'OF VIRAL', 620, 130, 380, 120, 85, 900, '#FFFFFF', 'right', 2),
        textEl('c1_s1_carousels', 'CAROUSELS', 60, 250, 960, 160, 125, 900, '#FFFFFF', 'center', 2, 4)
      ]
    },
    // ── SLIDE 2: PROOF & SUBHOOK ──
    {
      id: 'c1_s2',
      order: 1,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#FFFFFF' },
      previewUrl: '/carousels/c1/slide2.png',
      elements: [
        textEl('c1_s2_h1', "I've created over", 80, 80, 920, 70, 52, 700, '#111111', 'center', 2),
        textEl('c1_s2_h2', "2500+ carousels", 80, 150, 920, 90, 72, 900, '#FF2E93', 'center', 2),
        textEl('c1_s2_sub', "Here's everything I wish\nI knew before I started 👉", 80, 260, 920, 120, 42, 600, '#222222', 'center', 2, 0, {
          properties: { text: "Here's everything I wish\nI knew before I started 👉", color: '#222222', fontSize: 42, fontWeight: 600, alignment: 'center', lineHeight: 1.3, fontFamily: 'Inter' }
        }),
        imgEl('c1_s2_creator', '/carousels/c1/creator_hero_clean.jpg', 220, 480, 640, 870, 1, {
          properties: { src: '/carousels/c1/creator_hero_clean.jpg', objectFit: 'contain' }
        }),
        shapeEl('c1_s2_card1', 'rectangle', 80, 480, 220, 260, '#18181B', 2, {
          properties: { shapeType: 'rectangle', fill: '#18181B', borderRadius: 20 }
        }),
        textEl('c1_s2_card1_txt', "7 VIRAL\nFORMATS\nin 2026", 95, 520, 190, 180, 26, 800, '#FFFFFF', 'center', 3),
        shapeEl('c1_s2_card2', 'rectangle', 780, 480, 220, 260, '#F4F4F5', 2, {
          properties: { shapeType: 'rectangle', fill: '#F4F4F5', stroke: '#E4E4E7', strokeWidth: 2, borderRadius: 20 }
        }),
        textEl('c1_s2_card2_txt', "Stop wasting\ntime on\ncontent", 795, 530, 190, 160, 24, 800, '#18181B', 'center', 3),
        shapeEl('c1_s2_card3', 'rectangle', 80, 820, 220, 260, '#FFFFFF', 2, {
          properties: { shapeType: 'rectangle', fill: '#FFFFFF', stroke: '#E4E4E7', strokeWidth: 2, borderRadius: 20 }
        }),
        textEl('c1_s2_card3_txt', "CONTENT\nIS DEAD\n⚠️", 95, 870, 190, 160, 26, 800, '#DC2626', 'center', 3),
        shapeEl('c1_s2_card4', 'rectangle', 780, 820, 220, 260, '#FFFFFF', 2, {
          properties: { shapeType: 'rectangle', fill: '#FFFFFF', stroke: '#E4E4E7', strokeWidth: 2, borderRadius: 20 }
        }),
        textEl('c1_s2_card4_txt', "INSTAGRAM\nFORMATS\n🔥", 795, 870, 190, 160, 24, 800, '#FF2E93', 'center', 3)
      ]
    },
    // ── SLIDE 3: COMPARISON CARDS (ASPECT RATIOS) ──
    {
      id: 'c1_s3',
      order: 2,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#FFFFFF' },
      previewUrl: '/carousels/c1/slide3.png',
      elements: [
        textEl('c1_s3_h1', 'THE CAROUSEL', 80, 90, 620, 110, 84, 900, '#111111', 'left', 2),
        textEl('c1_s3_h2', 'SIZE', 700, 90, 300, 110, 84, 900, '#FF2E93', 'left', 2),
        shapeEl('c1_s3_c1', 'rectangle', 60, 260, 290, 420, '#E63946', 1, {
          properties: { shapeType: 'rectangle', fill: '#E63946', borderRadius: 16 }
        }),
        textEl('c1_s3_t1a', "1:1\n1080 x 1080\n\ndon't post this", 70, 370, 270, 220, 36, 900, '#FFFFFF', 'center', 2),
        textEl('c1_s3_sub1', "DON'T POST THIS", 60, 720, 290, 60, 26, 700, '#666666', 'center', 2),
        shapeEl('c1_s3_c2', 'rectangle', 395, 260, 290, 420, '#F77F00', 1, {
          properties: { shapeType: 'rectangle', fill: '#F77F00', borderRadius: 16 }
        }),
        textEl('c1_s3_t2a', "4:5\n1080 x 1350\n\nyou could use this", 405, 370, 270, 220, 36, 900, '#FFFFFF', 'center', 2),
        textEl('c1_s3_sub2', "USE IF YOU BOOST", 395, 720, 290, 60, 26, 700, '#666666', 'center', 2),
        shapeEl('c1_s3_c3', 'rectangle', 730, 260, 290, 420, '#2A9D8F', 1, {
          properties: { shapeType: 'rectangle', fill: '#2A9D8F', borderRadius: 16 }
        }),
        textEl('c1_s3_t3a', "3:4\n1080 x 1440\n\nthis is best", 740, 370, 270, 220, 36, 900, '#FFFFFF', 'center', 2),
        textEl('c1_s3_sub3', "THIS IS THE BEST", 730, 720, 290, 60, 26, 700, '#2A9D8F', 'center', 2)
      ]
    },
    // ── SLIDE 4: SAFE ZONE FRAME ──
    {
      id: 'c1_s4',
      order: 3,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#FFFFFF' },
      previewUrl: '/carousels/c1/slide4.png',
      elements: [
        textEl('c1_s4_h1', 'THE CAROUSEL', 80, 90, 560, 110, 80, 900, '#111111', 'left', 2),
        textEl('c1_s4_h2', 'SAFE ZONE', 640, 90, 360, 110, 80, 900, '#FF2E93', 'left', 2),
        shapeEl('c1_s4_frame', 'rectangle', 100, 260, 600, 760, '#E63946', 1, {
          properties: { shapeType: 'rectangle', fill: '#E63946', borderRadius: 20 }
        }),
        shapeEl('c1_s4_inner', 'rectangle', 150, 360, 500, 560, '#FFFFFF', 2, {
          properties: { shapeType: 'rectangle', fill: '#FFFFFF', borderRadius: 12 }
        }),
        textEl('c1_s4_title', 'The cover\nsafe zone', 180, 420, 440, 140, 48, 800, '#333333', 'left', 3),
        textEl('c1_s4_details', "180px top & bottom\n50px left\n120px right", 180, 590, 440, 180, 28, 600, '#555555', 'left', 3),
        textEl('c1_s4_note', "CAROUSELS WITH\nMUSIC APPEAR IN\nTHE REELS TAB 🎵", 740, 440, 280, 220, 30, 700, '#666666', 'left', 2)
      ]
    },
    // ── SLIDE 5: DESIGN & HIERARCHY ──
    {
      id: 'c1_s5',
      order: 4,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#FFFFFF' },
      previewUrl: '/carousels/c1/slide5.png',
      elements: [
        textEl('c1_s5_h1', 'THE CAROUSEL', 80, 90, 580, 110, 80, 900, '#111111', 'left', 2),
        textEl('c1_s5_h2', 'DESIGN', 660, 90, 340, 110, 80, 900, '#FF2E93', 'left', 2),
        shapeEl('c1_s5_b1', 'rectangle', 80, 260, 920, 200, '#FFFFFF', 1, {
          properties: { shapeType: 'rectangle', fill: '#FFFFFF', stroke: '#CCCCCC', strokeWidth: 2, borderRadius: 16 }
        }),
        textEl('c1_s5_t1', 'HEADLINE', 120, 290, 460, 70, 58, 900, '#111111', 'left', 2),
        textEl('c1_s5_t1sub', 'Headline font size 50pt or more', 120, 370, 700, 50, 28, 600, '#444444', 'left', 2),
        shapeEl('c1_s5_b2', 'rectangle', 80, 500, 920, 440, '#FFFFFF', 1, {
          properties: { shapeType: 'rectangle', fill: '#FFFFFF', stroke: '#CCCCCC', strokeWidth: 2, borderRadius: 16 }
        }),
        textEl('c1_s5_t2', 'Body copy', 120, 540, 460, 70, 52, 800, '#111111', 'left', 2),
        textEl('c1_s5_t2sub', 'Body copy size 14pt or more', 120, 620, 700, 50, 28, 600, '#444444', 'left', 2),
        textEl('c1_s5_note', "ZOOM HERE 🔍\nSmaller sizes may cause people to stop reading.\nSo be careful! Keep your content clear and bold.", 120, 740, 840, 140, 24, 500, '#666666', 'left', 2)
      ]
    }
  ]
};

export const SEED_TEMPLATES: Template[] = [
  TEMPLATE_AI_TOOLS,
  TEMPLATE_VIRAL_CAROUSELS
];

// ─── IN-MEMORY CACHE FOR LIVE SUPABASE TEMPLATES ──────────────────────────────
let cachedSupabaseTemplates: Template[] = [];

// ─── CUSTOM TEMPLATES STORAGE (LOCALSTORAGE) ──────────────────────────────────
const CUSTOM_TEMPLATES_KEY = 'swapp_custom_templates';

export function getCustomTemplates(): Template[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out any obsolete fake demo templates starting with tpl_
    return parsed.filter(t => !t.id.startsWith('tpl_'));
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

// ─── LIVE TEMPLATES SYNC (SUPABASE) ──────────────────────────────────────────

export async function fetchLivePublishedTemplates(): Promise<Template[]> {
  try {
    const { data: dbTemplates, error } = await supabase
      .from('templates')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (!error && dbTemplates && dbTemplates.length > 0) {
      const templateIds = dbTemplates.map(t => t.id);
      const { data: dbSlides } = await supabase
        .from('template_slides')
        .select('*')
        .in('template_id', templateIds)
        .order('slide_index', { ascending: true });

      const slidesByTemplate: Record<string, Slide[]> = {};
      (dbSlides || []).forEach(s => {
        if (!slidesByTemplate[s.template_id]) slidesByTemplate[s.template_id] = [];
        slidesByTemplate[s.template_id].push({
          id: s.id,
          order: s.slide_index,
          width: s.width || 1080,
          height: s.height || 1350,
          background: s.background || { type: 'solid', value: '#FFFFFF' },
          elements: s.elements || [],
          previewUrl: s.preview_url,
        });
      });

      cachedSupabaseTemplates = dbTemplates
        .filter(t => !t.id.startsWith('tpl_'))
        .map(t => ({
          id: t.id,
          name: t.name,
          description: t.description || '',
          category: t.category || 'Creator',
          categoryId: t.category_id,
          tags: t.tags || [],
          style: t.style,
          audience: t.audience,
          thumbnailUrl: t.thumbnail_url || (slidesByTemplate[t.id]?.[0]?.previewUrl ?? ''),
          aspectRatio: t.aspect_ratio || '4:5',
          width: t.width || 1080,
          height: t.height || 1350,
          slideCount: t.slide_count || slidesByTemplate[t.id]?.length || 1,
          isTrending: !!t.is_trending,
          isNew: !!t.is_new,
          sourceType: t.source_type || 'original',
          sourceUrl: t.source_url,
          sourcePlatform: t.source_platform,
          attributionRequired: !!t.attribution_required,
          licenseNotes: t.license_notes,
          status: 'published',
          useCount: t.use_count || 0,
          createdBy: t.created_by,
          createdAt: t.created_at || new Date().toISOString(),
          updatedAt: t.updated_at || new Date().toISOString(),
          publishedAt: t.published_at,
          slides: slidesByTemplate[t.id] && slidesByTemplate[t.id].length > 0
            ? slidesByTemplate[t.id]
            : (t.id === AI_TOOLS_ID ? TEMPLATE_AI_TOOLS.slides : TEMPLATE_VIRAL_CAROUSELS.slides),
        }));
    }
  } catch (err) {
    console.warn('Live templates fetch failed, using seed & local templates:', err);
  }

  return getPublishedTemplates();
}

// ─── QUERY HELPERS ────────────────────────────────────────────────────────────

export const getAllTemplates = (): Template[] => {
  const custom = getCustomTemplates();
  const customIds = new Set(custom.map(t => t.id));

  const result: Template[] = [...custom];

  for (const t of cachedSupabaseTemplates) {
    if (!customIds.has(t.id)) {
      result.push(t);
      customIds.add(t.id);
    }
  }

  for (const t of SEED_TEMPLATES) {
    if (!customIds.has(t.id)) {
      result.push(t);
      customIds.add(t.id);
    }
  }

  // Final check: filter out any fake tpl_ items
  return result.filter(t => !t.id.startsWith('tpl_'));
};

export const getPublishedTemplates = (): Template[] =>
  getAllTemplates().filter(t => t.status === 'published');

export const getTemplateById = (id: string): Template | undefined => {
  if (!id) return undefined;
  const all = getAllTemplates();

  // 1. Direct ID match
  const found = all.find(t => t.id === id);
  if (found) return found;

  // 2. Aliases for c1 & AI Tools
  if (id === 'c1' || id === VIRAL_CAROUSELS_ID) {
    return all.find(t => t.id === VIRAL_CAROUSELS_ID) || TEMPLATE_VIRAL_CAROUSELS;
  }
  if (id === 'ai-tools' || id === AI_TOOLS_ID) {
    return all.find(t => t.id === AI_TOOLS_ID) || TEMPLATE_AI_TOOLS;
  }

  // 3. Name match fallback (case insensitive)
  const norm = id.trim().toLowerCase();
  return all.find(t => t.name.toLowerCase() === norm);
};

export async function getTemplateByIdAsync(id: string): Promise<Template | undefined> {
  const existing = getTemplateById(id);
  if (existing) return existing;

  // Try fetching live templates from Supabase
  await fetchLivePublishedTemplates();
  return getTemplateById(id);
}

export const getTemplatesByCategory = (category: string): Template[] => {
  const pub = getPublishedTemplates();
  if (category === 'All') return pub;
  if (category === 'Trending') return pub.filter(t => t.isTrending);
  if (category === 'New') return pub.filter(t => t.isNew);
  return pub.filter(t => t.category.toLowerCase() === category.toLowerCase());
};
