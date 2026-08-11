import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Post } from '../types';
import { getPostBySlug, getRelatedPosts } from '../lib/postsService';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CategoryBadge } from '../components/CategoryBadge';
import { ShareButtons } from '../components/ShareButtons';
import { Sidebar } from '../components/Sidebar';
import { AdSlot } from '../components/AdSlot';
import { categoryToSlug, stateToSlug } from '../data/statesAndCategories';
import { Calendar, Clock, MapPin, Tag, Sparkles, ArrowRight, User, ExternalLink } from 'lucide-react';

function getSafeUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (/^[a-zA-Z0-9+-.]+:/i.test(trimmed)) {
    return null;
  }
  return `https://${trimmed}`;
}

export const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    getPostBySlug(slug).then((foundPost) => {
      setPost(foundPost);
      if (foundPost) {
        // Dynamic SEO Update with OpenGraph & Article Metadata
        updateSEO({
          title: foundPost.title,
          description: foundPost.meta_description || foundPost.excerpt,
          canonicalUrl: `/post/${foundPost.slug}`,
          ogType: 'article',
          ogImage: foundPost.image_url || undefined,
          articleMeta: {
            publishedTime: foundPost.created_at,
            modifiedTime: foundPost.updated_at,
            section: foundPost.category,
            keywords: foundPost.keywords,
          },
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            url: `https://allindiasarkari.com/post/${foundPost.slug}`,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://allindiasarkari.com/post/${foundPost.slug}`,
            },
            headline: foundPost.title,
            description: foundPost.meta_description || foundPost.excerpt,
            image: [foundPost.image_url || 'https://allindiasarkari.com/icon.png'],
            datePublished: foundPost.created_at,
            dateModified: foundPost.updated_at || foundPost.created_at,
            author: {
              '@type': 'Organization',
              name: 'All India Sarkari',
              url: 'https://allindiasarkari.com',
            },
            publisher: {
              '@type': 'Organization',
              name: 'All India Sarkari',
              logo: {
                '@type': 'ImageObject',
                url: 'https://allindiasarkari.com/logo.png',
              },
            },
          },
        });

        // Load related posts
        getRelatedPosts(foundPost.category, foundPost.slug, 4).then(setRelatedPosts);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-900 border-t-transparent" />
        <p className="text-sm font-semibold text-slate-600">Loading Article Details...</p>
      </div>
    );
  }

  if (!post) {
    updateSEO({
      title: '404 - Post Not Found | All India Sarkari',
      description: 'The requested government article or notification could not be found.',
      noindex: true,
    });

    return (
      <div className="py-16 text-center space-y-4 max-w-lg mx-auto bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">Post Not Found</h1>
        <p className="text-sm text-slate-600">The government update or article you are looking for does not exist or may have been removed.</p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-blue-900 px-5 py-2.5 text-xs font-bold uppercase text-white shadow-xs hover:bg-blue-950"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  const formattedCreated = new Date(post.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedUpdated = new Date(post.updated_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const categorySlug = categoryToSlug(post.category);
  const stateSlug = post.state ? stateToSlug(post.state) : null;

  // Sanitize HTML safely before rendering
  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: post.category, url: `/${categorySlug}` },
          ...(post.state ? [{ label: post.state, url: `/sarkari-naukri/${stateSlug}` }] : []),
          { label: post.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Article Container */}
        <main className="lg:col-span-8 space-y-6 min-w-0">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-xs space-y-6 overflow-hidden">
            {/* Header Meta */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={post.category} size="lg" />
                {post.state && (
                  <Link
                    to={`/sarkari-naukri/${stateSlug}`}
                    className="flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{post.state} Jobs</span>
                  </Link>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 border-y border-slate-100 py-3">
                <span className="flex items-center gap-1 text-slate-700">
                  <User className="h-3.5 w-3.5 text-blue-800" />
                  All India Sarkari Team
                </span>

                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Published: {formattedCreated}
                </span>

                {formattedCreated !== formattedUpdated && (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Clock className="h-3.5 w-3.5" />
                    Updated: {formattedUpdated}
                  </span>
                )}
              </div>
            </div>

            {/* Featured Image */}
            {post.image_url && (
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-xs max-h-[440px] bg-slate-50">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover max-h-[440px]"
                />
              </div>
            )}

            {/* In-Article Top Ad */}
            <AdSlot format="horizontal" label="Advertisement" />

            {/* Excerpt Box */}
            {post.excerpt && (
              <div className="rounded-xl border-l-4 border-blue-900 bg-blue-50/70 p-4 text-sm font-medium text-slate-800 leading-relaxed shadow-2xs">
                <strong className="text-blue-950 font-black block mb-1">Summary / Highlights:</strong>
                {post.excerpt}
              </div>
            )}

            {/* Article Content Body with Safe Custom Typography & Table Auto-Scroll */}
            <div className="article-content overflow-x-auto">
              <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </div>

            {/* In-Article Middle Ad */}
            <AdSlot format="horizontal" label="Advertisement" />

            {/* Keywords / Tags */}
            {post.keywords && post.keywords.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <span className="flex items-center gap-1 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <Tag className="h-3.5 w-3.5 text-blue-800" /> Topic Tags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {post.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Official Source Link Box */}
            {getSafeUrl(post.official_source_url) && (
              <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <span className="text-xs font-black text-blue-900 uppercase tracking-wider block mb-0.5">
                    Official Government Portal / Source
                  </span>
                  <p className="text-xs text-blue-800">
                    Verify official notifications or apply directly on the government portal.
                  </p>
                </div>
                <a
                  href={getSafeUrl(post.official_source_url)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-950 transition-colors shrink-0 shadow-xs"
                >
                  <span>Official Source</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}

            {/* Official Information Disclaimer Notice */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-950 font-medium space-y-1">
              <span className="font-extrabold uppercase tracking-wide text-amber-900 block">
                ⚠️ Official Notice & Disclaimer:
              </span>
              <p>
                Information provided on All India Sarkari is for informational purposes. Please verify important details from the official government portal or recruitment notification.
              </p>
            </div>

            {/* Share Buttons */}
            <ShareButtons title={post.title} />
          </article>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-base font-black uppercase text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Related Updates in {post.category}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((rel) => (
                  <div
                    key={rel.id}
                    className="rounded-lg border border-slate-200 p-3.5 hover:border-blue-700 hover:shadow-xs transition-all bg-slate-50/50"
                  >
                    <CategoryBadge category={rel.category} size="sm" />
                    <Link to={`/post/${rel.slug}`} className="block mt-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 hover:text-blue-800 line-clamp-2">
                        {rel.title}
                      </h4>
                    </Link>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">{rel.excerpt}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bottom Ad */}
          <AdSlot format="horizontal" label="Advertisement" />
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-4 min-w-0">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
};
