import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, Flag } from 'lucide-react';
import { CATEGORIES_CONFIG } from '../data/statesAndCategories';
import { SearchBar } from './SearchBar';
import { MobileMenu } from './MobileMenu';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md w-full">
      {/* Top Notification Ticker Bar */}
      <div className="w-full bg-slate-900 text-slate-100 text-[11px] py-1.5 border-b border-slate-800">
        <div className="px-3 sm:px-6 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="bg-emerald-800 text-emerald-100 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">
              LIVE UPDATES
            </span>
            <span className="truncate">
              All India Sarkari • Official Portal for Sarkari Yojana, Govt Jobs, Results, Admit Cards & Syllabus across India
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3.5 text-slate-300 text-[11px] shrink-0">
            <Link to="/blogs/hindi" className="text-amber-400 hover:text-white font-bold transition-colors">करियर ब्लॉग्स</Link>
            <Link to="/blogs/english" className="text-blue-200 hover:text-white font-bold transition-colors">Career Blog</Link>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Logo & Search Header */}
      <div className="w-full bg-white">
        <div className="px-3 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-900 text-white shadow-md border border-blue-700 group-hover:bg-blue-950 transition-colors">
              <Flag className="h-6 w-6 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                  All India Sarkari
                </h1>
                <span className="hidden sm:inline-block bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  India
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 tracking-wide">
                sarkari yojana • sarkari naukri • result • admit card
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block w-full max-w-md">
            <SearchBar />
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              aria-label="Toggle Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-blue-900 text-white shadow-xs hover:bg-blue-950"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Input for Mobile */}
      {isSearchOpen && (
        <div className="md:hidden bg-slate-100 p-3 border-t border-slate-200 w-full">
          <div className="px-3 sm:px-6">
            <SearchBar onSearchSubmit={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Category Navigation Bar */}
      <nav className="w-full bg-blue-900 text-white shadow-inner hidden md:block">
        <div className="px-3 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar">
          <ul className="flex items-center font-bold text-xs uppercase tracking-wide -ml-3.5">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3.5 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-950 border-amber-400 text-amber-300'
                      : 'border-transparent text-slate-100 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            {CATEGORIES_CONFIG.map((cat) => (
              <li key={cat.slug}>
                <NavLink
                  to={`/${cat.slug}`}
                  className={({ isActive }) =>
                    `block px-3.5 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-950 border-amber-400 text-amber-300'
                        : 'border-transparent text-slate-100 hover:bg-blue-800 hover:text-white'
                    }`
                  }
                >
                  {cat.name}
                </NavLink>
              </li>
            ))}

            <li>
              <NavLink
                to="/blogs/hindi"
                className={({ isActive }) =>
                  `block px-3.5 py-3 border-b-2 transition-colors whitespace-nowrap text-amber-300 ${
                    isActive
                      ? 'bg-blue-950 border-amber-400 text-amber-300'
                      : 'border-transparent hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                करियर ब्लॉग्स
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/blogs/english"
                className={({ isActive }) =>
                  `block px-3.5 py-3 border-b-2 transition-colors whitespace-nowrap text-blue-200 ${
                    isActive
                      ? 'bg-blue-950 border-amber-400 text-amber-300'
                      : 'border-transparent hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                Career Guide
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};
