import { HttpError } from './http.js';
import { getSupabaseAdmin } from './supabaseAdmin.js';
import { getConfig } from './config.js';

interface RateLimitConfig {
  aiPerMinute: number;
  aiPerDay: number;
  uploadsPerHour: number;
}

const DEFAULTS: RateLimitConfig = { aiPerMinute: 6, aiPerDay: 200, uploadsPerHour: 60 };

async function hit(key: string, windowSeconds: number, max: number) {
  const { data, error } = await getSupabaseAdmin().rpc('hit_rate_limit', {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max: max,
  });
  if (error) {
    // Fail open on limiter infrastructure errors; credits still protect spend.
    console.warn('[rate-limit] limiter unavailable', error.message);
    return;
  }
  if (!data?.allowed) {
    throw new HttpError(429, 'rate_limited', 'Too many requests. Please slow down and try again shortly.', {
      retryAfter: data?.retry_after ?? windowSeconds,
    });
  }
}

export async function enforceAiRateLimit(userId: string) {
  const cfg = { ...DEFAULTS, ...(await getConfig<Partial<RateLimitConfig>>('rate_limits', DEFAULTS)) };
  await hit(`ai:min:${userId}`, 60, cfg.aiPerMinute);
  await hit(`ai:day:${userId}`, 86_400, cfg.aiPerDay);
}

export async function enforceUploadRateLimit(userId: string) {
  const cfg = { ...DEFAULTS, ...(await getConfig<Partial<RateLimitConfig>>('rate_limits', DEFAULTS)) };
  await hit(`upload:hour:${userId}`, 3_600, cfg.uploadsPerHour);
}
