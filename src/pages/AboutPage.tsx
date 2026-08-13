import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { Building2, CheckCircle2, ShieldAlert, Award, FileText, Users, Mail, Compass } from 'lucide-react';
import { ALL_INDIAN_STATES } from '../data/statesAndCategories';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'About Us - All India Sarkari (allindiasarkari.com)',
      description: 'Learn about All India Sarkari (allindiasarkari.com) - India\'s leading independent portal for Sarkari Yojana, Sarkari Naukri, Results, Admit Cards & Exam updates across all 28 States & UTs.',
      canonicalUrl: '/about',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About All India Sarkari',
        url: 'https://allindiasarkari.com/about',
        mainEntity: {
          '@type': 'Organization',
          name: 'All India Sarkari',
          url: 'https://allindiasarkari.com',
          logo: 'https://allindiasarkari.com/icon.png',
          description: 'Independent national educational and government jobs informational portal.',
        },
      },
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
            <p className="text-xs text-slate-500 mt-1">allindiasarkari.com • India's National Government Jobs & Schemes Information Portal</p>
          </div>

          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <p className="text-base font-semibold text-slate-900 leading-relaxed">
              Welcome to <strong>All India Sarkari</strong> (accessible at <a href="https://allindiasarkari.com" className="text-blue-800 font-bold hover:underline">https://allindiasarkari.com</a>), a dedicated, independent educational news and career information platform serving millions of students, job seekers, and citizens across India.
            </p>

            <p>
              Navigating government employment bulletins, state recruitment portals, welfare eligibility norms, and complex notification PDFs can often be confusing. All India Sarkari was founded with a singular objective: <strong>to simplify, curate, and deliver timely, verified, and accessible government information in clear, organized Hindi and English formats.</strong>
            </p>

            <h2 className="text-lg font-black text-slate-900 border-l-4 border-blue-900 pl-3">
              Our Vision & Core Principles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  Primary Source Verification
                </div>
                <p className="text-xs text-slate-600">
                  Every job post, exam date, and scheme guide is authenticated directly against official gazettes (<code className="text-[11px]">.gov.in</code> & <code className="text-[11px]">.nic.in</code>) and Employment News before publishing.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase">
                  <Award className="h-4 w-4 text-blue-800" />
                  Clear Structured Data
                </div>
                <p className="text-xs text-slate-600">
                  We present essential data points — eligibility, age limit, category fee, important dates, and direct links — in easy-to-read tabular formats.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase">
                  <Compass className="h-4 w-4 text-amber-600" />
                  All India & State Coverage
                </div>
                <p className="text-xs text-slate-600">
                  Dedicated coverage for all 28 Indian States, 8 Union Territories, Central Ministries, Railway Recruitment Boards, Defence, SSC, and UPSC.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-xs uppercase">
                  <Users className="h-4 w-4 text-purple-700" />
                  Zero Cost to Aspirants
                </div>
                <p className="text-xs text-slate-600">
                  All educational content, notifications, syllabus summaries, and answer key updates on our website are 100% free of charge.
                </p>
              </div>
            </div>

            <h2 className="text-lg font-black text-slate-900 border-l-4 border-blue-900 pl-3">
              Comprehensive Sections We Cover
            </h2>
            <ul className="list-disc pl-5 space-y-2 font-medium">
              <li>
                <strong>Sarkari Yojana (सरकारी योजना):</strong> Complete eligibility criteria, application steps, required documents, beneficiary lists, and portal links for Central and State government welfare schemes (e.g. PM Kisan, Ayushman Bharat, PMAY, Ladli Behna, Kanya Sumangala).
              </li>
              <li>
                <strong>Sarkari Naukri (सरकारी नौकरी):</strong> Latest job vacancies across Central Ministries, Police Departments, Armed Forces (Army, Navy, Air Force), Indian Railways (RRB/RRC), Banking (IBPS/SBI), SSC, UPSC, and State Public Service Commissions.
              </li>
              <li>
                <strong>Exam Results (रिजल्ट):</strong> Official merit lists, scorecards, category-wise cut-off marks, and selection lists.
              </li>
              <li>
                <strong>Admit Cards (एडमिट कार्ड):</strong> Official hall tickets, exam city slips, and roll number search links.
              </li>
              <li>
                <strong>Answer Keys & Question Papers:</strong> Official provisional and final answer keys, objection raising portals, and solution sheets.
              </li>
              <li>
                <strong>Syllabus & Exam Pattern:</strong> Subject-wise syllabus, marks distribution, physical standards (PST/PET), and selection stage guidelines.
              </li>
              <li>
                <strong>Admissions & Scholarships:</strong> National Scholarship Portal (NSP), Central Universities entrance exams (CUET), ITI, Polytechnic, and State pre/post-matric scholarship schemes.
              </li>
            </ul>

            <h2 className="text-lg font-black text-slate-900 border-l-4 border-blue-900 pl-3">
              Editorial Guidelines & Fact Checking
            </h2>
            <p>
              Our editorial team operates under strict fact-checking guidelines. We regularly review active notifications and promptly post updates or corrigendums issued by statutory recruiting agencies. Read our complete <Link to="/editorial-policy" className="text-blue-800 font-bold underline">Editorial & Content Policy</Link> for detailed verification procedures.
            </p>

            <div className="rounded-xl bg-amber-50 border border-amber-300 p-5 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 text-sm">
                <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0" />
                Non-Government Affiliation Disclaimer
              </div>
              <p className="leading-relaxed">
                <strong>All India Sarkari</strong> (allindiasarkari.com) is an independent private educational and informational website. We are <strong>NOT</strong> affiliated with, associated with, endorsed by, or in any way connected to the Government of India, any State Government, Union Territory administration, or any statutory recruitment authority (such as UPSC, SSC, RRB, NTA, IBPS, or State PSCs).
              </p>
              <p className="leading-relaxed">
                All official department trademarks, insignia, and organization names are the intellectual property of their respective owners. Candidates are advised to cross-verify all details on official government portals before submitting applications or making fee payments.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900">Have Questions or Suggestions?</span>
                <p className="text-slate-500">Our editorial desk is available to assist you.</p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold uppercase text-white shadow-xs hover:bg-blue-950 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> Contact Our Team
              </Link>
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

