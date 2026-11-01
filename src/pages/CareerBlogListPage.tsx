import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Filter,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileText,
  Clock,
  Compass,
} from 'lucide-react';
import { CareerBlog, BlogLanguage, CareerBlogCategory } from '../types/careerBlog';
import {
  getPublishedCareerBlogs,
  getAllCareerBlogCategories,
} from '../lib/careerBlogsService';
import { updateSEO, BASE_URL } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface CareerBlogListPageProps {
  forcedLanguage?: BlogLanguage;
}

export const CareerBlogListPage: React.FC<CareerBlogListPageProps> = ({ forcedLanguage }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active language from prop or URL pathname
  const language: BlogLanguage = useMemo(() => {
    if (forcedLanguage) return forcedLanguage;
    if (location.pathname.includes('/english')) return 'english';
    return 'hindi';
  }, [forcedLanguage, location.pathname]);

  const [blogs, setBlogs] = useState<CareerBlog[]>([]);
  const [categories, setCategories] = useState<CareerBlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const isHindi = language === 'hindi';

  // Load Categories on mount
  useEffect(() => {
    getAllCareerBlogCategories().then(setCategories);
  }, []);

  // Update SEO for this listing page
  useEffect(() => {
    const pageTitle = isHindi
      ? 'करियर गाइडेंस और जॉब टिप्स ब्लॉग (हिंदी में) - All India Sarkari'
      : 'Career Guidance & Job Preparation Blog (English) - All India Sarkari';

    const pageDesc = isHindi
      ? 'सरकारी और प्राइवेट नौकरी, रिज्यूमे मेकिंग, इंटरव्यू तैयारी, और स्किल डेवलपमेंट के लिए सर्वश्रेष्ठ हिंदी करियर आर्टिकल्स व गाइड।'
      : 'Expert career guides, resume building tips, interview preparation strategies, government exam guidance, and workplace skills on All India Sarkari.';

    updateSEO({
      title: pageTitle,
      description: pageDesc,
      canonicalUrl: `/blogs/${language}`,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        description: pageDesc,
        url: `${BASE_URL}/blogs/${language}`,
        inLanguage: isHindi ? 'hi-IN' : 'en-US',
      },
    });
  }, [language, isHindi]);

  // Fetch blogs when filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getPublishedCareerBlogs(language, page, 9, selectedCategory, searchQuery)
      .then((res) => {
        if (isMounted) {
          setBlogs(res.blogs);
          setTotalPages(res.totalPages);
          setTotalCount(res.total);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load career blogs:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [language, page, selectedCategory, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
  };

  const handleLanguageSwitch = (newLang: BlogLanguage) => {
    navigate(`/blogs/${newLang}`);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Career Blogs', path: `/blogs/${language}` },
          { label: isHindi ? 'हिंदी करियर ब्लॉग्स' : 'English Career Blogs' },
        ]}
      />

      {/* Hero Header Section */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white p-5 sm:p-8 shadow-lg border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-blue-950 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-blue-950" />
                {isHindi ? 'करियर मार्गदर्शन' : 'Career Portal'}
              </span>
              <span className="text-xs text-blue-200 font-medium">
                {isHindi ? 'सरकारी व प्राइवेट नौकरियों के लिए विशेषज्ञ सलाह' : 'Expert Advice for Sarkari & Private Careers'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {isHindi ? 'हिंदी करियर ब्लॉग्स और मार्गदर्शन' : 'English Career Blogs & Job Tips'}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
              {isHindi
                ? 'सरकारी नौकरियों की तैयारी, रिज्यूमे बनाने का सही तरीका, इंटरव्यू क्रैक करने के टिप्स, स्किल डेवलपमेंट और वेतन वृद्धि से जुड़े विस्तृत गाइड्स पढ़ें।'
                : 'Actionable guidance on cracking interviews, ATS-friendly resumes, government exam roadmaps, professional skills, and salary growth.'}
            </p>
          </div>

          {/* Language Switcher Tabs */}
          <div className="shrink-0 bg-blue-950/70 p-2 rounded-2xl border border-blue-700/50 flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 px-2 text-center">
              Select Language / भाषा चुनें
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleLanguageSwitch('hindi')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  isHindi
                    ? 'bg-amber-400 text-blue-950 shadow-md scale-102'
                    : 'bg-blue-900/60 text-blue-200 hover:bg-blue-800 hover:text-white'
                }`}
              >
                हिंदी ब्लॉग्स
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSwitch('english')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  !isHindi
                    ? 'bg-amber-400 text-blue-950 shadow-md scale-102'
                    : 'bg-blue-900/60 text-blue-200 hover:bg-blue-800 hover:text-white'
                }`}
              >
                English Blogs
              </button>
            </div>
            <div className="text-[10px] text-center text-blue-300 font-medium pt-1">
              {totalCount} {isHindi ? 'आर्टिकल्स उपलब्ध' : 'Articles Published'}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={
              isHindi
                ? 'करियर गाइड, इंटरव्यू टिप्स, रिज्यूमे, या परीक्षा कीवर्ड खोजें...'
                : 'Search career guides, interview questions, resume tips, skills...'
            }
            className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50 placeholder-slate-400 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isHindi ? 'सभी विषय (All)' : 'All Topics'}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.name)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3 animate-pulse"
            >
              <div className="h-44 bg-slate-200 rounded-xl w-full" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-12 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center mx-auto">
            <Compass className="h-7 w-7 text-blue-900" />
          </div>
          <h3 className="text-lg font-black text-slate-900">
            {isHindi ? 'कोई करियर ब्लॉग नहीं मिला' : 'No Career Blogs Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {searchQuery || selectedCategory !== 'all'
              ? isHindi
                ? 'आपके खोजे गए कीवर्ड या श्रेणी के लिए कोई आर्टिकल नहीं मिला। कृपया दूसरे कीवर्ड खोजें।'
                : 'No articles matched your search or category filter. Try clearing filters or using another keyword.'
              : isHindi
              ? 'वर्तमान में कोई ब्लॉग प्रकाशित नहीं है। कृपया जल्द ही दोबारा देखें।'
              : 'No articles currently published in this section. Please check back soon!'}
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPage(1);
              }}
              className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs hover:bg-blue-950 transition-colors"
            >
              {isHindi ? 'सभी फ़िल्टर हटाएं' : 'Reset All Filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            const dateStr = new Date(blog.published_at || blog.created_at).toLocaleDateString(
              isHindi ? 'hi-IN' : 'en-IN',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }
            );

            // Compute reading time
            const wordCount = (blog.content || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
            const readMins = Math.max(1, Math.ceil(wordCount / 180));

            return (
              <article
                key={blog.id}
                className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Card Thumbnail / Featured Image */}
                  <Link
                    to={`/blogs/${language}/${blog.slug}`}
                    className="block relative h-48 w-full overflow-hidden bg-slate-100"
                  >
                    {blog.image_url ? (
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 flex items-center justify-center p-4 text-center">
                        <BookOpen className="h-10 w-10 text-amber-400 opacity-60" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-blue-900/90 backdrop-blur-xs text-amber-300 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs border border-blue-800">
                      {blog.category}
                    </span>
                  </Link>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" /> {dateStr}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" /> {readMins} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-blue-900 transition-colors line-clamp-2">
                      <Link to={`/blogs/${language}/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 font-normal">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 sm:px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold truncate">
                    <User className="h-3.5 w-3.5 text-blue-900 shrink-0" />
                    <span className="truncate">{blog.author_name}</span>
                  </div>

                  <Link
                    to={`/blogs/${language}/${blog.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-blue-900 hover:text-blue-950 group-hover:translate-x-0.5 transition-transform shrink-0"
                  >
                    <span>{isHindi ? 'पूरा पढ़ें' : 'Read Guide'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{isHindi ? 'पिछला' : 'Previous'}</span>
          </button>

          <div className="flex items-center gap-1 text-xs font-bold px-2">
            <span>
              {isHindi ? 'पेज' : 'Page'} {page} {isHindi ? 'का' : 'of'} {totalPages}
            </span>
          </div>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{isHindi ? 'अगला' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bottom Editorial Callout */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 sm:p-6 text-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h3 className="text-sm sm:text-base font-black text-blue-950 uppercase tracking-wide">
            {isHindi ? 'विश्वसनीय करियर गाइड - All India Sarkari' : 'Trusted Career Guidance - All India Sarkari'}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          {isHindi
            ? 'हमारे सभी करियर आर्टिकल्स, रिज्यूमे टेम्पलेट्स और परीक्षा रणनीतियाँ विशेषज्ञों द्वारा तैयार की जाती हैं ताकि छात्र और युवा उम्मीदवार सही करियर चुनाव कर सकें। नियमित अपडेट्स के लिए हमारे साथ बने रहें।'
            : 'All our career articles, resume blueprints, and examination strategies are researched and prepared to help candidates across India make informed career decisions.'}
        </p>
      </section>
    </div>
  );
};
