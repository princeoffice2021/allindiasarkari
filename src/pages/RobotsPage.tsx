import React from 'react';
import { FileText } from 'lucide-react';

export const RobotsPage: React.FC = () => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/private

Sitemap: https://allindiasarkari.com/sitemap.xml`;

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-800" />
          Robots.txt Directive
        </h1>
        <p className="text-xs text-slate-500">https://allindiasarkari.com/robots.txt</p>
      </div>

      <div className="rounded-xl border border-slate-300 bg-slate-950 p-6 text-emerald-400 font-mono text-sm leading-relaxed shadow-inner">
        <pre>{robotsTxt}</pre>
      </div>
    </div>
  );
};
