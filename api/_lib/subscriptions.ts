// Server-side subscription state transitions (used by webhooks + verification).
import { getSupabaseAdmin } from './supabaseAdmin.js';
import type { PlanId } from '../../src/shared/plans.js';

type SubStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';

export interface ProviderRefs {
  provider: 'dodo' | 'stripe';
  subscriptionId?: string | null;
  customerId?: string | null;
}

function iso(d?: string | null): string | null {
  if (!d) return null;
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? null : t.toISOString();
}

/** Activate / renew / change plan and grant that plan's monthly credits. */
export async function activatePlan(
  userId: string,
  plan: PlanId,
  refs: ProviderRefs,
  periodEnd?: string | null,
  resetCredits = true
) {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const end = iso(periodEnd);

  const { error: subErr } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      plan,
      status: 'active',
      provider: refs.provider,
      provider_subscription_id: refs.subscriptionId ?? null,
      provider_customer_id: refs.customerId ?? null,
      current_period_start: now,
      renewal_date: end,
      cancel_at_period_end: false,
    },
    { onConflict: 'user_id' }
  );
  if (subErr) throw new Error(`subscriptions upsert failed: ${subErr.message}`);

  const { error: planErr } = await supabase.rpc('apply_plan', {
    p_user_id: userId,
    p_plan: plan,
    p_period_start: now,
    p_period_end: end,
    p_reset_credits: resetCredits,
  });
  if (planErr) throw new Error(`apply_plan failed: ${planErr.message}`);

  // Legacy profile mirror (older UI reads these).
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      generations_used: 0,
      dodo_subscription_id: refs.provider === 'dodo' ? refs.subscriptionId ?? null : undefined,
      dodo_customer_id: refs.provider === 'dodo' ? refs.customerId ?? null : undefined,
    })
    .eq('user_id', userId);
}

export async function setSubscriptionStatus(userId: string, status: SubStatus, cancelAtPeriodEnd = false) {
  const supabase = getSupabaseAdmin();
  await supabase
    .from('subscriptions')
    .update({ status, cancel_at_period_end: cancelAtPeriodEnd })
    .eq('user_id', userId);
  await supabase.from('profiles').update({ subscription_status: status }).eq('user_id', userId);
}

/** Subscription ended: drop to Free immediately. */
export async function downgradeToFree(userId: string) {
  const supabase = getSupabaseAdmin();
  await supabase
    .from('subscriptions')
    .update({ plan: 'free', status: 'expired', cancel_at_period_end: false })
    .eq('user_id', userId);
  const { error } = await supabase.rpc('apply_plan', {
    p_user_id: userId,
    p_plan: 'free',
    p_period_start: new Date().toISOString(),
    p_period_end: null,
    p_reset_credits: true,
  });
  if (error) throw new Error(`apply_plan(free) failed: ${error.message}`);
  await supabase.from('profiles').update({ subscription_status: 'expired' }).eq('user_id', userId);
}

export async function grantPurchasedCredits(userId: string, amount: number, note: string) {
  const { error } = await getSupabaseAdmin().rpc('admin_adjust_credits', {
    p_user_id: userId,
    p_delta: amount,
    p_note: note.slice(0, 500),
    p_reason: 'purchase',
  });
  if (error) throw new Error(`credit purchase grant failed: ${error.message}`);
}
