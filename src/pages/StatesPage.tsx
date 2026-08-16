import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ALL_INDIAN_STATES,
  ALL_UNION_TERRITORIES,
  ALL_STATES_AND_UTS,
  stateToSlug,
} from '../data/statesAndCategories';
import { getStatePostCounts } from '../lib/postsService';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { AdSlot } from '../components/AdSlot';
import {
  MapPin,
  Building2,
  ChevronRight,
  Landmark,
  Search,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const StatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'states' | 'uts'>('all');
  const [stateCounts, setStateCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    updateSEO({
      title: 'Sarkari Naukri By State – Latest Government Jobs in All States & UTs',
      description:
        'Find the latest Sarkari Naukri, government job vacancies, recruitment notifications, admit cards, results and official updates state-wise across India.',
      canonicalUrl: '/sarkari-naukri',
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
            name: 'Sarkari Naukri By State',
            item: 'https://allindiasarkari.com/sarkari-naukri',
          },
        ],
      },
    });

    getStatePostCounts().then(setStateCounts);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredStates = ALL_INDIAN_STATES.filter((st) =>
    st.toLowerCase().includes(normalizedQuery)
  );

  const filteredUTs = ALL_UNION_TERRITORIES.filter((ut) =>
    ut.toLowerCase().includes(normalizedQuery)
  );

  const totalFilteredCount = filteredStates.length + filteredUTs.length;

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Sarkari Naukri By State', url: '/sarkari-naukri' }]} />

      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-6 sm:p-8 shadow-md border border-blue-800 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-xs font-bold text-amber-300">
              <Landmark className="h-3.5 w-3.5" />
              <span>All India State Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              Latest Sarkari Naukri By State
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Find the latest Sarkari Naukri, government job vacancies, recruitment notifications, admit cards, results and official updates state-wise across India.
            </p>
          </div>

          {/* Dynamic Summary Badges */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0 bg-blue-950/80 p-3 rounded-xl border border-blue-800/80">
            <div className="text-center px-2">
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                {ALL_INDIAN_STATES.length}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-300">Indian States</div>
            </div>
            <div className="h-auto w-px md:h-px md:w-full bg-blue-800" />
            <div className="text-center px-2">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {ALL_UNION_TERRITORIES.length}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-300">Union Territories</div>
            </div>
          </div>
        </div>

        {/* Central Jobs Link Callout */}
        <div className="pt-2 border-t border-blue-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-300">
            Looking for All-India / Central Govt recruitments (SSC, UPSC, Railways, Defence, Banking)?
          </span>
          <Link
            to="/category/sarkari-naukri"
            className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200 hover:underline"
          >
            <span>View All Central Sarkari Jobs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <main className="lg:col-span-8 space-y-6">
          {/* Search & Filter Controls */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search state or union territory (e.g. Rajasthan, Punjab, Delhi)..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-800 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    activeTab === 'all'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({ALL_STATES_AND_UTS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('states')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    activeTab === 'states'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  States ({ALL_INDIAN_STATES.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('uts')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    activeTab === 'uts'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  UTs ({ALL_UNION_TERRITORIES.length})
                </button>
              </div>
            </div>

            {searchQuery && (
              <p className="text-xs text-slate-500 font-medium">
                Found {totalFilteredCount} matching regions for "{searchQuery}"
              </p>
            )}
          </div>

          {/* 28 Indian States Section */}
          {(activeTab === 'all' || activeTab === 'states') && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 border border-red-200">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
                      Indian States ({filteredStates.length} of {ALL_INDIAN_STATES.length})
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Official State Public Service Commissions & Department Jobs
                    </p>
                  </div>
                </div>
              </div>

              {filteredStates.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No Indian States match your search "{searchQuery}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredStates.map((stateName) => {
                    const slug = stateToSlug(stateName);
                    const count = stateCounts[stateName] || 0;
                    return (
                      <Link
                        key={stateName}
                        to={`/sarkari-naukri/${slug}`}
                        className="group flex flex-col justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-900 hover:border-blue-900 hover:shadow-md transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-white transition-colors">
                            {stateName}
                          </span>
                          {count > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 group-hover:bg-amber-300 group-hover:text-slate-950 shrink-0">
                              {count} {count === 1 ? 'Job' : 'Jobs'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold text-slate-400 group-hover:text-blue-200 shrink-0">
                              State
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 group-hover:text-amber-300 transition-colors pt-1 border-t border-slate-200/60 group-hover:border-blue-800">
                          <span>Latest Jobs in {stateName}</span>
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* 8 Union Territories Section */}
          {(activeTab === 'all' || activeTab === 'uts') && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-900">
                      Union Territories ({filteredUTs.length} of {ALL_UNION_TERRITORIES.length})
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      UT Administrations, Police & High Court Recruitments
                    </p>
                  </div>
                </div>
              </div>

              {filteredUTs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No Union Territories match your search "{searchQuery}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredUTs.map((utName) => {
                    const slug = stateToSlug(utName);
                    const count = stateCounts[utName] || 0;
                    return (
                      <Link
                        key={utName}
                        to={`/sarkari-naukri/${slug}`}
                        className="group flex flex-col justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-900 hover:border-blue-900 hover:shadow-md transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-white transition-colors">
                            {utName}
                          </span>
                          {count > 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 group-hover:bg-amber-300 group-hover:text-slate-950 shrink-0">
                              {count} {count === 1 ? 'Job' : 'Jobs'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold text-slate-400 group-hover:text-blue-200 shrink-0">
                              UT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-blue-800 group-hover:text-amber-300 transition-colors pt-1 border-t border-slate-200/60 group-hover:border-blue-800">
                          <span>Latest Jobs in {utName}</span>
                          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Quick FAQ / Info Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2 text-xs text-slate-700">
            <h3 className="font-black uppercase text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              State Sarkari Naukri Verification & Regular Updates
            </h3>
            <p className="leading-relaxed">
              All India Sarkari actively monitors recruitment portals across all {ALL_INDIAN_STATES.length} States and {ALL_UNION_TERRITORIES.length} Union Territories. Click any state or UT above to view active recruitment notifications, exam dates, syllabus, question papers, and official portal links.
            </p>
          </div>

          <AdSlot format="horizontal" label="Advertisement" />
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
