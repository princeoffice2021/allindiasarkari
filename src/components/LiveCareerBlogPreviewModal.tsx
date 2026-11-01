import React from 'react';
import { X, Calendar, User, Tag, Clock, ExternalLink, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CareerBlog, BlogLanguage } from '../types/careerBlog';
import { sanitizeArticleHtml } from '../lib/sanitizer';

interface LiveCareerBlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: Partial<CareerBlog> & { tags?: string[] | string };
}

export const LiveCareerBlogPreviewModal: React.FC<LiveCareerBlogPreviewModalProps> = ({
  isOpen,
  onClose,
  blog,
}) => {
  if (!isOpen) return null;

  const title = blog.title || 'Untitled Career Guide';
  const language: BlogLanguage = blog.language || 'hindi';
  const category = blog.category || 'Career Guidance';
  const author = blog.author_name || 'Prince Sharma';
  const dateStr = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString(language === 'hindi' ? 'hi-IN' : 'en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const tagsArray = Array.isArray(blog.tags)
    ? blog.tags
    : typeof blog.tags === 'string'
    ? (blog.tags as string).split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const rawContent = blog.content || '<p class="text-slate-400 italic">No content written yet...</p>';
  const sanitizedContent = sanitizeArticleHtml(rawContent);

  // Approximate reading time
  const textWords = (blog.content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(textWords / 180));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center gap-2">
              <span>Live Article Preview</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-700 text-white uppercase">
                {language === 'hindi' ? 'हिंदी' : 'English'}
              </span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Status notice */}
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Preview Mode:</strong> This is an accurate preview of how your article will render on <strong>AllIndiaSarkari.com</strong>.
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              {blog.published ? 'Status: Published' : 'Status: Draft'}
            </span>
          </div>

          {/* Breadcrumbs Preview */}
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <span>Home</span>
            <span>›</span>
            <span>Career Blogs</span>
            <span>›</span>
            <span className="capitalize">{language}</span>
            <span>›</span>
            <span className="text-slate-800 font-bold truncate max-w-xs">{title}</span>
          </div>

          {/* Article Header */}
          <header className="space-y-4 border-b border-slate-200 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-100 text-blue-900 text-xs font-black px-3 py-1 uppercase tracking-wider border border-blue-200">
                {category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> {readMinutes} min read
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              {title}
            </h1>

            {blog.excerpt && (
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal bg-slate-50 p-3.5 rounded-xl border-l-4 border-blue-900">
                {blog.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <User className="h-4 w-4 text-blue-900" /> By {author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" /> {dateStr}
              </span>
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified Career Guide
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {blog.image_url && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-h-[420px]">
              <img
                src={blog.image_url}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Article Formatted Content */}
          <div
            className="article-content max-w-none text-slate-800 leading-relaxed space-y-4 text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Tags */}
          {tagsArray.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Topic Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {tagsArray.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 text-xs font-semibold transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* SEO Metadata Card Preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
            <h4 className="font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>Google SERP Preview</span>
            </h4>
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[11px] text-emerald-700 font-mono truncate">
                https://allindiasarkari.com/blogs/{language}/{blog.slug || 'url-slug'}
              </div>
              <div className="text-sm font-bold text-blue-800 line-clamp-1 hover:underline cursor-pointer">
                {blog.meta_title || title} | All India Sarkari
              </div>
              <div className="text-xs text-slate-600 line-clamp-2">
                {blog.meta_description || blog.excerpt || 'Read this complete career guide on All India Sarkari.'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-5 py-2.5 transition-colors shadow-xs"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
