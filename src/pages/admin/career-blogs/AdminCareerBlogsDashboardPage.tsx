import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  FolderTree,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Languages,
} from 'lucide-react';
import { CareerBlog, CareerBlogStats } from '../../../types/careerBlog';
import {
  getCareerBlogStats,
  getAllCareerBlogsAdmin,
  deleteCareerBlog,
  toggleCareerBlogPublish,
} from '../../../lib/careerBlogsService';
import { LiveCareerBlogPreviewModal } from '../../../components/LiveCareerBlogPreviewModal';

export const AdminCareerBlogsDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<CareerBlogStats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<CareerBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'hindi' | 'english'>('all');
  const [previewBlog, setPreviewBlog] = useState<CareerBlog | null>(null);
  const [blogToDelete, setBlogToDelete] = useState<CareerBlog | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, blogsData] = await Promise.all([
        getCareerBlogStats(),
        getAllCareerBlogsAdmin(),
      ]);
      setStats(statsData);
      setRecentBlogs(blogsData.slice(0, 10));
    } catch (e) {
      console.error('Failed to load career blogs dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          : 'Article converted to draft.'
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
      showToast('Failed to delete article.');
    }
  };

  const filteredBlogs = recentBlogs.filter((b) => {
    if (activeTab === 'hindi') return b.language === 'hindi';
    if (activeTab === 'english') return b.language === 'english';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
              <BookOpen className="h-5 w-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Career Blogs Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage public career articles, job tips & resume guides for Hindi & English sections
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/career-blogs/categories"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-300/80"
          >
            <FolderTree className="h-4 w-4" />
            <span>Categories</span>
          </Link>
          <Link
            to="/admin/career-blogs/new?lang=hindi"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-colors shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ New Hindi Blog</span>
          </Link>
          <Link
            to="/admin/career-blogs/new?lang=english"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ New English Blog</span>
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

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: All Articles */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Blogs</span>
            <FileText className="h-4 w-4 text-blue-900" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats ? stats.total : '...'}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="text-emerald-600 font-bold">{stats?.published || 0} Published</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">{stats?.drafts || 0} Drafts</span>
          </div>
        </div>

        {/* Card 2: Hindi Blogs */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-2xs space-y-2 bg-gradient-to-br from-amber-50/40 to-white">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-xs font-bold uppercase tracking-wider">Hindi Blogs (हिंदी)</span>
            <Languages className="h-4 w-4 text-amber-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-950">
            {stats ? stats.hindiTotal : '...'}
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600 font-medium">
              {stats?.hindiPublished || 0} Live / {stats?.hindiDrafts || 0} Draft
            </span>
            <Link
              to="/admin/career-blogs/hindi"
              className="text-amber-800 font-bold hover:underline"
            >
              View Hindi ›
            </Link>
          </div>
        </div>

        {/* Card 3: English Blogs */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200/80 shadow-2xs space-y-2 bg-gradient-to-br from-blue-50/40 to-white">
          <div className="flex items-center justify-between text-blue-900">
            <span className="text-xs font-bold uppercase tracking-wider">English Blogs</span>
            <Languages className="h-4 w-4 text-blue-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-950">
            {stats ? stats.englishTotal : '...'}
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-600 font-medium">
              {stats?.englishPublished || 0} Live / {stats?.englishDrafts || 0} Draft
            </span>
            <Link
              to="/admin/career-blogs/english"
              className="text-blue-800 font-bold hover:underline"
            >
              View English ›
            </Link>
          </div>
        </div>

        {/* Card 4: Quick Public Preview Links */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              Live Public Sections
            </span>
            <h3 className="text-sm font-bold text-white mt-0.5">
              Verify On Public Website
            </h3>
          </div>
          <div className="space-y-1.5">
            <Link
              to="/blogs/hindi"
              target="_blank"
              className="flex items-center justify-between text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors"
            >
              <span>🌐 /blogs/hindi</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/blogs/english"
              target="_blank"
              className="flex items-center justify-between text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 transition-colors"
            >
              <span>🌐 /blogs/english</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Filter Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Articles ({recentBlogs.length})
            </button>
            <button
              onClick={() => setActiveTab('hindi')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'hindi'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Hindi Only
            </button>
            <button
              onClick={() => setActiveTab('english')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'english'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              English Only
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/admin/career-blogs/hindi"
              className="text-blue-900 font-bold hover:underline"
            >
              Manage Hindi Blogs ›
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              to="/admin/career-blogs/english"
              className="text-blue-900 font-bold hover:underline"
            >
              Manage English Blogs ›
            </Link>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            Loading articles...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500">
            No articles found. Click "+ New Blog" to create your first career guide.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Title & Excerpt</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Language */}
                    <td className="py-3.5 px-4 font-bold shrink-0">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          b.language === 'hindi'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}
                      >
                        {b.language === 'hindi' ? 'हिंदी' : 'English'}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <Link
                        to={`/admin/career-blogs/${b.id}/edit`}
                        className="font-bold text-slate-900 hover:text-blue-900 line-clamp-1 block"
                      >
                        {b.title}
                      </Link>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {b.excerpt}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {b.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(b.id)}
                        title="Click to toggle publish/draft"
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase transition-all ${
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

                    {/* Date */}
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
              This will remove the article from public view.
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
