import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://lubdghswecahviwkhrak.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1YmRnaHN3ZWNhaHZpd2tocmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MzIwNTQsImV4cCI6MjEwNjAwODA1NH0.RrowjZYXfyjRrSlN6HEhtoBj8IPU5ggwEM3tyqasD1A';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('placeholder')
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
