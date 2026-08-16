import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminLayout } from './components/AdminLayout';
import { initGA, trackPageView } from './lib/analytics';

// Public Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { StatePage } from './pages/StatePage';
import { StatesPage } from './pages/StatesPage';
import { PostPage } from './pages/PostPage';
import { SearchPage } from './pages/SearchPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { TermsPage } from './pages/TermsPage';
import { EditorialPolicyPage } from './pages/EditorialPolicyPage';
import { SitemapPage } from './pages/SitemapPage';
import { RobotsPage } from './pages/RobotsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPostsListPage } from './pages/admin/AdminPostsListPage';
import { AdminPostEditorPage } from './pages/admin/AdminPostEditorPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminStatesPage } from './pages/admin/AdminStatesPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminPostPreviewPage } from './pages/admin/AdminPostPreviewPage';

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
        <Routes>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/posts" element={<AdminPostsListPage />} />
          <Route path="/admin/posts/new" element={<AdminPostEditorPage />} />
          <Route path="/admin/posts/:id/edit" element={<AdminPostEditorPage />} />
          <Route path="/admin/posts/:id/preview" element={<AdminPostPreviewPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/states" element={<AdminStatesPage />} />
          <Route path="/admin/media" element={<AdminMediaPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Routes>
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col justify-between selection:bg-amber-300 selection:text-slate-950">
      <div>
        <Header />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-16 md:pb-8">
          <Routes>
            {/* Public Core Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/sarkari-yojana" element={<CategoryPage forcedCategory="Sarkari Yojana" />} />
            <Route path="/sarkari-naukri" element={<CategoryPage forcedCategory="Sarkari Naukri" />} />
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
