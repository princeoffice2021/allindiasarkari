import React, { useState } from 'react';
import { sanitizeArticleHtml } from '../lib/sanitizer';
import { CategoryBadge } from './CategoryBadge';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  ExternalLink,
  Smartphone,
  Monitor,
  X,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Link as LinkIcon,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ImportantLinkItem {
  label: string;
  url: string;
  isExternal?: boolean;
}

interface LiveArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  state?: string;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  officialSourceUrl?: string;
  importantLinks: ImportantLinkItem[];
  faqs: FAQItem[];
  keywords?: string[];
}

export const LiveArticlePreviewModal: React.FC<LiveArticlePreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  state,
  excerpt,
  content,
  imageUrl,
  officialSourceUrl,
  importantLinks,
  faqs,
  keywords,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const sanitizedContent = sanitizeArticleHtml(content || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 backdrop-blur-xs">
      <div className="flex h-full max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl bg-slate-100 shadow-2xl border border-slate-300 overflow-hidden">
        {/* Top Preview Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 bg-white px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-900 text-amber-300 shadow-2xs font-bold text-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Live Article Preview
              </h3>
              <p className="text-[10px] text-slate-500">
                Simulated public view (Draft Mode - Not Saved/Published)
              </p>
            </div>
          </div>

          {/* Viewport switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                deviceView === 'desktop'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                deviceView === 'mobile'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile (375px)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            title="Close Preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preview Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center bg-slate-200/70">
          <div
            className={`w-full transition-all duration-200 bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 md:p-8 space-y-6 ${
              deviceView === 'mobile' ? 'max-w-[400px]' : 'max-w-3xl'
            }`}
          >
            {/* Header badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={category || 'Sarkari Naukri'} size="lg" />
                {state && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-700">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{state} Jobs</span>
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {title || 'Article Title Placeholder'}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 border-y border-slate-100 py-2.5">
                <span className="flex items-center gap-1 text-slate-700">
                  <User className="h-3.5 w-3.5 text-blue-800" />
                  All India Sarkari Team
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Published: {today}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <Clock className="h-3.5 w-3.5" />
                  Updated: {today}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            {imageUrl && (
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-2xs max-h-[360px] bg-slate-50">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover max-h-[360px]"
                />
              </div>
            )}

            {/* Excerpt Box */}
            {excerpt && (
              <div className="rounded-xl border-l-4 border-blue-900 bg-blue-50/70 p-4 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed shadow-2xs">
                <strong className="text-blue-950 font-black block mb-1">
                  Summary / Highlights:
                </strong>
                {excerpt}
              </div>
            )}

            {/* Article Content Render */}
            <div className="article-content overflow-x-auto">
              {sanitizedContent ? (
                <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
              ) : (
                <div className="py-8 text-center text-slate-400 italic text-xs">
                  No article content written yet.
                </div>
              )}
            </div>

            {/* Important Direct Links Section */}
            {importantLinks && importantLinks.length > 0 && (
              <div className="my-6 rounded-xl border-2 border-blue-900 bg-white overflow-hidden shadow-2xs">
                <div className="bg-blue-900 text-amber-300 px-4 py-2.5 text-xs font-black uppercase tracking-wide flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-amber-400" />
                  <span>Important Direct Links</span>
                </div>
                <div className="divide-y divide-slate-200">
                  {importantLinks.map((lnk, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap items-center justify-between p-3 hover:bg-slate-50 gap-2"
                    >
                      <span className="text-xs font-extrabold text-slate-900">{lnk.label}</span>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1 text-[11px] font-black uppercase text-white shadow-2xs">
                        <span>Click Here</span>
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs Section */}
            {faqs && faqs.length > 0 && (
              <div className="my-6 space-y-3">
                <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <HelpCircle className="h-4 w-4 text-blue-800" /> Frequently Asked Questions (FAQs)
                </h3>
                <div className="space-y-2.5">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1"
                    >
                      <h4 className="text-xs font-black text-slate-900">
                        Q{idx + 1}. {faq.question}
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Source Link Box */}
            {officialSourceUrl && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-xs font-black text-blue-900 uppercase tracking-wider block mb-0.5">
                    Official Government Portal / Source
                  </span>
                  <p className="text-[11px] text-blue-800">
                    Verify official notifications or apply directly on the government portal.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
                  <span>Official Source</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </div>
            )}

            {/* Official Disclaimer */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-950 font-medium space-y-1">
              <span className="font-extrabold uppercase tracking-wide text-amber-900 block text-[11px]">
                ⚠️ Official Notice & Disclaimer:
              </span>
              <p className="text-[11px]">
                Information provided on All India Sarkari is for informational purposes. Please verify
                important details from the official government portal or recruitment notification.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-300 bg-white px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Preview reflects styles and typography of the live website.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-black uppercase text-white hover:bg-slate-800 transition-colors"
          >
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
};
