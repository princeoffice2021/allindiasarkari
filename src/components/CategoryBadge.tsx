import React from 'react';
import { CategoryType } from '../types';
import { CATEGORIES_CONFIG } from '../data/statesAndCategories';

interface CategoryBadgeProps {
  category: CategoryType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  className = '',
}) => {
  const config = CATEGORIES_CONFIG.find((c) => c.name === category);
  const colorClass = config?.color || 'bg-slate-700 text-white';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 rounded font-medium',
    md: 'text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide',
    lg: 'text-sm px-3 py-1.5 rounded-lg font-bold tracking-wide',
  };

  return (
    <span
      className={`inline-block whitespace-nowrap shadow-xs uppercase ${colorClass} ${sizeClasses[size]} ${className}`}
    >
      {category}
    </span>
  );
};
