import { supabase } from './supabase';

export class ApiError extends Error {
  status: number;
  code: string;
  data: Record<string, unknown>;
  constructor(status: number, code: string, message: string, data: Record<string, unknown> = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

/**
 * fetch() for our /api routes: attaches the Supabase access token,
 * parses JSON, and throws ApiError with the server's error code.
 */
export async function apiFetch<T = Record<string, unknown>>(
  path: string,
  init: RequestInit & { json?: unknown; timeoutMs?: number } = {}
): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  let body = init.body;
  if (init.json !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(init.json);
  }

  const controller = new AbortController();
  const timer = init.timeoutMs ? setTimeout(() => controller.abort(), init.timeoutMs) : null;
  if (init.signal) init.signal.addEventListener('abort', () => controller.abort(), { once: true });

  let res: Response;
  try {
    res = await fetch(path, { ...init, headers, body, signal: controller.signal });
  } catch {
    if (controller.signal.aborted) throw new ApiError(408, 'timeout', 'The request timed out. Please retry.');
    throw new ApiError(0, 'network_error', 'Network error. Check your connection and retry.');
  } finally {
    if (timer) clearTimeout(timer);
  }

  const payload = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok || payload.success === false) {
    throw new ApiError(
      res.status,
      String(payload.error || 'request_failed'),
      String(payload.message || payload.error || `Request failed (${res.status})`),
      payload
    );
  }
  return payload as T;
}

export function newRequestId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
