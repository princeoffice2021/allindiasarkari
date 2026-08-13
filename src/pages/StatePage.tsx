import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Post } from '../types';
import { getPostsByState } from '../lib/postsService';
import { updateSEO } from '../lib/seo';
import { PostList } from '../components/PostList';
import { Sidebar } from '../components/Sidebar';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdSlot } from '../components/AdSlot';
import { slugToState, ALL_INDIAN_STATES, stateToSlug } from '../data/statesAndCategories';
import { NotFoundPage } from './NotFoundPage';
import { MapPin, Building2, ChevronRight } from 'lucide-react';

export const StatePage: React.FC = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const stateName = stateSlug ? slugToState(stateSlug) : undefined;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const selectedCategory = searchParams.get('cat') || 'All';

  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const categoriesList = [
    'All',
    'Sarkari Naukri',
    'Sarkari Yojana',
    'Results',
    'Admit Card',
    'Answer Key',
    'Scholarship',
  ];

  useEffect(() => {
    if (!stateName) return;

    updateSEO({
      title: `${stateName} ${selectedCategory !== 'All' ? selectedCategory : 'Sarkari Naukri'} 2026 - Latest Govt Jobs & Updates`,
      description: `Find all latest ${stateName} government job vacancies, state recruitment notifications, result, admit cards & exam updates.`,
      canonicalUrl: `/sarkari-naukri/${stateSlug}`,
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
            name: 'State Jobs',
            item: 'https://allindiasarkari.com/states',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${stateName} Jobs`,
            item: `https://allindiasarkari.com/sarkari-naukri/${stateSlug}`,
          },
        ],
      },
    });

    getPostsByState(stateName, currentPage, 12, selectedCategory).then((res) => {
      setPosts(res.posts);
      setTotalPages(res.totalPages);
      setTotalPosts(res.total);
    });
  }, [stateName, stateSlug, currentPage, selectedCategory]);

  if (!stateName) {
    return <NotFoundPage />;
  }

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryFilter = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', cat);
    }
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs
        items={[
          { label: 'Sarkari Naukri', url: '/sarkari-naukri' },
          { label: stateName, url: `/sarkari-naukri/${stateSlug}` },
        ]}
      />

      {/* State Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6 shadow-md border border-slate-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shrink-0">
            <MapPin className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Sarkari Naukri in {stateName} 2026
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Official Government Vacancies, Recruitment Boards, Results & Admit Cards in {stateName}.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 space-y-6">
          {/* Category Filter Pills for State */}
          <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl border border-slate-200 bg-white shadow-xs">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-blue-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <PostList
            posts={posts}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            emptyMessage={`No specific ${selectedCategory !== 'All' ? selectedCategory : ''} notifications found for ${stateName} currently.`}
          />

          <AdSlot format="horizontal" label="Advertisement" />

          {/* Other States Quick Nav */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Explore Govt Jobs In Other States
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {ALL_INDIAN_STATES.filter((s) => s !== stateName)
                .slice(0, 12)
                .map((st) => (
                  <Link
                    key={st}
                    to={`/sarkari-naukri/${stateToSlug(st)}`}
                    className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-900 font-semibold truncate"
                  >
                    <span className="truncate">{st}</span>
                    <ChevronRight className="h-3 w-3 text-slate-400" />
                  </Link>
                ))}
            </div>
          </div>
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
