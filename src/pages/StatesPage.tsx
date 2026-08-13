import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ALL_INDIAN_STATES, ALL_UNION_TERRITORIES, stateToSlug } from '../data/statesAndCategories';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { AdSlot } from '../components/AdSlot';
import { MapPin, Building2, ChevronRight, Landmark } from 'lucide-react';

export const StatesPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'State Wise Sarkari Naukri 2026 - All 28 States & 8 UT Govt Jobs',
      description: 'Find latest state government jobs, recruitment notifications, results and admit cards across all 28 Indian States & 8 Union Territories.',
      canonicalUrl: '/states',
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
            name: 'State Wise Jobs',
            item: 'https://allindiasarkari.com/states',
          },
        ],
      },
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'All States & UTs', url: '/states' }]} />

      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white p-6 shadow-md border border-blue-800 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-blue-950 shadow-md shrink-0 font-black">
            <Landmark className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              State-Wise Sarkari Naukri 2026
            </h1>
            <p className="text-xs sm:text-sm text-slate-200">
              Select your state or Union Territory to access localized government job notifications, admit cards, and state portal updates.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 space-y-8">
          {/* 28 Indian States Grid */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <MapPin className="h-5 w-5 text-red-600" />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
                28 Indian States
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ALL_INDIAN_STATES.map((stateName) => {
                const slug = stateToSlug(stateName);
                return (
                  <Link
                    key={stateName}
                    to={`/state/${slug}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all group"
                  >
                    <span className="text-xs font-extrabold text-slate-800 group-hover:text-white">
                      {stateName}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 8 Union Territories Grid */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Building2 className="h-5 w-5 text-blue-700" />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
                8 Union Territories
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ALL_UNION_TERRITORIES.map((utName) => {
                const slug = stateToSlug(utName);
                return (
                  <Link
                    key={utName}
                    to={`/state/${slug}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-900 hover:text-white hover:border-blue-900 transition-all group"
                  >
                    <span className="text-xs font-extrabold text-slate-800 group-hover:text-white">
                      {utName}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </div>
          </section>

          <AdSlot format="horizontal" label="Advertisement" />
        </main>

        <Sidebar />
      </div>
    </div>
  );
};
