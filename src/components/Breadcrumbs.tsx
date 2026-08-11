import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BASE_URL } from '../lib/seo';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const allItems: BreadcrumbItem[] = [{ label: 'Home', url: '/' }, ...items];

  // Inject BreadcrumbList structured data
  useEffect(() => {
    const breadcrumbListJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: allItems.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.label,
        item: item.url
          ? `${BASE_URL.replace(/\/+$/, '')}${item.url.startsWith('/') ? '' : '/'}${item.url}`
          : undefined,
      })),
    };

    let script = document.querySelector('#breadcrumb-json-ld') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'breadcrumb-json-ld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(breadcrumbListJsonLd);

    return () => {
      const existing = document.querySelector('#breadcrumb-json-ld');
      if (existing) existing.remove();
    };
  }, [items]);

  return (
    <nav className={`my-3 text-xs text-slate-600 ${className}`} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 font-medium">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
              {isLast || !item.url ? (
                <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-xs" title={item.label}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="flex items-center gap-1 text-slate-600 hover:text-blue-800 transition-colors"
                >
                  {index === 0 && <Home className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
