import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateSEO } from '../lib/seo';
import { SearchBar } from '../components/SearchBar';
import { AlertCircle, Home, Search, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: '404 - Page Not Found | All India Sarkari',
      description: 'The requested government notification or page could not be found.',
      noindex: true,
    });
  }, []);

  return (
    <div className="py-12 sm:py-20 max-w-2xl mx-auto px-4 text-center space-y-6">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100 text-red-600 shadow-inner">
        <AlertCircle className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-red-600">
          Error 404
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The page or article you are looking for does not exist, has been removed, or the link may be outdated.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Search Government Vacancies & Schemes:
        </p>
        <SearchBar />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-blue-950 transition-colors"
        >
          <Home className="h-4 w-4" /> Go To Homepage
        </Link>
        <Link
          to="/sarkari-naukri"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-300 transition-colors"
        >
          Browse Sarkari Naukri <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
