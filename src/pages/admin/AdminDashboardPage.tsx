import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post, PostStats } from '../../types';
import { getPostStats, getAllPostsAdmin, deletePost } from '../../lib/postsService';
import { updateSEO } from '../../lib/seo';
import { useToast } from '../../components/AdminToast';
import {
  FileText,
  PlusCircle,
  Eye,
  CheckCircle2,
  FileClock,
  LogOut,
  Edit,
  Trash2,
  TrendingUp,
  LayoutDashboard,
  ShieldCheck,
  ExternalLink,
  FolderTree,
  MapPin,
  Image as ImageIcon,
  Settings,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<PostStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const adminEmail = localStorage.getItem('admin_email') || 'admin@allindiasarkari.com';

  useEffect(() => {
    updateSEO({
      title: 'Admin Dashboard - All India Sarkari',
      description: 'All India Sarkari Admin Panel.',
      noindex: true,
    });

    if (localStorage.getItem('admin_authenticated') !== 'true') {
      navigate('/admin/login');
      return;
    }

    loadDashboard();
  }, [navigate]);

  async function loadDashboard() {
    setLoading(true);
    const s = await getPostStats();
    const posts = await getAllPostsAdmin();
    setStats(s);
    setRecentPosts(posts.slice(0, 8));
    setLoading(false);
  }

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deletePost(id);
      showToast('Article deleted successfully.', 'info');
      loadDashboard();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 text-white p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 text-amber-400 font-black text-lg shadow-inner">
            AIS
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-amber-400" />
              Admin Control Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as: <span className="text-amber-300 font-bold">{adminEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/posts/new"
            className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-black uppercase text-blue-950 shadow-sm hover:bg-amber-300 transition-colors"
          >
            <PlusCircle className="h-4 w-4" /> Add New Post
          </Link>

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> View Site
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-700" /> Total Articles
            </span>
            <p className="text-3xl font-black text-slate-900">{stats.total}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Live Published
            </span>
            <p className="text-3xl font-black text-emerald-600">{stats.published}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileClock className="h-4 w-4 text-amber-600" /> Draft Posts
            </span>
            <p className="text-3xl font-black text-amber-600">{stats.drafts}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-purple-700" /> Active Categories
            </span>
            <p className="text-3xl font-black text-purple-700">8</p>
          </div>
        </div>
      )}

      {/* Quick Access Portal Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/posts"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-700 transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-blue-50 text-blue-800">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900">Manage Posts</h3>
            <p className="text-[11px] text-slate-500">Edit or publish existing posts</p>
          </div>
        </Link>

        <Link
          to="/admin/categories"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-700 transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-purple-50 text-purple-800">
            <FolderTree className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900">Categories</h3>
            <p className="text-[11px] text-slate-500">Organize job sections</p>
          </div>
        </Link>

        <Link
          to="/admin/states"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-700 transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900">States & UTs</h3>
            <p className="text-[11px] text-slate-500">Statewise Sarkari Naukri</p>
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-700 transition-all flex items-center gap-3"
        >
          <div className="p-3 rounded-xl bg-amber-50 text-amber-800">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900">Site Settings</h3>
            <p className="text-[11px] text-slate-500">AdSense & SEO tags</p>
          </div>
        </Link>
      </div>

      {/* Recent Posts Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-base font-black uppercase text-slate-900">
            Recently Added Articles
          </h2>
          <Link to="/admin/posts" className="text-xs font-bold text-blue-800 hover:underline">
            View All Posts ({stats?.total || 0}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-extrabold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">State</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate" title={post.title}>
                    <Link to={`/admin/posts/${post.id}/preview`} className="hover:text-blue-800">
                      {post.title}
                    </Link>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-600">
                    {post.state || 'All India'}
                  </td>
                  <td className="p-3">
                    {post.published ? (
                      <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                        Published
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500 font-medium">
                    {new Date(post.created_at).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      to={`/admin/posts/${post.id}/preview`}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      to={`/admin/posts/${post.id}/edit`}
                      className="inline-flex items-center gap-1 text-blue-800 hover:text-blue-950 font-bold ml-2"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-bold ml-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
