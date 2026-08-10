import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Briefcase, FileText, Award, Search } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-xs py-1 px-2 md:hidden shadow-lg">
      <div className="flex items-center justify-around text-[10px] font-bold uppercase tracking-wider">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 transition-colors ${
              isActive ? 'text-blue-900' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/sarkari-naukri"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 transition-colors ${
              isActive ? 'text-blue-900' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Briefcase className="h-5 w-5 mb-0.5" />
          <span>Jobs</span>
        </NavLink>

        <NavLink
          to="/sarkari-yojana"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 transition-colors ${
              isActive ? 'text-blue-900' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <FileText className="h-5 w-5 mb-0.5" />
          <span>Schemes</span>
        </NavLink>

        <NavLink
          to="/results"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 transition-colors ${
              isActive ? 'text-blue-900' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Award className="h-5 w-5 mb-0.5" />
          <span>Results</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 transition-colors ${
              isActive ? 'text-blue-900' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Search className="h-5 w-5 mb-0.5" />
          <span>Search</span>
        </NavLink>
      </div>
    </div>
  );
};
