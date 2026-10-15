/// <reference path="../deno.d.ts" />

// Supabase Edge Function: dodo-webhook
// Follows standard Deno runtime for Supabase Edge Functions.
// Handles Dodo Payments lifecycle webhooks and syncs with Supabase profiles table.

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const DODO_CREATOR_PRODUCT_ID = Deno.env.get('DODO_CREATOR_PRODUCT_ID') || 'pdt_0NoV6f6sKvSHpmZrs8uPj';
const DODO_STUDIO_PRODUCT_ID = Deno.env.get('DODO_STUDIO_PRODUCT_ID') || 'pdt_0NoV8Hg2oW2DEM5YbUHGz';
const DODO_EXTRA_PRODUCT_ID = Deno.env.get('DODO_EXTRA_GENERATIONS_PRODUCT_ID') || '';

const processedWebhookIds = new Set<string>();

async function verifySignature(
  rawBody: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignature: string,
  secret: string
): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const eventTime = parseInt(webhookTimestamp, 10);
  if (isNaN(eventTime) || Math.abs(now - eventTime) > 300) {
    return false;
  }

  let cleanSecret = secret.trim();
  if (cleanSecret.startsWith('whsec_')) {
    cleanSecret = cleanSecret.slice(6);
  }

  // Base64 decode secret
  const binaryString = atob(cleanSecret);
  const secretBytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    secretBytes[i] = binaryString.charCodeAt(i);
  }

  const encoder = new TextEncoder();
  const signedContent = encoder.encode(`${webhookId}.${webhookTimestamp}.${rawBody}`);

  const key = await crypto.subtle.importKey(
    'raw',
    secretBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, signedContent);
  const computedBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

  const signatures = webhookSignature.split(' ');
  for (const sig of signatures) {
    const parts = sig.split(',');
    if (parts.length === 2 && parts[0] === 'v1') {
      if (parts[1] === computedBase64) return true;
    }
  }

  return false;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, webhook-id, webhook-timestamp, webhook-signature',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const webhookSecret = Deno.env.get('DODO_PAYMENTS_WEBHOOK_SECRET');
  const webhookId = req.headers.get('webhook-id');
  const webhookTimestamp = req.headers.get('webhook-timestamp');
  const webhookSignature = req.headers.get('webhook-signature');

  const rawBody = await req.text();

  // Signature verification
  if (webhookSecret && webhookId && webhookTimestamp && webhookSignature) {
    const valid = await verifySignature(rawBody, webhookId, webhookTimestamp, webhookSignature, webhookSecret);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Idempotency check
  if (webhookId) {
    if (processedWebhookIds.has(webhookId)) {
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    processedWebhookIds.add(webhookId);
  }

  let event: any = null;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const eventType = event.type || event.event;
  const data = event.data || {};
  const metadata = data.metadata || {};
  const customer = data.customer || {};

  const userId = metadata.user_id;
  const userEmail = customer.email || metadata.user_email;

  let profile: any = null;
  if (userId) {
    const { data: p } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
    profile = p;
  }
  if (!profile && userEmail) {
    const { data: p } = await supabase.from('profiles').select('*').eq('email', userEmail).maybeSingle();
    profile = p;
  }

  const effectiveUserId = profile?.user_id || userId;

  if (effectiveUserId) {
    const now = new Date();
    const nextBilling = data.next_billing_date
      ? new Date(data.next_billing_date).toISOString()
      : new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();

    switch (eventType) {
      case 'subscription.active':
      case 'subscription.created': {
        const productId = data.product_id;
        const plan = (productId === DODO_STUDIO_PRODUCT_ID || metadata.plan_id === 'studio') ? 'studio' : 'creator';
        const limit = plan === 'studio' ? 100 : 30;

        await supabase.from('profiles').update({
          plan,
          subscription_status: 'active',
          monthly_generation_limit: limit,
          generations_used: 0,
          period_start: now.toISOString(),
          period_end: nextBilling,
          dodo_subscription_id: data.subscription_id || null,
          dodo_customer_id: customer.customer_id || null,
          updated_at: now.toISOString(),
        }).eq('user_id', effectiveUserId);
        break;
      }

      case 'subscription.renewed': {
        await supabase.from('profiles').update({
          subscription_status: 'active',
          generations_used: 0,
          period_start: now.toISOString(),
          period_end: nextBilling,
          updated_at: now.toISOString(),
        }).eq('user_id', effectiveUserId);
        break;
      }

      case 'subscription.plan_changed': {
        const productId = data.product_id;
        const plan = (productId === DODO_STUDIO_PRODUCT_ID || metadata.plan_id === 'studio') ? 'studio' : 'creator';
        const limit = plan === 'studio' ? 100 : 30;

        await supabase.from('profiles').update({
          plan,
          monthly_generation_limit: limit,
          updated_at: now.toISOString(),
        }).eq('user_id', effectiveUserId);
        break;
      }

      case 'subscription.cancelled': {
        await supabase.from('profiles').update({
          subscription_status: 'canceled',
          updated_at: now.toISOString(),
        }).eq('user_id', effectiveUserId);
        break;
      }

      case 'subscription.expired': {
        await supabase.from('profiles').update({
          plan: 'starter',
          subscription_status: 'expired',
          monthly_generation_limit: 5,
          updated_at: now.toISOString(),
        }).eq('user_id', effectiveUserId);
        break;
      }

      case 'subscription.failed':
      case 'subscription.on_hold':
      case 'payment.failed': {
        await supabase.from('profiles').update({
          subscription_status: 'past_due',
          updated_at: now.toISOString(),
        }).eq('user_id', effectiveUserId);
        break;
      }

      case 'payment.succeeded': {
        if (metadata.plan_id === 'extra_generations' || data.product_id === DODO_EXTRA_PRODUCT_ID) {
          const addCount = Number(metadata.extra_count) || 15;
          const currentExtra = profile?.extra_generations || 0;
          await supabase.from('profiles').update({
            extra_generations: currentExtra + addCount,
            updated_at: now.toISOString(),
          }).eq('user_id', effectiveUserId);
        }
        break;
      }
    }
  }

  return new Response(JSON.stringify({ received: true, event: eventType }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
