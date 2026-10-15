// Payment-provider abstraction. Dodo today; the same shape fits Stripe later.
// The SERVER decides which plan a product grants — never the client.
import type { PlanId } from '../../src/shared/plans.js';

export type PaidPlanId = Exclude<PlanId, 'free'>;

// Legacy USD products (still live) map onto the new tiers until INR products exist.
const LEGACY_CREATOR_PRODUCT = 'pdt_0NoV6f6sKvSHpmZrs8uPj';
const LEGACY_STUDIO_PRODUCT = 'pdt_0NoV8Hg2oW2DEM5YbUHGz';

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

/** All product ids that grant a given plan (new INR product first, then legacy). */
function productsForPlan(plan: PaidPlanId): string[] {
  switch (plan) {
    case 'creator':
      return [env('DODO_PRODUCT_CREATOR'), env('DODO_CREATOR_PRODUCT_ID'), LEGACY_CREATOR_PRODUCT].filter(Boolean) as string[];
    case 'pro':
      return [env('DODO_PRODUCT_PRO'), env('DODO_STUDIO_PRODUCT_ID'), LEGACY_STUDIO_PRODUCT].filter(Boolean) as string[];
    case 'business':
      return [env('DODO_PRODUCT_BUSINESS')].filter(Boolean) as string[];
    case 'agency':
      return [env('DODO_PRODUCT_AGENCY')].filter(Boolean) as string[];
  }
}

export function checkoutProductForPlan(plan: PaidPlanId): string | null {
  return productsForPlan(plan)[0] ?? null;
}

export function planForProduct(productId: string | null | undefined): PaidPlanId | null {
  if (!productId) return null;
  for (const plan of ['creator', 'pro', 'business', 'agency'] as PaidPlanId[]) {
    if (productsForPlan(plan).includes(productId)) return plan;
  }
  return null;
}

export function extraCreditsProduct(): string | null {
  return env('DODO_EXTRA_CREDITS_PRODUCT_ID') || env('DODO_EXTRA_GENERATIONS_PRODUCT_ID') || null;
}

export function extraCreditsAmount(): number {
  const n = Number(env('DODO_EXTRA_CREDITS_AMOUNT'));
  return Number.isInteger(n) && n > 0 ? n : 15;
}

/** Accepts new ids plus legacy UI ids ('studio' → pro). */
export function parseRequestedPlan(raw: unknown): PaidPlanId | 'extra_credits' | null {
  if (raw === 'extra_generations' || raw === 'extra_credits') return 'extra_credits';
  if (raw === 'studio') return 'pro';
  if (raw === 'creator' || raw === 'pro' || raw === 'business' || raw === 'agency') return raw;
  return null;
}

export function dodoBaseUrl(): string {
  return env('DODO_PAYMENTS_ENVIRONMENT') === 'live_mode'
    ? 'https://live.dodopayments.com'
    : 'https://test.dodopayments.com';
}

export function isProductionDeployment(): boolean {
  return env('VERCEL_ENV') === 'production' || env('DODO_PAYMENTS_ENVIRONMENT') === 'live_mode';
}
