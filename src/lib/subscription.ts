import { supabase, isSupabaseConfigured } from './supabase';

export type PlanId = 'starter' | 'creator' | 'studio';

export interface PlanDetails {
  id: PlanId;
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
    name: 'Creator',
    price: 4.99,
    priceFormatted: '$4.99',
    period: '/mo',
    description: 'For a consistent content engine.',
    subDescription: '$4.99 / month, billed monthly. Cancel anytime.',
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
  paymentStatus: 'pending' | 'paid_demo' | 'free';
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

export function setPendingPlan(planId: PlanId, paymentStatus: 'pending' | 'paid_demo' | 'free' = 'pending', transactionId?: string): void {
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
  status: 'active' | 'canceled' | 'past_due';
  monthlyGenerations: number;
  generationsUsed: number;
  periodStart: string;
  periodEnd: string;
  billingInterval: 'monthly';
  lastPaymentId?: string;
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
    periodStart: now.toISOString(),
    periodEnd: nextMonth.toISOString(),
    billingInterval: 'monthly',
  };
}

// Fetch user subscription from Supabase or local persistence
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  const localKey = USER_SUBSCRIPTION_KEY_PREFIX + userId;
  const cached = localStorage.getItem(localKey);

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && data && data.plan) {
        const sub: UserSubscription = {
          userId,
          planId: (data.plan as PlanId) || 'starter',
          status: data.subscription_status || 'active',
          monthlyGenerations: data.monthly_generation_limit || PLANS[data.plan as PlanId]?.monthlyGenerations || 5,
          generationsUsed: data.generations_used || 0,
          periodStart: data.period_start || new Date().toISOString(),
          periodEnd: data.period_end || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
          billingInterval: 'monthly',
        };
        localStorage.setItem(localKey, JSON.stringify(sub));
        return sub;
      }
    } catch {
      // fallback to cached or default
    }
  }

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Check if period has reset
      if (new Date(parsed.periodEnd) < new Date()) {
        parsed.generationsUsed = 0;
        parsed.periodStart = new Date().toISOString();
        parsed.periodEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString();
        localStorage.setItem(localKey, JSON.stringify(parsed));
      }
      return parsed;
    } catch {
      // ignore
    }
  }

  const def = getDefaultSubscription(userId, 'starter');
  localStorage.setItem(localKey, JSON.stringify(def));
  return def;
}

// Activate subscription after checkout or free selection
export async function activateSubscription(
  userId: string,
  planId: PlanId,
  paymentStatus: string = 'paid'
): Promise<UserSubscription> {
  const plan = PLANS[planId] || PLANS.starter;
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const sub: UserSubscription = {
    userId,
    planId,
    status: 'active',
    monthlyGenerations: plan.monthlyGenerations,
    generationsUsed: 0,
    periodStart: now.toISOString(),
    periodEnd: nextMonth.toISOString(),
    billingInterval: 'monthly',
    lastPaymentId: paymentStatus,
  };

  const localKey = USER_SUBSCRIPTION_KEY_PREFIX + userId;
  localStorage.setItem(localKey, JSON.stringify(sub));
  clearPendingPlan();

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('profiles')
        .update({
          plan: planId,
          monthly_generation_limit: plan.monthlyGenerations,
          generations_used: 0,
          subscription_status: 'active',
          period_start: now.toISOString(),
          period_end: nextMonth.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('user_id', userId);
    } catch {
      // local copy is active
    }
  }

  return sub;
}

// Check generation allowance
export async function canGenerateCarousel(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  reason?: string;
}> {
  const sub = await getUserSubscription(userId);
  const allowed = sub.generationsUsed < sub.monthlyGenerations;

  return {
    allowed,
    used: sub.generationsUsed,
    limit: sub.monthlyGenerations,
    reason: allowed
      ? undefined
      : `You've reached your ${sub.monthlyGenerations} carousel limit for this month. Upgrade your plan to continue creating.`,
  };
}

// Record generation usage
export async function recordCarouselGeneration(userId: string): Promise<{
  success: boolean;
  used: number;
  limit: number;
}> {
  const sub = await getUserSubscription(userId);
  if (sub.generationsUsed >= sub.monthlyGenerations) {
    return { success: false, used: sub.generationsUsed, limit: sub.monthlyGenerations };
  }

  const newUsed = sub.generationsUsed + 1;
  sub.generationsUsed = newUsed;

  const localKey = USER_SUBSCRIPTION_KEY_PREFIX + userId;
  localStorage.setItem(localKey, JSON.stringify(sub));

  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('profiles')
        .update({
          generations_used: newUsed,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } catch {
      // local is updated
    }
  }

  return { success: true, used: newUsed, limit: sub.monthlyGenerations };
}
