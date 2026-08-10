import React, { useEffect } from 'react';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Disclaimer - All India Sarkari',
      description: 'Official Disclaimer for All India Sarkari (allindiasarkari.com) clarifying independent non-government status.',
      canonicalUrl: '/disclaimer',
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Disclaimer' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
              Official Disclaimer
            </h1>
            <p className="text-xs text-slate-500 mt-1">allindiasarkari.com</p>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 text-xs text-amber-950 font-bold leading-relaxed space-y-2">
            <p className="text-sm text-red-700 font-black uppercase">Important Legal Notice:</p>
            <p>
              All India Sarkari (allindiasarkari.com) is NOT an official website of the Government of India, any State Government, Union Territory administration, or statutory recruitment board (such as UPSC, SSC, RRB, NTA, IBPS, or State PSCs).
            </p>
          </div>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            1. Informational Purpose Only
          </h2>
          <p>
            All information published on All India Sarkari is for general educational and guidance purposes only. While we make every effort to maintain up-to-date and accurate information extracted from official government employment news bulletins and gazette notifications, we make no representations or warranties of any kind regarding accuracy, completeness, or reliability.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            2. Verify With Official Gazette
          </h2>
          <p>
            Candidates and users are strictly advised to cross-check all job eligibility criteria, fee submission details, age limits, and notification dates directly on the official department portal specified in each article before filling out application forms or making financial payments.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            3. No Monetary Fees
          </h2>
          <p>
            All India Sarkari NEVER collects recruitment application fees, interview charges, or job placement fees from readers. Beware of fraudulent emails or phone calls claiming employment on behalf of this site.
          </p>
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
