import React, { useEffect } from 'react';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Privacy Policy - All India Sarkari',
      description: 'Privacy Policy for All India Sarkari (allindiasarkari.com) explaining data collection, cookies, and Google AdSense guidelines.',
      canonicalUrl: '/privacy-policy',
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-blue-800" />
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 mt-1">Effective Date: January 1, 2026 • allindiasarkari.com</p>
          </div>

          <p>
            At <strong>All India Sarkari</strong> (accessible from https://allindiasarkari.com), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by All India Sarkari and how we use it.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            1. Information We Collect
          </h2>
          <p>
            When you visit our portal, we do not require user registration or creation of personal accounts to access publicly published government recruitment notifications, syllabus PDFs, or exam schedules.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            2. Log Files & Analytics
          </h2>
          <p>
            All India Sarkari follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            3. Google DoubleClick DART Cookie & AdSense
          </h2>
          <p>
            Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-800 underline">https://policies.google.com/technologies/ads</a>
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            4. Consent
          </h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
