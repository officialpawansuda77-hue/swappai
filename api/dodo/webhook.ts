// POST /api/dodo/webhook — Dodo Payments webhooks (Standard Webhooks spec).
// * Signature verification on the RAW body; fails closed in production.
// * Durable idempotency via dodo_webhook_events (not process memory).
// * Plan is derived from the product id server-side.
import crypto from 'crypto';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';
import { isProductionDeployment, planForProduct, extraCreditsAmount, extraCreditsProduct } from '../_lib/billing.js';
import { activatePlan, downgradeToFree, grantPurchasedCredits, setSubscriptionStatus } from '../_lib/subscriptions.js';
import { normalizePlanId, type PlanId } from '../../src/shared/plans.js';

// Ask Vercel not to pre-parse the body so the signature can be checked byte-for-byte.
export const config = { api: { bodyParser: false } };

type AnyReq = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  on: (event: string, cb: (chunk?: unknown) => void) => void;
};
type AnyRes = { status: (c: number) => AnyRes; json: (b: unknown) => void };

function h(req: AnyReq, name: string): string | undefined {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] : v;
}

async function readRawBody(req: AnyReq): Promise<string> {
  if (typeof req.body === 'string') return req.body;
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body); // parser already ran
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(String(c))));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', (e) => reject(e));
  });
}

function verifySignature(rawBody: string, req: AnyReq, secret: string): boolean {
  const id = h(req, 'webhook-id');
  const ts = h(req, 'webhook-timestamp');
  const sigHeader = h(req, 'webhook-signature');
  if (!id || !ts || !sigHeader) return false;

  const eventTime = parseInt(ts, 10);
  if (Number.isNaN(eventTime) || Math.abs(Math.floor(Date.now() / 1000) - eventTime) > 300) return false;

  const key = Buffer.from(secret.trim().replace(/^whsec_/, ''), 'base64');
  const expected = crypto.createHmac('sha256', key).update(`${id}.${ts}.${rawBody}`).digest();

  return sigHeader.split(' ').some((part) => {
    const [version, sig] = part.split(',');
    if (version !== 'v1' || !sig) return false;
    const given = Buffer.from(sig, 'base64');
    return given.length === expected.length && crypto.timingSafeEqual(given, expected);
  });
}

/** Subset of the Dodo webhook `data` object that we read. All fields optional. */
interface DodoPayload {
  subscription_id?: string;
  payment_id?: string;
  product_id?: string;
  next_billing_date?: string;
  metadata?: { user_id?: string; plan_id?: string };
  customer?: { email?: string; customer_id?: string };
  subscription?: { subscription_id?: string; product_id?: string };
}

interface DodoEvent {
  id?: string;
  type?: string;
  event?: string;
  data?: DodoPayload;
}

async function resolveUserId(data: DodoPayload): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const metaUser = data?.metadata?.user_id;
  if (typeof metaUser === 'string' && /^[0-9a-f-]{36}$/i.test(metaUser)) return metaUser;

  const subId = data?.subscription_id || data?.subscription?.subscription_id;
  if (subId) {
    const { data: s } = await supabase.from('subscriptions').select('user_id').eq('provider_subscription_id', subId).maybeSingle();
    if (s?.user_id) return s.user_id;
  }
  const email = data?.customer?.email;
  if (email) {
    const { data: p } = await supabase.from('profiles').select('user_id').eq('email', email).maybeSingle();
    if (p?.user_id) return p.user_id;
  }
  return null;
}

export default async function handler(req: AnyReq, res: AnyRes) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const rawBody = await readRawBody(req);
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

  if (secret) {
    if (!verifySignature(rawBody, req, secret)) return res.status(401).json({ error: 'Invalid webhook signature' });
  } else if (isProductionDeployment()) {
    console.error('[dodo-webhook] DODO_PAYMENTS_WEBHOOK_SECRET missing in production — rejecting');
    return res.status(500).json({ error: 'Webhook not configured' });
  } else {
    console.warn('[dodo-webhook] signature check skipped (non-production, no secret)');
  }

  let event: DodoEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const supabase = getSupabaseAdmin();
  const webhookId = h(req, 'webhook-id') || event.id || crypto.createHash('sha256').update(rawBody).digest('hex');
  const eventType: string = event.type || event.event || 'unknown';
  const data: DodoPayload = event.data || {};

  // Durable idempotency: the insert succeeds only once per webhook id.
  const { error: dupErr } = await supabase
    .from('dodo_webhook_events')
    .insert({ id: webhookId, event_type: eventType, data: event });
  if (dupErr) {
    if (dupErr.code === '23505') return res.status(200).json({ received: true, duplicate: true });
    console.error('[dodo-webhook] could not record event', dupErr);
    return res.status(500).json({ error: 'Could not record event' });
  }

  try {
    const userId = await resolveUserId(data);
    if (!userId) {
      console.warn(`[dodo-webhook] ${eventType}: no matching user`);
      return res.status(200).json({ received: true, unmatched: true });
    }

    const refs = {
      provider: 'dodo' as const,
      subscriptionId: data.subscription_id || data.subscription?.subscription_id || null,
      customerId: data.customer?.customer_id || null,
    };
    const productId = data.product_id || data.subscription?.product_id;
    const plan: PlanId | null =
      planForProduct(productId) ??
      (data.metadata?.plan_id && data.metadata.plan_id !== 'extra_credits' ? normalizePlanId(data.metadata.plan_id) : null);

    switch (eventType) {
      case 'subscription.active':
      case 'subscription.created':
      case 'subscription.renewed':
      case 'subscription.plan_changed': {
        if (!plan || plan === 'free') {
          console.warn(`[dodo-webhook] ${eventType}: unknown product ${productId}`);
          break;
        }
        await activatePlan(userId, plan, refs, data.next_billing_date, true);
        break;
      }
      case 'subscription.cancelled':
        // Keep access until the paid period ends; the monthly rollover downgrades.
        await setSubscriptionStatus(userId, 'canceled', true);
        break;
      case 'subscription.expired':
        await downgradeToFree(userId);
        break;
      case 'subscription.failed':
      case 'subscription.on_hold':
      case 'payment.failed':
        await setSubscriptionStatus(userId, 'past_due');
        break;
      case 'payment.succeeded': {
        const extraProduct = extraCreditsProduct();
        const isTopUp = data.metadata?.plan_id === 'extra_credits' || data.metadata?.plan_id === 'extra_generations'
          || (extraProduct && productId === extraProduct);
        if (isTopUp) {
          await grantPurchasedCredits(userId, extraCreditsAmount(), `dodo payment ${data.payment_id || webhookId}`);
        }
        break;
      }
      default:
        console.log(`[dodo-webhook] unhandled event ${eventType}`);
    }

    return res.status(200).json({ received: true, event: eventType });
  } catch (err) {
    console.error('[dodo-webhook] processing failed', err);
    // Remove the idempotency marker so the provider's retry is processed.
    await supabase.from('dodo_webhook_events').delete().eq('id', webhookId);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
