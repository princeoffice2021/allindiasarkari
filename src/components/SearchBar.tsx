import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  className?: string;
  onSearchSubmit?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  placeholder = 'Search Govt Jobs, Schemes, Results, Admit Card...',
  className = '',
  onSearchSubmit,
}) => {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onSearchSubmit) onSearchSubmit();
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search government jobs, schemes, results and exams"
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder-slate-400 shadow-2xs focus:border-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-800/20"
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search input"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        aria-label="Submit search query"
        className="ml-2 rounded-lg bg-blue-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-blue-900 transition-colors shrink-0"
      >
        Search
      </button>
    </form>
  );
};
