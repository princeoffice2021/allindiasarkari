import React, { useState } from 'react';
import { AIDraft, DraftStatus } from '../../../types/aiStaff';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Edit,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertTriangle,
  Calendar,
  DollarSign,
  Users,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AIDraftsReviewTabProps {
  drafts: AIDraft[];
  onOpenPreview: (draft: AIDraft) => void;
  onOpenEdit: (draft: AIDraft) => void;
  onOpenFacts: (draft: AIDraft) => void;
  onApproveAndPublish: (draftId: string) => void;
  onReject: (draftId: string, reason: string) => void;
  onDelete: (draftId: string) => void;
}

type DateFilterType = 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'ALL';

function getKolkataDateString(dateInput: string | Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(typeof dateInput === 'string' ? new Date(dateInput) : dateInput);
}

export const AIDraftsReviewTab: React.FC<AIDraftsReviewTabProps> = ({
  drafts,
  onOpenPreview,
  onOpenEdit,
  onOpenFacts,
  onApproveAndPublish,
  onReject,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DraftStatus | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('TODAY');
  const [rejectingDraftId, setRejectingDraftId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const todayIST = getKolkataDateString();
  const yesterdayIST = getKolkataDateString(new Date(Date.now() - 86400000));

  const handleConfirmReject = () => {
    if (!rejectingDraftId) return;
    onReject(rejectingDraftId, rejectReason || 'Ineligible or duplicate content');
    setRejectingDraftId(null);
    setRejectReason('');
  };

  const filteredDrafts = drafts.filter(d => {
    const matchesSearch =
      !searchQuery ||
      d.draftData.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.notificationNumber && d.notificationNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;

    // Date filtering based on Asia/Kolkata timezone
    const draftDateIST = d.batchDate || getKolkataDateString(d.createdAt || d.sourceFetchedAt);
    let matchesDate = true;
    if (dateFilter === 'TODAY') {
      matchesDate = draftDateIST === todayIST;
    } else if (dateFilter === 'YESTERDAY') {
      matchesDate = draftDateIST === yesterdayIST;
    } else if (dateFilter === 'LAST_7_DAYS') {
      const draftTime = new Date(d.createdAt || d.sourceFetchedAt).getTime();
      matchesDate = Date.now() - draftTime <= 7 * 24 * 60 * 60 * 1000;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: DraftStatus) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-900 border border-amber-300">
            Pending Review
          </span>
        );
      case 'EDITED':
        return (
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-blue-900 border border-blue-300">
            Admin Edited
          </span>
        );
      case 'PUBLISHED':
        return (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Live Published
          </span>
        );
      case 'REJECTED':
        return (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-red-800 border border-red-200">
            Rejected
          </span>
        );
      case 'DUPLICATE':
        return (
          <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-700">
            Duplicate
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-2xs border border-slate-200">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search drafts by title, source, or notice number..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-blue-700 focus:outline-hidden"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 focus:bg-white focus:outline-hidden"
          >
            <option value="ALL">All Statuses ({drafts.length})</option>
            <option value="PENDING_REVIEW">
              Pending Review ({drafts.filter(d => d.status === 'PENDING_REVIEW').length})
            </option>
            <option value="NEEDS_VERIFICATION">
              Needs Verification ({drafts.filter(d => d.status === 'NEEDS_VERIFICATION').length})
            </option>
            <option value="EDITED">
              Admin Edited ({drafts.filter(d => d.status === 'EDITED').length})
            </option>
            <option value="PUBLISHED">
              Live Published ({drafts.filter(d => d.status === 'PUBLISHED').length})
            </option>
            <option value="REJECTED">
              Rejected ({drafts.filter(d => d.status === 'REJECTED').length})
            </option>
          </select>
        </div>

        {/* Date Filter Buttons (Requirement 9) */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['TODAY', 'YESTERDAY', 'LAST_7_DAYS', 'ALL'] as DateFilterType[]).map(df => (
            <button
              key={df}
              onClick={() => setDateFilter(df)}
              className={`rounded-lg px-3 py-1 text-[11px] font-black uppercase transition-all ${
                dateFilter === df
                  ? 'bg-blue-800 text-amber-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {df === 'TODAY' ? "Today's Batch" : df === 'YESTERDAY' ? 'Yesterday' : df === 'LAST_7_DAYS' ? 'Last 7 Days' : 'All Dates'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>
            Showing <strong className="text-slate-800">{filteredDrafts.length}</strong> Draft(s)
          </span>
        </div>
      </div>

      {/* Drafts List */}
      <div className="space-y-4">
        {filteredDrafts.map(draft => (
          <div
            key={draft.id}
            className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-2xs transition-all ${
              draft.status === 'PUBLISHED'
                ? 'border-emerald-200 bg-emerald-50/20'
                : draft.status === 'REJECTED'
                ? 'border-red-200 opacity-70 bg-red-50/10'
                : 'border-slate-200 hover:border-blue-200'
            }`}
          >
            {/* Top Row: Meta Tags & Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(draft.status)}
                <span className="rounded-md bg-blue-50 text-blue-900 px-2 py-0.5 text-[10px] font-black uppercase">
                  {draft.draftData.category}
                </span>
                <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-bold">
                  {draft.draftData.state || 'Central'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Fetched: {new Date(draft.sourceFetchedAt).toLocaleDateString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">
                  Confidence: <span className="text-emerald-700">{draft.confidenceScore}%</span>
                </span>
                {draft.notificationNumber && (
                  <span className="rounded-md bg-slate-100 font-mono text-[11px] text-slate-700 px-2 py-0.5">
                    {draft.notificationNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Title & Short Description */}
            <div className="space-y-1.5 mb-4">
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {draft.draftData.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                {draft.draftData.shortDescription}
              </p>
            </div>

            {/* Official Source Provenance Bar */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Official Portal:</span>
                <span className="text-blue-950 font-semibold">{draft.sourceName}</span>
                <span className="text-slate-400">({draft.sourceDomain})</span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={draft.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline"
                >
                  Source Link <ExternalLink className="h-3 w-3" />
                </a>
                {draft.pdfUrl && (
                  <a
                    href={draft.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-red-600 hover:underline"
                  >
                    Notification PDF ↗
                  </a>
                )}
              </div>
            </div>

            {/* Extracted Facts Snippet Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                  <Users className="h-3 w-3 text-blue-700" /> Vacancies
                </span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">
                  {draft.extractedFacts.totalVacancies}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-red-600" /> Last Date
                </span>
                <p className="font-bold text-red-600 mt-0.5 truncate">
                  {draft.extractedFacts.applicationEndDate}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-emerald-600" /> Fee (UR/OBC)
                </span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">
                  {draft.extractedFacts.applicationFee.general_obc_ews}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                  <Award className="h-3 w-3 text-purple-600" /> Scale of Pay
                </span>
                <p className="font-bold text-slate-900 mt-0.5 truncate">
                  {draft.extractedFacts.salaryPayScale}
                </p>
              </div>
            </div>

            {/* Rejection Note if rejected */}
            {draft.status === 'REJECTED' && draft.rejectionReason && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 mb-4 text-xs text-red-800">
                <strong>Rejection Reason:</strong> {draft.rejectionReason}
              </div>
            )}

            {/* Action Buttons Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onOpenPreview(draft)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" /> Preview Article
                </button>

                <button
                  onClick={() => onOpenEdit(draft)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors"
                >
                  <Edit className="h-3.5 w-3.5 text-blue-600" /> Edit Draft
                </button>

                <button
                  onClick={() => onOpenFacts(draft)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Layers className="h-3.5 w-3.5 text-slate-500" /> Inspect Extracted Facts
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {draft.status !== 'PUBLISHED' && (
                  <>
                    <button
                      onClick={() => setRejectingDraftId(draft.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Approve and publish "${draft.draftData.title}" to live website now?\n\nThis will create an official post and make it accessible to public visitors.`
                          )
                        ) {
                          onApproveAndPublish(draft.id);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-black uppercase text-white shadow-sm hover:bg-emerald-500 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve & Publish
                    </button>
                  </>
                )}

                {draft.status === 'PUBLISHED' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4" /> Published Live
                  </span>
                )}

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to remove this draft from the review queue?')) {
                      onDelete(draft.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Delete Draft"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDrafts.length === 0 && (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 bg-white p-8">
            <FileText className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h4 className="text-sm font-black uppercase text-slate-700">No Drafts in this View</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Scans automatically detect new notifications from your official government sources and queue them here for your review.
            </p>
          </div>
        )}
      </div>

      {/* REJECTION REASON PROMPT MODAL */}
      {rejectingDraftId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" /> Reject AI Staff Draft
            </h3>
            <p className="text-xs text-slate-600">
              Provide a reason for rejection for audit records:
            </p>
            <input
              type="text"
              placeholder="e.g. Duplicate notice, incomplete notification, or invalid source"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingDraftId(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
