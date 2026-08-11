export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
  articleMeta?: {
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    keywords?: string[];
  };
  jsonLd?: Record<string, any>;
}

const DEFAULT_TITLE = 'All India Sarkari - Sarkari Yojana, Naukri, Result & Exam Updates';
const DEFAULT_DESCRIPTION = 'Government schemes, Sarkari Naukri, exam results, admit cards, answer keys, syllabus, scholarships and latest government job updates across India.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1595009552535-be753447727e?auto=format&fit=crop&q=80&w=1200';
export const BASE_URL = import.meta.env.VITE_SITE_URL || 'https://allindiasarkari.com';

export function updateSEO({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage,
  noindex = false,
  articleMeta,
  jsonLd,
}: SEOProps = {}) {
  const finalTitle = title ? `${title} | All India Sarkari` : DEFAULT_TITLE;
  const finalDesc = description || DEFAULT_DESCRIPTION;
  const finalImage = ogImage || DEFAULT_IMAGE;
  let finalCanonical = BASE_URL;
  if (canonicalUrl) {
    if (canonicalUrl.startsWith('http://') || canonicalUrl.startsWith('https://')) {
      finalCanonical = canonicalUrl;
    } else {
      const path = canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`;
      finalCanonical = `${BASE_URL.replace(/\/+$/, '')}${path}`;
    }
  }

  // Update Title
  document.title = finalTitle;

  // Update Meta Description
  setMetaTag('description', finalDesc);

  // Update Robots Indexing
  if (noindex) {
    setMetaTag('robots', 'noindex, nofollow');
  } else {
    setMetaTag('robots', 'index, follow');
  }

  // Update OpenGraph
  setMetaTag('og:title', finalTitle, 'property');
  setMetaTag('og:description', finalDesc, 'property');
  setMetaTag('og:type', ogType, 'property');
  setMetaTag('og:image', finalImage, 'property');
  setMetaTag('og:url', finalCanonical, 'property');
  setMetaTag('og:site_name', 'All India Sarkari', 'property');

  // Update Twitter
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', finalTitle);
  setMetaTag('twitter:description', finalDesc);
  setMetaTag('twitter:image', finalImage);

  // Update Canonical URL
  let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.rel = 'canonical';
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.href = finalCanonical;

  // Update Article Metadata
  if (articleMeta) {
    if (articleMeta.publishedTime) {
      setMetaTag('article:published_time', articleMeta.publishedTime, 'property');
    }
    if (articleMeta.modifiedTime) {
      setMetaTag('article:modified_time', articleMeta.modifiedTime, 'property');
    }
    if (articleMeta.section) {
      setMetaTag('article:section', articleMeta.section, 'property');
    }
    if (articleMeta.keywords && articleMeta.keywords.length > 0) {
      setMetaTag('keywords', articleMeta.keywords.join(', '));
    }
  }

  // Update JSON-LD
  let jsonLdScript = document.querySelector('script[id="json-ld-structured-data"]') as HTMLScriptElement;
  if (jsonLd) {
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'json-ld-structured-data';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.text = JSON.stringify(jsonLd);
  } else if (jsonLdScript) {
    jsonLdScript.remove();
  }
}

function setMetaTag(name: string, content: string, keyAttr: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${keyAttr}="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(keyAttr, name);
    document.head.appendChild(element);
  }
  element.content = content;
}
