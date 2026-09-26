-- ============================================================
-- SWAPP.AI — Production Readiness Database & Storage Migration
-- Version: 20260927_production_setup.sql
-- ============================================================

-- 1. Ensure extensions schema is enabled
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto"  WITH SCHEMA extensions;

-- 2. Extend PROFILES table with subscription & usage tracking columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan                     TEXT NOT NULL DEFAULT 'starter',
  ADD COLUMN IF NOT EXISTS subscription_status       TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS monthly_generation_limit  INT NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS generations_used          INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS period_start              TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS period_end                TIMESTAMPTZ DEFAULT (now() + interval '1 month');

-- 3. Update public.handle_new_user() trigger function
-- Fixes "Database error saving new user" by setting search_path to public, extensions
-- and populates default starter plan and generation limits.
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

-- 4. Storage Buckets Creation (if not present)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('carousel-templates', 'carousel-templates', true),
  ('thumbnails', 'thumbnails', true),
  ('user-projects', 'user-projects', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 5. Storage Row Level Security (RLS) Policies on storage.objects
-- Carousel Templates Bucket (Public Read, Authenticated Write)
DROP POLICY IF EXISTS "Public Read carousel-templates" ON storage.objects;
CREATE POLICY "Public Read carousel-templates"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'carousel-templates');

DROP POLICY IF EXISTS "Authenticated Upload carousel-templates" ON storage.objects;
CREATE POLICY "Authenticated Upload carousel-templates"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'carousel-templates');

DROP POLICY IF EXISTS "Authenticated Update carousel-templates" ON storage.objects;
CREATE POLICY "Authenticated Update carousel-templates"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'carousel-templates');

DROP POLICY IF EXISTS "Authenticated Delete carousel-templates" ON storage.objects;
CREATE POLICY "Authenticated Delete carousel-templates"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'carousel-templates');

-- Thumbnails Bucket (Public Read, Authenticated Write)
DROP POLICY IF EXISTS "Public Read thumbnails" ON storage.objects;
CREATE POLICY "Public Read thumbnails"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Authenticated Upload thumbnails" ON storage.objects;
CREATE POLICY "Authenticated Upload thumbnails"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Authenticated Update thumbnails" ON storage.objects;
CREATE POLICY "Authenticated Update thumbnails"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'thumbnails');

-- User Projects Bucket (Private, Owner Only)
DROP POLICY IF EXISTS "User Access own project assets" ON storage.objects;
CREATE POLICY "User Access own project assets"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'user-projects' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'user-projects' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 6. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON public.projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_slides_project_id ON public.project_slides(project_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_status ON public.templates(status);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON public.templates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
