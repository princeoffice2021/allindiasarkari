import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
 import { Sidebar } from '../components/Sidebar';
import { AlertTriangle, ShieldAlert, CheckCircle2, FileCheck, HelpCircle } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Disclaimer - All India Sarkari (allindiasarkari.com)',
      description: 'Official Legal Disclaimer for All India Sarkari (allindiasarkari.com). Clarifying independent educational non-government status and information verification advice.',
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
            <p className="text-xs text-slate-500 mt-1">allindiasarkari.com • Legal & Non-Affiliation Declaration</p>
          </div>

          <div className="rounded-xl bg-amber-50 border-2 border-amber-300 p-5 text-xs text-amber-950 font-medium leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-sm text-red-700 font-black uppercase">
              <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
              Crucial Notice to All Visitors & Aspirants
            </div>
            <p className="text-slate-800 text-xs sm:text-sm leading-relaxed">
              <strong>All India Sarkari</strong> (<a href="https://allindiasarkari.com" className="text-blue-900 font-bold underline">https://allindiasarkari.com</a>) is an <strong>independent, privately operated educational and career informational portal</strong>. We are <strong>NOT</strong> an official website of the Government of India, any State Government, Union Territory administration, or any statutory recruitment commission / board (such as UPSC, SSC, RRB, NTA, IBPS, CBSE, State PSCs, or State Police Recruitment Boards).
            </p>
          </div>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            1. Informational & Educational Scope
          </h2>
          <p>
            The content, exam analysis, syllabus overviews, dates, eligibility details, and application instructions published on All India Sarkari are compiled from publicly available official gazette notifications, Employment News, and department press releases solely for the educational benefit, convenience, and awareness of candidates.
          </p>
          <p>
            While our editorial team endeavors to ensure that all data is current, accurate, and verified, errors or subsequent departmental modifications can happen. We make no representations or warranties of any kind, express or implied, regarding completeness, reliability, or suitability for any specific purpose.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-700" />
            2. Mandatory Verification with Official Gazette
          </h2>
          <p>
            Candidates, students, and citizens are <strong>strictly advised to verify all critical eligibility criteria, reservation policies, age calculations, application deadlines, and fee requirements directly from the official department notification PDF / official portal</strong> before submitting online application forms or making financial transactions.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            3. No Monetary Collections or Job Guarantees
          </h2>
          <p>
            All India Sarkari <strong>NEVER</strong> demands, collects, or solicits money, application fees, coaching charges, or job placement fees from users. We do not guarantee recruitment or selection in any government or public enterprise. Beware of phishing emails, unauthorized calls, or fraudulent social media accounts pretending to represent this portal.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            4. Logos, Trademarks & Department Names
          </h2>
          <p>
            All organization names, logos, emblems, and trademarks referenced on All India Sarkari remain the exclusive intellectual property of their respective government ministries, state departments, and recruitment commissions. Their use on this website is strictly descriptive for referential and identification purposes under nominative fair use.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            5. External Links
          </h2>
          <p>
            Links provided on our portal redirect directly to official departmental servers. We are not responsible for the availability, server uptime, or privacy policies of those external websites.
          </p>

          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500">
            For corrections, questions, or reporting discrepancies, please visit our <Link to="/contact" className="text-blue-800 font-bold underline">Contact Page</Link> or review our <Link to="/editorial-policy" className="text-blue-800 font-bold underline">Editorial & Content Policy</Link>.
          </div>
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

