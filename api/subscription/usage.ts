// GET /api/subscription/usage — LEGACY response shape, backed by the credit system.
// Identity comes only from the Bearer JWT (the old ?userId= param is ignored).
import { route } from '../_lib/http.js';
import { requireUser } from '../_lib/auth.js';
import { getBalance } from '../_lib/credits.js';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';

export default route(['GET'], async (req, res) => {
  const user = await requireUser(req);
  const balance = await getBalance(user.id);
  const { data: sub } = await getSupabaseAdmin()
    .from('subscriptions')
    .select('plan,status')
    .eq('user_id', user.id)
    .maybeSingle();

  const totalLimit = balance.monthlyAllowance + balance.bonusCredits;
  res.status(200).json({
    userId: user.id,
    plan: sub?.plan || balance.plan,
    status: sub?.status || 'active',
    monthlyLimit: balance.monthlyAllowance,
    extraGenerations: balance.bonusCredits,
    totalLimit,
    used: Math.max(0, totalLimit - balance.available),
    remaining: balance.available,
    periodStart: balance.periodStart,
    periodEnd: balance.periodEnd,
  });
});
