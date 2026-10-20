import React from 'react';
import { UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthorBioProps {
  className?: string;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ className = '' }) => {
  return (
    <section
      aria-label="Author Information"
      className={`rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-slate-50/60 to-blue-50/40 p-4 sm:p-5 md:p-6 shadow-2xs transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Author Avatar / Initials Badge */}
        <div className="relative shrink-0">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-900 via-blue-950 to-indigo-950 text-white shadow-md ring-2 ring-white">
            <span className="text-xl sm:text-2xl font-black tracking-wider text-amber-300">
              PS
            </span>
          </div>
          {/* Verified Badge */}
          <div
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white ring-2 ring-white shadow-xs"
            title="Verified Author"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Author Details & Bio Paragraph */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Prince Sharma
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-0.5 text-[11px] font-bold text-blue-900 border border-blue-200">
                  <UserCheck className="h-3 w-3 text-blue-700" /> Verified Author
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                <Sparkles className="h-3 w-3 text-amber-500" /> Content Creator & Government Updates Researcher
              </p>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:inline-block">
              All India Sarkari Editorial
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal text-justify sm:text-left">
            Prince Sharma is the author and content creator at All India Sarkari, providing the latest updates on government jobs, Sarkari Yojana, exam results, admit cards, answer keys, syllabuses, scholarships, and important public announcements. He aims to make reliable government-related information easy to understand for job seekers and students across India. His articles explain important dates, eligibility criteria, application processes, examination updates, and official notifications in a clear and organized format. Readers are encouraged to verify important information through the relevant official government website before taking action.
          </p>
        </div>
      </div>
    </section>
  );
};
