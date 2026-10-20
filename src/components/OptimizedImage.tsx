import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
}

/**
 * Optimizes Unsplash image URLs to deliver WebP/AVIF via auto=format,
 * custom width, and compressed quality (q=75).
 */
function buildUnsplashUrl(baseUrl: string, targetWidth: number, quality = 75): string {
  try {
    const url = new URL(baseUrl);
    if (!url.hostname.includes('unsplash.com')) {
      return baseUrl;
    }
    url.searchParams.set('w', targetWidth.toString());
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('q', quality.toString());
    return url.toString();
  } catch {
    return baseUrl;
  }
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width = 800,
  height = 450,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
  aspectRatio = '16/9',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isUnsplash = typeof src === 'string' && src.includes('unsplash.com');

  // Generate responsive srcSet for Unsplash images
  const srcSet = isUnsplash
    ? `${buildUnsplashUrl(src, 360)} 360w, ${buildUnsplashUrl(src, 640)} 640w, ${buildUnsplashUrl(src, 800)} 800w`
    : undefined;

  const defaultSrc = isUnsplash ? buildUnsplashUrl(src, width) : src;

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 ${className}`}
        style={{ aspectRatio }}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-6 w-6 stroke-1 mb-1 text-slate-400" />
        <span className="text-[10px] font-semibold text-slate-400">Image unavailable</span>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-slate-100"
      style={{ aspectRatio }}
    >
      {/* Lightweight skeleton background while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200/70 animate-pulse pointer-events-none" />
      )}

      <img
        src={defaultSrc}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
