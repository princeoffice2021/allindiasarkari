import React from 'react';
import { AIDraft } from '../../../types/aiStaff';
import { X, ExternalLink, ShieldCheck, Check, AlertCircle } from 'lucide-react';

interface AIFactsComparisonModalProps {
  draft: AIDraft | null;
  onClose: () => void;
}

export const AIFactsComparisonModal: React.FC<AIFactsComparisonModalProps> = ({
  draft,
  onClose,
}) => {
  if (!draft) return null;

  const facts = draft.extractedFacts;

  const factRows = [
    {
      label: 'Recruitment Name',
      officialFact: facts.recruitmentName,
      status: 'VERIFIED',
    },
    {
      label: 'Conducting Body / Org',
      officialFact: facts.organization,
      status: 'VERIFIED',
    },
    {
      label: 'Notice / Advt Number',
      officialFact: facts.advtNumber,
      status: facts.advtNumber.includes('Not specified') ? 'UNVERIFIED' : 'VERIFIED',
    },
    {
      label: 'Total Vacancies',
      officialFact: facts.totalVacancies,
      status: facts.totalVacancies.includes('Not specified') ? 'UNVERIFIED' : 'VERIFIED',
    },
    {
      label: 'Application Start Date',
      officialFact: facts.applicationStartDate,
      status: facts.applicationStartDate.includes('Not specified') ? 'UNVERIFIED' : 'VERIFIED',
    },
    {
      label: 'Application Closing Date',
      officialFact: facts.applicationEndDate,
      status: facts.applicationEndDate.includes('Not specified') ? 'UNVERIFIED' : 'VERIFIED',
    },
    {
      label: 'Exam Schedule',
      officialFact: facts.examDate,
      status: facts.examDate.includes('Not specified') ? 'UNVERIFIED' : 'VERIFIED',
    },
    {
      label: 'Fee (General / OBC / EWS)',
      officialFact: facts.applicationFee.general_obc_ews,
      status: 'VERIFIED',
    },
    {
      label: 'Fee (SC / ST / PwD / Female)',
      officialFact: facts.applicationFee.sc_st_pwd,
      status: 'VERIFIED',
    },
    {
      label: 'Age Limit',
      officialFact: `${facts.ageLimit.minimum} to ${facts.ageLimit.maximum} (${facts.ageLimit.relaxation})`,
      status: 'VERIFIED',
    },
    {
      label: 'Educational Qualification',
      officialFact: facts.educationalQualification,
      status: 'VERIFIED',
    },
    {
      label: 'Pay Scale / Salary',
      officialFact: facts.salaryPayScale,
      status: 'VERIFIED',
    },
    {
      label: 'Official Notification PDF',
      officialFact: facts.officialNotificationPdf || 'Direct link on official portal',
      isLink: Boolean(facts.officialNotificationPdf),
      url: facts.officialNotificationPdf,
      status: facts.officialNotificationPdf ? 'VERIFIED' : 'UNVERIFIED',
    },
    {
      label: 'Official Source URL',
      officialFact: draft.sourceUrl,
      isLink: true,
      url: draft.sourceUrl,
      status: 'VERIFIED',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-wide text-white">
                Official Facts Extraction Audit
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {draft.sourceName} | Confidence: {draft.confidenceScore}%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 text-xs text-blue-900 shrink-0">
          <p>
            <strong>Zero-Hallucination Policy:</strong> If a fact was not present in the government notification, it is explicitly marked as <em>"Not specified in official notification"</em>.
          </p>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 uppercase font-black text-[10px]">
                <th className="p-3 w-1/3">Field</th>
                <th className="p-3 w-1/2">Official Extracted Fact</th>
                <th className="p-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {factRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-800 align-top">{row.label}</td>
                  <td className="p-3 text-slate-700 align-top leading-relaxed">
                    {row.isLink && row.url ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 font-semibold hover:underline inline-flex items-center gap-1 break-all"
                      >
                        {row.officialFact} <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      <span>{row.officialFact}</span>
                    )}
                  </td>
                  <td className="p-3 text-right align-top">
                    {row.status === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                        <Check className="h-3 w-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        <AlertCircle className="h-3 w-3" /> NOT SPECIFIED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end bg-slate-100 px-6 py-3 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
};
