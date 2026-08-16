// Google Analytics 4 (GA4) Integration for All India Sarkari (https://allindiasarkari.com)

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = (
  import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-EL1Y9ND4C9'
).trim();

const BASE_URL = 'https://allindiasarkari.com';
let isScriptInitialized = false;

/**
 * Loads the official gtag.js script only once into document head and initializes GA4.
 * Uses send_page_view: false to prevent duplicate pageviews on initial SPA load.
 */
export function initGA(): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) {
    return;
  }

  // Prevent duplicate script injection
  if (isScriptInitialized || document.getElementById('ga-gtag-script')) {
    return;
  }

  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    // Inject Google tag script
    const script = document.createElement('script');
    script.id = 'ga-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initial setup with send_page_view: false so SPA route tracking handles exact 1:1 pageviews
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false,
    });

    isScriptInitialized = true;
  } catch (error) {
    // Fail silently in production without disrupting the app
    console.warn('Google Analytics initialization skipped or failed:', error);
  }
}

/**
 * Tracks a page view for both initial load and subsequent client-side SPA navigations.
 * Formats canonical production URL https://allindiasarkari.com
 */
export function trackPageView(pathWithQuery: string, title?: string): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) {
    return;
  }

  try {
    // Ensure GA is initialized
    if (!isScriptInitialized) {
      initGA();
    }

    if (typeof window.gtag === 'function') {
      const cleanPath = pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`;
      const pageLocation = `${BASE_URL}${cleanPath}`;
      const pageTitle = title || document.title || 'All India Sarkari';

      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: pageLocation,
        page_path: cleanPath,
        send_to: GA_MEASUREMENT_ID,
      });
    }
  } catch (error) {
    // Fail silently
    console.warn('GA4 page_view tracking skipped:', error);
  }
}

/**
 * Custom event tracking helper
 */
export function trackCustomEvent(
  eventName: string,
  eventParams: Record<string, any> = {}
): void {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID || typeof window.gtag !== 'function') {
    return;
  }

  try {
    window.gtag('event', eventName, {
      ...eventParams,
      send_to: GA_MEASUREMENT_ID,
    });
  } catch (error) {
    // Fail silently
  }
}
