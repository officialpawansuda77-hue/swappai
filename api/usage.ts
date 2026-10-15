// GET /api/usage — the caller's plan, credit balance, limits and monthly usage.
import { route } from './_lib/http.js';
import { requireUser } from './_lib/auth.js';
import { getBalance } from './_lib/credits.js';
import { getCreditCosts, getPlanLimits } from './_lib/config.js';
import { getSupabaseAdmin } from './_lib/supabaseAdmin.js';
import { normalizePlanId } from '../src/shared/plans.js';

export async function buildUsage(userId: string) {
  const supabase = getSupabaseAdmin();
  const month = new Date();
  const monthKey = `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(2, '0')}-01`;

  const [balance, costs, subRes, usageRes, projectsRes, recentRes] = await Promise.all([
    getBalance(userId),
    getCreditCosts(),
    supabase.from('subscriptions').select('plan,status,billing_cycle,renewal_date,cancel_at_period_end').eq('user_id', userId).maybeSingle(),
    supabase.from('usage_monthly').select('*').eq('user_id', userId).eq('month', monthKey).maybeSingle(),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase
      .from('generations')
      .select('id,operation,status,credits_used,created_at,project_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const plan = normalizePlanId(subRes.data?.plan || balance.plan);
  const limits = await getPlanLimits(plan);
  const usage = usageRes.data;

  return {
    plan,
    subscription: {
      status: subRes.data?.status || 'active',
      billingCycle: subRes.data?.billing_cycle || 'monthly',
      renewalDate: subRes.data?.renewal_date || null,
      cancelAtPeriodEnd: subRes.data?.cancel_at_period_end || false,
    },
    credits: {
      available: balance.available,
      planRemaining: balance.planCreditsRemaining,
      bonus: balance.bonusCredits,
      monthlyAllowance: balance.monthlyAllowance,
      periodStart: balance.periodStart,
      periodEnd: balance.periodEnd,
    },
    limits,
    projects: { count: projectsRes.count ?? 0, max: limits.maxProjects },
    usage: {
      creditsUsed: usage?.credits_used ?? 0,
      analyses: usage?.analyses_count ?? 0,
      remixes: usage?.remixes_count ?? 0,
      exports: usage?.exports_count ?? 0,
      projectsCreated: usage?.projects_created ?? 0,
    },
    creditCosts: costs,
    recentGenerations: recentRes.data ?? [],
  };
}

export default route(['GET'], async (req, res) => {
  const user = await requireUser(req);
  res.status(200).json({ success: true, ...(await buildUsage(user.id)) });
});
