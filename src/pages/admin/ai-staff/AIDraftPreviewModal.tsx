import React from 'react';
import { AIDraft } from '../../../types/aiStaff';
import { X, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, FileText, Calendar, DollarSign, Users, Award } from 'lucide-react';

interface AIDraftPreviewModalProps {
  draft: AIDraft | null;
  onClose: () => void;
  onApproveAndPublish: (draftId: string) => void;
  onEdit: (draft: AIDraft) => void;
}

export const AIDraftPreviewModal: React.FC<AIDraftPreviewModalProps> = ({
  draft,
  onClose,
  onApproveAndPublish,
  onEdit,
}) => {
  if (!draft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-amber-300 font-bold text-xs">
              AI
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wide text-white flex items-center gap-2">
                Draft Article Preview
                <span className="rounded-md bg-amber-400/20 text-amber-300 px-2 py-0.5 text-[10px] font-bold border border-amber-400/30">
                  {draft.status}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Source: <span className="text-slate-200">{draft.sourceName}</span> ({draft.sourceDomain})
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

        {/* Warning / Notification Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Draft Mode:</strong> This article is private to the Admin Portal and will NOT be visible to public visitors until you click <em>"Approve & Publish"</em>.
            </span>
          </div>
          <a
            href={draft.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline shrink-0 ml-4"
          >
            Verify Official Source ↗
          </a>
        </div>

        {/* Scrollable Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Article Header */}
          <div className="space-y-3 border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-blue-100 text-blue-900 px-2.5 py-1 text-xs font-black uppercase">
                {draft.draftData.category}
              </span>
              <span className="rounded-md bg-slate-100 text-slate-700 px-2.5 py-1 text-xs font-bold">
                State: {draft.draftData.state || 'Central / All India'}
              </span>
              <span className="rounded-md bg-emerald-100 text-emerald-800 px-2.5 py-1 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> AI Confidence: {draft.confidenceScore}%
              </span>
              {draft.notificationNumber && (
                <span className="rounded-md bg-slate-100 font-mono text-slate-700 px-2 py-0.5 text-xs">
                  Advt: {draft.notificationNumber}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {draft.draftData.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {draft.draftData.shortDescription}
            </p>
          </div>

          {/* Key Facts Highlight Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-blue-700" /> Vacancies
              </span>
              <p className="text-xs font-black text-slate-900 mt-1 truncate">
                {draft.extractedFacts.totalVacancies}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-red-600" /> Last Date
              </span>
              <p className="text-xs font-black text-red-600 mt-1 truncate">
                {draft.extractedFacts.applicationEndDate}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Application Fee
              </span>
              <p className="text-xs font-black text-slate-900 mt-1 truncate">
                {draft.extractedFacts.applicationFee.general_obc_ews}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-purple-600" /> Salary Scale
              </span>
              <p className="text-xs font-black text-slate-900 mt-1 truncate">
                {draft.extractedFacts.salaryPayScale}
              </p>
            </div>
          </div>

          {/* Rendered HTML Content */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Article Body & Formatted Data Tables
            </h3>
            <div
              className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: draft.draftData.content }}
            />
          </div>

          {/* Direct Links Section Preview */}
          {draft.draftData.importantLinks?.length > 0 && (
            <div className="rounded-xl border-2 border-blue-900 bg-white overflow-hidden shadow-xs">
              <div className="bg-blue-900 text-amber-300 px-4 py-2.5 text-xs font-black uppercase tracking-wide flex items-center gap-2">
                🔗 Direct Links
              </div>
              <div className="divide-y divide-slate-200">
                {draft.draftData.importantLinks.map((link, idx) => (
                  <div key={idx} className="flex flex-wrap items-center justify-between p-3 hover:bg-slate-50 gap-2">
                    <span className="text-xs font-extrabold text-slate-900">{link.label}</span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-xs font-black uppercase text-white hover:bg-red-700"
                    >
                      Click Here ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO Metadata Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
              SEO & Search Meta
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div>
                <strong>SEO Title:</strong> {draft.draftData.metaTitle}
              </div>
              <div>
                <strong>URL Slug:</strong> <code className="text-blue-700 font-mono">/post/{draft.draftData.suggestedSlug}</code>
              </div>
              <div className="sm:col-span-2">
                <strong>Meta Description:</strong> {draft.draftData.metaDescription}
              </div>
              <div className="sm:col-span-2">
                <strong>Keywords:</strong> {draft.draftData.keywords.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 px-6 py-4 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl bg-white border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close Preview
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(draft);
              }}
              className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors"
            >
              Edit Draft Content
            </button>

            {draft.status !== 'PUBLISHED' && (
              <button
                onClick={() => {
                  onClose();
                  onApproveAndPublish(draft.id);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-black uppercase text-white shadow-sm hover:bg-emerald-500 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve & Publish Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
