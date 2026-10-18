import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { AdSlot } from './AdSlot';
import {
  ALL_INDIAN_STATES,
  ALL_STATES_AND_UTS,
  CATEGORIES_CONFIG,
  stateToSlug,
} from '../data/statesAndCategories';
import { getLatestPosts, getPostsByCategory } from '../lib/postsService';
import { Post, CategoryType } from '../types';
import {
  MapPin,
  Sparkles,
  TrendingUp,
  ChevronRight,
  FileText,
  Award,
  Ticket,
  CheckSquare,
  BookOpen,
  GraduationCap,
  Newspaper,
  LayoutGrid,
} from 'lucide-react';

interface CategorySectionDef {
  categoryName: CategoryType;
  title: string;
  slug: string;
  viewAllLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

const CATEGORY_SECTIONS: CategorySectionDef[] = [
  {
    categoryName: 'Sarkari Yojana',
    title: 'Sarkari Yojana',
    slug: 'sarkari-yojana',
    viewAllLabel: 'View All Sarkari Yojana →',
    icon: FileText,
    iconColor: 'text-emerald-600',
  },
  {
    categoryName: 'Results',
    title: 'Results',
    slug: 'results',
    viewAllLabel: 'View All Results →',
    icon: Award,
    iconColor: 'text-indigo-600',
  },
  {
    categoryName: 'Admit Card',
    title: 'Admit Card',
    slug: 'admit-card',
    viewAllLabel: 'View All Admit Cards →',
    icon: Ticket,
    iconColor: 'text-amber-600',
  },
  {
    categoryName: 'Answer Key',
    title: 'Answer Key',
    slug: 'answer-key',
    viewAllLabel: 'View All Answer Keys →',
    icon: CheckSquare,
    iconColor: 'text-teal-600',
  },
  {
    categoryName: 'Syllabus',
    title: 'Syllabus',
    slug: 'syllabus',
    viewAllLabel: 'View All Syllabus →',
    icon: BookOpen,
    iconColor: 'text-purple-600',
  },
  {
    categoryName: 'Scholarship',
    title: 'Scholarship',
    slug: 'scholarship',
    viewAllLabel: 'View All Scholarships →',
    icon: GraduationCap,
    iconColor: 'text-rose-600',
  },
  {
    categoryName: 'Current Affairs',
    title: 'Current Affairs',
    slug: 'current-affairs',
    viewAllLabel: 'View All Current Affairs →',
    icon: Newspaper,
    iconColor: 'text-cyan-600',
  },
];

export const Sidebar: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Post[]>([]);
  const [categoryData, setCategoryData] = useState<Record<string, Post[]>>({
    'Sarkari Yojana': [],
    'Results': [],
    'Admit Card': [],
    'Answer Key': [],
    'Syllabus': [],
    'Scholarship': [],
    'Current Affairs': [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSidebarData() {
      try {
        const [announcementsRes, ...catResults] = await Promise.all([
          getLatestPosts(5),
          ...CATEGORY_SECTIONS.map((sec) => getPostsByCategory(sec.categoryName, 1, 5)),
        ]);

        if (!isMounted) return;

        setAnnouncements(announcementsRes);

        const newCatData: Record<string, Post[]> = {};
        CATEGORY_SECTIONS.forEach((sec, idx) => {
          newCatData[sec.categoryName] = catResults[idx]?.posts || [];
        });
        setCategoryData(newCatData);
      } catch (err) {
        console.error('Failed fetching sidebar data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSidebarData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside className="space-y-6">
      {/* 1. Search Sarkari Updates */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-blue-700" />
          Search Sarkari Updates
        </h3>
        <SearchBar />
      </section>

      {/* AdSlot Vertical */}
      <AdSlot format="vertical" label="Sponsored Links" />

      {/* 2. Sarkari Naukri By State */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
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
          View All {ALL_STATES_AND_UTS.length} States & UTs Jobs →
        </Link>
      </section>

      {/* 3. Latest Announcements */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-amber-500" />
          Latest Announcements
        </h3>

        <div className="space-y-3 min-h-[30px]">
          {loading && announcements.length === 0 ? (
            <div className="space-y-2 py-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-9 rounded bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic py-1">
              No recent announcements available.
            </p>
          ) : (
            announcements.map((post) => (
              <div key={post.id} className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                <Link
                  to={`/post/${post.slug}`}
                  className="group text-xs font-bold text-slate-800 hover:text-blue-800 line-clamp-2 transition-colors"
                >
                  {post.title}
                </Link>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-blue-700">{post.category}</span>
                  <span>
                    {new Date(post.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <a
          href="/latest-updates"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-xs font-bold text-blue-800 hover:underline border-t border-slate-100 pt-2"
        >
          View All Announcements →
        </a>
      </section>

      {/* 4–10. Category-Specific Update Sections */}
      {CATEGORY_SECTIONS.map((sec) => {
        const posts = categoryData[sec.categoryName] || [];
        const IconComponent = sec.icon;

        return (
          <section key={sec.categoryName} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <IconComponent className={`h-4 w-4 ${sec.iconColor}`} />
              {sec.title}
            </h3>

            <div className="space-y-3 min-h-[30px]">
              {loading && posts.length === 0 ? (
                <div className="space-y-2 py-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-9 rounded bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic py-1">
                  No published updates available in this category.
                </p>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                    <Link
                      to={`/post/${post.slug}`}
                      className="group text-xs font-bold text-slate-800 hover:text-blue-800 line-clamp-2 transition-colors"
                    >
                      {post.title}
                    </Link>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      {post.state ? (
                        <span className="font-semibold text-slate-500">{post.state}</span>
                      ) : (
                        <span className="font-semibold text-slate-400">All India</span>
                      )}
                      <span>
                        {new Date(post.created_at).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <a
              href={`/${sec.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-center text-xs font-bold text-blue-800 hover:underline border-t border-slate-100 pt-2"
            >
              {sec.viewAllLabel}
            </a>
          </section>
        );
      })}

      {/* 11. Explore Categories */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <LayoutGrid className="h-4 w-4 text-blue-700" />
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
      </section>

      {/* AdSlot Rectangle */}
      <AdSlot format="rectangle" label="Advertisement" />
    </aside>
  );
};
