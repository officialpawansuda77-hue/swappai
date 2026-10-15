-- ============================================================
-- SWAPP.AI — Dodo Payments & Server-Side Usage Tracking Migration
-- File: supabase/migrations/20260927_dodo_payments.sql
-- ============================================================

-- 1. Ensure profiles table has Dodo tracking and extra allowance columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS dodo_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS dodo_customer_id     TEXT,
  ADD COLUMN IF NOT EXISTS extra_generations      INT NOT NULL DEFAULT 0;

-- 2. Webhook Idempotency Table
-- Stores processed webhook IDs from Dodo Payments (webhook-id header) to prevent duplicate processing
CREATE TABLE IF NOT EXISTS public.dodo_webhook_events (
  id           TEXT PRIMARY KEY,
  event_type   TEXT NOT NULL,
  data         JSONB,
  processed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.dodo_webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service_role and admins can inspect webhook events
CREATE POLICY "Admins read dodo webhook events"
  ON public.dodo_webhook_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 3. Atomic Server-Side Usage Consumption Function
-- Safely checks subscription limit, resets billing month if period has rolled over,
-- and increments usage atomically with row-level locking.
CREATE OR REPLACE FUNCTION public.consume_carousel_generation(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_profile RECORD;
  v_limit INT;
  v_used INT;
  v_remaining INT;
BEGIN
  -- Row-level lock to prevent concurrent generation race conditions
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Profile not found'
    );
  END IF;

  -- If subscription is canceled, expired, or past_due AND billing period has passed, block
  IF v_profile.subscription_status IN ('canceled', 'expired', 'failed') AND v_profile.period_end < now() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Subscription is no longer active. Please renew your plan.',
      'status', v_profile.subscription_status
    );
  END IF;

  -- Rollover check: If current time is past period_end and subscription is active, reset usage
  IF v_profile.period_end IS NOT NULL AND v_profile.period_end < now() AND v_profile.subscription_status = 'active' THEN
    UPDATE public.profiles
    SET generations_used = 0,
        period_start = now(),
        period_end = now() + interval '1 month',
        updated_at = now()
    WHERE user_id = p_user_id
    RETURNING * INTO v_profile;
  END IF;

  v_limit := COALESCE(v_profile.monthly_generation_limit, 5) + COALESCE(v_profile.extra_generations, 0);
  v_used := COALESCE(v_profile.generations_used, 0);
  v_remaining := v_limit - v_used;

  IF v_remaining <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Monthly carousel limit reached',
      'used', v_used,
      'limit', v_limit,
      'remaining', 0
    );
  END IF;

  -- Increment usage
  UPDATE public.profiles
  SET generations_used = v_used + 1,
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING * INTO v_profile;

  RETURN jsonb_build_object(
    'success', true,
    'used', v_used + 1,
    'limit', v_limit,
    'remaining', v_limit - (v_used + 1)
  );
END;
$$;
