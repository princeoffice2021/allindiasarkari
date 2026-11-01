-- ====================================================================
-- ALL INDIA SARKARI - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (ADMIN / EDITOR ROLES)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT NOT NULL,
  state TEXT,
  image_url TEXT,
  meta_description TEXT,
  keywords TEXT[],
  published BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING AND SEARCHING
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_state ON public.posts(state);
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STATES TABLE
CREATE TABLE IF NOT EXISTS public.states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  site_name TEXT DEFAULT 'All India Sarkari',
  site_description TEXT DEFAULT 'Latest Government Jobs, Results, Admit Cards & Schemes',
  canonical_url TEXT DEFAULT 'https://allindiasarkari.com',
  contact_email TEXT DEFAULT 'contact@allindiasarkari.com',
  adsense_client_id TEXT,
  adsense_enabled BOOLEAN DEFAULT false,
  google_search_console TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- ENABLE RLS ON ALL TABLES
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- POSTS POLICIES
-- --------------------------------------------------------------------

-- Public visitors: CAN ONLY READ published, non-deleted posts
CREATE POLICY "Public visitors can view published posts"
  ON public.posts
  FOR SELECT
  USING (published = true AND (is_deleted IS FALSE OR is_deleted IS NULL));

-- Authenticated Users (Admins/Editors): FULL ACCESS
CREATE POLICY "Authenticated admins can create posts"
  ON public.posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update posts"
  ON public.posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete posts"
  ON public.posts
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can view all posts including drafts"
  ON public.posts
  FOR SELECT
  TO authenticated
  USING (true);

-- --------------------------------------------------------------------
-- CATEGORIES & STATES POLICIES (PUBLIC READ, ADMIN WRITE)
-- --------------------------------------------------------------------

CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (active = true);
CREATE POLICY "Admin write categories" ON public.categories FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read states" ON public.states FOR SELECT USING (is_active = true);
CREATE POLICY "Admin write states" ON public.states FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin write settings" ON public.site_settings FOR ALL TO authenticated USING (true);

-- ====================================================================
-- 7. CAREER BLOGS & CAREER CATEGORIES
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.career_blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.career_blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language TEXT NOT NULL CHECK (language IN ('hindi', 'english')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  author_name TEXT DEFAULT 'Prince Sharma',
  image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  focus_keyword TEXT,
  canonical_url TEXT,
  published BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT career_blogs_lang_slug_unique UNIQUE (language, slug)
);

-- Fast Query Indexes
CREATE INDEX IF NOT EXISTS idx_career_blogs_lang ON public.career_blogs(language);
CREATE INDEX IF NOT EXISTS idx_career_blogs_slug ON public.career_blogs(slug);
CREATE INDEX IF NOT EXISTS idx_career_blogs_lang_slug ON public.career_blogs(language, slug);
CREATE INDEX IF NOT EXISTS idx_career_blogs_category ON public.career_blogs(category);
CREATE INDEX IF NOT EXISTS idx_career_blogs_published ON public.career_blogs(published);
CREATE INDEX IF NOT EXISTS idx_career_blogs_created_at ON public.career_blogs(created_at DESC);

-- Enable RLS
ALTER TABLE public.career_blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_blogs ENABLE ROW LEVEL SECURITY;

-- Policies for career_blog_categories
CREATE POLICY "Public read career blog categories"
  ON public.career_blog_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admin write career blog categories"
  ON public.career_blog_categories
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for career_blogs
CREATE POLICY "Public visitors can view published career blogs"
  ON public.career_blogs
  FOR SELECT
  USING (published = true AND (is_deleted IS FALSE OR is_deleted IS NULL));

CREATE POLICY "Authenticated admins can view all career blogs"
  ON public.career_blogs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated admins can insert career blogs"
  ON public.career_blogs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can update career blogs"
  ON public.career_blogs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can delete career blogs"
  ON public.career_blogs
  FOR DELETE
  TO authenticated
  USING (true);

