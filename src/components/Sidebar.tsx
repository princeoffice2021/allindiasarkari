import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { AdSlot } from './AdSlot';
import { ALL_INDIAN_STATES, CATEGORIES_CONFIG, stateToSlug } from '../data/statesAndCategories';
import { getLatestPosts } from '../lib/postsService';
import { Post } from '../types';
import { MapPin, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    getLatestPosts(5).then(setLatestPosts);
  }, []);

  return (
    <aside className="space-y-6">
      {/* Search Widget */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-blue-700" />
          Search Sarkari Updates
        </h3>
        <SearchBar />
      </div>

      {/* AdSlot 1 */}
      <AdSlot format="vertical" label="Sponsored Links" />

      {/* Popular State Sarkari Naukri Links */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-red-600" />
          Sarkari Naukri By State
        </h3>

        <div className="grid grid-cols-2 gap-1.5 text-xs">
          {ALL_INDIAN_STATES.slice(0, 16).map((state) => {
            const slug = stateToSlug(state);
            return (
              <Link
                key={state}
                to={`/sarkari-naukri/${slug}`}
                className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900 font-semibold transition-colors truncate"
              >
                <span className="truncate">{state}</span>
                <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
              </Link>
            );
          })}
        </div>

        <Link
          to="/sarkari-naukri"
          className="mt-3 block text-center text-xs font-bold text-blue-800 hover:underline"
        >
          View All 28 States & UTs Jobs →
        </Link>
      </div>

      {/* Latest Quick Updates Ticker */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-amber-500" />
          Latest Announcements
        </h3>

        <div className="space-y-3">
          {latestPosts.map((post) => (
            <div key={post.id} className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
              <Link
                to={`/post/${post.slug}`}
                className="group text-xs font-bold text-slate-800 hover:text-blue-800 line-clamp-2 transition-colors"
              >
                {post.title}
              </Link>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold text-blue-700">{post.category}</span>
                <span>{new Date(post.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Widget */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          Explore Categories
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES_CONFIG.map((cat) => (
            <Link
              key={cat.slug}
              to={`/${cat.slug}`}
              className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-blue-900 hover:text-white transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* AdSlot 2 */}
      <AdSlot format="rectangle" label="Advertisement" />
    </aside>
  );
};
