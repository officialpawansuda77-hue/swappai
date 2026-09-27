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

async function main() {
  console.log('--- SEEDING REAL TEMPLATES (AI Tools & The Art of Viral Carousels) ---');

  // 1. Template: c1 - The Art of Viral Carousels
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
  const c1Slides = [1, 2, 3, 4, 5].map((num, i) => ({
    template_id: c1Id,
    slide_index: i,
    width: 1080,
    height: 1350,
    background: { type: 'image', value: `/carousels/c1/slide${num}.png` },
    preview_url: `/carousels/c1/slide${num}.png`,
    elements: [
      {
        id: `c1_img_${num}`,
        type: 'image',
        x: 0, y: 0, width: 1080, height: 1350,
        rotation: 0, opacity: 1, zIndex: 1,
        properties: { src: `/carousels/c1/slide${num}.png`, objectFit: 'cover' }
      }
    ]
  }));
  await adminSupabase.from('template_slides').insert(c1Slides);
  console.log('c1 (The Art of Viral Carousels) seeded with 5 slides.');

  // 2. Ensure AI Tools template is published with slides
  const { data: aiTemplates } = await adminSupabase.from('templates').select('*').ilike('name', '%AI Tools%');
  if (aiTemplates && aiTemplates.length > 0) {
    for (const t of aiTemplates) {
      await adminSupabase.from('templates').update({
        status: 'published',
        thumbnail_url: '/carousels/c1/slide1.png'
      }).eq('id', t.id);
      console.log('Updated AI Tools template status to published:', t.id);
    }
  }

  // Verify all published templates
  const { data: allPublished } = await adminSupabase.from('templates').select('id, name, status, category');
  console.log('Current Supabase Templates:', allPublished);
}

main().catch(console.error);
