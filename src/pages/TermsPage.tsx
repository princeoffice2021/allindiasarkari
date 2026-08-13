import React, { useEffect } from 'react';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { FileText, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export const TermsPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Terms & Conditions - All India Sarkari (allindiasarkari.com)',
      description: 'Terms and Conditions governing the use of All India Sarkari (allindiasarkari.com). Read user guidelines, liability limitations, and intellectual property rights.',
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
            <p className="text-xs text-slate-500 mt-1">
              Effective Date: January 1, 2026 • Published for allindiasarkari.com
            </p>
          </div>

          <p>
            Welcome to <strong>All India Sarkari</strong> (accessible at <a href="https://allindiasarkari.com" className="text-blue-800 font-bold hover:underline">https://allindiasarkari.com</a>). By visiting, accessing, or using this website, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of this portal.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            1. Educational & Informational Purpose
          </h2>
          <p>
            All India Sarkari is an independent digital news and career information resource. All articles, notification summaries, syllabus tables, and exam schedules are provided strictly for educational guidance and awareness of Indian citizens and competitive examination aspirants.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            2. Intellectual Property Rights
          </h2>
          <p>
            Unless otherwise stated, All India Sarkari and/or its content licensors own the intellectual property rights for all original editorial analysis, summary compilations, site layout, graphics, and custom categorization published on this website. All intellectual property rights are reserved.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You may view, download, or bookmark pages for personal, non-commercial educational use.</li>
            <li>You must not republish, sell, rent, or sub-license material from All India Sarkari for commercial resale without prior written authorization.</li>
          </ul>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-blue-800" />
            3. Hyperlinks to Official Government Portals
          </h2>
          <p>
            To assist job seekers and students, our posts include direct external links to official recruitment portals, state government departments, and statutory bodies (e.g. <code className="text-xs">upsc.gov.in</code>, <code className="text-xs">ssc.gov.in</code>, <code className="text-xs">rrbcdg.gov.in</code>).
          </p>
          <p>
            We have no control over the content, server uptime, security, or privacy practices of these third-party governmental or external websites. Inclusion of any link does not imply endorsement beyond facilitating informational verification.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            4. Limitation of Liability
          </h2>
          <p>
            While every attempt is made to keep information updated and accurate, All India Sarkari makes no guarantees or warranties regarding the completeness, timeliness, or absolute accuracy of published notifications, fee structures, or exam centers.
          </p>
          <p>
            In no event shall All India Sarkari or its editorial team be liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, the information on this website. Aspirants are strongly encouraged to verify all notifications directly with the official gazettes.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            5. User Conduct
          </h2>
          <p>
            Users agree not to use the website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the portal. Any unauthorized attempt to breach server infrastructure or execute malicious scripts is strictly prohibited.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right to revise these Terms and Conditions at any time. By continuing to use the website following any updates, you agree to be bound by the revised terms.
          </p>
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

