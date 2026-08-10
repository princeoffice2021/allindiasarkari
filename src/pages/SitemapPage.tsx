import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPostsAdmin } from '../lib/postsService';
import { Post } from '../types';
import { CATEGORIES_CONFIG, ALL_INDIAN_STATES, stateToSlug } from '../data/statesAndCategories';
import { BASE_URL } from '../lib/seo';
import { FileCode, Globe, Check } from 'lucide-react';

export const SitemapPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getAllPostsAdmin().then((data) => setPosts(data.filter((p) => p.published)));
  }, []);

  const baseUrl = BASE_URL;

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

  <!-- States Sarkari Naukri -->
  ${ALL_INDIAN_STATES.map(
    (st) => `
  <url>
    <loc>${baseUrl}/sarkari-naukri/${stateToSlug(st)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  ).join('')}

  <!-- Posts -->
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
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-800" />
            Dynamic XML Sitemap
          </h1>
          <p className="text-xs text-slate-500">
            https://allindiasarkari.com/sitemap.xml • Google AdSense & Search Console Ready
          </p>
        </div>

        <button
          onClick={handleCopyXml}
          className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold uppercase text-white shadow-xs hover:bg-slate-800 flex items-center gap-1.5"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <FileCode className="h-4 w-4" />}
          <span>{copied ? 'XML Copied!' : 'Copy XML Payload'}</span>
        </button>
      </div>

      <div className="rounded-xl border border-slate-300 bg-slate-950 p-4 text-slate-200 text-xs font-mono overflow-x-auto shadow-inner max-h-[500px]">
        <pre>{xmlContent}</pre>
      </div>
    </div>
  );
};
