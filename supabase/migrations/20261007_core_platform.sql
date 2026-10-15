-- ============================================================================
-- SWAPP.AI — Core platform migration (Phase 1)
--   * Security hardening (profile privilege escalation, RPC exposure, storage)
--   * AI credits: balances, ledger, generations (reserve → commit / refund)
--   * Usage, subscriptions, admin runtime config, analysis cache, rate limits
--   * Design JSON columns, assets, carousels, brand kits, private buckets
-- Idempotent: safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Helpers
-- ---------------------------------------------------------------------------

-- is_admin(): recreate with fixed search_path + cached auth.uid()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = (SELECT auth.uid()) AND role = 'admin'
  );
$$;

-- True when the statement is executed by a trusted backend role
-- (service_role key from /api, or a direct DB/admin session).
CREATE OR REPLACE FUNCTION public.is_trusted_backend()
RETURNS boolean
LANGUAGE sql STABLE
SET search_path = ''
AS $$
  SELECT current_user IN ('service_role', 'postgres', 'supabase_admin')
      OR coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '') = 'service_role';
$$;

-- ---------------------------------------------------------------------------
-- 1. SECURITY HARDENING
-- ---------------------------------------------------------------------------

-- 1a. Users may only edit cosmetic profile fields. Plan / billing / quota /
--     role columns can only change via the service role (webhooks, /api).
CREATE OR REPLACE FUNCTION public.protect_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF public.is_trusted_backend() OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF NEW.role                     IS DISTINCT FROM OLD.role
  OR NEW.plan                     IS DISTINCT FROM OLD.plan
  OR NEW.subscription_status      IS DISTINCT FROM OLD.subscription_status
  OR NEW.monthly_generation_limit IS DISTINCT FROM OLD.monthly_generation_limit
  OR NEW.generations_used         IS DISTINCT FROM OLD.generations_used
  OR NEW.extra_generations        IS DISTINCT FROM OLD.extra_generations
  OR NEW.dodo_subscription_id     IS DISTINCT FROM OLD.dodo_subscription_id
  OR NEW.dodo_customer_id         IS DISTINCT FROM OLD.dodo_customer_id
  OR NEW.period_start             IS DISTINCT FROM OLD.period_start
  OR NEW.period_end               IS DISTINCT FROM OLD.period_end
  OR NEW.user_id                  IS DISTINCT FROM OLD.user_id
  OR NEW.email                    IS DISTINCT FROM OLD.email
  THEN
    RAISE EXCEPTION 'Not allowed to modify protected profile fields'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_protect_columns ON public.profiles;
CREATE TRIGGER profiles_protect_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_columns();

-- 1b. Profile insert: only for yourself (signup trigger runs as definer anyway).
DROP POLICY IF EXISTS "Allow insert on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id AND role = 'user');

-- 1c. Legacy RPC must never be callable from the browser (it trusts p_user_id).
DO $$
BEGIN
  IF to_regprocedure('public.consume_carousel_generation(uuid)') IS NOT NULL THEN
    REVOKE EXECUTE ON FUNCTION public.consume_carousel_generation(uuid) FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.consume_carousel_generation(uuid) TO service_role;
  END IF;
END $$;

-- 1d. Template buckets: public read, ADMIN-only writes (was: any authenticated user).
DROP POLICY IF EXISTS "Authenticated Upload carousel-templates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update carousel-templates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete carousel-templates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins write template buckets" ON storage.objects;
CREATE POLICY "Admins write template buckets" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id IN ('carousel-templates', 'thumbnails') AND (SELECT public.is_admin()))
  WITH CHECK (bucket_id IN ('carousel-templates', 'thumbnails') AND (SELECT public.is_admin()));

-- ---------------------------------------------------------------------------
-- 2. ADMIN RUNTIME CONFIG (changeable without redeploy)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.app_config (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  is_public   boolean NOT NULL DEFAULT true,   -- false = internal (costs, margins)
  updated_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.app_config (key, value, is_public) VALUES
  ('credit_costs', '{"analysis":1,"reconstruction":3,"background_edit":6,"remix":6,"redesign":15}', true),
  ('plan_limits', '{
     "free":     {"monthlyCredits":5,    "maxProjects":3,    "monthlyRemixes":0,    "teamMembers":1},
     "creator":  {"monthlyCredits":100,  "maxProjects":30,   "monthlyRemixes":10,   "teamMembers":1},
     "pro":      {"monthlyCredits":400,  "maxProjects":null, "monthlyRemixes":50,   "teamMembers":1},
     "business": {"monthlyCredits":1500, "maxProjects":null, "monthlyRemixes":null, "teamMembers":5},
     "agency":   {"monthlyCredits":5000, "maxProjects":null, "monthlyRemixes":null, "teamMembers":15}
   }', true),
  ('upload_limits', '{"maxSlides":10,"maxFileMb":10,"allowedMime":["image/png","image/jpeg","image/webp"]}', true),
  ('ai_models', '{"vision":"gemini-3.5-flash-lite","image":"gemini-3.1-flash-lite-image","remix":"gemini-3.5-flash-lite"}', false),
  ('ai_cost_estimates_usd', '{"analysis":0.002,"reconstruction":0.004,"background_edit":0.04,"remix":0.003,"redesign":0.08}', false),
  ('rate_limits', '{"aiPerMinute":6,"aiPerDay":200,"uploadsPerHour":60}', false),
  ('maintenance', '{"enabled":false,"message":""}', true)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Read public config" ON public.app_config;
CREATE POLICY "Read public config" ON public.app_config
  FOR SELECT USING (is_public OR (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Admins manage config" ON public.app_config;
CREATE POLICY "Admins manage config" ON public.app_config
  FOR ALL TO authenticated
  USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));

-- ---------------------------------------------------------------------------
-- 3. SUBSCRIPTIONS (server-owned; mirrors payment provider)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                      text NOT NULL DEFAULT 'free'
                              CHECK (plan IN ('free','creator','pro','business','agency')),
  status                    text NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active','trialing','past_due','canceled','expired')),
  billing_cycle             text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly','yearly')),
  provider                  text NOT NULL DEFAULT 'none' CHECK (provider IN ('none','dodo','stripe')),
  provider_subscription_id  text,
  provider_customer_id      text,
  current_period_start      timestamptz NOT NULL DEFAULT now(),
  renewal_date              timestamptz,
  cancel_at_period_end      boolean NOT NULL DEFAULT false,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS subscriptions_provider_sub_idx ON public.subscriptions (provider_subscription_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own subscription" ON public.subscriptions;
CREATE POLICY "Users read own subscription" ON public.subscriptions
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));
-- No user INSERT/UPDATE/DELETE policies: writes happen only through the service role.

-- ---------------------------------------------------------------------------
-- 4. CREDITS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.credit_balances (
  user_id                 uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                    text NOT NULL DEFAULT 'free',
  monthly_allowance       integer NOT NULL DEFAULT 5 CHECK (monthly_allowance >= 0),
  plan_credits_remaining  integer NOT NULL DEFAULT 5 CHECK (plan_credits_remaining >= 0),
  bonus_credits           integer NOT NULL DEFAULT 0 CHECK (bonus_credits >= 0),
  period_start            timestamptz NOT NULL DEFAULT now(),
  period_end              timestamptz NOT NULL DEFAULT (now() + interval '1 month'),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.credit_balances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own balance" ON public.credit_balances;
CREATE POLICY "Users read own balance" ON public.credit_balances
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

CREATE TABLE IF NOT EXISTS public.generations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id          uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  slide_id            uuid REFERENCES public.project_slides(id) ON DELETE SET NULL,
  operation           text NOT NULL
                        CHECK (operation IN ('analysis','reconstruction','background_edit','remix','redesign')),
  model               text,
  status              text NOT NULL DEFAULT 'reserved'
                        CHECK (status IN ('reserved','succeeded','partial','failed','refunded')),
  credits_reserved    integer NOT NULL DEFAULT 0 CHECK (credits_reserved >= 0),
  credits_used        integer NOT NULL DEFAULT 0 CHECK (credits_used >= 0),
  credits_from_plan   integer NOT NULL DEFAULT 0 CHECK (credits_from_plan >= 0),
  credits_from_bonus  integer NOT NULL DEFAULT 0 CHECK (credits_from_bonus >= 0),
  idempotency_key     text NOT NULL,
  input_hash          text,
  est_cost_usd        numeric(10,5) NOT NULL DEFAULT 0,
  latency_ms          integer,
  error               text,
  metadata            jsonb NOT NULL DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  completed_at        timestamptz,
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS generations_user_created_idx ON public.generations (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS generations_created_idx      ON public.generations (created_at DESC);
CREATE INDEX IF NOT EXISTS generations_reserved_idx     ON public.generations (created_at) WHERE status = 'reserved';
CREATE INDEX IF NOT EXISTS generations_project_idx      ON public.generations (project_id);
CREATE INDEX IF NOT EXISTS generations_slide_idx        ON public.generations (slide_id);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own generations" ON public.generations;
CREATE POLICY "Users read own generations" ON public.generations
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

CREATE TABLE IF NOT EXISTS public.credit_ledger (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta          integer NOT NULL,
  reason         text NOT NULL CHECK (reason IN ('grant','reserve','refund','purchase','admin_adjust','reset')),
  generation_id  uuid REFERENCES public.generations(id) ON DELETE SET NULL,
  note           text,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS credit_ledger_user_idx ON public.credit_ledger (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS credit_ledger_generation_idx ON public.credit_ledger (generation_id);

ALTER TABLE public.credit_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own ledger" ON public.credit_ledger;
CREATE POLICY "Users read own ledger" ON public.credit_ledger
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

-- ---------------------------------------------------------------------------
-- 5. USAGE (monthly aggregates)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.usage_monthly (
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month             date NOT NULL,
  credits_used      integer NOT NULL DEFAULT 0,
  projects_created  integer NOT NULL DEFAULT 0,
  exports_count     integer NOT NULL DEFAULT 0,
  analyses_count    integer NOT NULL DEFAULT 0,
  remixes_count     integer NOT NULL DEFAULT 0,
  uploads_count     integer NOT NULL DEFAULT 0,
  updated_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, month)
);
CREATE INDEX IF NOT EXISTS usage_monthly_month_idx ON public.usage_monthly (month);

ALTER TABLE public.usage_monthly ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own usage" ON public.usage_monthly;
CREATE POLICY "Users read own usage" ON public.usage_monthly
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));

-- ---------------------------------------------------------------------------
-- 6. PROJECT / CAROUSEL / SLIDE DESIGN JSON
-- ---------------------------------------------------------------------------

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS source        text NOT NULL DEFAULT 'template';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS canvas_width  integer NOT NULL DEFAULT 1080;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS canvas_height integer NOT NULL DEFAULT 1350;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status        text NOT NULL DEFAULT 'active';
CREATE INDEX IF NOT EXISTS projects_user_updated_idx ON public.projects (user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS public.carousels (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text,
  width       integer NOT NULL DEFAULT 1080,
  height      integer NOT NULL DEFAULT 1350,
  source      text NOT NULL DEFAULT 'upload' CHECK (source IN ('upload','template','blank')),
  status      text NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','uploading','analyzing','ready','partial','failed')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS carousels_project_idx ON public.carousels (project_id);
CREATE INDEX IF NOT EXISTS carousels_user_idx ON public.carousels (user_id);

ALTER TABLE public.carousels ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own carousels" ON public.carousels;
CREATE POLICY "Users manage own carousels" ON public.carousels
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER TABLE public.project_slides ADD COLUMN IF NOT EXISTS carousel_id           uuid REFERENCES public.carousels(id) ON DELETE SET NULL;
ALTER TABLE public.project_slides ADD COLUMN IF NOT EXISTS design_json           jsonb;
ALTER TABLE public.project_slides ADD COLUMN IF NOT EXISTS original_asset_id     uuid;
ALTER TABLE public.project_slides ADD COLUMN IF NOT EXISTS reconstruction_status text NOT NULL DEFAULT 'none';
ALTER TABLE public.project_slides ADD COLUMN IF NOT EXISTS confidence            numeric(4,3);
ALTER TABLE public.project_slides ADD COLUMN IF NOT EXISTS design_version        integer NOT NULL DEFAULT 1;
CREATE INDEX IF NOT EXISTS project_slides_project_idx ON public.project_slides (project_id, slide_index);
CREATE INDEX IF NOT EXISTS project_slides_carousel_idx ON public.project_slides (carousel_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'project_slides_reconstruction_status_chk') THEN
    ALTER TABLE public.project_slides ADD CONSTRAINT project_slides_reconstruction_status_chk
      CHECK (reconstruction_status IN ('none','pending','analyzing','ready','partial','failed'));
  END IF;
END $$;

-- Recreate slide policy with WITH CHECK (previously USING only).
DROP POLICY IF EXISTS "Users manage own slides" ON public.project_slides;
CREATE POLICY "Users manage own slides" ON public.project_slides
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Users manage own projects" ON public.projects;
CREATE POLICY "Users manage own projects" ON public.projects
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER TABLE public.template_slides ADD COLUMN IF NOT EXISTS design_json jsonb;

-- ---------------------------------------------------------------------------
-- 7. ASSETS (metadata only — binaries live in Storage)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.assets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id    uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  slide_id      uuid REFERENCES public.project_slides(id) ON DELETE SET NULL,
  bucket        text NOT NULL,
  storage_path  text NOT NULL,
  type          text NOT NULL
                  CHECK (type IN ('original','crop','background','preview','export','upload','ai_intermediate','logo')),
  mime_type     text,
  size_bytes    bigint,
  width         integer,
  height        integer,
  sha256        text,
  is_temporary  boolean NOT NULL DEFAULT false,
  expires_at    timestamptz,
  metadata      jsonb NOT NULL DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bucket, storage_path)
);
CREATE INDEX IF NOT EXISTS assets_user_idx     ON public.assets (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS assets_project_idx  ON public.assets (project_id);
CREATE INDEX IF NOT EXISTS assets_slide_idx    ON public.assets (slide_id);
CREATE INDEX IF NOT EXISTS assets_sha_idx      ON public.assets (sha256);
CREATE INDEX IF NOT EXISTS assets_expiry_idx   ON public.assets (expires_at) WHERE is_temporary;

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own assets" ON public.assets;
CREATE POLICY "Users read own assets" ON public.assets
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR (SELECT public.is_admin()));
DROP POLICY IF EXISTS "Users delete own assets" ON public.assets;
CREATE POLICY "Users delete own assets" ON public.assets
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);
-- Inserts go through /api (validated), so no user INSERT policy.

-- ---------------------------------------------------------------------------
-- 8. AI ANALYSIS CACHE (service-role only)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.analysis_cache (
  input_hash     text NOT NULL,
  settings_hash  text NOT NULL,
  model          text NOT NULL,
  design_json    jsonb NOT NULL,
  confidence     numeric(4,3),
  hits           integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  last_hit_at    timestamptz,
  PRIMARY KEY (input_hash, settings_hash)
);
ALTER TABLE public.analysis_cache ENABLE ROW LEVEL SECURITY;  -- no policies → only service role

-- ---------------------------------------------------------------------------
-- 9. RATE LIMITS (fixed window, service-role only)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.rate_limits (
  key           text PRIMARY KEY,
  window_start  timestamptz NOT NULL DEFAULT now(),
  count         integer NOT NULL DEFAULT 0
);
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.hit_rate_limit(p_key text, p_window_seconds integer, p_max integer)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_count integer;
  v_start timestamptz;
BEGIN
  INSERT INTO public.rate_limits AS r (key, window_start, count)
  VALUES (p_key, now(), 1)
  ON CONFLICT (key) DO UPDATE SET
    count = CASE WHEN r.window_start < now() - make_interval(secs => p_window_seconds) THEN 1 ELSE r.count + 1 END,
    window_start = CASE WHEN r.window_start < now() - make_interval(secs => p_window_seconds) THEN now() ELSE r.window_start END
  RETURNING count, window_start INTO v_count, v_start;

  RETURN jsonb_build_object(
    'allowed', v_count <= p_max,
    'count', v_count,
    'retry_after', GREATEST(0, ceil(extract(epoch FROM (v_start + make_interval(secs => p_window_seconds) - now())))::int)
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- 10. BRAND KITS
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.brand_kits (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name           text NOT NULL DEFAULT 'My Brand',
  colors         jsonb NOT NULL DEFAULT '[]',
  fonts          jsonb NOT NULL DEFAULT '{"heading":"Inter","body":"Inter"}',
  logo_asset_id  uuid REFERENCES public.assets(id) ON DELETE SET NULL,
  assets         jsonb NOT NULL DEFAULT '[]',
  is_default     boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS brand_kits_user_idx ON public.brand_kits (user_id);
CREATE INDEX IF NOT EXISTS brand_kits_logo_idx ON public.brand_kits (logo_asset_id);

ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own brand kits" ON public.brand_kits;
CREATE POLICY "Users manage own brand kits" ON public.brand_kits
  FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- 11. CREDIT FUNCTIONS (service-role only — called from /api)
-- ---------------------------------------------------------------------------

-- Plan allowance from runtime config (falls back to safe defaults).
CREATE OR REPLACE FUNCTION public.plan_allowance(p_plan text)
RETURNS integer
LANGUAGE sql STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(
    ((SELECT value FROM public.app_config WHERE key = 'plan_limits') -> p_plan ->> 'monthlyCredits')::int,
    CASE p_plan WHEN 'creator' THEN 100 WHEN 'pro' THEN 400 WHEN 'business' THEN 1500 WHEN 'agency' THEN 5000 ELSE 5 END
  );
$$;

CREATE OR REPLACE FUNCTION public.normalize_plan(p_plan text)
RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = ''
AS $$
  SELECT CASE
    WHEN p_plan IN ('free','creator','pro','business','agency') THEN p_plan
    WHEN p_plan = 'studio' THEN 'pro'
    ELSE 'free'
  END;
$$;

-- Ensure a balance row exists (lazy creation for pre-existing users).
CREATE OR REPLACE FUNCTION public.ensure_credit_balance(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_plan text;
BEGIN
  IF EXISTS (SELECT 1 FROM public.credit_balances WHERE user_id = p_user_id) THEN
    RETURN;
  END IF;
  SELECT public.normalize_plan(COALESCE(s.plan, p.plan))
    INTO v_plan
    FROM public.profiles p
    LEFT JOIN public.subscriptions s ON s.user_id = p.user_id AND s.status IN ('active','trialing','past_due')
   WHERE p.user_id = p_user_id;
  v_plan := COALESCE(v_plan, 'free');

  INSERT INTO public.credit_balances (user_id, plan, monthly_allowance, plan_credits_remaining)
  VALUES (p_user_id, v_plan, public.plan_allowance(v_plan), public.plan_allowance(v_plan))
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Lock + roll over the monthly period if needed. Returns the locked row.
CREATE OR REPLACE FUNCTION public.lock_credit_balance(p_user_id uuid)
RETURNS public.credit_balances
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  b public.credit_balances;
  v_sub_active boolean;
BEGIN
  PERFORM public.ensure_credit_balance(p_user_id);
  SELECT * INTO b FROM public.credit_balances WHERE user_id = p_user_id FOR UPDATE;

  IF b.period_end <= now() THEN
    -- Paid plan whose subscription is no longer active falls back to free.
    SELECT EXISTS (
      SELECT 1 FROM public.subscriptions
       WHERE user_id = p_user_id AND status IN ('active','trialing') AND plan = b.plan
    ) INTO v_sub_active;
    IF b.plan <> 'free' AND NOT v_sub_active THEN
      b.plan := 'free';
      b.monthly_allowance := public.plan_allowance('free');
    END IF;

    INSERT INTO public.credit_ledger (user_id, delta, reason, note)
    VALUES (p_user_id, b.monthly_allowance - b.plan_credits_remaining, 'reset', 'monthly period rollover');

    UPDATE public.credit_balances
       SET plan = b.plan,
           monthly_allowance = b.monthly_allowance,
           plan_credits_remaining = b.monthly_allowance,
           period_start = now(),
           period_end = now() + interval '1 month',
           updated_at = now()
     WHERE user_id = p_user_id
     RETURNING * INTO b;
  END IF;

  RETURN b;
END;
$$;

-- Atomically reserve credits for an AI operation.
-- Idempotent per (user, idempotency_key): duplicates never double-charge.
CREATE OR REPLACE FUNCTION public.reserve_credits(
  p_user_id          uuid,
  p_operation        text,
  p_cost             integer,
  p_idempotency_key  text,
  p_project_id       uuid DEFAULT NULL,
  p_slide_id         uuid DEFAULT NULL,
  p_model            text DEFAULT NULL,
  p_input_hash       text DEFAULT NULL,
  p_metadata         jsonb DEFAULT '{}'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  b public.credit_balances;
  g public.generations;
  v_from_plan integer;
  v_from_bonus integer;
BEGIN
  IF p_cost IS NULL OR p_cost < 0 THEN
    RAISE EXCEPTION 'Invalid credit cost' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO g FROM public.generations
   WHERE user_id = p_user_id AND idempotency_key = p_idempotency_key;
  IF FOUND THEN
    RETURN jsonb_build_object('success', true, 'duplicate', true, 'generation_id', g.id, 'status', g.status);
  END IF;

  b := public.lock_credit_balance(p_user_id);

  IF b.plan_credits_remaining + b.bonus_credits < p_cost THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_credits',
      'required', p_cost,
      'available', b.plan_credits_remaining + b.bonus_credits
    );
  END IF;

  v_from_plan  := LEAST(p_cost, b.plan_credits_remaining);
  v_from_bonus := p_cost - v_from_plan;

  UPDATE public.credit_balances
     SET plan_credits_remaining = plan_credits_remaining - v_from_plan,
         bonus_credits = bonus_credits - v_from_bonus,
         updated_at = now()
   WHERE user_id = p_user_id;

  INSERT INTO public.generations (
    user_id, project_id, slide_id, operation, model, status,
    credits_reserved, credits_from_plan, credits_from_bonus,
    idempotency_key, input_hash, metadata
  ) VALUES (
    p_user_id, p_project_id, p_slide_id, p_operation, p_model, 'reserved',
    p_cost, v_from_plan, v_from_bonus,
    p_idempotency_key, p_input_hash, COALESCE(p_metadata, '{}')
  ) RETURNING * INTO g;

  IF p_cost > 0 THEN
    INSERT INTO public.credit_ledger (user_id, delta, reason, generation_id)
    VALUES (p_user_id, -p_cost, 'reserve', g.id);
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'duplicate', false,
    'generation_id', g.id,
    'reserved', p_cost,
    'available', b.plan_credits_remaining + b.bonus_credits - p_cost
  );
EXCEPTION
  WHEN unique_violation THEN
    -- Concurrent duplicate request won the race; the subtransaction above is rolled back.
    SELECT * INTO g FROM public.generations
     WHERE user_id = p_user_id AND idempotency_key = p_idempotency_key;
    RETURN jsonb_build_object('success', true, 'duplicate', true, 'generation_id', g.id, 'status', g.status);
END;
$$;

-- Return credits from a reserved generation (failure, or partial usage).
CREATE OR REPLACE FUNCTION public.refund_generation(p_generation_id uuid, p_error text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  g public.generations;
BEGIN
  SELECT * INTO g FROM public.generations WHERE id = p_generation_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;
  IF g.status <> 'reserved' THEN
    RETURN jsonb_build_object('success', true, 'already_final', true, 'status', g.status);
  END IF;

  PERFORM public.ensure_credit_balance(g.user_id);
  UPDATE public.credit_balances
     SET plan_credits_remaining = plan_credits_remaining + g.credits_from_plan,
         bonus_credits = bonus_credits + g.credits_from_bonus,
         updated_at = now()
   WHERE user_id = g.user_id;

  UPDATE public.generations
     SET status = 'refunded', credits_used = 0, error = p_error, completed_at = now()
   WHERE id = g.id;

  IF g.credits_reserved > 0 THEN
    INSERT INTO public.credit_ledger (user_id, delta, reason, generation_id, note)
    VALUES (g.user_id, g.credits_reserved, 'refund', g.id, left(p_error, 500));
  END IF;

  RETURN jsonb_build_object('success', true, 'refunded', g.credits_reserved);
END;
$$;

-- Finalize a generation. If fewer credits were used than reserved, refund the rest.
CREATE OR REPLACE FUNCTION public.commit_generation(
  p_generation_id  uuid,
  p_status         text DEFAULT 'succeeded',
  p_credits_used   integer DEFAULT NULL,
  p_model          text DEFAULT NULL,
  p_est_cost_usd   numeric DEFAULT 0,
  p_latency_ms     integer DEFAULT NULL,
  p_metadata       jsonb DEFAULT '{}'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  g public.generations;
  v_used integer;
  v_unused integer;
  v_back_bonus integer;
  v_back_plan integer;
  v_month date := date_trunc('month', now())::date;
BEGIN
  IF p_status NOT IN ('succeeded', 'partial') THEN
    RAISE EXCEPTION 'Invalid commit status %', p_status USING ERRCODE = '22023';
  END IF;

  SELECT * INTO g FROM public.generations WHERE id = p_generation_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;
  IF g.status <> 'reserved' THEN
    RETURN jsonb_build_object('success', true, 'already_final', true, 'status', g.status);
  END IF;

  v_used := LEAST(g.credits_reserved, GREATEST(0, COALESCE(p_credits_used, g.credits_reserved)));
  v_unused := g.credits_reserved - v_used;

  IF v_unused > 0 THEN
    -- Give back bonus first (it never expires), then plan credits.
    v_back_bonus := LEAST(v_unused, g.credits_from_bonus);
    v_back_plan  := v_unused - v_back_bonus;
    PERFORM public.ensure_credit_balance(g.user_id);
    UPDATE public.credit_balances
       SET plan_credits_remaining = plan_credits_remaining + v_back_plan,
           bonus_credits = bonus_credits + v_back_bonus,
           updated_at = now()
     WHERE user_id = g.user_id;
    INSERT INTO public.credit_ledger (user_id, delta, reason, generation_id, note)
    VALUES (g.user_id, v_unused, 'refund', g.id, 'unused reservation');
  END IF;

  UPDATE public.generations
     SET status = p_status,
         credits_used = v_used,
         model = COALESCE(p_model, model),
         est_cost_usd = COALESCE(p_est_cost_usd, 0),
         latency_ms = p_latency_ms,
         metadata = metadata || COALESCE(p_metadata, '{}'),
         completed_at = now()
   WHERE id = g.id;

  INSERT INTO public.usage_monthly AS u (user_id, month, credits_used, analyses_count, remixes_count)
  VALUES (
    g.user_id, v_month, v_used,
    CASE WHEN g.operation = 'analysis' THEN 1 ELSE 0 END,
    CASE WHEN g.operation IN ('remix','redesign') THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, month) DO UPDATE SET
    credits_used   = u.credits_used + EXCLUDED.credits_used,
    analyses_count = u.analyses_count + EXCLUDED.analyses_count,
    remixes_count  = u.remixes_count + EXCLUDED.remixes_count,
    updated_at     = now();

  RETURN jsonb_build_object('success', true, 'credits_used', v_used, 'refunded', v_unused);
END;
$$;

-- Increment non-credit usage counters (exports, projects, uploads).
CREATE OR REPLACE FUNCTION public.increment_usage(p_user_id uuid, p_field text, p_amount integer DEFAULT 1)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_month date := date_trunc('month', now())::date;
BEGIN
  IF p_field NOT IN ('exports_count', 'projects_created', 'uploads_count') THEN
    RAISE EXCEPTION 'Invalid usage field %', p_field USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.usage_monthly (user_id, month) VALUES (p_user_id, v_month)
  ON CONFLICT (user_id, month) DO NOTHING;
  EXECUTE format(
    'UPDATE public.usage_monthly SET %I = %I + $1, updated_at = now() WHERE user_id = $2 AND month = $3',
    p_field, p_field
  ) USING p_amount, p_user_id, v_month;
END;
$$;

-- Set plan + grant the plan's monthly allowance (called by billing webhooks).
CREATE OR REPLACE FUNCTION public.apply_plan(
  p_user_id       uuid,
  p_plan          text,
  p_period_start  timestamptz DEFAULT now(),
  p_period_end    timestamptz DEFAULT NULL,
  p_reset_credits boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_plan text := public.normalize_plan(p_plan);
  v_allowance integer := public.plan_allowance(public.normalize_plan(p_plan));
  b public.credit_balances;
BEGIN
  PERFORM public.ensure_credit_balance(p_user_id);
  SELECT * INTO b FROM public.credit_balances WHERE user_id = p_user_id FOR UPDATE;

  UPDATE public.credit_balances
     SET plan = v_plan,
         monthly_allowance = v_allowance,
         plan_credits_remaining = CASE WHEN p_reset_credits THEN v_allowance
                                       ELSE LEAST(plan_credits_remaining, v_allowance) END,
         period_start = COALESCE(p_period_start, now()),
         period_end = COALESCE(p_period_end, COALESCE(p_period_start, now()) + interval '1 month'),
         updated_at = now()
   WHERE user_id = p_user_id;

  IF p_reset_credits THEN
    INSERT INTO public.credit_ledger (user_id, delta, reason, note)
    VALUES (p_user_id, v_allowance - b.plan_credits_remaining, 'grant', 'plan ' || v_plan);
  END IF;

  -- Keep legacy profile columns in sync for older UI code paths.
  UPDATE public.profiles
     SET plan = v_plan,
         monthly_generation_limit = v_allowance,
         period_start = COALESCE(p_period_start, now()),
         period_end = COALESCE(p_period_end, COALESCE(p_period_start, now()) + interval '1 month'),
         updated_at = now()
   WHERE user_id = p_user_id;

  RETURN jsonb_build_object('success', true, 'plan', v_plan, 'allowance', v_allowance);
END;
$$;

-- Admin manual adjustment / purchased top-ups (bonus credits; never below zero).
DROP FUNCTION IF EXISTS public.admin_adjust_credits(uuid, integer, text);
CREATE OR REPLACE FUNCTION public.admin_adjust_credits(
  p_user_id uuid,
  p_delta integer,
  p_note text DEFAULT NULL,
  p_reason text DEFAULT 'admin_adjust'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  b public.credit_balances;
  v_applied integer;
BEGIN
  IF p_reason NOT IN ('admin_adjust', 'purchase') THEN
    RAISE EXCEPTION 'Invalid reason %', p_reason USING ERRCODE = '22023';
  END IF;
  PERFORM public.ensure_credit_balance(p_user_id);
  SELECT * INTO b FROM public.credit_balances WHERE user_id = p_user_id FOR UPDATE;
  v_applied := GREATEST(p_delta, -b.bonus_credits);
  UPDATE public.credit_balances SET bonus_credits = bonus_credits + v_applied, updated_at = now()
   WHERE user_id = p_user_id;
  INSERT INTO public.credit_ledger (user_id, delta, reason, note)
  VALUES (p_user_id, v_applied, p_reason, p_note);
  RETURN jsonb_build_object('success', true, 'applied', v_applied);
END;
$$;

-- Refund reservations stuck in 'reserved' (function crashed / timed out).
CREATE OR REPLACE FUNCTION public.refund_stale_generations(p_older_than_minutes integer DEFAULT 15)
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  r record;
  n integer := 0;
BEGIN
  FOR r IN
    SELECT id FROM public.generations
     WHERE status = 'reserved'
       AND created_at < now() - make_interval(mins => p_older_than_minutes)
     FOR UPDATE SKIP LOCKED
  LOOP
    PERFORM public.refund_generation(r.id, 'timed out (auto-refund)');
    n := n + 1;
  END LOOP;
  RETURN n;
END;
$$;

-- Lock down every SECURITY DEFINER / internal function: service role only.
DO $$
DECLARE
  fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'public.hit_rate_limit(text, integer, integer)',
    'public.ensure_credit_balance(uuid)',
    'public.lock_credit_balance(uuid)',
    'public.reserve_credits(uuid, text, integer, text, uuid, uuid, text, text, jsonb)',
    'public.refund_generation(uuid, text)',
    'public.commit_generation(uuid, text, integer, text, numeric, integer, jsonb)',
    'public.increment_usage(uuid, text, integer)',
    'public.apply_plan(uuid, text, timestamptz, timestamptz, boolean)',
    'public.admin_adjust_credits(uuid, integer, text, text)',
    'public.refund_stale_generations(integer)'
  ] LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn);
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 12. SIGNUP: create profile + free subscription + credit balance
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, user_id, email, full_name, avatar_url, role, plan, subscription_status,
    monthly_generation_limit, generations_used, period_start, period_end
  ) VALUES (
    NEW.id, NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL),
    'user', 'free', 'active', public.plan_allowance('free'), 0, now(), now() + interval '1 month'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN profiles.full_name IS NULL OR profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END,
    avatar_url = COALESCE(profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = now();

  INSERT INTO public.subscriptions (user_id, plan, status, provider)
  VALUES (NEW.id, 'free', 'active', 'none')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.credit_balances (user_id, plan, monthly_allowance, plan_credits_remaining)
  VALUES (NEW.id, 'free', public.plan_allowance('free'), public.plan_allowance('free'))
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 13. BACKFILL existing users
-- ---------------------------------------------------------------------------

UPDATE public.profiles SET plan = public.normalize_plan(plan)
 WHERE plan IS DISTINCT FROM public.normalize_plan(plan);

INSERT INTO public.subscriptions (user_id, plan, status, provider, provider_subscription_id, provider_customer_id,
                                  current_period_start, renewal_date)
SELECT p.user_id,
       public.normalize_plan(p.plan),
       CASE WHEN p.subscription_status IN ('active','trialing','past_due','canceled','expired')
            THEN p.subscription_status ELSE 'active' END,
       CASE WHEN p.dodo_subscription_id IS NOT NULL THEN 'dodo' ELSE 'none' END,
       p.dodo_subscription_id, p.dodo_customer_id,
       COALESCE(p.period_start, now()), p.period_end
  FROM public.profiles p
 WHERE p.user_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.credit_balances (user_id, plan, monthly_allowance, plan_credits_remaining, bonus_credits,
                                    period_start, period_end)
SELECT p.user_id,
       public.normalize_plan(p.plan),
       public.plan_allowance(public.normalize_plan(p.plan)),
       GREATEST(0, public.plan_allowance(public.normalize_plan(p.plan)) - COALESCE(p.generations_used, 0)),
       GREATEST(0, COALESCE(p.extra_generations, 0)),
       COALESCE(p.period_start, now()),
       GREATEST(COALESCE(p.period_end, now() + interval '1 month'), now() + interval '1 day')
  FROM public.profiles p
 WHERE p.user_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 14. PRIVATE STORAGE BUCKETS  (path convention: {user_id}/{project_id}/...)
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('carousel-originals',   'carousel-originals',   false, 10485760, ARRAY['image/png','image/jpeg','image/webp']),
  ('carousel-assets',      'carousel-assets',      false, 10485760, ARRAY['image/png','image/jpeg','image/webp','image/svg+xml']),
  ('carousel-backgrounds', 'carousel-backgrounds', false, 15728640, ARRAY['image/png','image/jpeg','image/webp']),
  ('carousel-previews',    'carousel-previews',    false,  5242880, ARRAY['image/png','image/jpeg','image/webp']),
  ('carousel-exports',     'carousel-exports',     false, 52428800, ARRAY['image/png','image/jpeg','application/zip','application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Users read own carousel files" ON storage.objects;
CREATE POLICY "Users read own carousel files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id IN ('carousel-originals','carousel-assets','carousel-backgrounds','carousel-previews','carousel-exports')
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- Users may upload only into their own folder of the user-writable buckets.
-- (AI outputs in carousel-backgrounds / carousel-exports are written by the server.)
DROP POLICY IF EXISTS "Users upload own carousel files" ON storage.objects;
CREATE POLICY "Users upload own carousel files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('carousel-originals','carousel-assets','carousel-previews')
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users update own carousel files" ON storage.objects;
CREATE POLICY "Users update own carousel files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id IN ('carousel-assets','carousel-previews')
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users delete own carousel files" ON storage.objects;
CREATE POLICY "Users delete own carousel files" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id IN ('carousel-originals','carousel-assets','carousel-backgrounds','carousel-previews','carousel-exports')
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

-- ---------------------------------------------------------------------------
-- 15. updated_at triggers
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS carousels_updated_at ON public.carousels;
CREATE TRIGGER carousels_updated_at BEFORE UPDATE ON public.carousels
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS brand_kits_updated_at ON public.brand_kits;
CREATE TRIGGER brand_kits_updated_at BEFORE UPDATE ON public.brand_kits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
