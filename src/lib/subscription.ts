import { supabase } from './supabase';
import { apiFetch, newRequestId, ApiError } from './apiClient';

export type PlanId = 'starter' | 'creator' | 'studio';

export interface PlanDetails {
  id: PlanId;
  productId?: string;
  name: string;
  price: number;
  priceFormatted: string;
  period: string;
  description: string;
  subDescription?: string;
  monthlyGenerations: number;
  maxProjects: number | 'unlimited';
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

export const DODO_PRODUCT_IDS = {
  creator: 'pdt_0NoV6f6sKvSHpmZrs8uPj',
  studio: 'pdt_0NoV8Hg2oW2DEM5YbUHGz',
} as const;

export const PLANS: Record<PlanId, PlanDetails> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 0,
    priceFormatted: '$0',
    period: '/mo',
    description: 'For trying the workflow.',
    subDescription: 'Start creating with 5 carousel generations every month.',
    monthlyGenerations: 5,
    maxProjects: 3,
    features: [
      '5 carousel generations / month',
      '3 projects',
      'Core templates',
      'JPG export',
    ],
    ctaText: 'Start free',
  },
  creator: {
    id: 'creator',
    productId: DODO_PRODUCT_IDS.creator,
    name: 'Creator',
    price: 12,
    priceFormatted: '$12',
    period: '/mo',
    description: 'For a consistent content engine.',
    subDescription: '$12 / month, billed monthly. Cancel anytime.',
    monthlyGenerations: 30,
    maxProjects: 'unlimited',
    features: [
      '30 carousel generations / month',
      'Unlimited projects',
      'AI content assistant',
      'Brand kit',
      'PNG, JPG & PDF export',
    ],
    isPopular: true,
    ctaText: 'Choose plan',
  },
  studio: {
    id: 'studio',
    productId: DODO_PRODUCT_IDS.studio,
    name: 'Studio',
    price: 19,
    priceFormatted: '$19',
    period: '/mo',
    description: 'For teams moving fast.',
    subDescription: '$19 / month, billed monthly. Cancel anytime.',
    monthlyGenerations: 100,
    maxProjects: 'unlimited',
    features: [
      '100 carousel generations / month',
      'Everything in Creator',
      '5 brand kits',
      'Team workspace',
      'Priority support',
    ],
    ctaText: 'Choose plan',
  },
};

export interface PendingPlan {
  planId: PlanId;
  paymentStatus: 'pending' | 'free';
  transactionId?: string;
  timestamp: number;
}

const PENDING_PLAN_KEY = 'swapp_pending_plan';
const USER_SUBSCRIPTION_KEY_PREFIX = 'swapp_sub_';

// Pending Plan Management
export function getPendingPlan(): PendingPlan | null {
  try {
    const raw = sessionStorage.getItem(PENDING_PLAN_KEY) || localStorage.getItem(PENDING_PLAN_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setPendingPlan(planId: PlanId, paymentStatus: 'pending' | 'free' = 'pending', transactionId?: string): void {
  const item: PendingPlan = {
    planId,
    paymentStatus,
    transactionId,
    timestamp: Date.now(),
  };
  sessionStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(item));
  localStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(item));
}

export function clearPendingPlan(): void {
  sessionStorage.removeItem(PENDING_PLAN_KEY);
  localStorage.removeItem(PENDING_PLAN_KEY);
}

export interface UserSubscription {
  userId: string;
  planId: PlanId;
  status: 'active' | 'canceled' | 'past_due' | 'expired' | 'failed';
  monthlyGenerations: number;
  generationsUsed: number;
  extraGenerations: number;
  periodStart: string;
  periodEnd: string;
  billingInterval: 'monthly';
  dodoSubscriptionId?: string;
}

export function getDefaultSubscription(userId: string, planId: PlanId = 'starter'): UserSubscription {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const plan = PLANS[planId] || PLANS.starter;

  return {
    userId,
    planId,
    status: 'active',
    monthlyGenerations: plan.monthlyGenerations,
    generationsUsed: 0,
    extraGenerations: 0,
    periodStart: now.toISOString(),
    periodEnd: nextMonth.toISOString(),
    billingInterval: 'monthly',
  };
}

// Server-backed subscription + credit reads/writes for the legacy UI.
// Replaces the old block that wrote quota counters directly from the browser.

// Server plans: free | creator | pro | business | agency → legacy UI ids.
function toLegacyPlanId(raw: string | undefined): PlanId {
  if (raw === 'creator') return 'creator';
  if (raw === 'pro' || raw === 'studio' || raw === 'business' || raw === 'agency') return 'studio';
  return 'starter';
}

// Fetch subscription/credits from the server (authenticated; never trusts a client userId).
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const localKey = USER_SUBSCRIPTION_KEY_PREFIX + userId;

  try {
    const uData = await apiFetch<{
      plan?: string; status?: string; monthlyLimit?: number; extraGenerations?: number;
      used?: number; periodStart?: string; periodEnd?: string;
    }>('/api/subscription/usage', { timeoutMs: 15_000 });

    const sub: UserSubscription = {
      userId,
      planId: toLegacyPlanId(uData.plan),
      status: (uData.status as UserSubscription['status']) || 'active',
      monthlyGenerations: uData.monthlyLimit ?? 0,
      generationsUsed: uData.used ?? 0,
      extraGenerations: uData.extraGenerations ?? 0,
      periodStart: uData.periodStart || new Date().toISOString(),
      periodEnd: uData.periodEnd || new Date(Date.now() + 30 * 86_400_000).toISOString(),
      billingInterval: 'monthly',
    };
    // Cache is display-only; the server is always the authority for spending.
    localStorage.setItem(localKey, JSON.stringify(sub));
    return sub;
  } catch (err) {
    console.warn('Could not load subscription from server, using cached display values:', err);
  }

  const cached = localStorage.getItem(localKey);
  if (cached) {
    try {
      return JSON.parse(cached) as UserSubscription;
    } catch {
      // ignore
    }
  }
  return getDefaultSubscription(userId, 'starter');
}

// Check credit availability (display/pre-check only — the server re-checks atomically).
export async function canGenerateCarousel(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  reason?: string;
}> {
  const sub = await getUserSubscription(userId);
  const totalLimit = sub.monthlyGenerations + (sub.extraGenerations || 0);
  const remaining = Math.max(0, totalLimit - sub.generationsUsed);
  const allowed = remaining > 0 && (sub.status === 'active' || sub.status === 'past_due' || sub.status === 'canceled');

  return {
    allowed,
    used: sub.generationsUsed,
    limit: totalLimit,
    remaining,
    reason: allowed
      ? undefined
      : remaining <= 0
      ? `You're out of AI credits for this period (${sub.generationsUsed} / ${totalLimit} used). Upgrade or wait for your monthly reset.`
      : 'Your subscription is not active. Please renew to continue creating.',
  };
}

// Charge credits server-side (atomic, idempotent). No client-side fallback:
// if the server can't confirm the charge, the action does not proceed.
export async function recordCarouselGeneration(userId: string, requestId?: string): Promise<{
  success: boolean;
  used: number;
  limit: number;
  remaining: number;
  error?: string;
}> {
  try {
    const result = await apiFetch<{ used: number; limit: number; remaining: number }>(
      '/api/subscription/consume-generation',
      { method: 'POST', json: { requestId: requestId || newRequestId() }, timeoutMs: 20_000 }
    );
    await getUserSubscription(userId);
    return { success: true, used: result.used, limit: result.limit, remaining: result.remaining };
  } catch (err) {
    const e = err as ApiError;
    return {
      success: false,
      used: Number(e?.data?.used ?? 0),
      limit: Number(e?.data?.limit ?? 0),
      remaining: Number(e?.data?.available ?? 0),
      error: e?.code === 'insufficient_credits'
        ? "You're out of AI credits for this period."
        : e?.message || 'Could not confirm your credits. Please try again.',
    };
  }
}

// Request a Dodo Payments Checkout session
export async function createDodoCheckoutSession(
  planId: PlanId | 'extra_generations',
  returnUrl?: string
): Promise<{ checkoutUrl: string; error?: string }> {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;
  // The server derives user id + email from the JWT and picks the product.
  const data = await apiFetch<{ checkoutUrl: string }>('/api/dodo/create-checkout', {
    method: 'POST',
    json: {
      planId,
      userName: user?.user_metadata?.full_name || user?.user_metadata?.name,
      returnUrl: returnUrl || `${window.location.origin}/dashboard?payment=success`,
    },
    timeoutMs: 20_000,
  });
  return { checkoutUrl: data.checkoutUrl };
}
