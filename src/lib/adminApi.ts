import { supabase, uploadFile, STORAGE_BUCKETS } from './supabase';
import { Template, TemplateFormData, AdminStats, Slide } from '../types';
import { getCustomTemplates, saveCustomTemplate, deleteCustomTemplate, getTemplateById, SEED_TEMPLATES } from './templates';
import { v4 as uuidv4 } from 'uuid';

// ---- STATS -------------------------------------------------------------------

export async function fetchAdminStats(): Promise<AdminStats> {
  try {
    const { data, error } = await supabase.from('template_stats').select('*').single();
    if (error || !data) throw error;
    return {
      total: Number(data.total) || 0,
      published: Number(data.published) || 0,
      drafts: Number(data.drafts) || 0,
      archived: Number(data.archived) || 0,
      totalUses: Number(data.total_uses) || 0,
      addedThisMonth: Number(data.added_this_month) || 0,
    };
  } catch {
    return { total: 0, published: 0, drafts: 0, archived: 0, totalUses: 0, addedThisMonth: 0 };
  }
}

// ---- TEMPLATES LIST ---------------------------------------------------------

export interface FetchTemplatesOptions {
  status?: 'draft' | 'published' | 'archived' | 'all';
  category?: string;
  search?: string;
  page?: number;
  perPage?: number;
  orderBy?: 'created_at' | 'updated_at' | 'use_count' | 'name';
  order?: 'asc' | 'desc';
}

export async function fetchTemplatesAdmin(opts: FetchTemplatesOptions = {}): Promise<Template[]> {
  const custom = getCustomTemplates();
  let supabaseTemplates: Template[] = [];

  try {
    let query = supabase.from('templates').select(`
      id, name, description, category, category_id, tags, style, audience,
      thumbnail_url, aspect_ratio, width, height, slide_count,
      is_trending, is_new, source_type, source_url, source_platform,
      attribution_required, license_notes, status, use_count,
      created_by, created_at, updated_at, published_at
    `);

    if (opts.status && opts.status !== 'all') {
      query = query.eq('status', opts.status);
    }
    if (opts.category && opts.category !== 'All') {
      query = query.eq('category', opts.category);
    }
    if (opts.search) {
      query = query.ilike('name', `%${opts.search}%`);
    }

    const orderCol = opts.orderBy || 'created_at';
    const orderAsc = opts.order === 'asc';
    query = query.order(orderCol, { ascending: orderAsc });

    const from = ((opts.page || 1) - 1) * (opts.perPage || 50);
    const to = from + (opts.perPage || 50) - 1;
    query = query.range(from, to);

    const { data, error } = await query;
    if (!error && data) {
      supabaseTemplates = data.map(mapTemplateRow);
    }
  } catch {
    // Supabase unavailable or table empty
  }

  // Combine custom templates + supabase templates (or fallback to SEED_TEMPLATES)
  const basePool = supabaseTemplates.length > 0 ? supabaseTemplates : SEED_TEMPLATES;
  const customIds = new Set(custom.map(t => t.id));
  const merged = [...custom, ...basePool.filter(t => !customIds.has(t.id))];

  // Apply filters
  let filtered = merged;
  if (opts.status && opts.status !== 'all') {
    filtered = filtered.filter(t => t.status === opts.status);
  }
  if (opts.category && opts.category !== 'All') {
    filtered = filtered.filter(t => t.category === opts.category);
  }
  if (opts.search) {
    const q = opts.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  return filtered;
}

// ---- SINGLE TEMPLATE --------------------------------------------------------

export async function fetchTemplateAdmin(id: string): Promise<Template | null> {
  const custom = getCustomTemplates();
  const foundCustom = custom.find(t => t.id === id);
  if (foundCustom) return foundCustom;

  try {
    const { data: tpl, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && tpl) {
      const { data: slides } = await supabase
        .from('template_slides')
        .select('*')
        .eq('template_id', id)
        .order('slide_index', { ascending: true });

      const mappedSlides: Slide[] = (slides || []).map(s => ({
        id: s.id,
        order: s.slide_index,
        width: s.width,
        height: s.height,
        background: s.background || { type: 'solid', value: '#FFFFFF' },
        elements: s.elements || [],
        previewUrl: s.preview_url,
      }));

      return { ...mapTemplateRow(tpl), slides: mappedSlides };
    }
  } catch {}

  return getTemplateById(id) || null;
}

// ---- CREATE TEMPLATE --------------------------------------------------------

export async function createTemplateDraft(
  formData: TemplateFormData,
  slides: Array<{ publicUrl: string; storagePath: string; width?: number; height?: number }>,
  thumbnailUrl?: string,
  userId?: string
): Promise<{ id: string } | null> {
  const templateId = uuidv4();

  // Create full local Template object with slides
  const templateSlides: Slide[] = slides.map((s, i) => ({
    id: `${templateId}_s${i + 1}`,
    order: i,
    width: s.width || 1080,
    height: s.height || 1350,
    background: { type: 'image', value: s.publicUrl },
    elements: [],
    previewUrl: s.publicUrl,
  }));

  const localTemplate: Template = {
    id: templateId,
    name: formData.name,
    description: formData.description || '',
    category: formData.category,
    tags: formData.tags || [],
    style: formData.style,
    audience: formData.audience,
    thumbnailUrl: thumbnailUrl || (slides[0]?.publicUrl ?? ''),
    aspectRatio: '4:5',
    width: 1080,
    height: 1350,
    slideCount: templateSlides.length,
    slides: templateSlides,
    isTrending: formData.isTrending || false,
    isNew: formData.isNew !== undefined ? formData.isNew : true,
    sourceType: formData.sourceType,
    sourceUrl: formData.sourceUrl,
    attributionRequired: formData.attributionRequired,
    licenseNotes: formData.licenseNotes,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveCustomTemplate(localTemplate);

  // Sync to Supabase in background / try-catch
  try {
    await supabase.from('templates').insert({
      id: templateId,
      name: formData.name,
      description: formData.description || '',
      category: formData.category,
      tags: formData.tags,
      style: formData.style,
      audience: formData.audience,
      thumbnail_url: thumbnailUrl || (slides[0]?.publicUrl ?? ''),
      aspect_ratio: '4:5',
      width: 1080,
      height: 1350,
      slide_count: slides.length,
      is_trending: formData.isTrending,
      is_new: formData.isNew,
      source_type: formData.sourceType,
      source_url: formData.sourceUrl,
      source_platform: formData.sourcePlatform,
      attribution_required: formData.attributionRequired,
      license_notes: formData.licenseNotes,
      status: 'draft',
      use_count: 0,
      created_by: userId,
    });

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const slideId = `${templateId}_s${i + 1}`;
      await supabase.from('template_slides').insert({
        id: slideId,
        template_id: templateId,
        slide_index: i,
        width: slide.width || 1080,
        height: slide.height || 1350,
        background: { type: 'image', value: slide.publicUrl },
        elements: [],
        preview_url: slide.publicUrl,
      });
    }
  } catch (err) {
    console.warn('Supabase template insert skipped/error:', err);
  }

  return { id: templateId };
}

// ---- UPDATE TEMPLATE --------------------------------------------------------

export async function updateTemplate(
  id: string,
  updates: Partial<TemplateFormData> & { thumbnailUrl?: string; slideCount?: number }
): Promise<boolean> {
  const custom = getCustomTemplates();
  const found = custom.find(t => t.id === id);
  if (found) {
    const updated: Template = {
      ...found,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveCustomTemplate(updated);
  }

  try {
    await supabase.from('templates').update({
      name: updates.name,
      description: updates.description,
      category: updates.category,
      tags: updates.tags,
      style: updates.style,
      audience: updates.audience,
      thumbnail_url: updates.thumbnailUrl,
      source_type: updates.sourceType,
      source_url: updates.sourceUrl,
      attribution_required: updates.attributionRequired,
      license_notes: updates.licenseNotes,
      is_trending: updates.isTrending,
      is_new: updates.isNew,
      slide_count: updates.slideCount,
      updated_at: new Date().toISOString(),
    }).eq('id', id);
  } catch {}

  return true;
}

// ---- PUBLISH ----------------------------------------------------------------

export async function publishTemplate(id: string, userId?: string): Promise<boolean> {
  const custom = getCustomTemplates();
  const found = custom.find(t => t.id === id);
  if (found) {
    found.status = 'published';
    found.publishedAt = new Date().toISOString();
    found.updatedAt = new Date().toISOString();
    saveCustomTemplate(found);
  }

  try {
    await supabase.from('templates').update({
      status: 'published',
      published_at: new Date().toISOString(),
      published_by: userId,
      updated_at: new Date().toISOString(),
    }).eq('id', id);
  } catch {}

  return true;
}

// ---- UNPUBLISH --------------------------------------------------------------

export async function unpublishTemplate(id: string): Promise<boolean> {
  const custom = getCustomTemplates();
  const found = custom.find(t => t.id === id);
  if (found) {
    found.status = 'draft';
    found.updatedAt = new Date().toISOString();
    saveCustomTemplate(found);
  }

  try {
    await supabase.from('templates').update({
      status: 'draft',
      updated_at: new Date().toISOString(),
    }).eq('id', id);
  } catch {}

  return true;
}

// ---- ARCHIVE ----------------------------------------------------------------

export async function archiveTemplate(id: string): Promise<boolean> {
  const custom = getCustomTemplates();
  const found = custom.find(t => t.id === id);
  if (found) {
    found.status = 'archived';
    found.updatedAt = new Date().toISOString();
    saveCustomTemplate(found);
  }

  try {
    await supabase.from('templates').update({
      status: 'archived',
      updated_at: new Date().toISOString(),
    }).eq('id', id);
  } catch {}

  return true;
}

// ---- RESTORE ----------------------------------------------------------------

export async function restoreTemplate(id: string): Promise<boolean> {
  const custom = getCustomTemplates();
  const found = custom.find(t => t.id === id);
  if (found) {
    found.status = 'draft';
    found.updatedAt = new Date().toISOString();
    saveCustomTemplate(found);
  }

  try {
    await supabase.from('templates').update({
      status: 'draft',
      updated_at: new Date().toISOString(),
    }).eq('id', id);
  } catch {}

  return true;
}

// ---- DUPLICATE --------------------------------------------------------------

export async function duplicateTemplate(id: string, userId?: string): Promise<{ id: string } | null> {
  const original = await fetchTemplateAdmin(id);
  if (!original) return null;

  const newId = uuidv4();
  const duplicated: Template = {
    ...original,
    id: newId,
    name: `${original.name} — Copy`,
    isTrending: false,
    isNew: true,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveCustomTemplate(duplicated);

  try {
    await supabase.from('templates').insert({
      id: newId,
      name: `${original.name} — Copy`,
      description: original.description,
      category: original.category,
      tags: original.tags,
      style: original.style,
      audience: original.audience,
      thumbnail_url: original.thumbnailUrl,
      aspect_ratio: original.aspectRatio,
      width: original.width,
      height: original.height,
      slide_count: original.slideCount,
      is_trending: false,
      is_new: true,
      source_type: original.sourceType,
      source_url: original.sourceUrl,
      attribution_required: original.attributionRequired,
      license_notes: original.licenseNotes,
      status: 'draft',
      use_count: 0,
      created_by: userId,
    });
  } catch {}

  return { id: newId };
}

// ---- DELETE -----------------------------------------------------------------

export async function deleteTemplate(id: string): Promise<boolean> {
  deleteCustomTemplate(id);

  try {
    await supabase.from('templates').delete().eq('id', id);
  } catch {}

  return true;
}

// ---- UPLOAD SLIDE IMAGE -----------------------------------------------------

export async function uploadSlideImage(
  templateId: string,
  slideIndex: number,
  file: File,
  onProgress?: (status: string) => void
): Promise<{ publicUrl: string; storagePath: string } | null> {
  try {
    onProgress?.('uploading');
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${templateId}/original/slide-${String(slideIndex + 1).padStart(2, '0')}.${ext}`;

    const result = await uploadFile(STORAGE_BUCKETS.CAROUSEL_TEMPLATES, path, file);

    onProgress?.('done');
    return result;
  } catch (err) {
    onProgress?.('error');
    console.error('Upload error:', err);
    return null;
  }
}

// ---- TRACK USAGE ------------------------------------------------------------

export async function trackTemplateUsage(templateId: string, userId?: string, projectId?: string) {
  try {
    await supabase.from('template_usage').insert({
      template_id: templateId,
      user_id: userId,
      project_id: projectId,
    });
    // Increment use_count
    await supabase.rpc('increment_use_count', { template_id_param: templateId });
  } catch {
    // Silent fail — usage tracking is non-critical
  }
}

// ---- MAP ROW TO TYPE --------------------------------------------------------

function mapTemplateRow(row: Record<string, unknown>): Template {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) || '',
    category: (row.category as Template['category']) || 'AI',
    categoryId: row.category_id as string | undefined,
    tags: (row.tags as string[]) || [],
    style: row.style as Template['style'],
    audience: row.audience as Template['audience'],
    thumbnailUrl: (row.thumbnail_url as string) || '',
    aspectRatio: ((row.aspect_ratio as string) || '4:5') as Template['aspectRatio'],
    width: (row.width as number) || 1080,
    height: (row.height as number) || 1350,
    slideCount: (row.slide_count as number) || 0,
    isTrending: (row.is_trending as boolean) || false,
    isNew: (row.is_new as boolean) || false,
    sourceType: (row.source_type as Template['sourceType']) || 'original',
    sourceUrl: row.source_url as string | undefined,
    sourcePlatform: row.source_platform as string | undefined,
    attributionRequired: (row.attribution_required as boolean) || false,
    licenseNotes: row.license_notes as string | undefined,
    status: (row.status as Template['status']) || 'draft',
    useCount: (row.use_count as number) || 0,
    createdBy: row.created_by as string | undefined,
    createdAt: (row.created_at as string) || new Date().toISOString(),
    updatedAt: (row.updated_at as string) || new Date().toISOString(),
    publishedAt: row.published_at as string | undefined,
    slides: [],
  };
}

// ---- BULK ACTIONS -----------------------------------------------------------

export async function bulkPublish(ids: string[]): Promise<boolean> {
  try {
    const { error } = await supabase.from('templates')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .in('id', ids);
    return !error;
  } catch { return false; }
}

export async function bulkArchive(ids: string[]): Promise<boolean> {
  try {
    const { error } = await supabase.from('templates')
      .update({ status: 'archived' })
      .in('id', ids);
    return !error;
  } catch { return false; }
}

export async function bulkDelete(ids: string[]): Promise<boolean> {
  try {
    const { error } = await supabase.from('templates').delete().in('id', ids);
    return !error;
  } catch { return false; }
}

// ---- CATEGORIES -------------------------------------------------------------

export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('template_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function createCategory(name: string, slug: string, description?: string) {
  const { data, error } = await supabase.from('template_categories').insert({
    name, slug, description,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, updates: { name?: string; description?: string; isActive?: boolean }) {
  const { error } = await supabase.from('template_categories').update({
    name: updates.name,
    description: updates.description,
    is_active: updates.isActive,
  }).eq('id', id);
  if (error) throw error;
}
