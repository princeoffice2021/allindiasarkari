import React, { useEffect, useState } from 'react';
import { CATEGORIES_CONFIG } from '../../data/statesAndCategories';
import { getAllPostsAdmin } from '../../lib/postsService';
import { updateSEO } from '../../lib/seo';
import { useToast } from '../../components/AdminToast';
import { FolderTree, Plus, CheckCircle2, FileText, Search, Edit2 } from 'lucide-react';

interface CategoryItem {
  name: string;
  slug: string;
  description: string;
  active: boolean;
}

export const AdminCategoriesPage: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [postCounts, setPostCounts] = useState<Record<string, number>>({});
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateSEO({ title: 'Category Management - Admin Portal', noindex: true });
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    // Initial categories
    const initialCats: CategoryItem[] = CATEGORIES_CONFIG.map((c) => ({
      name: c.name,
      slug: c.slug,
      description: c.description,
      active: true,
    }));

    // Fetch post counts
    const posts = await getAllPostsAdmin();
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    setPostCounts(counts);
    setCategories(initialCats);
    setLoading(false);
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (categories.some((c) => c.slug === slug)) {
      showToast('Category with this slug already exists!', 'error');
      return;
    }

    const newCat: CategoryItem = {
      name: newCatName.trim(),
      slug,
      description: newCatDesc.trim() || `${newCatName.trim()} updates and notifications.`,
      active: true,
    };

    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatDesc('');
    showToast(`Category "${newCat.name}" created successfully.`, 'success');
  };

  const toggleCategoryActive = (slug: string) => {
    setCategories(
      categories.map((c) => (c.slug === slug ? { ...c, active: !c.active } : c))
    );
    showToast('Category status updated.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 text-white p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-amber-400 font-black shadow-inner">
            <FolderTree className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase text-white">Category Management</h1>
            <p className="text-xs text-slate-400">Configure main portal job & scheme categories</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Category Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 h-fit">
          <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-800" /> Add New Category
          </h2>

          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Defense Recruitment"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Brief meta description for search engine listings..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-800 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-900 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-blue-950 transition-colors"
            >
              Save Category
            </button>
          </form>
        </div>

        {/* Category List */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-100 pb-2">
            Active Categories ({categories.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-extrabold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Slug Route</th>
                  <th className="p-3">Total Posts</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.slug} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      {cat.name}
                      <p className="text-[10px] text-slate-500 font-normal line-clamp-1">{cat.description}</p>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-blue-800">
                      /{cat.slug}
                    </td>
                    <td className="p-3 font-black text-slate-700">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        <FileText className="h-3 w-3 text-blue-800" />
                        {postCounts[cat.name] || 0}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleCategoryActive(cat.slug)}
                        className={`font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                          cat.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {cat.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => showToast(`Editing category ${cat.name}`, 'info')}
                        className="text-blue-800 hover:text-blue-950 font-bold"
                      >
                        <Edit2 className="h-3.5 w-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
