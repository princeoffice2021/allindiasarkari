import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, MapPin } from 'lucide-react';
import { Post } from '../types';
import { CategoryBadge } from './CategoryBadge';

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, compact = false }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const stateSlug = post.state ? post.state.toLowerCase().replace(/\s+/g, '-') : null;

  if (compact) {
    return (
      <div className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-blue-700 hover:shadow-md transition-all">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <CategoryBadge category={post.category} size="sm" />
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Calendar className="h-3 w-3 text-slate-400" />
              {formattedDate}
            </span>
          </div>

          <Link to={`/post/${post.slug}`} className="block">
            <h3 className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-blue-800 transition-colors leading-snug">
              {post.title}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
          {post.state ? (
            <Link
              to={`/sarkari-naukri/${stateSlug}`}
              className="flex items-center gap-1 text-slate-600 hover:text-blue-800 font-semibold"
            >
              <MapPin className="h-3 w-3 text-red-600" />
              {post.state}
            </Link>
          ) : (
            <span className="text-slate-400 font-medium">All India</span>
          )}

          <Link
            to={`/post/${post.slug}`}
            className="flex items-center gap-1 font-bold text-blue-800 hover:underline"
          >
            Read <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-blue-700 hover:shadow-lg transition-all">
      {/* Featured Image */}
      {post.image_url ? (
        <Link to={`/post/${post.slug}`} className="relative aspect-16/9 overflow-hidden bg-slate-100">
          <img
            src={post.image_url}
            alt={post.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5">
            <CategoryBadge category={post.category} size="md" />
          </div>
          {post.state && (
            <div className="absolute bottom-2.5 right-2.5 rounded-md bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 text-[11px] font-bold text-white flex items-center gap-1">
              <MapPin className="h-3 w-3 text-amber-400" />
              {post.state}
            </div>
          )}
        </Link>
      ) : (
        <div className="p-4 pb-0 flex items-center justify-between">
          <CategoryBadge category={post.category} size="md" />
          {post.state && (
            <span className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
              <MapPin className="h-3.5 w-3.5 text-blue-700" />
              {post.state}
            </span>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>

          <Link to={`/post/${post.slug}`}>
            <h2 className="line-clamp-2 text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-800 transition-colors leading-snug">
              {post.title}
            </h2>
          </Link>

          <p className="mt-2 line-clamp-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Footer Link */}
        <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400">
            {post.state ? `Job in ${post.state}` : 'Central Govt / All India'}
          </span>

          <Link
            to={`/post/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 group-hover:text-blue-900 hover:underline"
          >
            <span>Read Details</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};
