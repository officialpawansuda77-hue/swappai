import { HttpError, header, type Req } from './http.js';
import { getSupabaseAdmin } from './supabaseAdmin.js';

export interface AuthUser {
  id: string;
  email: string | null;
  isAdmin: boolean;
}

/**
 * Resolves the caller strictly from the Bearer JWT.
 * Never trusts a userId sent in the body or query string.
 */
export async function requireUser(req: Req): Promise<AuthUser> {
  const auth = header(req, 'authorization');
  const token = auth?.replace(/^Bearer\s+/i, '').trim();
  if (!token) throw new HttpError(401, 'unauthorized', 'Please sign in to continue.');

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) throw new HttpError(401, 'unauthorized', 'Your session has expired. Please sign in again.');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', data.user.id)
    .maybeSingle();

  return { id: data.user.id, email: data.user.email ?? null, isAdmin: profile?.role === 'admin' };
}

export async function requireAdmin(req: Req): Promise<AuthUser> {
  const user = await requireUser(req);
  if (!user.isAdmin) throw new HttpError(403, 'forbidden', 'Admin access required.');
  return user;
}
