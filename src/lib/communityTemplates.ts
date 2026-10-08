import { v4 as uuidv4 } from 'uuid';
import { supabase, STORAGE_BUCKETS, uploadFile, deleteFile } from './supabase';
import { renderSlideToCanvas } from './exportSlide';
import { mapTemplateRowToTemplate } from './templates';
import {
  Template,
  TemplateVisibility,
  TemplateCategory,
  Project,
  Slide,
  ImageProperties,
} from '../types';

// ─── PUBLISH ─────────────────────────────────────────────────────────────────

export interface PublishTemplateOptions {
  project: Project;
  title: string;
  description?: string;
  category: TemplateCategory;
  visibility: TemplateVisibility;
  userId: string;
  creatorName?: string;
}

export type PublishStage = 'thumbnail' | 'saving';

function deriveAspectRatio(w: number, h: number): '4:5' | '1:1' | '3:4' {
  const r = w / h;
  if (Math.abs(r - 1) < 0.06) return '1:1';
  if (Math.abs(r - 0.75) < 0.06) return '3:4';
  return '4:5';
}

/** Remap slide + element ids so the published template never collides with the source project. */
function remapSlides(slides: Slide[]): Slide[] {
  return slides.map((s, i) => ({
    ...s,
    id: uuidv4(),
    order: i,
    background: { ...s.background },
    elements: s.elements.map(el => ({
      ...el,
      id: uuidv4(),
      properties: { ...el.properties },
    })),
  }));
}

/**
 * Count image elements whose src is a blob: URL (fresh uploads not yet persisted).
 * Publishing those would bake dead URLs into the template, so we refuse instead.
 */
function countUnpersistedImages(slides: Slide[]): number {
  let count = 0;
  for (const s of slides) {
    for (const el of s.elements) {
      if (el.type === 'image') {
        const src = (el.properties as ImageProperties)?.src || '';
        if (typeof src === 'string' && src.startsWith('blob:')) count++;
      }
    }
  }
  return count;
}

/**
 * Publish a user's project as a community template.
 * NOTE: requires the community-gallery SQL migration (user_id / visibility /
 * creator_name columns + RLS policies) to have been run in Supabase first.
 */
export async function publishTemplateFromProject(
  opts: PublishTemplateOptions,
  onProgress?: (stage: PublishStage) => void
): Promise<{ id: string }> {
  const { project, title, description, category, visibility, userId, creatorName } = opts;

  if (!userId) throw new Error('You must be signed in to publish a template.');
  if (!title.trim()) throw new Error('Please give your template a title.');
  if (!project.slides || project.slides.length === 0) {
    throw new Error('This project has no slides to publish.');
  }

  const unpersisted = countUnpersistedImages(project.slides);
  if (unpersisted > 0) {
    throw new Error(
      'Some images in this design have not finished uploading yet. Please save the project and try again in a moment.'
    );
  }

  const templateId = uuidv4();
  const slides = remapSlides(project.slides);
  const first = slides[0];
  const now = new Date().toISOString();

  // 1. Thumbnail rendered from the first slide (downscaled to keep storage light).
  //    Note: renderSlideToCanvas skips icon/logo elements — they still work in the editor.
  onProgress?.('thumbnail');
  let thumbnailUrl = '';
  try {
    const canvas = await renderSlideToCanvas(first);
    const small = document.createElement('canvas');
    small.width = 540;
    small.height = 675;
    const ctx = small.getContext('2d');
    if (ctx) ctx.drawImage(canvas, 0, 0, small.width, small.height);
    const blob: Blob | null = await new Promise(res => small.toBlob(res, 'image/png'));
    if (blob) {
      const file = new File([blob], 'thumb.png', { type: 'image/png' });
      const { publicUrl } = await uploadFile(
        STORAGE_BUCKETS.THUMBNAILS,
        `community/${templateId}/thumb.png`,
        file
      );
      thumbnailUrl = publicUrl;
    }
  } catch (err) {
    console.warn('Community template thumbnail failed, continuing without:', err);
  }

  // 2. Template row
  onProgress?.('saving');
  const { error: tplError } = await supabase.from('templates').insert({
    id: templateId,
    name: title.trim().slice(0, 80),
    description: (description || '').trim().slice(0, 500),
    category,
    tags: [],
    thumbnail_url: thumbnailUrl || null,
    aspect_ratio: deriveAspectRatio(first.width, first.height),
    width: first.width,
    height: first.height,
    slide_count: slides.length,
    status: 'published',
    is_trending: false,
    is_new: true,
    source_type: 'original',
    attribution_required: false,
    use_count: 0,
    user_id: userId,
    visibility,
    creator_name: creatorName || null,
    published_at: now,
  });
  if (tplError) throw tplError;

  // 3. Slides
  const slideRows = slides.map((s, i) => ({
    id: s.id,
    template_id: templateId,
    slide_index: i,
    width: s.width,
    height: s.height,
    background: s.background,
    elements: s.elements,
    preview_url: i === 0 ? thumbnailUrl || null : null,
  }));
  const { error: slidesError } = await supabase.from('template_slides').insert(slideRows);
  if (slidesError) {
    // Roll back the template row so we don't leave an orphan
    await supabase.from('templates').delete().eq('id', templateId);
    throw slidesError;
  }

  return { id: templateId };
}

// ─── FETCH ───────────────────────────────────────────────────────────────────

async function fetchTemplatesWithSlides(query: PromiseLike<{ data: any; error: any }>): Promise<Template[]> {
  const { data: dbTemplates, error } = await query;
  if (error) throw error;
  if (!dbTemplates || dbTemplates.length === 0) return [];

  const templateIds = dbTemplates.map((t: any) => t.id);
  const { data: dbSlides, error: slidesError } = await supabase
    .from('template_slides')
    .select('*')
    .in('template_id', templateIds)
    .order('slide_index', { ascending: true });
  if (slidesError) throw slidesError;

  const slidesByTemplate: Record<string, Slide[]> = {};
  (dbSlides || []).forEach((s: any) => {
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

  return dbTemplates.map((t: any) => mapTemplateRowToTemplate(t, slidesByTemplate));
}

/** Public community templates (published + public + has an owner), newest first. */
export async function fetchCommunityTemplates(): Promise<Template[]> {
  return fetchTemplatesWithSlides(
    supabase
      .from('templates')
      .select('*')
      .eq('status', 'published')
      .eq('visibility', 'public')
      .not('user_id', 'is', null)
      .order('created_at', { ascending: false })
  );
}

/** All templates owned by a user (any visibility/status), newest first. */
export async function fetchMyTemplates(userId: string): Promise<Template[]> {
  if (!userId) return [];
  return fetchTemplatesWithSlides(
    supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  );
}

// ─── OWNER ACTIONS ───────────────────────────────────────────────────────────

export async function updateTemplateVisibility(
  id: string,
  visibility: TemplateVisibility,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('templates')
    .update({ visibility })
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function deleteCommunityTemplate(id: string, userId: string): Promise<void> {
  // Slides first (FK), then the template row, then the thumbnail file
  const { error: slidesError } = await supabase
    .from('template_slides')
    .delete()
    .eq('template_id', id);
  if (slidesError) throw slidesError;

  const { error: tplError } = await supabase
    .from('templates')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (tplError) throw tplError;

  try {
    await deleteFile(STORAGE_BUCKETS.THUMBNAILS, `community/${id}/thumb.png`);
  } catch (err) {
    console.warn('Failed to delete community template thumbnail:', err);
  }
}
