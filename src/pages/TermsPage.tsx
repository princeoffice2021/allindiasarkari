import React, { useEffect } from 'react';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Terms & Conditions - All India Sarkari',
      description: 'Terms & Conditions for browsing All India Sarkari (allindiasarkari.com).',
      canonicalUrl: '/terms-and-conditions',
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <FileText className="h-7 w-7 text-blue-800" />
              Terms & Conditions
            </h1>
            <p className="text-xs text-slate-500 mt-1">allindiasarkari.com</p>
          </div>

          <p>
            Welcome to <strong>All India Sarkari</strong>. By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            1. Intellectual Property
          </h2>
          <p>
            The original editorial summaries, design layout, and curated structural categorization on All India Sarkari are protected by intellectual property rights. Users may read, bookmark, and share links to articles for personal, non-commercial educational use.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            2. External Links Notice
          </h2>
          <p>
            Our articles contain external links pointing to official government department portals (e.g., ssc.gov.in, up.gov.in, rrbcdg.gov.in) for candidate convenience. We do not exercise control over external site content or security practices.
          </p>
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
