// GET|POST /api/dodo/verify-subscription
// After returning from checkout: confirms the caller's plan server-side.
// If the webhook hasn't landed yet, asks Dodo directly and syncs.
import { route, HttpError } from '../_lib/http.js';
import { requireUser } from '../_lib/auth.js';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { getBalance } from '../_lib/credits.js';
import { dodoBaseUrl, planForProduct } from '../_lib/billing.js';
import { activatePlan } from '../_lib/subscriptions.js';

export default route(['GET', 'POST'], async (req, res) => {
  const user = await requireUser(req);
  const supabase = getSupabaseAdmin();

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan,status,provider_subscription_id')
    .eq('user_id', user.id)
    .maybeSingle();

  const respond = async (verified: boolean, plan: string, status: string) => {
    const balance = await getBalance(user.id);
    res.status(200).json({
      verified,
      plan,
      status,
      monthlyLimit: balance.monthlyAllowance,
      remaining: balance.available,
      credits: balance.available,
    });
  };

  if (sub && sub.plan !== 'free' && sub.status === 'active') {
    await respond(true, sub.plan, sub.status);
    return;
  }

  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (apiKey && user.email) {
    try {
      const r = await fetch(`${dodoBaseUrl()}/subscriptions?customer_email=${encodeURIComponent(user.email)}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (r.ok) {
        const payload = await r.json();
        const items: Array<{ status?: string; product_id?: string; subscription_id?: string; customer?: { customer_id?: string }; next_billing_date?: string; metadata?: { user_id?: string } }> =
          Array.isArray(payload) ? payload : payload.items || [];
        // Only trust subscriptions created for THIS user (metadata) or, for
        // legacy checkouts without metadata, the verified account email.
        const active = items.find(
          (s) => s.status === 'active' && (!s.metadata?.user_id || s.metadata.user_id === user.id)
        );
        const plan = active ? planForProduct(active.product_id) : null;
        if (active && plan) {
          await activatePlan(
            user.id,
            plan,
            { provider: 'dodo', subscriptionId: active.subscription_id, customerId: active.customer?.customer_id },
            active.next_billing_date,
            true
          );
          await respond(true, plan, 'active');
          return;
        }
      }
    } catch (err) {
      console.warn('[verify-subscription] Dodo lookup failed', err);
    }
  } else if (!apiKey) {
    console.warn('[verify-subscription] DODO_PAYMENTS_API_KEY missing');
  }

  if (!sub) throw new HttpError(404, 'not_found', 'Subscription record not found.');
  await respond(false, sub.plan, sub.status);
});
