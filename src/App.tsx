import React, { useEffect, useRef, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { initGA, trackPageView } from './lib/analytics';

// Lazy-loaded Admin Layout
const AdminLayout = lazy(() => import('./components/AdminLayout').then((m) => ({ default: m.AdminLayout })));

// Lazy-loaded Public Pages
const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const LatestUpdatesPage = lazy(() => import('./pages/LatestUpdatesPage').then((m) => ({ default: m.LatestUpdatesPage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const StatePage = lazy(() => import('./pages/StatePage').then((m) => ({ default: m.StatePage })));
const StatesPage = lazy(() => import('./pages/StatesPage').then((m) => ({ default: m.StatesPage })));
const PostPage = lazy(() => import('./pages/PostPage').then((m) => ({ default: m.PostPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage').then((m) => ({ default: m.DisclaimerPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const EditorialPolicyPage = lazy(() => import('./pages/EditorialPolicyPage').then((m) => ({ default: m.EditorialPolicyPage })));
const SitemapPage = lazy(() => import('./pages/SitemapPage').then((m) => ({ default: m.SitemapPage })));
const RobotsPage = lazy(() => import('./pages/RobotsPage').then((m) => ({ default: m.RobotsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Lazy-loaded Admin Pages (isolated completely from public visitors)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminPostsListPage = lazy(() => import('./pages/admin/AdminPostsListPage').then((m) => ({ default: m.AdminPostsListPage })));
const AdminPostEditorPage = lazy(() => import('./pages/admin/AdminPostEditorPage').then((m) => ({ default: m.AdminPostEditorPage })));
const AdminCategoriesPage = lazy(() => import('./pages/admin/AdminCategoriesPage').then((m) => ({ default: m.AdminCategoriesPage })));
const AdminStatesPage = lazy(() => import('./pages/admin/AdminStatesPage').then((m) => ({ default: m.AdminStatesPage })));
const AdminMediaPage = lazy(() => import('./pages/admin/AdminMediaPage').then((m) => ({ default: m.AdminMediaPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));
const AdminPostPreviewPage = lazy(() => import('./pages/admin/AdminPostPreviewPage').then((m) => ({ default: m.AdminPostPreviewPage })));
const AIStaffDashboardPage = lazy(() => import('./pages/admin/ai-staff/AIStaffDashboardPage').then((m) => ({ default: m.AIStaffDashboardPage })));

// Minimal non-blocking fallback spinner
function PageLoadingFallback() {
  return (
    <div className="py-16 flex flex-col items-center justify-center min-h-[300px] space-y-3">
      <div className="h-8 w-8 rounded-full border-3 border-blue-900 border-t-transparent animate-spin" />
      <span className="text-xs font-bold text-slate-500">Loading All India Sarkari...</span>
    </div>
  );
}

// Scroll To Top component on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Analytics Tracker: loads GA4 script once, tracks initial view and all SPA route transitions
function AnalyticsTracker() {
  const location = useLocation();
  const lastTrackedPathRef = useRef<string>('');

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    const fullPath = `${location.pathname}${location.search}`;

    // Prevent duplicate page_view events on rapid re-renders
    if (lastTrackedPathRef.current === fullPath) {
      return;
    }
    lastTrackedPathRef.current = fullPath;

    // Small delay to allow updateSEO() in route components to set the accurate document.title
    const timer = setTimeout(() => {
      trackPageView(fullPath, document.title);
    }, 80);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}

// Inner App with conditional layout based on route
function MainLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  if (isAdminRoute) {
    return (
      <AdminLayout>
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/ai-staff" element={<AIStaffDashboardPage />} />
            <Route path="/admin/ai-staff/*" element={<AIStaffDashboardPage />} />
            <Route path="/admin/posts" element={<AdminPostsListPage />} />
            <Route path="/admin/posts/new" element={<AdminPostEditorPage />} />
            <Route path="/admin/posts/:id/edit" element={<AdminPostEditorPage />} />
            <Route path="/admin/posts/:id/preview" element={<AdminPostPreviewPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/states" element={<AdminStatesPage />} />
            <Route path="/admin/media" element={<AdminMediaPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Routes>
        </Suspense>
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col justify-between selection:bg-amber-300 selection:text-slate-950">
      <div>
        <Header />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-16 md:pb-8">
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              {/* Public Core Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/latest-updates" element={<LatestUpdatesPage />} />
              <Route path="/sarkari-yojana" element={<CategoryPage forcedCategory="Sarkari Yojana" />} />
              <Route path="/sarkari-naukri" element={<StatesPage />} />
              <Route path="/sarkari-naukri/:stateSlug" element={<StatePage />} />
              <Route path="/state/:stateSlug" element={<StatePage />} />
              <Route path="/jobs/:stateSlug" element={<StatePage />} />
              <Route path="/states" element={<StatesPage />} />
              <Route path="/results" element={<CategoryPage forcedCategory="Results" />} />
              <Route path="/admit-card" element={<CategoryPage forcedCategory="Admit Card" />} />
              <Route path="/answer-key" element={<CategoryPage forcedCategory="Answer Key" />} />
              <Route path="/syllabus" element={<CategoryPage forcedCategory="Syllabus" />} />
              <Route path="/scholarship" element={<CategoryPage forcedCategory="Scholarship" />} />
              <Route path="/current-affairs" element={<CategoryPage forcedCategory="Current Affairs" />} />
              
              {/* Category Prefix Routes */}
              <Route path="/category/:categorySlug" element={<CategoryPage />} />

              {/* Dynamic Post Routes */}
              <Route path="/post/:slug" element={<PostPage />} />
              <Route path="/posts/:slug" element={<PostPage />} />
              <Route path="/search" element={<SearchPage />} />

              {/* Legal & Info */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/editorial-policy" element={<EditorialPolicyPage />} />
              <Route path="/content-policy" element={<EditorialPolicyPage />} />

              {/* Sitemap & Robots */}
              <Route path="/sitemap.xml" element={<SitemapPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/robots.txt" element={<RobotsPage />} />
              <Route path="/robots" element={<RobotsPage />} />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Category Slug Fallback */}
              <Route path="/:categorySlug" element={<CategoryPage />} />

              {/* 404 Catch All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>

      <div>
        <Footer />
        <MobileBottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnalyticsTracker />
      <MainLayout />
    </BrowserRouter>
  );
}
