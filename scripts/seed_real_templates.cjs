const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const adminSupabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const textEl = (id, text, x, y, w, h, fontSize, fontWeight, color, alignment = 'left', zIndex = 2, extra = {}) => ({
  id, type: 'text', x, y, width: w, height: h,
  rotation: 0, opacity: 1, zIndex,
  locked: false, visible: true,
  properties: {
    text, fontFamily: 'Inter', fontSize, fontWeight,
    color, alignment, letterSpacing: 0, lineHeight: 1.25, textCase: 'none',
    ...(extra.properties || {})
  },
  ...extra
});

const shapeEl = (id, shapeType, x, y, w, h, fill, zIndex = 1, extra = {}) => ({
  id, type: 'shape', x, y, width: w, height: h,
  rotation: 0, opacity: 1, zIndex,
  locked: false, visible: true,
  properties: { shapeType, fill, ...(extra.properties || {}) },
  ...extra
});

const imgEl = (id, src, x, y, w, h, zIndex = 1, extra = {}) => ({
  id, type: 'image', x, y, width: w, height: h,
  rotation: 0, opacity: 1, zIndex,
  locked: false, visible: true,
  properties: { src, alt: '', objectFit: 'contain', ...(extra.properties || {}) },
  ...extra
});

async function main() {
  console.log('--- SEEDING REAL TEMPLATES (100% Editable Slides) ---');

  const c1Id = 'c1000000-0000-0000-0000-000000000001';
  await adminSupabase.from('templates').upsert({
    id: c1Id,
    name: 'The Art of Viral Carousels',
    description: 'High-performing viral carousel structure by @marketingharry. Proven hook, high retention and save rate.',
    category: 'Marketing',
    tags: ['marketing', 'viral', 'instagram', 'linkedin', 'growth', 'creator'],
    thumbnail_url: '/carousels/c1/slide1.png',
    aspect_ratio: '4:5',
    width: 1080,
    height: 1350,
    slide_count: 5,
    status: 'published',
    is_trending: true,
    is_new: false,
    source_type: 'original',
    source_platform: 'instagram'
  });

  await adminSupabase.from('template_slides').delete().eq('template_id', c1Id);

  const c1Slides = [
    // Slide 1: Hook / Hero
    {
      template_id: c1Id,
      slide_index: 0,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#3B82C4' },
      preview_url: '/carousels/c1/slide1.png',
      elements: [
        imgEl('c1_s1_statue', '/carousels/c1/statue_hero_clean.jpg', 60, 420, 960, 930, 1),
        textEl('c1_s1_eyebrow', 'Social Media Marketing | @marketingharry', 140, 50, 800, 40, 22, 700, 'rgba(255,255,255,0.9)', 'center', 2),
        textEl('c1_s1_the', 'THE', 80, 130, 260, 120, 105, 900, '#FFFFFF', 'left', 2),
        textEl('c1_s1_art', 'ART', 340, 120, 280, 130, 115, 900, '#FF1493', 'center', 2),
        textEl('c1_s1_ofviral', 'OF VIRAL', 620, 130, 380, 120, 85, 900, '#FFFFFF', 'right', 2),
        textEl('c1_s1_carousels', 'CAROUSELS', 60, 250, 960, 160, 125, 900, '#FFFFFF', 'center', 2)
      ]
    },
    // Slide 2: Proof & Subhook
    {
      template_id: c1Id,
      slide_index: 1,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#FFFFFF' },
      preview_url: '/carousels/c1/slide2.png',
      elements: [
        textEl('c1_s2_h1', "I've created over", 80, 80, 920, 70, 52, 700, '#111111', 'center', 2),
        textEl('c1_s2_h2', "2500+ carousels", 80, 150, 920, 90, 72, 900, '#FF2E93', 'center', 2),
        textEl('c1_s2_sub', "Here's everything I wish\nI knew before I started 👉", 80, 260, 920, 120, 42, 600, '#222222', 'center', 2),
        imgEl('c1_s2_creator', '/carousels/c1/creator_hero_clean.jpg', 220, 480, 640, 870, 1),
        shapeEl('c1_s2_card1', 'rectangle', 80, 480, 220, 260, '#18181B', 2, { properties: { shapeType: 'rectangle', fill: '#18181B', borderRadius: 20 } }),
        textEl('c1_s2_card1_txt', "7 VIRAL\nFORMATS\nin 2026", 95, 520, 190, 180, 26, 800, '#FFFFFF', 'center', 3),
        shapeEl('c1_s2_card2', 'rectangle', 780, 480, 220, 260, '#F4F4F5', 2, { properties: { shapeType: 'rectangle', fill: '#F4F4F5', stroke: '#E4E4E7', strokeWidth: 2, borderRadius: 20 } }),
        textEl('c1_s2_card2_txt', "Stop wasting\ntime on\ncontent", 795, 530, 190, 160, 24, 800, '#18181B', 'center', 3),
        shapeEl('c1_s2_card3', 'rectangle', 80, 820, 220, 260, '#FFFFFF', 2, { properties: { shapeType: 'rectangle', fill: '#FFFFFF', stroke: '#E4E4E7', strokeWidth: 2, borderRadius: 20 } }),
        textEl('c1_s2_card3_txt', "CONTENT\nIS DEAD\n⚠️", 95, 870, 190, 160, 26, 800, '#DC2626', 'center', 3),
        shapeEl('c1_s2_card4', 'rectangle', 780, 820, 220, 260, '#FFFFFF', 2, { properties: { shapeType: 'rectangle', fill: '#FFFFFF', stroke: '#E4E4E7', strokeWidth: 2, borderRadius: 20 } }),
        textEl('c1_s2_card4_txt', "INSTAGRAM\nFORMATS\n🔥", 795, 870, 190, 160, 24, 800, '#FF2E93', 'center', 3)
      ]
    },
    // Slide 3: Comparison Cards
    {
      template_id: c1Id,
      slide_index: 2,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#FFFFFF' },
      preview_url: '/carousels/c1/slide3.png',
      elements: [
        textEl('c1_s3_h1', 'THE CAROUSEL', 80, 90, 620, 110, 84, 900, '#111111', 'left', 2),
        textEl('c1_s3_h2', 'SIZE', 700, 90, 300, 110, 84, 900, '#FF2E93', 'left', 2),
        shapeEl('c1_s3_c1', 'rectangle', 60, 260, 290, 420, '#E63946', 1, { properties: { shapeType: 'rectangle', fill: '#E63946', borderRadius: 16 } }),
        textEl('c1_s3_t1a', "1:1\n1080 x 1080\n\ndon't post this", 70, 370, 270, 220, 36, 900, '#FFFFFF', 'center', 2),
        textEl('c1_s3_sub1', "DON'T POST THIS", 60, 720, 290, 60, 26, 700, '#666666', 'center', 2),
        shapeEl('c1_s3_c2', 'rectangle', 395, 260, 290, 420, '#F77F00', 1, { properties: { shapeType: 'rectangle', fill: '#F77F00', borderRadius: 16 } }),
        textEl('c1_s3_t2a', "4:5\n1080 x 1350\n\nyou could use this", 405, 370, 270, 220, 36, 900, '#FFFFFF', 'center', 2),
        textEl('c1_s3_sub2', "USE IF YOU BOOST", 395, 720, 290, 60, 26, 700, '#666666', 'center', 2),
        shapeEl('c1_s3_c3', 'rectangle', 730, 260, 290, 420, '#2A9D8F', 1, { properties: { shapeType: 'rectangle', fill: '#2A9D8F', borderRadius: 16 } }),
        textEl('c1_s3_t3a', "3:4\n1080 x 1440\n\nthis is best", 740, 370, 270, 220, 36, 900, '#FFFFFF', 'center', 2),
        textEl('c1_s3_sub3', "THIS IS THE BEST", 730, 720, 290, 60, 26, 700, '#2A9D8F', 'center', 2)
      ]
    },
    // Slide 4: Safe Zone Frame
    {
      template_id: c1Id,
      slide_index: 3,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#FFFFFF' },
      preview_url: '/carousels/c1/slide4.png',
      elements: [
        textEl('c1_s4_h1', 'THE CAROUSEL', 80, 90, 560, 110, 80, 900, '#111111', 'left', 2),
        textEl('c1_s4_h2', 'SAFE ZONE', 640, 90, 360, 110, 80, 900, '#FF2E93', 'left', 2),
        shapeEl('c1_s4_frame', 'rectangle', 100, 260, 600, 760, '#E63946', 1, { properties: { shapeType: 'rectangle', fill: '#E63946', borderRadius: 20 } }),
        shapeEl('c1_s4_inner', 'rectangle', 150, 360, 500, 560, '#FFFFFF', 2, { properties: { shapeType: 'rectangle', fill: '#FFFFFF', borderRadius: 12 } }),
        textEl('c1_s4_title', 'The cover\nsafe zone', 180, 420, 440, 140, 48, 800, '#333333', 'left', 3),
        textEl('c1_s4_details', "180px top & bottom\n50px left\n120px right", 180, 590, 440, 180, 28, 600, '#555555', 'left', 3),
        textEl('c1_s4_note', "CAROUSELS WITH\nMUSIC APPEAR IN\nTHE REELS TAB 🎵", 740, 440, 280, 220, 30, 700, '#666666', 'left', 2)
      ]
    },
    // Slide 5: Design & Hierarchy
    {
      template_id: c1Id,
      slide_index: 4,
      width: 1080,
      height: 1350,
      background: { type: 'solid', value: '#FFFFFF' },
      preview_url: '/carousels/c1/slide5.png',
      elements: [
        textEl('c1_s5_h1', 'THE CAROUSEL', 80, 90, 580, 110, 80, 900, '#111111', 'left', 2),
        textEl('c1_s5_h2', 'DESIGN', 660, 90, 340, 110, 80, 900, '#FF2E93', 'left', 2),
        shapeEl('c1_s5_b1', 'rectangle', 80, 260, 920, 200, '#FFFFFF', 1, { properties: { shapeType: 'rectangle', fill: '#FFFFFF', stroke: '#CCCCCC', strokeWidth: 2, borderRadius: 16 } }),
        textEl('c1_s5_t1', 'HEADLINE', 120, 290, 460, 70, 58, 900, '#111111', 'left', 2),
        textEl('c1_s5_t1sub', 'Headline font size 50pt or more', 120, 370, 700, 50, 28, 600, '#444444', 'left', 2),
        shapeEl('c1_s5_b2', 'rectangle', 80, 500, 920, 440, '#FFFFFF', 1, { properties: { shapeType: 'rectangle', fill: '#FFFFFF', stroke: '#CCCCCC', strokeWidth: 2, borderRadius: 16 } }),
        textEl('c1_s5_t2', 'Body copy', 120, 540, 460, 70, 52, 800, '#111111', 'left', 2),
        textEl('c1_s5_t2sub', 'Body copy size 14pt or more', 120, 620, 700, 50, 28, 600, '#444444', 'left', 2),
        textEl('c1_s5_note', "ZOOM HERE 🔍\nSmaller sizes may cause people to stop reading.\nSo be careful! Keep your content clear and bold.", 120, 740, 840, 140, 24, 500, '#666666', 'left', 2)
      ]
    }
  ];

  await adminSupabase.from('template_slides').insert(c1Slides);
  console.log('c1 seeded with 5 genuinely editable slides!');

  // Verify
  const { data: slides } = await adminSupabase.from('template_slides').select('slide_index, elements').eq('template_id', c1Id);
  console.log('Seeded c1 slide element counts:', slides.map(s => ({ slide: s.slide_index, count: s.elements.length })));
}

main().catch(console.error);
