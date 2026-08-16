import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, ChevronRight, Building2, MapPin, ShieldCheck } from 'lucide-react';
import { CATEGORIES_CONFIG, ALL_INDIAN_STATES, ALL_STATES_AND_UTS, stateToSlug } from '../data/statesAndCategories';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 flex w-full max-w-xs flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 p-4 text-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-700 font-bold text-white shadow-xs">
              AIS
            </div>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-white">
                All India Sarkari
              </h2>
              <p className="text-[10px] text-slate-300">allindiasarkari.com</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Links */}
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories
            </h3>
            <nav className="space-y-1">
              <NavLink
                to="/"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                <span>Home</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </NavLink>

              {CATEGORIES_CONFIG.map((cat) => (
                <NavLink
                  key={cat.slug}
                  to={`/${cat.slug}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-900'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-700" />
                    {cat.name}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Popular State Jobs */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-blue-700" />
              <span>State Sarkari Naukri</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {ALL_INDIAN_STATES.slice(0, 10).map((state) => {
                const slug = stateToSlug(state);
                return (
                  <Link
                    key={state}
                    to={`/sarkari-naukri/${slug}`}
                    onClick={onClose}
                    className="rounded border border-slate-200 bg-slate-50 px-2.5 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-800 font-medium truncate"
                  >
                    {state}
                  </Link>
                );
              })}
            </div>
            <Link
              to="/sarkari-naukri"
              onClick={onClose}
              className="mt-2 block text-center text-xs font-bold text-blue-700 hover:underline"
            >
              View All {ALL_STATES_AND_UTS.length} States & UTs Jobs →
            </Link>
          </div>

          {/* Admin & Legal */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <Link
              to="/admin/login"
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 justify-center"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Admin Portal Login</span>
            </Link>

            <div className="flex flex-wrap justify-between gap-2 pt-2 text-[11px] text-slate-500 font-medium">
              <Link to="/about" onClick={onClose} className="hover:underline">About</Link>
              <Link to="/contact" onClick={onClose} className="hover:underline">Contact</Link>
              <Link to="/editorial-policy" onClick={onClose} className="hover:underline">Editorial</Link>
              <Link to="/privacy-policy" onClick={onClose} className="hover:underline">Privacy</Link>
              <Link to="/disclaimer" onClick={onClose} className="hover:underline">Disclaimer</Link>
              <Link to="/terms-and-conditions" onClick={onClose} className="hover:underline">Terms</Link>
              <Link to="/sitemap" onClick={onClose} className="hover:underline">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
