import React from 'react';
import { Link } from 'react-router-dom';
import { Flag, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';
import { CATEGORIES_CONFIG, ALL_INDIAN_STATES, ALL_STATES_AND_UTS, stateToSlug } from '../data/statesAndCategories';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t-4 border-blue-800">
      {/* Top Disclaimer Banner */}
      <div className="bg-slate-950 border-b border-slate-800 py-3 px-4 text-center text-[11px] text-amber-300">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
          <p className="font-semibold">
            <strong>Disclaimer:</strong> All India Sarkari (allindiasarkari.com) is an independent informative web portal. We are NOT associated or affiliated with any Central or State Government department.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: About */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-700 text-white font-black">
              AIS
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase text-white tracking-wider">
                All India Sarkari
              </h3>
              <p className="text-[10px] text-slate-400">allindiasarkari.com</p>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed text-[11px]">
            India’s trusted national government portal for Sarkari Yojana, Sarkari Naukri, exam results, admit cards, official answer keys, syllabus PDF downloads, scholarships, and daily current affairs across all 28 States & UTs.
          </p>

          <div className="flex items-center gap-2 pt-1 text-slate-400 font-semibold text-[11px]">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Fast, Reliable & AdSense Compliant</span>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            Categories
          </h4>
          <ul className="space-y-2">
            {CATEGORIES_CONFIG.map((cat) => (
              <li key={cat.slug}>
                <Link
                  to={`/${cat.slug}`}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <span className="text-blue-500">›</span> {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Popular State Sarkari Naukri */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            State Sarkari Naukri
          </h4>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
            {ALL_INDIAN_STATES.slice(0, 12).map((st) => {
              const slug = stateToSlug(st);
              return (
                <Link
                  key={st}
                  to={`/sarkari-naukri/${slug}`}
                  className="hover:text-amber-300 transition-colors truncate"
                >
                  • {st}
                </Link>
              );
            })}
          </div>
          <Link
            to="/sarkari-naukri"
            className="inline-block text-amber-400 hover:underline font-bold pt-1"
          >
            View All {ALL_STATES_AND_UTS.length} States & UTs Jobs →
          </Link>
        </div>

        {/* Col 4: Legal & Important */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
            Important & Trust
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="hover:text-amber-300 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-amber-300 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/editorial-policy" className="hover:text-amber-300 transition-colors">
                Editorial & Content Policy
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-amber-300 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/disclaimer" className="hover:text-amber-300 transition-colors">
                Disclaimer
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="hover:text-amber-300 transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/sitemap" className="hover:text-amber-300 transition-colors">
                HTML / XML Sitemap
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="text-emerald-400 font-bold hover:underline">
                Admin Panel Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 py-4 px-4 text-center text-slate-500 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <p>© 2026 All India Sarkari (allindiasarkari.com). All Rights Reserved.</p>
          <p className="text-slate-400">
            National Portal for Government Jobs, Schemes & Exam Notifications
          </p>
        </div>
      </div>
    </footer>
  );
};
