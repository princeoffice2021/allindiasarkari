import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Post, CategoryType } from '../types';
import { getPostsByCategory } from '../lib/postsService';
import { updateSEO } from '../lib/seo';
import { PostList } from '../components/PostList';
import { Sidebar } from '../components/Sidebar';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdSlot } from '../components/AdSlot';
import {
  CATEGORIES_CONFIG,
  ALL_INDIAN_STATES,
  slugToCategory,
  stateToSlug,
} from '../data/statesAndCategories';
import { Filter, MapPin } from 'lucide-react';

interface CategoryPageProps {
  forcedCategory?: CategoryType;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ forcedCategory }) => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryName = forcedCategory || (categorySlug ? slugToCategory(categorySlug) : undefined);
  const categoryConfig = CATEGORIES_CONFIG.find((c) => c.name === categoryName);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const selectedState = searchParams.get('state') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryName) return;

    updateSEO({
      title: `${categoryName} 2026 - Latest Govt Notifications`,
      description: categoryConfig?.description || `Find latest ${categoryName} updates across India.`,
      canonicalUrl: categorySlug ? `/${categorySlug}` : '/',
    });

    setLoading(true);
    getPostsByCategory(categoryName, currentPage, 12, selectedState).then((res) => {
      setPosts(res.posts);
      setTotalPages(res.totalPages);
      setTotalPosts(res.total);
      setLoading(false);
    });
  }, [categoryName, categorySlug, currentPage, selectedState]);

  if (!categoryName) {
    return (
      <div className="py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Category Not Found</h1>
        <p className="text-sm text-slate-600">The requested category does not exist.</p>
      </div>
    );
  }

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
      <Breadcrumbs items={[{ label: categoryName, url: `/${categorySlug}` }]} />

      {/* Category Title Header Banner */}
      <div className="rounded-xl bg-slate-900 text-white p-6 shadow-md border border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              {categoryName} 2026
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {categoryConfig?.description}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700 text-xs">
            <Filter className="h-4 w-4 text-amber-400 shrink-0" />
            <select
              value={selectedState}
              onChange={handleStateFilterChange}
              className="bg-transparent text-white font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-white">
                All India / Central
              </option>
              {ALL_INDIAN_STATES.map((st) => (
                <option key={st} value={st} className="bg-slate-900 text-white">
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {totalPosts > 0 && (
          <p className="text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-800">
            Showing {posts.length} of {totalPosts} posts {selectedState ? `for ${selectedState}` : 'across India'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 space-y-6">
          <PostList
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            emptyMessage={`No ${categoryName} posts found ${selectedState ? `for ${selectedState}` : ''}.`}
          />

          <AdSlot format="horizontal" label="Advertisement" />
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
