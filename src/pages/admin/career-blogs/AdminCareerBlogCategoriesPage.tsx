import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Tag,
  BookOpen,
} from 'lucide-react';
import { CareerBlogCategory } from '../../../types/careerBlog';
import {
  getAllCareerBlogCategories,
  createCareerBlogCategory,
  updateCareerBlogCategory,
  deleteCareerBlogCategory,
  getCareerBlogStats,
} from '../../../lib/careerBlogsService';

export const AdminCareerBlogCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CareerBlogCategory[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<CareerBlogCategory | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<CareerBlogCategory | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, stats] = await Promise.all([
        getAllCareerBlogCategories(),
        getCareerBlogStats(),
      ]);
      setCategories(cats);
      setCategoryCounts(stats.byCategory || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartCreate = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsCreating(true);
  };

  const handleStartEdit = (cat: CareerBlogCategory) => {
    setIsCreating(false);
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setEditingCategory(null);
    setName('');
    setDescription('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingCategory) {
        await updateCareerBlogCategory(editingCategory.id, name.trim(), description.trim());
        showToast('Category updated successfully!');
      } else {
        await createCareerBlogCategory(name.trim(), description.trim());
        showToast('New category added successfully!');
      }
      handleCancelForm();
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Error saving category.');
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCareerBlogCategory(categoryToDelete.id);
      showToast('Category deleted successfully.');
      setCategoryToDelete(null);
      loadData();
    } catch (e) {
      console.error(e);
      showToast('Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/career-blogs"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Career Blog Categories
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Create and manage topic categories for Hindi & English Career Blogs
            </p>
          </div>
        </div>

        <button
          onClick={handleStartCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition-colors shadow-xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Add New Category</span>
        </button>
      </div>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-2.5 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add / Edit Form Modal or Inline Card */}
      {(isCreating || editingCategory) && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl p-5 border-2 border-blue-200 shadow-md space-y-4 animate-fadeIn"
        >
          <h3 className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-2">
            <Tag className="h-4 w-4 text-blue-900" />
            <span>{editingCategory ? 'Edit Category' : 'Create New Category'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Career Guidance, Interview Preparation..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short purpose of this category..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-900 hover:bg-blue-950 text-white shadow-xs"
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400">
            Loading categories...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Articles Count</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {categories.map((c) => {
                  const count = categoryCounts[c.name] || 0;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {c.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        {c.slug}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                        {c.description || '—'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 font-bold text-[11px]">
                          {count} {count === 1 ? 'article' : 'articles'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(c)}
                            title="Edit Category"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setCategoryToDelete(c)}
                            title="Delete Category"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                Delete Category
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete category <strong>"{categoryToDelete.name}"</strong>?
              Existing articles in this category will keep their text, but this category option will be removed from the selector.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-xs"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
