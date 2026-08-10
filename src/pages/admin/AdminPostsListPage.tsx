import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Post, CategoryType } from '../../types';
import { getAllPostsAdmin, deletePost, updatePost } from '../../lib/postsService';
import { updateSEO } from '../../lib/seo';
import { CATEGORIES_CONFIG } from '../../data/statesAndCategories';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  ArrowLeft,
  Eye,
  CheckCircle2,
  FileClock,
} from 'lucide-react';

export const AdminPostsListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    updateSEO({ title: 'All Posts - Admin Portal', noindex: true });

    if (localStorage.getItem('admin_authenticated') !== 'true') {
      navigate('/admin/login');
      return;
    }

    loadPosts();
  }, [navigate]);

  async function loadPosts() {
    setLoading(true);
    const data = await getAllPostsAdmin();
    setPosts(data);
    setLoading(false);
  }

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deletePost(id);
      loadPosts();
    }
  };

  const handleTogglePublish = async (post: Post) => {
    await updatePost(post.id, {
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      state: post.state || '',
      image_url: post.image_url || '',
      meta_description: post.meta_description || '',
      keywords: post.keywords ? post.keywords.join(', ') : '',
      published: !post.published,
    });
    loadPosts();
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === 'published' && p.published) ||
      (selectedStatus === 'draft' && !p.published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 text-white p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black uppercase text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-400" />
              Manage All Articles ({filteredPosts.length})
            </h1>
            <p className="text-xs text-slate-400">Search, filter, edit or delete posts</p>
          </div>
        </div>

        <Link
          to="/admin/posts/new"
          className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-xs font-black uppercase text-blue-950 shadow-sm hover:bg-amber-300 transition-colors"
        >
          <PlusCircle className="h-4 w-4" /> Create New Post
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts by title or keyword..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-800 focus:outline-hidden"
          />
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 focus:outline-hidden"
          >
            <option value="">All Categories</option>
            {CATEGORIES_CONFIG.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white p-2 text-slate-700 focus:outline-hidden"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-extrabold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">State</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Created Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                    No articles found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900 max-w-sm">
                      <Link
                        to={`/post/${post.slug}`}
                        target="_blank"
                        className="hover:text-blue-800 line-clamp-1"
                        title={post.title}
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-600">
                      {post.state || 'Central'}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`font-extrabold px-2.5 py-1 rounded text-[10px] uppercase tracking-wider transition-colors ${
                          post.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-3.5 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(post.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/post/${post.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold"
                        title="Preview"
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
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
