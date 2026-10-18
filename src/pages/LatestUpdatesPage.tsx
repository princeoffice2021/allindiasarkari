import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Post } from '../types';
import { getAllPublishedPosts } from '../lib/postsService';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdSlot } from '../components/AdSlot';
import { ALL_INDIAN_STATES } from '../data/statesAndCategories';
import {
  Briefcase,
  Ticket,
  Award,
  Sparkles,
  Clock,
  Filter,
  Search,
  ChevronRight,
  Calendar,
  Layers,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface ColumnSectionProps {
  title: string;
  icon: React.ReactNode;
  headerBg: string;
  badgeBg: string;
  posts: Post[];
  loading: boolean;
  emptyMessage: string;
  showCategoryTag?: boolean;
  initialLimit?: number;
  step?: number;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function isRecentPost(dateStr: string): boolean {
  try {
    const postTime = new Date(dateStr).getTime();
    const diffHours = (Date.now() - postTime) / (1000 * 60 * 60);
    return diffHours <= 72; // New within 3 days
  } catch {
    return false;
  }
}

const ColumnSection: React.FC<ColumnSectionProps> = ({
  title,
  icon,
  headerBg,
  badgeBg,
  posts,
  loading,
  emptyMessage,
  showCategoryTag = false,
  initialLimit = 10,
  step = 10,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(initialLimit);

  // Reset pagination if posts filter changes significantly
  useEffect(() => {
    setVisibleCount(initialLimit);
  }, [posts.length, initialLimit]);

  const displayedPosts = useMemo(() => {
    return posts.slice(0, visibleCount);
  }, [posts, visibleCount]);

  const hasMore = posts.length > visibleCount;
  const remaining = Math.max(0, posts.length - visibleCount);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
      {/* Section Header */}
      <div className={`${headerBg} text-white px-4 py-3 flex items-center justify-between shadow-xs`}>
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-white/10 shrink-0 text-white">
            {icon}
          </span>
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
            {title}
          </h2>
        </div>
        <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${badgeBg} border border-white/20 shadow-xs`}>
          {loading ? '...' : `${posts.length} ${posts.length === 1 ? 'Post' : 'Posts'}`}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-between">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="flex items-start gap-2.5 py-2 border-b border-slate-100 last:border-0">
                <div className="h-2 w-2 rounded-full bg-slate-200 mt-1.5 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-slate-200 rounded w-5/6 animate-pulse" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50/50 my-auto">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">{emptyMessage}</p>
            <p className="text-[11px] text-slate-400 mt-1">Check back soon for new government updates.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {displayedPosts.map((post) => {
              const formattedDate = formatDate(post.created_at);
              const isRecent = isRecentPost(post.created_at);

              return (
                <li
                  key={post.id}
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  <Link
                    to={`/post/${post.slug}`}
                    className="block px-3.5 py-2.5 focus:outline-hidden focus:bg-blue-50"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 group-hover:text-blue-600 text-sm leading-none mt-0.5 shrink-0 font-bold">
                        •
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-blue-700 leading-snug break-words">
                          {post.title}
                        </span>

                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-medium">
                          {isRecent && (
                            <span className="bg-red-600 text-white font-black px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider animate-pulse shrink-0">
                              NEW
                            </span>
                          )}

                          {showCategoryTag && post.category && (
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold border border-slate-200 shrink-0">
                              {post.category}
                            </span>
                          )}

                          {post.state && (
                            <span className="text-blue-800 font-bold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 shrink-0">
                              {post.state}
                            </span>
                          )}

                          {formattedDate && (
                            <span className="text-slate-400 shrink-0">
                              {formattedDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Section Pagination / Load More Footer */}
        {!loading && posts.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs mt-auto">
            <span className="text-slate-500 font-semibold text-[11px]">
              Showing {displayedPosts.length} of {posts.length}
            </span>

            {hasMore ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + step, posts.length))}
                  className="rounded bg-blue-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-blue-950 transition-colors flex items-center gap-1"
                >
                  <span>Load More (+{Math.min(step, remaining)})</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
                {posts.length > visibleCount + step && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount(posts.length)}
                    className="text-[11px] font-bold text-blue-800 hover:underline"
                  >
                    All
                  </button>
                )}
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">
                All updates displayed
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export const LatestUpdatesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const stateFilterParam = searchParams.get('state') || '';
  const searchFilterParam = searchParams.get('q') || '';

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(searchFilterParam);
  const [selectedState, setSelectedState] = useState<string>(stateFilterParam);

  useEffect(() => {
    updateSEO({
      title: 'Latest Updates 2026 - All India Sarkari Govt Notifications & Jobs',
      description: 'Comprehensive national feed of all government recruitment notifications, exam results, admit cards, answer keys, syllabus PDFs and Sarkari Yojana schemes across India.',
      canonicalUrl: '/latest-updates',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://allindiasarkari.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Latest Updates',
            item: 'https://allindiasarkari.com/latest-updates',
          },
        ],
      },
    });

    setLoading(true);
    getAllPublishedPosts(1, 500)
      .then((res) => {
        // Exclude drafts, keep only published posts, sorted newest first
        const publishedOnly = (res.posts || []).filter((p) => p.published);
        publishedOnly.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setAllPosts(publishedOnly);
      })
      .catch((err) => {
        console.error('Failed to load published posts:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Update query string in URL
  const updateFilters = (state: string, query: string) => {
    const params = new URLSearchParams();
    if (state) params.set('state', state);
    if (query) params.set('q', query);
    setSearchParams(params);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedState(val);
    updateFilters(val, searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    updateFilters(selectedState, val);
  };

  const handleResetFilters = () => {
    setSelectedState('');
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  // Filter posts based on active search and state filters
  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    if (selectedState) {
      posts = posts.filter(
        (p) => p.state && p.state.toLowerCase().includes(selectedState.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    }

    return posts;
  }, [allPosts, selectedState, searchQuery]);

  // Accurate Category Classification:
  // 1. Column 1: All Government Jobs (Sarkari Naukri)
  const jobsPosts = useMemo(() => {
    return filteredPosts.filter(
      (p) =>
        p.category === 'Sarkari Naukri' ||
        p.category.toLowerCase().includes('naukri') ||
        p.category.toLowerCase().includes('job')
    );
  }, [filteredPosts]);

  // 2. Column 2A: Admit Cards
  const admitCardPosts = useMemo(() => {
    return filteredPosts.filter((p) => p.category === 'Admit Card');
  }, [filteredPosts]);

  // 2. Column 2B: Results
  const resultsPosts = useMemo(() => {
    return filteredPosts.filter((p) => p.category === 'Results');
  }, [filteredPosts]);

  // 3. Column 3: Other Updates & Services (Sarkari Yojana, Answer Key, Syllabus, Scholarship, Current Affairs, etc.)
  const otherPosts = useMemo(() => {
    return filteredPosts.filter(
      (p) =>
        p.category !== 'Sarkari Naukri' &&
        !p.category.toLowerCase().includes('naukri') &&
        !p.category.toLowerCase().includes('job') &&
        p.category !== 'Admit Card' &&
        p.category !== 'Results'
    );
  }, [filteredPosts]);

  const hasActiveFilters = Boolean(selectedState || searchQuery.trim());

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: 'Latest Updates', url: '/latest-updates' }]} />

      {/* Top Banner / Feed Info Bar */}
      <div className="rounded-xl bg-slate-900 text-white p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="bg-red-600/30 text-red-300 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-red-500/30">
                Live National Sarkari Directory
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Clock className="h-7 w-7 text-amber-400 shrink-0" />
              Latest Updates & Notifications 2026
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl font-normal">
              Direct access to all official government recruitment vacancies, admit card download links, published exam results, answer keys, syllabus schemes, and welfare yojanas across India.
            </p>
          </div>

          {/* Quick Real-Time Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-xs">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-slate-900 text-white rounded pl-8 pr-3 py-1.5 text-xs font-semibold focus:outline-hidden border border-slate-700 w-36 sm:w-48 placeholder:text-slate-500"
              />
            </div>

            <div className="relative">
              <Filter className="h-3.5 w-3.5 text-amber-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <select
                value={selectedState}
                onChange={handleStateChange}
                aria-label="Filter by State"
                className="bg-slate-900 text-white rounded pl-7 pr-3 py-1.5 text-xs font-semibold focus:outline-hidden cursor-pointer border border-slate-700"
              >
                <option value="">All States / Central</option>
                {ALL_INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 rounded bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-800 gap-2">
          <div className="flex items-center gap-4">
            <span>
              Total Published Updates: <strong className="text-white">{filteredPosts.length}</strong>
            </span>
            <span>•</span>
            <span>Sorted Newest First</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" /> Jobs: {jobsPosts.length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Admit Cards: {admitCardPosts.length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" /> Results: {resultsPosts.length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-400 inline-block" /> Other: {otherPosts.length}
            </span>
          </div>
        </div>
      </div>

      {/* THREE EQUAL-WIDTH COLUMNS DISPLAYED SIDE BY SIDE ON DESKTOP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* COLUMN 1: ALL GOVERNMENT JOBS */}
        <div className="space-y-6">
          <ColumnSection
            title="ALL GOVERNMENT JOBS"
            icon={<Briefcase className="h-4 w-4" />}
            headerBg="bg-blue-900"
            badgeBg="bg-blue-800 text-blue-100"
            posts={jobsPosts}
            loading={loading}
            emptyMessage="No government job recruitment posts currently available."
            initialLimit={15}
            step={10}
          />
        </div>

        {/* COLUMN 2: ADMIT CARDS & RESULTS (TWO DISTINCT STACKED SECTIONS) */}
        <div className="space-y-6">
          {/* Section 2A: ADMIT CARDS */}
          <ColumnSection
            title="ADMIT CARDS"
            icon={<Ticket className="h-4 w-4" />}
            headerBg="bg-amber-600"
            badgeBg="bg-amber-700 text-amber-100"
            posts={admitCardPosts}
            loading={loading}
            emptyMessage="No admit card download notifications currently available."
            initialLimit={10}
            step={10}
          />

          {/* Section 2B: RESULTS */}
          <ColumnSection
            title="RESULTS"
            icon={<Award className="h-4 w-4" />}
            headerBg="bg-indigo-700"
            badgeBg="bg-indigo-800 text-indigo-100"
            posts={resultsPosts}
            loading={loading}
            emptyMessage="No exam result announcements currently available."
            initialLimit={10}
            step={10}
          />
        </div>

        {/* COLUMN 3: OTHER UPDATES & SERVICES */}
        <div className="space-y-6">
          <ColumnSection
            title="OTHER UPDATES & SERVICES"
            icon={<Layers className="h-4 w-4" />}
            headerBg="bg-slate-800"
            badgeBg="bg-slate-700 text-slate-100"
            posts={otherPosts}
            loading={loading}
            emptyMessage="No other updates or services currently available."
            showCategoryTag={true}
            initialLimit={15}
            step={10}
          />
        </div>
      </div>

      {/* Horizontal Ad Slot */}
      <AdSlot format="horizontal" label="Advertisement" />
    </div>
  );
};
