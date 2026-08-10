import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { AlertCircle, AlertTriangle, Info, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export interface BoxProps {
  title?: string;
  children: React.ReactNode;
}

export const ImportantBox: React.FC<BoxProps> = ({ title = 'Important Notice', children }) => (
  <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/80 p-4 shadow-2xs space-y-1.5 my-4">
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-950">
      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
      <span>{title}</span>
    </div>
    <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">{children}</div>
  </div>
);

export const WarningBox: React.FC<BoxProps> = ({ title = 'Caution / Warning', children }) => (
  <div className="rounded-xl border-l-4 border-red-600 bg-red-50/80 p-4 shadow-2xs space-y-1.5 my-4">
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-950">
      <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
      <span>{title}</span>
    </div>
    <div className="text-xs sm:text-sm text-red-900 leading-relaxed">{children}</div>
  </div>
);

export const InfoBox: React.FC<BoxProps> = ({ title = 'Quick Highlights', children }) => (
  <div className="rounded-xl border-l-4 border-blue-800 bg-blue-50/80 p-4 shadow-2xs space-y-1.5 my-4">
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-950">
      <Info className="h-4 w-4 text-blue-800 shrink-0" />
      <span>{title}</span>
    </div>
    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">{children}</div>
  </div>
);

export interface DataTableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  title?: string;
}

export const DataTable: React.FC<DataTableProps> = ({ headers, rows, title }) => (
  <div className="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
    {title && (
      <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">
        {title}
      </div>
    )}
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase tracking-wider border-b border-slate-200">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="p-3 border-r border-slate-200 last:border-r-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="p-3 border-r border-slate-200 last:border-r-0 text-slate-800 font-medium">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export interface LinkItem {
  label: string;
  url: string;
  isExternal?: boolean;
}

export interface ImportantLinksProps {
  links: LinkItem[];
  title?: string;
}

export const ImportantLinks: React.FC<ImportantLinksProps> = ({
  links,
  title = 'Important Direct Links',
}) => (
  <div className="my-6 rounded-xl border-2 border-blue-900 bg-white overflow-hidden shadow-xs">
    <div className="bg-blue-900 text-amber-300 px-4 py-3 text-xs font-black uppercase tracking-wide flex items-center gap-2">
      <ExternalLink className="h-4 w-4 text-amber-400" />
      <span>{title}</span>
    </div>
    <div className="divide-y divide-slate-200">
      {links.map((lnk, idx) => (
        <div key={idx} className="flex flex-wrap items-center justify-between p-3.5 hover:bg-slate-50 gap-2">
          <span className="text-xs sm:text-sm font-extrabold text-slate-900">{lnk.label}</span>
          {lnk.isExternal || lnk.url.startsWith('http') ? (
            <a
              href={lnk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-black uppercase text-white shadow-2xs hover:bg-red-700 transition-colors"
            >
              <span>Click Here</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <Link
              to={lnk.url}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-900 px-4 py-1.5 text-xs font-black uppercase text-white shadow-2xs hover:bg-blue-950 transition-colors"
            >
              <span>View Link</span>
            </Link>
          )}
        </div>
      ))}
    </div>
  </div>
);

export interface RelatedPostsProps {
  posts: Post[];
  title?: string;
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  posts,
  title = 'Related Updates',
}) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="my-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
      <h3 className="text-base font-black uppercase text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-500" />
        {title}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((rel) => (
          <div
            key={rel.id}
            className="rounded-xl border border-slate-200 p-3.5 hover:border-blue-700 hover:shadow-xs transition-all bg-slate-50/50"
          >
            <CategoryBadge category={rel.category} size="sm" />
            <Link to={`/post/${rel.slug}`} className="block mt-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-800 line-clamp-2">
                {rel.title}
              </h4>
            </Link>
            <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{rel.excerpt}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
