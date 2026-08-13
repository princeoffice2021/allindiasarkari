import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPostsAdmin } from '../lib/postsService';
import { Post } from '../types';
import { CATEGORIES_CONFIG, ALL_INDIAN_STATES, ALL_UNION_TERRITORIES, stateToSlug } from '../data/statesAndCategories';
import { BASE_URL, updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FileCode, Globe, Check, BookOpen, MapPin, ShieldCheck, FileText } from 'lucide-react';

export const SitemapPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'html' | 'xml'>('html');

  useEffect(() => {
    updateSEO({
      title: 'Site Index & XML Sitemap - All India Sarkari',
      description: 'Explore the complete directory of government jobs, welfare schemes, admit cards, answer keys, results, and state-wise listings on allindiasarkari.com.',
      canonicalUrl: '/sitemap',
    });

    getAllPostsAdmin().then((data) => setPosts(data.filter((p) => p.published)));
  }, []);

  const baseUrl = BASE_URL;

  const trustPages = [
    { label: 'About Us', url: '/about' },
    { label: 'Contact Us', url: '/contact' },
    { label: 'Editorial & Content Policy', url: '/editorial-policy' },
    { label: 'Privacy Policy', url: '/privacy-policy' },
    { label: 'Disclaimer', url: '/disclaimer' },
    { label: 'Terms & Conditions', url: '/terms-and-conditions' },
  ];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Categories -->
  ${CATEGORIES_CONFIG.map(
    (c) => `
  <url>
    <loc>${baseUrl}/${c.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
  ).join('')}

  <!-- Trust Pages -->
  ${trustPages.map(
    (tp) => `
  <url>
    <loc>${baseUrl}${tp.url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
  ).join('')}

  <!-- States Sarkari Naukri -->
  ${ALL_INDIAN_STATES.map(
    (st) => `
  <url>
    <loc>${baseUrl}/sarkari-naukri/${stateToSlug(st)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  ).join('')}

  <!-- Published Articles -->
  ${posts
    .map(
      (p) => `
  <url>
    <loc>${baseUrl}/post/${p.slug}</loc>
    <lastmod>${new Date(p.updated_at || p.created_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: 'Sitemap' }]} />

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
            <Globe className="h-7 w-7 text-blue-800" />
            All India Sarkari Sitemap
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete index of pages, categories, states, and published articles on https://allindiasarkari.com
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'html'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-blue-900'
            }`}
          >
            HTML Sitemap
          </button>
          <button
            onClick={() => setActiveTab('xml')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'xml'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-blue-900'
            }`}
          >
            XML Payload View
          </button>
        </div>
      </div>

      {activeTab === 'html' ? (
        <div className="space-y-8">
          {/* Main Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Core Categories */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <BookOpen className="h-4 w-4 text-blue-800" />
                Notification Categories
              </h2>
              <ul className="space-y-2 text-xs">
                {CATEGORIES_CONFIG.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to={`/${c.slug}`}
                      className="text-blue-900 hover:underline font-semibold flex items-center gap-1.5"
                    >
                      <span className="text-blue-500">›</span> {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Trust & Editorial */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                Trust, Legal & Editorial
              </h2>
              <ul className="space-y-2 text-xs">
                {trustPages.map((tp) => (
                  <li key={tp.url}>
                    <Link
                      to={tp.url}
                      className="text-blue-900 hover:underline font-semibold flex items-center gap-1.5"
                    >
                      <span className="text-emerald-500">›</span> {tp.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Central & Utility Pages */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="h-4 w-4 text-amber-600" />
                Central Portals & Feeds
              </h2>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/" className="text-blue-900 hover:underline font-semibold flex items-center gap-1.5">
                    <span className="text-amber-500">›</span> Home Portal
                  </Link>
                </li>
                <li>
                  <Link to="/states" className="text-blue-900 hover:underline font-semibold flex items-center gap-1.5">
                    <span className="text-amber-500">›</span> All States Directory
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="text-blue-900 hover:underline font-semibold flex items-center gap-1.5">
                    <span className="text-amber-500">›</span> Search Job Engine
                  </Link>
                </li>
                <li>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-900 hover:underline font-semibold flex items-center gap-1.5"
                  >
                    <span className="text-amber-500">›</span> robots.txt Direct File
                  </a>
                </li>
                <li>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-900 hover:underline font-semibold flex items-center gap-1.5"
                  >
                    <span className="text-amber-500">›</span> sitemap.xml Direct File
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* All 28 States & UTs Links */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <MapPin className="h-4 w-4 text-red-600" />
              State-Wise Sarkari Naukri & Scheme Portals
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
              {ALL_INDIAN_STATES.map((st) => (
                <Link
                  key={st}
                  to={`/sarkari-naukri/${stateToSlug(st)}`}
                  className="rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-300 font-semibold truncate transition-colors"
                >
                  • {st} Jobs
                </Link>
              ))}
              {ALL_UNION_TERRITORIES.map((ut) => (
                <Link
                  key={ut}
                  to={`/sarkari-naukri/${stateToSlug(ut)}`}
                  className="rounded-lg bg-slate-50 border border-slate-200 p-2 text-slate-800 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-300 font-semibold truncate transition-colors"
                >
                  • {ut} Jobs
                </Link>
              ))}
            </div>
          </div>

          {/* Published Articles List */}
          {posts.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileCode className="h-4 w-4 text-blue-800" />
                Published Articles & Notifications ({posts.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {posts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/post/${p.slug}`}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-200 text-slate-900 hover:text-blue-900 font-medium line-clamp-1 transition-colors"
                  >
                    <span className="font-bold text-blue-800 mr-1">[{p.category}]</span> {p.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleCopyXml}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold uppercase text-white shadow-xs hover:bg-slate-800 flex items-center gap-1.5"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <FileCode className="h-4 w-4" />}
              <span>{copied ? 'XML Copied!' : 'Copy XML Payload'}</span>
            </button>
          </div>
          <div className="rounded-2xl border border-slate-300 bg-slate-950 p-5 text-slate-200 text-xs font-mono overflow-x-auto shadow-inner max-h-[550px]">
            <pre>{xmlContent}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

