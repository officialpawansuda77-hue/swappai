-- Migration: Prevent unauthorized privilege escalation and credit tampering on profiles table
-- Date: 2026-10-16
-- Description: Ensures regular users cannot alter their role, plan, credits, or payment IDs.

CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  -- If invoked by service_role (e.g. backend webhooks / serverless APIs) or postgres superuser, allow all
  IF (auth.jwt() ->> 'role') = 'service_role' OR session_user = 'postgres' THEN
    RETURN NEW;
  END IF;

  -- If invoked by an existing admin user, allow
  IF EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RETURN NEW;
  END IF;

  -- For regular authenticated users, lock sensitive fields
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Unauthorized: You cannot modify your user role.';
  END IF;

  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    RAISE EXCEPTION 'Unauthorized: You cannot modify your subscription plan directly.';
  END IF;

  IF NEW.subscription_status IS DISTINCT FROM OLD.subscription_status THEN
    RAISE EXCEPTION 'Unauthorized: You cannot modify subscription status directly.';
  END IF;

  IF NEW.monthly_generation_limit IS DISTINCT FROM OLD.monthly_generation_limit THEN
    RAISE EXCEPTION 'Unauthorized: You cannot modify generation limits.';
  END IF;

  IF NEW.generations_used IS DISTINCT FROM OLD.generations_used THEN
    RAISE EXCEPTION 'Unauthorized: You cannot modify generation usage counter directly.';
  END IF;

  IF NEW.extra_generations IS DISTINCT FROM OLD.extra_generations THEN
    RAISE EXCEPTION 'Unauthorized: You cannot modify extra generations directly.';
  END IF;

  IF NEW.dodo_subscription_id IS DISTINCT FROM OLD.dodo_subscription_id THEN
    RAISE EXCEPTION 'Unauthorized: You cannot modify payment subscription identifiers.';
  END IF;

  IF NEW.dodo_customer_id IS DISTINCT FROM OLD.dodo_customer_id THEN
    RAISE EXCEPTION 'Unauthorized: You cannot modify payment customer identifiers.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_sensitive_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_sensitive_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_sensitive_columns();
