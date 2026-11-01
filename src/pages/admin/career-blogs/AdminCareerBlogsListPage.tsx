import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Languages,
  BookOpen,
} from 'lucide-react';
import { CareerBlog, BlogLanguage, CareerBlogCategory } from '../../../types/careerBlog';
import {
  getAllCareerBlogsAdmin,
  getAllCareerBlogCategories,
  deleteCareerBlog,
  toggleCareerBlogPublish,
} from '../../../lib/careerBlogsService';
import { LiveCareerBlogPreviewModal } from '../../../components/LiveCareerBlogPreviewModal';

interface AdminCareerBlogsListPageProps {
  forcedLanguage?: BlogLanguage;
}

export const AdminCareerBlogsListPage: React.FC<AdminCareerBlogsListPageProps> = ({
  forcedLanguage,
}) => {
  const location = useLocation();

  const language: BlogLanguage = useMemo(() => {
    if (forcedLanguage) return forcedLanguage;
    if (location.pathname.includes('/english')) return 'english';
    return 'hindi';
  }, [forcedLanguage, location.pathname]);

  const isHindi = language === 'hindi';

  const [blogs, setBlogs] = useState<CareerBlog[]>([]);
  const [categories, setCategories] = useState<CareerBlogCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState(true);
  const [previewBlog, setPreviewBlog] = useState<CareerBlog | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<CareerBlog | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [blogsData, catsData] = await Promise.all([
        getAllCareerBlogsAdmin(language, searchQuery, selectedCategory, statusFilter),
        getAllCareerBlogCategories(),
      ]);
      setBlogs(blogsData);
      setCategories(catsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [language, searchQuery, selectedCategory, statusFilter]);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const updated = await toggleCareerBlogPublish(id);
      showToast(
        updated.published
          ? 'Article published to live website!'
          : 'Article moved to draft mode.'
      );
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to update status.');
    }
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      await deleteCareerBlog(blogToDelete.id);
      showToast('Article deleted successfully.');
      setBlogToDelete(null);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to delete.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`p-2 rounded-xl ${
                isHindi ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
              }`}
            >
              <Languages className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {isHindi ? 'Hindi Career Blogs (हिंदी ब्लॉग्स)' : 'English Career Blogs'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {isHindi
              ? 'हिंदी भाषा के सभी करियर मार्गदर्शन आर्टिकल्स, इंटरव्यू टिप्स और रिज्यूमे गाइड्स प्रबंधित करें'
              : 'Manage all English career advice articles, job preparation guides, and corporate career tips'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/blogs/${language}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-300/80"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Public Page</span>
          </Link>

          <Link
            to={`/admin/career-blogs/new?lang=${language}`}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-colors shadow-xs ${
              isHindi
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-blue-900 hover:bg-blue-950 text-white'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ Write New {isHindi ? 'Hindi' : 'English'} Blog</span>
          </Link>
        </div>
      </div>

      {/* Toast Notice */}
      {actionMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, slug or excerpt..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 font-medium"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'all' | 'published' | 'draft')
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 font-medium"
            >
              <option value="all">All Statuses (Published & Draft)</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            Loading articles...
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No articles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No career articles matched your filter criteria in this section.
            </p>
            <Link
              to={`/admin/career-blogs/new?lang=${language}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create First Article</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Article Info */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="flex items-start gap-3">
                        {b.image_url ? (
                          <img
                            src={b.image_url}
                            alt=""
                            className="h-12 w-16 object-cover rounded-lg border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 text-slate-400">
                            <BookOpen className="h-5 w-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            to={`/admin/career-blogs/${b.id}/edit`}
                            className="font-bold text-slate-900 hover:text-blue-900 line-clamp-1"
                          >
                            {b.title}
                          </Link>
                          <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                            slug: {b.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {b.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(b.id)}
                        title="Click to toggle publish/draft"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase transition-all ${
                          b.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            b.published ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}
                        />
                        <span>{b.published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {b.author_name}
                    </td>

                    {/* Created */}
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(b.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewBlog(b)}
                          title="Live Preview"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/admin/career-blogs/${b.id}/edit`}
                          title="Edit Blog"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        {b.published && (
                          <Link
                            to={`/blogs/${b.language}/${b.slug}`}
                            target="_blank"
                            title="View on Public Site"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => setBlogToDelete(b)}
                          title="Delete Blog"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong>"{blogToDelete.title}"</strong>?
              This action will remove the article from the public website.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setBlogToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-xs"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewBlog && (
        <LiveCareerBlogPreviewModal
          isOpen={Boolean(previewBlog)}
          onClose={() => setPreviewBlog(null)}
          blog={previewBlog}
        />
      )}
    </div>
  );
};
