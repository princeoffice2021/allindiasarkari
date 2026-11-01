import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Tag,
  Share2,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { CareerBlog, BlogLanguage } from '../types/careerBlog';
import { getCareerBlogBySlug, getRelatedCareerBlogs } from '../lib/careerBlogsService';
import { updateSEO, BASE_URL } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ShareButtons } from '../components/ShareButtons';
import { AuthorBio } from '../components/AuthorBio';
import { sanitizeArticleHtml } from '../lib/sanitizer';

interface CareerBlogDetailPageProps {
  forcedLanguage?: BlogLanguage;
}

export const CareerBlogDetailPage: React.FC<CareerBlogDetailPageProps> = ({ forcedLanguage }) => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const language: BlogLanguage = useMemo(() => {
    if (forcedLanguage) return forcedLanguage;
    if (location.pathname.startsWith('/blogs/english')) return 'english';
    return 'hindi';
  }, [forcedLanguage, location.pathname]);

  const [blog, setBlog] = useState<CareerBlog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<CareerBlog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  const isHindi = language === 'hindi';

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    getCareerBlogBySlug(language, slug)
      .then(async (data) => {
        if (!isMounted) return;
        if (!data) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setBlog(data);
        setLoading(false);

        // Fetch related articles
        const related = await getRelatedCareerBlogs(data.id, data.language, data.category, 3);
        if (isMounted) {
          setRelatedBlogs(related);
        }

        // Setup SEO & Article Schema
        const pageTitle = data.meta_title || `${data.title} - All India Sarkari`;
        const pageDesc = data.meta_description || data.excerpt;
        const pageCanonical = data.canonical_url || `/blogs/${data.language}/${data.slug}`;
        const pageImage = data.image_url || undefined;

        updateSEO({
          title: pageTitle,
          description: pageDesc,
          canonicalUrl: pageCanonical,
          ogType: 'article',
          ogImage: pageImage,
          articleMeta: {
            publishedTime: data.published_at || data.created_at,
            modifiedTime: data.updated_at || data.published_at || data.created_at,
            section: data.category,
            keywords: data.tags,
          },
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data.title,
            description: data.excerpt,
            image: data.image_url ? [data.image_url] : undefined,
            datePublished: data.published_at || data.created_at,
            dateModified: data.updated_at || data.created_at,
            author: {
              '@type': 'Person',
              name: data.author_name || 'Prince Sharma',
            },
            publisher: {
              '@type': 'Organization',
              name: 'All India Sarkari',
              url: 'https://allindiasarkari.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://allindiasarkari.com/logo.png',
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${BASE_URL}/blogs/${data.language}/${data.slug}`,
            },
            inLanguage: data.language === 'hindi' ? 'hi-IN' : 'en-US',
          },
        });
      })
      .catch((err) => {
        console.error('Error fetching blog detail:', err);
        if (isMounted) {
          setNotFound(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [language, slug]);

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-10 w-10 rounded-full border-3 border-blue-900 border-t-transparent animate-spin" />
        <span className="text-xs font-bold text-slate-500">
          {isHindi ? 'करियर आर्टिकल लोड हो रहा है...' : 'Loading career guide...'}
        </span>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="bg-white rounded-2xl p-10 sm:p-14 text-center border border-slate-200 shadow-2xs space-y-4 my-8">
        <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          {isHindi ? 'आर्टिकल नहीं मिला' : 'Career Article Not Found'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {isHindi
            ? 'यह आर्टिकल हटा दिया गया है या इसका यूआरएल बदल दिया गया है। आप मुख्य ब्लॉग पेज पर जाकर अन्य आर्टिकल्स पढ़ सकते हैं।'
            : 'The requested career article could not be found or may have been relocated.'}
        </p>
        <div className="pt-2">
          <Link
            to={`/blogs/${language}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-900 text-white font-bold text-xs px-5 py-2.5 hover:bg-blue-950 transition-colors shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{isHindi ? 'सभी ब्लॉग्स देखें' : 'Back to Career Blogs'}</span>
          </Link>
        </div>
      </div>
    );
  }

  const dateStr = new Date(blog.published_at || blog.created_at).toLocaleDateString(
    isHindi ? 'hi-IN' : 'en-IN',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const wordCount = (blog.content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readMins = Math.max(1, Math.ceil(wordCount / 180));
  const sanitizedContent = sanitizeArticleHtml(blog.content || '');

  return (
    <article className="space-y-6 pb-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: isHindi ? 'करियर ब्लॉग्स' : 'Career Blogs', path: `/blogs/${language}` },
          { label: blog.category, path: `/blogs/${language}` },
          { label: blog.title },
        ]}
      />

      {/* Main Article Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Header Block */}
        <div className="p-5 sm:p-8 md:p-10 border-b border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-100 text-blue-900 text-xs font-black px-3 py-1 uppercase tracking-wider border border-blue-200">
              {blog.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5 text-slate-400" /> {readMins} min read
            </span>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase">
              {blog.language === 'hindi' ? 'हिंदी में' : 'English'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal bg-slate-50 p-4 rounded-xl border-l-4 border-blue-900">
              {blog.excerpt}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs text-slate-600 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <User className="h-4 w-4 text-blue-900" /> By {blog.author_name}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-slate-400" /> {dateStr}
              </span>
            </div>

            <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-bold text-xs border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" /> Verified Editorial Guide
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {blog.image_url && (
          <div className="w-full bg-slate-100 max-h-[460px] overflow-hidden flex items-center justify-center">
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Article Content Body */}
        <div className="p-5 sm:p-8 md:p-10 space-y-6">
          <div
            className="article-content max-w-none text-slate-800 leading-relaxed text-sm sm:text-base space-y-4"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-200 space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> {isHindi ? 'प्रमुख विषय और टैग्स' : 'Related Topics & Tags'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 text-xs font-semibold transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social Sharing Component */}
      <ShareButtons
        title={blog.title}
        url={`${BASE_URL}/blogs/${blog.language}/${blog.slug}`}
      />

      {/* Author Bio Component */}
      <AuthorBio />

      {/* Related Career Articles */}
      {relatedBlogs.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-900" />
              <span>{isHindi ? 'संबंधित करियर आर्टिकल्स' : 'Related Career Guides'}</span>
            </h3>
            <Link
              to={`/blogs/${language}`}
              className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
            >
              <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedBlogs.map((rel) => {
              const relDate = new Date(rel.published_at || rel.created_at).toLocaleDateString(
                isHindi ? 'hi-IN' : 'en-IN',
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }
              );

              return (
                <Link
                  key={rel.id}
                  to={`/blogs/${rel.language}/${rel.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 font-normal">
                      {rel.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{relDate}</span>
                    <span className="font-bold text-blue-900 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      {isHindi ? 'पढ़ें' : 'Read'} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Back to Blog Listing */}
      <div className="pt-4 text-center">
        <Link
          to={`/blogs/${language}`}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 transition-colors border border-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isHindi ? 'सभी हिंदी करियर ब्लॉग्स पर वापस जाएं' : 'Back to All English Career Blogs'}</span>
        </Link>
      </div>
    </article>
  );
};
