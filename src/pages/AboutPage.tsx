import React, { useEffect } from 'react';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { Building2, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'About Us - All India Sarkari',
      description: 'Learn about All India Sarkari (allindiasarkari.com) - India\'s trusted national government jobs and schemes portal.',
      canonicalUrl: '/about',
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <Building2 className="h-7 w-7 text-blue-800" />
              About All India Sarkari
            </h1>
            <p className="text-xs text-slate-500 mt-1">allindiasarkari.com - National Government Information Portal</p>
          </div>

          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <p className="text-base font-semibold text-slate-900">
              Welcome to <strong>All India Sarkari</strong> (allindiasarkari.com), a comprehensive, fast, and user-centric national informational website dedicated to delivering accurate updates on Indian government schemes, job vacancies, recruitment exams, results, admit cards, answer keys, syllabus, and scholarships.
            </p>

            <h2 className="text-lg font-black text-slate-900 border-l-4 border-blue-900 pl-3">
              Our Primary Mission
            </h2>
            <p>
              Millions of job seekers, students, and citizens across India face challenges navigating complex government departmental websites. Our primary mission is to simplify access to crucial information by providing clear, well-formatted, and timely updates in one organized platform.
            </p>

            <h2 className="text-lg font-black text-slate-900 border-l-4 border-blue-900 pl-3">
              Key Sections We Cover
            </h2>
            <ul className="list-disc pl-5 space-y-2 font-medium">
              <li><strong>Sarkari Yojana:</strong> Central PM Schemes, State Welfare Programs, Farmer Subsidies & Financial Support.</li>
              <li><strong>Sarkari Naukri:</strong> Central Govt Jobs, Police Recruitment, Defence, Railways, Banking, UPSC, SSC & State PSCs for all 28 Indian States & UTs.</li>
              <li><strong>Exam Results:</strong> Official Merit Lists, Cut Off Marks, Selection Score Cards.</li>
              <li><strong>Admit Cards:</strong> Direct Hall Ticket Download Links & Exam City Slips.</li>
              <li><strong>Answer Keys & Syllabus:</strong> Official Answer Solutions, Objection Trackers, Detailed PDF Syllabus & Marking Schemes.</li>
              <li><strong>Scholarships:</strong> National Scholarship Portal (NSP), State Post-Matric & Higher Education Fellowships.</li>
            </ul>

            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 text-sm">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
                Non-Government Affiliation Disclaimer
              </div>
              <p>
                <strong>All India Sarkari</strong> is an independent educational and informational publication. We are <strong>NOT</strong> an official government website and have no direct association, authorization, or affiliation with the Government of India, any State Government, or any recruitment board. All official logos, trademarks, and department names belong to their respective statutory owners.
              </p>
            </div>
          </div>
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
