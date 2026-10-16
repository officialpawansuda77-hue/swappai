-- ============================================================
-- SWAPP.AI — Complete Schema Extension for Admin CMS
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ---- PROFILES (role & subscription management) ---------------------
CREATE TABLE IF NOT EXISTS profiles (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email                    TEXT,
  full_name                TEXT,
  avatar_url               TEXT,
  role                     TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  plan                     TEXT NOT NULL DEFAULT 'starter',
  subscription_status       TEXT NOT NULL DEFAULT 'active',
  monthly_generation_limit  INT NOT NULL DEFAULT 5,
  generations_used          INT NOT NULL DEFAULT 0,
  extra_generations         INT NOT NULL DEFAULT 0,
  dodo_subscription_id      TEXT,
  dodo_customer_id          TEXT,
  period_start              TIMESTAMPTZ DEFAULT now(),
  period_end                TIMESTAMPTZ DEFAULT (now() + interval '1 month'),
  created_at               TIMESTAMPTZ DEFAULT now(),
  updated_at               TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    user_id,
    email,
    full_name,
    avatar_url,
    role,
    plan,
    subscription_status,
    monthly_generation_limit,
    generations_used,
    period_start,
    period_end
  )
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL),
    'user',
    'starter',
    'active',
    5,
    0,
    now(),
    (now() + interval '1 month')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN profiles.full_name IS NULL OR profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END,
    avatar_url = COALESCE(profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---- TEMPLATE CATEGORIES ------------------------------------------
CREATE TABLE IF NOT EXISTS template_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO template_categories (name, slug, sort_order) VALUES
  ('AI',              'ai',             1),
  ('Business',        'business',       2),
  ('Marketing',       'marketing',      3),
  ('Education',       'education',      4),
  ('Personal Brand',  'personal-brand', 5),
  ('Creator',         'creator',        6),
  ('SaaS',            'saas',           7),
  ('Finance',         'finance',        8),
  ('Productivity',    'productivity',   9),
  ('Motivation',      'motivation',    10),
  ('Product',         'product',       11),
  ('Quotes',          'quotes',        12)
ON CONFLICT (slug) DO NOTHING;

-- ---- TEMPLATES ----------------------------------------------------
CREATE TABLE IF NOT EXISTS templates (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  description         TEXT,
  category_id         UUID REFERENCES template_categories(id),
  category            TEXT,  -- denormalized for easy querying
  tags                TEXT[] DEFAULT '{}',
  style               TEXT,
  audience            TEXT,
  thumbnail_url       TEXT,
  aspect_ratio        TEXT DEFAULT '4:5',
  width               INT DEFAULT 1080,
  height              INT DEFAULT 1350,
  slide_count         INT DEFAULT 0,
  is_trending         BOOLEAN DEFAULT FALSE,
  is_new              BOOLEAN DEFAULT TRUE,
  source_type         TEXT DEFAULT 'original' CHECK (source_type IN ('original','licensed','generated','reference_inspired')),
  source_url          TEXT,
  source_platform     TEXT,
  attribution_required BOOLEAN DEFAULT FALSE,
  license_notes       TEXT,
  status              TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  use_count           INT DEFAULT 0,
  created_by          UUID REFERENCES auth.users(id),
  updated_by          UUID REFERENCES auth.users(id),
  published_by        UUID REFERENCES auth.users(id),
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now(),
  published_at        TIMESTAMPTZ
);

-- ---- TEMPLATE SLIDES ----------------------------------------------
CREATE TABLE IF NOT EXISTS template_slides (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  slide_index  INT NOT NULL,
  width        INT DEFAULT 1080,
  height       INT DEFAULT 1350,
  background   JSONB DEFAULT '{"type":"solid","value":"#FFFFFF"}',
  elements     JSONB DEFAULT '[]',
  preview_url  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(template_id, slide_index)
);

-- ---- TEMPLATE ASSETS ----------------------------------------------
CREATE TABLE IF NOT EXISTS template_assets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  UUID REFERENCES templates(id) ON DELETE CASCADE,
  slide_id     UUID REFERENCES template_slides(id) ON DELETE SET NULL,
  asset_type   TEXT DEFAULT 'slide_image' CHECK (asset_type IN ('slide_image','thumbnail','image','logo','other')),
  storage_path TEXT NOT NULL,
  public_url   TEXT NOT NULL,
  width        INT,
  height       INT,
  file_size    BIGINT,
  mime_type    TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ---- TEMPLATE USAGE -----------------------------------------------
CREATE TABLE IF NOT EXISTS template_usage (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id  UUID REFERENCES templates(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  project_id   UUID,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ---- PROJECTS -----------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id  UUID REFERENCES templates(id) ON DELETE SET NULL,
  name         TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ---- PROJECT SLIDES -----------------------------------------------
CREATE TABLE IF NOT EXISTS project_slides (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  slide_index  INT NOT NULL,
  width        INT DEFAULT 1080,
  height       INT DEFAULT 1350,
  background   JSONB DEFAULT '{"type":"solid","value":"#FFFFFF"}',
  elements     JSONB DEFAULT '[]',
  preview_url  TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ---- FAVORITES ----------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id  UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, template_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates         ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_slides   ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_assets   ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_usage    ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_slides    ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites         ENABLE ROW LEVEL SECURITY;

-- Helper: is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- PROFILES
CREATE POLICY "Users view own profile"    ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own profile"  ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage profiles"    ON profiles FOR ALL USING (is_admin());
CREATE POLICY "Allow insert on profiles"  ON profiles FOR INSERT WITH CHECK (TRUE);

-- TEMPLATES: public can SELECT published; admins manage all
CREATE POLICY "Public read published templates"  ON templates FOR SELECT
  USING (status = 'published' OR is_admin());
CREATE POLICY "Admins manage templates"          ON templates FOR ALL
  USING (is_admin());

-- TEMPLATE SLIDES: same visibility as template
CREATE POLICY "Public read published slides"  ON template_slides FOR SELECT
  USING (EXISTS (SELECT 1 FROM templates t WHERE t.id = template_id AND (t.status = 'published' OR is_admin())));
CREATE POLICY "Admins manage slides"          ON template_slides FOR ALL USING (is_admin());

-- TEMPLATE ASSETS
CREATE POLICY "Public read assets"   ON template_assets FOR SELECT
  USING (EXISTS (SELECT 1 FROM templates t WHERE t.id = template_id AND (t.status = 'published' OR is_admin())));
CREATE POLICY "Admins manage assets" ON template_assets FOR ALL USING (is_admin());

-- CATEGORIES
CREATE POLICY "Anyone read categories"   ON template_categories FOR SELECT USING (TRUE);
CREATE POLICY "Admins manage categories" ON template_categories FOR ALL USING (is_admin());

-- USAGE
CREATE POLICY "Users insert own usage"   ON template_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own usage"     ON template_usage FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- PROJECTS
CREATE POLICY "Users manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins read projects"      ON projects FOR SELECT USING (is_admin());

-- PROJECT SLIDES
CREATE POLICY "Users manage own slides"  ON project_slides FOR ALL
  USING (EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND p.user_id = auth.uid()));

-- FAVORITES
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS (run manually in Storage tab or via API)
-- ============================================================
-- Bucket: carousel-templates (public)
-- Bucket: user-projects (private)
-- Bucket: thumbnails (public)

-- Storage RLS: only admins upload to carousel-templates
-- INSERT INTO storage.policies ... (configure in Supabase Dashboard)

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

CREATE OR REPLACE VIEW template_stats AS
SELECT
  (SELECT COUNT(*) FROM templates)                              AS total,
  (SELECT COUNT(*) FROM templates WHERE status = 'published')  AS published,
  (SELECT COUNT(*) FROM templates WHERE status = 'draft')      AS drafts,
  (SELECT COUNT(*) FROM templates WHERE status = 'archived')   AS archived,
  (SELECT COALESCE(SUM(use_count),0) FROM templates)           AS total_uses,
  (SELECT COUNT(*) FROM templates WHERE created_at >= date_trunc('month', now())) AS added_this_month;

-- ============================================================
-- AUTO-UPDATE UPDATED_AT
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER templates_updated_at         BEFORE UPDATE ON templates         FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER template_slides_updated_at   BEFORE UPDATE ON template_slides   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER project_slides_updated_at    BEFORE UPDATE ON project_slides    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER profiles_updated_at          BEFORE UPDATE ON profiles          FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Prevent unauthorized privilege escalation and tampering with billing/credits on profiles
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF (auth.jwt() ->> 'role') = 'service_role' OR session_user = 'postgres' THEN
    RETURN NEW;
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RETURN NEW;
  END IF;

  -- On INSERT, reset protected fields to defaults for regular users
  IF TG_OP = 'INSERT' THEN
    NEW.role := 'user';
    NEW.plan := 'starter';
    NEW.subscription_status := 'active';
    NEW.monthly_generation_limit := 5;
    NEW.generations_used := 0;
    NEW.extra_generations := 0;
    NEW.dodo_subscription_id := NULL;
    NEW.dodo_customer_id := NULL;
    RETURN NEW;
  END IF;

  -- For regular authenticated users on UPDATE, lock sensitive fields
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
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_sensitive_columns();


-- ============================================================
-- DODO PAYMENTS & WEBHOOKS
-- ============================================================

CREATE TABLE IF NOT EXISTS dodo_webhook_events (
  id           TEXT PRIMARY KEY,
  event_type   TEXT NOT NULL,
  data         JSONB,
  processed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE dodo_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read dodo webhook events"
  ON dodo_webhook_events FOR SELECT
  TO authenticated
  USING (is_admin());

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
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;

  IF v_profile.subscription_status IN ('canceled', 'expired', 'failed') AND v_profile.period_end < now() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Subscription is no longer active. Please renew your plan.',
      'status', v_profile.subscription_status
    );
  END IF;

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
