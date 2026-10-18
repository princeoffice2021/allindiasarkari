import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Post } from '../types';
import { getAllPublishedPosts } from '../lib/postsService';
import { updateSEO } from '../lib/seo';
import { PostList } from '../components/PostList';
import { Sidebar } from '../components/Sidebar';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdSlot } from '../components/AdSlot';
import { CATEGORIES_CONFIG, ALL_INDIAN_STATES } from '../data/statesAndCategories';
import { Clock, Filter, Sparkles, Bell } from 'lucide-react';

export const LatestUpdatesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const selectedCategory = searchParams.get('category') || '';
  const selectedState = searchParams.get('state') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

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
    getAllPublishedPosts(currentPage, 12).then((res) => {
      let filtered = res.posts;
      if (selectedCategory) {
        filtered = filtered.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
      }
      if (selectedState) {
        filtered = filtered.filter((p) => p.state && p.state.toLowerCase().includes(selectedState.toLowerCase()));
      }
      setPosts(filtered);
      setTotalPages(res.totalPages);
      setTotalPosts(res.total);
      setLoading(false);
    });
  }, [currentPage, selectedCategory, selectedState]);

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      searchParams.set('category', val);
    } else {
      searchParams.delete('category');
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handleStateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      searchParams.set('state', val);
    } else {
      searchParams.delete('state');
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Latest Updates', url: '/latest-updates' }]} />

      {/* Header Banner */}
      <div className="rounded-xl bg-slate-900 text-white p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="bg-red-600/30 text-red-300 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-red-500/30">
                Live National Feed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Clock className="h-7 w-7 text-amber-400 shrink-0" />
              Latest Updates & Notifications 2026
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              Chronological feed of all official government job vacancies, online application links, exam results, admit cards, official answer keys, syllabus downloads, and welfare schemes across Central and State Governments.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-xs">
            <Filter className="h-4 w-4 text-amber-400 shrink-0" />
            
            <select
              value={selectedCategory}
              onChange={handleCategoryFilterChange}
              className="bg-slate-900 text-white rounded px-2 py-1 font-semibold focus:outline-hidden cursor-pointer border border-slate-700"
            >
              <option value="">All Categories</option>
              {CATEGORIES_CONFIG.map((cat) => (
                <option key={cat.slug} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={selectedState}
              onChange={handleStateFilterChange}
              className="bg-slate-900 text-white rounded px-2 py-1 font-semibold focus:outline-hidden cursor-pointer border border-slate-700"
            >
              <option value="">All States / Central</option>
              {ALL_INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {totalPosts > 0 && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-800">
            <span>
              Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'} on this page (Total {totalPosts} published updates)
            </span>
            <span>Sorted by newest published date</span>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <PostList
              posts={posts}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              gridCols="2"
              emptyMessage="No updates found matching your filter criteria."
            />
          )}

          <AdSlot format="horizontal" label="Advertisement" />
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
