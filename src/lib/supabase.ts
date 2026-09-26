import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder') &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage helpers
export const STORAGE_BUCKETS = {
  CAROUSEL_TEMPLATES: 'carousel-templates',
  USER_PROJECTS: 'user-projects',
  THUMBNAILS: 'thumbnails',
} as const;

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: { contentType?: string; upsert?: boolean }
): Promise<{ publicUrl: string; storagePath: string }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: options?.contentType || file.type,
      upsert: options?.upsert ?? true,
    });

  if (error) throw error;

  const publicUrl = getPublicUrl(bucket, data.path);
  return { publicUrl, storagePath: data.path };
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
