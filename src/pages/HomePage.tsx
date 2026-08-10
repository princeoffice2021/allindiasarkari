import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { getLatestPosts, getPostsByCategory } from '../lib/postsService';
import { updateSEO } from '../lib/seo';
import { PostCard } from '../components/PostCard';
import { Sidebar } from '../components/Sidebar';
import { AdSlot } from '../components/AdSlot';
import { CategoryBadge } from '../components/CategoryBadge';
import {
  ALL_INDIAN_STATES,
  ALL_UNION_TERRITORIES,
  CATEGORIES_CONFIG,
  stateToSlug,
} from '../data/statesAndCategories';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  TrendingUp,
  FileText,
  Briefcase,
  Award,
  Ticket,
  CheckSquare,
  BookOpen,
  GraduationCap,
  Newspaper,
  CheckCircle2,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [categoryPosts, setCategoryPosts] = useState<Record<string, Post[]>>({});
  const [selectedStateTab, setSelectedStateTab] = useState<string>('Uttar Pradesh');
  const [stateTabPosts, setStateTabPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateSEO();

    async function loadData() {
      setLoading(true);
      const latest = await getLatestPosts(6);
      setLatestPosts(latest);

      // Fetch sample posts for key category sections
      const categoriesToFetch = [
        'Sarkari Yojana',
        'Sarkari Naukri',
        'Results',
        'Admit Card',
        'Answer Key',
        'Syllabus',
        'Scholarship',
        'Current Affairs',
      ] as const;

      const catData: Record<string, Post[]> = {};
      for (const cat of categoriesToFetch) {
        const res = await getPostsByCategory(cat, 1, 4);
        catData[cat] = res.posts;
      }
      setCategoryPosts(catData);

      // Load state tab posts
      const stateRes = await getLatestPosts(10);
      const filteredForState = stateRes.filter(
        (p) => p.state && p.state.toLowerCase() === selectedStateTab.toLowerCase()
      );
      setStateTabPosts(filteredForState.length > 0 ? filteredForState : latest.slice(0, 3));

      setLoading(false);
    }

    loadData();
  }, [selectedStateTab]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400 text-blue-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
            <Sparkles className="h-3.5 w-3.5 fill-blue-950" /> Official Portal For All India
          </div>

          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            Sarkari Yojana, Sarkari Naukri, Result & Admit Card 2026
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            Find the latest Central Government & State Government job vacancies, exam results, admit card download links, answer keys, syllabus PDF, and welfare schemes for all 28 Indian States & UTs.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
            <Link
              to="/sarkari-naukri"
              className="rounded-lg bg-amber-400 px-4 py-2.5 text-blue-950 hover:bg-amber-300 shadow-md transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="h-4 w-4" /> Latest Govt Jobs
            </Link>
            <Link
              to="/sarkari-yojana"
              className="rounded-lg bg-blue-800 px-4 py-2.5 text-white hover:bg-blue-700 border border-blue-600 transition-colors flex items-center gap-1.5"
            >
              <FileText className="h-4 w-4" /> Sarkari Yojana
            </Link>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area (Left / Center) */}
        <main className="lg:col-span-8 space-y-10">
          {/* LATEST UPDATES SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-blue-900 pb-2">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-slate-900 flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-red-600 animate-ping" />
                Latest Updates
              </h2>
              <span className="text-xs font-bold text-slate-500">Updated Hourly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          {/* Ad Slot - Between Sections */}
          <AdSlot format="horizontal" label="Advertisement" />

          {/* SARKARI NAUKRI BY STATE TABBED FILTER */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  State-Wise Sarkari Naukri
                </h2>
                <p className="text-xs text-slate-500">Select your state to view dedicated government jobs</p>
              </div>
              <Link
                to="/sarkari-naukri"
                className="text-xs font-bold text-blue-800 hover:underline flex items-center gap-1"
              >
                All States <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* State Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {ALL_INDIAN_STATES.slice(0, 10).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStateTab(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedStateTab === st
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* State Job Cards Feed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {stateTabPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-slate-200 p-3 hover:border-blue-700 hover:shadow-xs transition-all bg-slate-50/50"
                >
                  <CategoryBadge category={post.category} size="sm" />
                  <Link to={`/post/${post.slug}`} className="block mt-1.5">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-blue-800 line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{post.excerpt}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SARKARI YOJANA SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-2">
              <h2 className="text-lg font-black uppercase tracking-wide text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Sarkari Yojana (Government Schemes)
              </h2>
              <Link
                to="/sarkari-yojana"
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                View All Yojana →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(categoryPosts['Sarkari Yojana'] || []).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          {/* RESULTS & ADMIT CARDS SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RESULTS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-indigo-700 pb-2">
                <h3 className="text-base font-black uppercase text-slate-900 flex items-center gap-1.5">
                  <Award className="h-5 w-5 text-indigo-700" />
                  Latest Results
                </h3>
                <Link to="/results" className="text-xs font-bold text-indigo-700 hover:underline">
                  All Results →
                </Link>
              </div>
              <div className="space-y-2">
                {(categoryPosts['Results'] || []).map((post) => (
                  <div key={post.id} className="rounded-lg border border-slate-200 p-3 bg-white hover:border-indigo-600">
                    <Link to={`/post/${post.slug}`} className="text-xs font-bold text-slate-900 hover:text-indigo-700 line-clamp-2">
                      {post.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* ADMIT CARD */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-amber-600 pb-2">
                <h3 className="text-base font-black uppercase text-slate-900 flex items-center gap-1.5">
                  <Ticket className="h-5 w-5 text-amber-600" />
                  Admit Card
                </h3>
                <Link to="/admit-card" className="text-xs font-bold text-amber-700 hover:underline">
                  All Admit Cards →
                </Link>
              </div>
              <div className="space-y-2">
                {(categoryPosts['Admit Card'] || []).map((post) => (
                  <div key={post.id} className="rounded-lg border border-slate-200 p-3 bg-white hover:border-amber-600">
                    <Link to={`/post/${post.slug}`} className="text-xs font-bold text-slate-900 hover:text-amber-700 line-clamp-2">
                      {post.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SCHOLARSHIP & ANSWER KEY SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SCHOLARSHIP */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-rose-600 pb-2">
                <h3 className="text-base font-black uppercase text-slate-900 flex items-center gap-1.5">
                  <GraduationCap className="h-5 w-5 text-rose-600" />
                  Scholarship Updates
                </h3>
                <Link to="/scholarship" className="text-xs font-bold text-rose-700 hover:underline">
                  All Scholarships →
                </Link>
              </div>
              <div className="space-y-2">
                {(categoryPosts['Scholarship'] || []).map((post) => (
                  <div key={post.id} className="rounded-lg border border-slate-200 p-3 bg-white hover:border-rose-600">
                    <Link to={`/post/${post.slug}`} className="text-xs font-bold text-slate-900 hover:text-rose-700 line-clamp-2">
                      {post.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* ANSWER KEY */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-teal-700 pb-2">
                <h3 className="text-base font-black uppercase text-slate-900 flex items-center gap-1.5">
                  <CheckSquare className="h-5 w-5 text-teal-700" />
                  Answer Keys
                </h3>
                <Link to="/answer-key" className="text-xs font-bold text-teal-700 hover:underline">
                  All Answer Keys →
                </Link>
              </div>
              <div className="space-y-2">
                {(categoryPosts['Answer Key'] || []).map((post) => (
                  <div key={post.id} className="rounded-lg border border-slate-200 p-3 bg-white hover:border-teal-600">
                    <Link to={`/post/${post.slug}`} className="text-xs font-bold text-slate-900 hover:text-teal-700 line-clamp-2">
                      {post.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ALL 28 STATES & UTs QUICK GRID */}
          <section className="rounded-xl border border-slate-200 bg-slate-900 text-white p-6 shadow-md space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black uppercase tracking-wide text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-400" />
                Sarkari Jobs By All Indian States & UTs
              </h2>
              <p className="text-xs text-slate-400">Direct state-wise recruitment portals and job notifications</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
              {ALL_INDIAN_STATES.map((st) => (
                <Link
                  key={st}
                  to={`/sarkari-naukri/${stateToSlug(st)}`}
                  className="rounded-lg bg-slate-800 px-3 py-2 text-slate-200 hover:bg-amber-400 hover:text-slate-950 font-bold transition-colors truncate"
                >
                  {st}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Union Territories
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {ALL_UNION_TERRITORIES.map((ut) => (
                  <Link
                    key={ut}
                    to={`/sarkari-naukri/${stateToSlug(ut)}`}
                    className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300 hover:bg-amber-400 hover:text-slate-950 font-bold transition-colors truncate"
                  >
                    {ut}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
