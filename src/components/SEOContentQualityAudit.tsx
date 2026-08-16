import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  FileText,
  Search,
  Sparkles,
  Info,
  Heading,
  Image as ImageIcon,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

interface SEOContentQualityAuditProps {
  title: string;
  metaDescription: string;
  slug: string;
  content: string;
  imageUrl?: string;
  officialSourceUrl?: string;
  importantLinksCount: number;
  faqsCount: number;
}

export const SEOContentQualityAudit: React.FC<SEOContentQualityAuditProps> = ({
  title,
  metaDescription,
  slug,
  content,
  imageUrl,
  officialSourceUrl,
  importantLinksCount,
  faqsCount,
}) => {
  // Compute text statistics
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;

  // Heading counts
  const h2Count = (content.match(/<h2[\s>]/gi) || []).length;
  const h3Count = (content.match(/<h3[\s>]/gi) || []).length;

  // Introduction check
  const hasIntro =
    /overview|introduction|highlights|about|details/i.test(content) && wordCount > 40;

  // Section count (h2 + h3)
  const totalSections = h2Count + h3Count;

  // Title Audit
  const titleLen = title.trim().length;
  const isTitleGood = titleLen >= 30 && titleLen <= 90;
  const isTitleReview = titleLen > 0 && !isTitleGood;

  // Meta Description Audit
  const metaLen = metaDescription.trim().length;
  const isMetaGood = metaLen >= 50 && metaLen <= 160;
  const isMetaReview = metaLen > 0 && !isMetaGood;

  // Slug Audit
  const isSlugGood = slug.trim().length > 3 && /^[a-z0-9-]+$/.test(slug.trim());

  // Word Count Audit
  const isWordCountGood = wordCount >= 300;
  const isWordCountReview = wordCount >= 100 && wordCount < 300;

  // Headings Audit
  const isHeadingsGood = h2Count >= 2;
  const isHeadingsReview = h2Count === 1;

  // Sections Audit
  const isSectionsGood = totalSections >= 3;

  // Image Audit
  const isImageGood = !!imageUrl && imageUrl.trim().length > 8;

  // Official Source Audit
  const isSourceGood = !!officialSourceUrl && /^https?:\/\//i.test(officialSourceUrl.trim());

  // Links & FAQs
  const isLinksGood = importantLinksCount >= 1;
  const isFaqsGood = faqsCount >= 1;

  // Overall Score Calculation (0 - 100)
  let score = 0;
  if (isTitleGood) score += 15;
  else if (isTitleReview) score += 7;

  if (isMetaGood) score += 15;
  else if (isMetaReview) score += 7;

  if (isSlugGood) score += 10;
  if (isWordCountGood) score += 20;
  else if (isWordCountReview) score += 10;

  if (isHeadingsGood) score += 15;
  else if (isHeadingsReview) score += 7;

  if (hasIntro) score += 5;
  if (isImageGood) score += 5;
  if (isSourceGood) score += 5;
  if (isLinksGood) score += 5;
  if (isFaqsGood) score += 5;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-2xs">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Content Quality & Editorial SEO Audit
            </h3>
            <p className="text-[11px] text-slate-500">Live checks for structured, clear government articles</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <span className="text-[11px] font-bold text-slate-600">Completeness:</span>
          <span
            className={`text-xs font-black ${
              score >= 80 ? 'text-emerald-700' : score >= 50 ? 'text-amber-600' : 'text-red-600'
            }`}
          >
            {score}/100
          </span>
        </div>
      </div>

      {/* Grid of Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        {/* Title Check */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Article Title</span>
            {isTitleGood ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" /> Good ({titleLen}c)
              </span>
            ) : isTitleReview ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" /> {titleLen}c
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-extrabold text-red-600 text-[11px]">
                <XCircle className="h-3.5 w-3.5" /> Required
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">Target 30–90 characters for clear display</p>
        </div>

        {/* Meta Description Check */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Meta Description</span>
            {isMetaGood ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" /> Good ({metaLen}c)
              </span>
            ) : isMetaReview ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" /> {metaLen}c
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-extrabold text-red-600 text-[11px]">
                <XCircle className="h-3.5 w-3.5" /> Missing
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">Target 50–160 characters for search snippets</p>
        </div>

        {/* SEO Slug */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">SEO URL Slug</span>
            {isSlugGood ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" /> Valid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" /> Format
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">Clean kebab-case (e.g. ssc-cgl-2026)</p>
        </div>

        {/* Word Count */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Article Word Count</span>
            {isWordCountGood ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" /> {wordCount} words
              </span>
            ) : isWordCountReview ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" /> {wordCount} words
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-extrabold text-red-600 text-[11px]">
                <XCircle className="h-3.5 w-3.5" /> {wordCount} words
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">Recommend 300+ words for detailed guide</p>
        </div>

        {/* Headings Structure */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Headings (H2 / H3)</span>
            {isHeadingsGood ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" /> {h2Count} H2s, {h3Count} H3s
              </span>
            ) : isHeadingsReview ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" /> {h2Count} H2
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-extrabold text-red-600 text-[11px]">
                <XCircle className="h-3.5 w-3.5" /> Add H2s
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">Organizes article into logical sub-topics</p>
        </div>

        {/* Content Structure */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Section Count</span>
            {isSectionsGood ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" /> {totalSections} Sections
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" /> {totalSections} Sections
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">At least 3 structured blocks recommended</p>
        </div>

        {/* Featured Image */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Featured Image</span>
            {isImageGood ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" /> Set
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-extrabold text-slate-500 text-[11px]">
                Optional
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">Provides visual preview for social sharing</p>
        </div>

        {/* Direct Links */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Important Links Box</span>
            {isLinksGood ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" /> {importantLinksCount} Added
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-extrabold text-amber-600 text-[11px]">
                <AlertTriangle className="h-3.5 w-3.5" /> None
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">Direct apply/notification links</p>
        </div>

        {/* FAQs Schema */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">FAQ Schema Builder</span>
            {isFaqsGood ? (
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" /> {faqsCount} Added
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-extrabold text-slate-500 text-[11px]">
                Optional
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">Generates FAQPage JSON-LD rich snippet</p>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600 flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-800 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Editorial Quality Notice:</span> This audit
          evaluates document structure, completeness, and clarity for readers. It provides best-practice
          recommendations and does not guarantee search engine rankings or third-party approval.
        </div>
      </div>
    </div>
  );
};
