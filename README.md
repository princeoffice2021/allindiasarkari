# All India Sarkari (allindiasarkari.com)

**All India Sarkari** is a production-ready, ultra-fast, SEO-friendly National Government Jobs & Welfare Schemes Information Portal. It covers Central Government notifications and all 28 Indian States & 8 Union Territories with real-time Supabase PostgreSQL database support.

Production Domain: [https://allindiasarkari.com](https://allindiasarkari.com)

---

## 🌟 Key Features

1. **National Coverage**:
   - Central Government Jobs & PM Schemes
   - State-wise Sarkari Naukri pages for all 28 States & 8 Union Territories
2. **Core Categories**:
   - Sarkari Yojana (PM & State Welfare Schemes)
   - Sarkari Naukri (UPSC, SSC, Railways, Banking, Police, State PSCs)
   - Results & Cut Off Marks
   - Admit Card & Hall Tickets
   - Answer Key & Solutions
   - Syllabus PDF & Exam Pattern
   - Scholarships (NSP, Post-Matric)
   - Daily Current Affairs & GK Updates
3. **SEO & AdSense Optimization**:
   - Dynamic OpenGraph, Twitter Cards, Canonical URLs
   - Dynamic Article & Breadcrumb JSON-LD Microdata
   - Clean `sitemap.xml` and `robots.txt`
   - AdSense-ready placeholder slots
4. **Admin CMS & Security**:
   - Protected Admin Portal (`/admin`) with Login (`/admin/login`)
   - Create, Edit, Draft, Publish, Unpublish, and Delete posts
   - Auto-generated SEO Slugs & Official Source Link validation
   - Supabase Auth + RLS (Row Level Security) protection for database state

---

## 🚀 Local Development

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/your-username/all-india-sarkari.git
cd all-india-sarkari
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
VITE_SITE_URL=https://allindiasarkari.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔑 Environment Variable Documentation

| Variable Name | Required | Description |
|---|---|---|
| `VITE_SITE_URL` | Yes | The canonical production domain URL (`https://allindiasarkari.com`). |
| `VITE_SUPABASE_URL` | Yes | Your Supabase project API URL. |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous public client key (designed for safe browser usage with Row Level Security). |
| `VITE_ADSENSE_CLIENT_ID` | Optional | Your Google AdSense publisher ID (e.g., `ca-pub-XXXXXXXXXXXXXXXX`). |

*Security Notice:* Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code or `.env` files committed to Git.

---

## 🗄️ Supabase PostgreSQL Setup

1. Create a project at [Supabase](https://supabase.com).
2. Execute the database schema script from `supabase/schema.sql` in the **SQL Editor**.
3. Enable Row Level Security (RLS) on all tables (already enabled in schema).
4. Create your Admin user in **Supabase Dashboard -> Authentication -> Users**.
5. Copy your project URL and `anon` key into `.env.local` / Vercel Environment Variables.

---

## 🌐 Deployment Guidelines (GitHub -> Vercel)

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - All India Sarkari"
   git branch -M main
   git remote add origin https://github.com/your-username/all-india-sarkari.git
   git push -u origin main
   ```
2. Connect repository to [Vercel](https://vercel.com).
3. Set Framework Preset to **Vite**.
4. Configure Environment Variables in Vercel:
   - `VITE_SITE_URL`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADSENSE_CLIENT_ID`
5. Click **Deploy**.

---

## 📄 License & Disclaimer
All India Sarkari (allindiasarkari.com) is an independent informational portal. Information is provided for public reference; official recruitment notifications and government portals should always be consulted for final verification.

