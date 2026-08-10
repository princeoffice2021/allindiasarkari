import React from 'react';
import { Post } from '../types';
import { PostCard } from './PostCard';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface PostListProps {
  posts: Post[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  gridCols?: '2' | '3' | '4';
  compact?: boolean;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  emptyMessage = 'No posts found in this section.',
  gridCols = '3',
  compact = false,
}) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 px-4 text-center">
        <Inbox className="h-10 w-10 text-slate-400 mb-2" />
        <p className="text-sm font-semibold text-slate-700">{emptyMessage}</p>
        <p className="text-xs text-slate-500 mt-1">Check back soon for latest sarkari updates.</p>
      </div>
    );
  }

  const gridClass = {
    '2': 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6',
    '3': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6',
    '4': 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
  }[gridCols];

  return (
    <div className="space-y-6">
      <div className={gridClass}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} compact={compact} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <span className="text-xs font-bold text-slate-700 px-3">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
