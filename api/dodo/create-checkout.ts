// POST /api/dodo/create-checkout  { planId, returnUrl? }
// Creates a Dodo checkout session for the AUTHENTICATED user.
// Price/product and the plan granted are decided server-side.
import { route, readJson, header, HttpError } from '../_lib/http.js';
import { requireUser } from '../_lib/auth.js';
import {
  checkoutProductForPlan,
  dodoBaseUrl,
  extraCreditsAmount,
  extraCreditsProduct,
  parseRequestedPlan,
} from '../_lib/billing.js';

function safeReturnUrl(req: Parameters<typeof header>[0], requested?: string): string {
  const origin = header(req, 'origin') || process.env.PUBLIC_APP_URL || 'http://localhost:5173';
  const fallback = `${origin}/dashboard?payment=success`;
  if (!requested) return fallback;
  try {
    const url = new URL(requested);
    return url.origin === new URL(origin).origin ? url.toString() : fallback; // block open redirects
  } catch {
    return fallback;
  }
}

export default route(['POST'], async (req, res) => {
  const user = await requireUser(req);
  const body = readJson<{ planId?: string; returnUrl?: string; userName?: string }>(req);

  const requested = parseRequestedPlan(body.planId);
  if (!requested) throw new HttpError(400, 'invalid_plan', 'Unknown plan.');

  const productId = requested === 'extra_credits' ? extraCreditsProduct() : checkoutProductForPlan(requested);
  if (!productId) {
    throw new HttpError(400, 'plan_not_configured', 'This plan is not available for purchase yet.');
  }

  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) throw new HttpError(500, 'server_misconfigured', 'Payments are not configured.');

  const email = user.email || '';
  const dodoResponse = await fetch(`${dodoBaseUrl()}/checkouts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: { email, name: (body.userName || email.split('@')[0] || 'Creator').slice(0, 80) },
      metadata: {
        user_id: user.id,
        plan_id: requested,
        ...(requested === 'extra_credits' ? { credits_amount: String(extraCreditsAmount()) } : {}),
      },
      return_url: safeReturnUrl(req, body.returnUrl),
    }),
  });

  if (!dodoResponse.ok) {
    console.error('[dodo] checkout error', dodoResponse.status, await dodoResponse.text());
    throw new HttpError(502, 'checkout_failed', 'Could not start checkout. Please try again.');
  }

  const data = await dodoResponse.json();
  const checkoutUrl = data.checkout_url || data.payment_link;
  if (!checkoutUrl) throw new HttpError(502, 'checkout_failed', 'Payment provider returned no checkout URL.');

  res.status(200).json({ success: true, checkoutUrl, sessionId: data.session_id || data.id });
});
