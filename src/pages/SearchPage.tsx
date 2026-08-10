import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Post } from '../types';
import { searchPosts } from '../lib/postsService';
import { updateSEO } from '../lib/seo';
import { SearchBar } from '../components/SearchBar';
import { PostList } from '../components/PostList';
import { Sidebar } from '../components/Sidebar';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdSlot } from '../components/AdSlot';
import { ALL_INDIAN_STATES, CATEGORIES_CONFIG } from '../data/statesAndCategories';
import { Search, Filter } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedState = searchParams.get('state') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateSEO({
      title: query ? `Search: "${query}" - All India Sarkari` : 'Search Govt Jobs & Schemes',
      description: `Search results for ${query || 'Sarkari Yojana, Sarkari Naukri, Results & Admit Cards'}.`,
      noindex: true,
    });

    setLoading(true);
    searchPosts(query, selectedCategory, selectedState, currentPage, 12).then((res) => {
      setPosts(res.posts);
      setTotalPosts(res.total);
      setTotalPages(res.totalPages);
      setLoading(false);
    });
  }, [query, selectedCategory, selectedState, currentPage]);

  const handleCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) searchParams.set('category', val);
    else searchParams.delete('category');
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handleStateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) searchParams.set('state', val);
    else searchParams.delete('state');
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
      <Breadcrumbs items={[{ label: 'Search Results' }]} />

      {/* Header Search Box & Filter Bar */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-amber-400" />
          <h1 className="text-xl sm:text-2xl font-black uppercase text-white">
            {query ? `Search Results for "${query}"` : 'Search Sarkari Portal'}
          </h1>
        </div>

        <SearchBar initialValue={query} />

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800 text-xs font-semibold">
          <span className="text-slate-400 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter By:
          </span>

          <select
            value={selectedCategory}
            onChange={handleCategoryFilter}
            className="rounded-lg bg-slate-800 border border-slate-700 text-white px-3 py-1.5 focus:outline-hidden cursor-pointer"
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
            onChange={handleStateFilter}
            className="rounded-lg bg-slate-800 border border-slate-700 text-white px-3 py-1.5 focus:outline-hidden cursor-pointer"
          >
            <option value="">All States / Central</option>
            {ALL_INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {totalPosts > 0 && (
            <span className="ml-auto text-amber-300 font-bold">
              Found {totalPosts} matching articles
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 space-y-6">
          <PostList
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            emptyMessage={
              query
                ? `No articles found matching "${query}". Try searching for terms like "Police", "Patwari", "PM Kisan", "SSC", "Admit Card".`
                : 'Enter a keyword above to search for government jobs and schemes.'
            }
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
