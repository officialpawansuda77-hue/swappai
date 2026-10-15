import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { HttpError } from './http.js';

let admin: SupabaseClient | null = null;

/**
 * Service-role Supabase client. Server-only.
 * Fails closed: never falls back to a hardcoded key.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (admin) return admin;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('[config] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing');
    throw new HttpError(500, 'server_misconfigured', 'Server is not configured. Please contact support.');
  }
  admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return admin;
}
