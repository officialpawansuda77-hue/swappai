import { getSupabaseAdmin } from './supabaseAdmin.js';
import {
  DEFAULT_CREDIT_COSTS,
  DEFAULT_UPLOAD_LIMITS,
  PLAN_DEFINITIONS,
  type AiOperation,
  type PlanId,
} from '../../src/shared/plans.js';

// Runtime config from `app_config`, cached per warm function instance.
const TTL_MS = 30_000;
const cache = new Map<string, { value: unknown; at: number }>();

export async function getConfig<T>(key: string, fallback: T): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.value as T;
  try {
    const { data, error } = await getSupabaseAdmin().from('app_config').select('value').eq('key', key).maybeSingle();
    if (error) throw error;
    const value = (data?.value ?? fallback) as T;
    cache.set(key, { value, at: Date.now() });
    return value;
  } catch (err) {
    console.warn(`[config] falling back to defaults for ${key}`, err);
    return fallback;
  }
}

export function invalidateConfig(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}

export async function getCreditCosts(): Promise<Record<AiOperation, number>> {
  const cfg = await getConfig<Partial<Record<AiOperation, number>>>('credit_costs', DEFAULT_CREDIT_COSTS);
  return { ...DEFAULT_CREDIT_COSTS, ...cfg };
}

export async function getCreditCost(op: AiOperation): Promise<number> {
  const costs = await getCreditCosts();
  const v = Number(costs[op]);
  return Number.isFinite(v) && v >= 0 ? Math.floor(v) : DEFAULT_CREDIT_COSTS[op];
}

export interface RuntimePlanLimits {
  monthlyCredits: number;
  maxProjects: number | null;
  monthlyRemixes: number | null;
  teamMembers: number;
}

export async function getPlanLimits(plan: PlanId): Promise<RuntimePlanLimits> {
  const def = PLAN_DEFINITIONS[plan].limits;
  const all = await getConfig<Record<string, Partial<RuntimePlanLimits>>>('plan_limits', {});
  return {
    monthlyCredits: def.monthlyCredits,
    maxProjects: def.maxProjects,
    monthlyRemixes: def.monthlyRemixes,
    teamMembers: def.teamMembers,
    ...(all[plan] || {}),
  };
}

export async function getUploadLimits(): Promise<typeof DEFAULT_UPLOAD_LIMITS> {
  const cfg = await getConfig<Partial<typeof DEFAULT_UPLOAD_LIMITS>>('upload_limits', DEFAULT_UPLOAD_LIMITS);
  return { ...DEFAULT_UPLOAD_LIMITS, ...cfg };
}

export interface AiModelsConfig {
  vision: string;
  image: string;
  remix: string;
}

export async function getAiModels(): Promise<AiModelsConfig> {
  const defaults: AiModelsConfig = {
    vision: 'gemini-3.5-flash-lite',
    image: 'gemini-3.1-flash-lite-image',
    remix: 'gemini-3.5-flash-lite',
  };
  return { ...defaults, ...(await getConfig<Partial<AiModelsConfig>>('ai_models', defaults)) };
}

export async function getCostEstimateUsd(op: AiOperation): Promise<number> {
  const cfg = await getConfig<Partial<Record<AiOperation, number>>>('ai_cost_estimates_usd', {});
  return Number(cfg[op] ?? 0) || 0;
}

export async function getMaintenance(): Promise<{ enabled: boolean; message: string }> {
  return getConfig('maintenance', { enabled: false, message: '' });
}
