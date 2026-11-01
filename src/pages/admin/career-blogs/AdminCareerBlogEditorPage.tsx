import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Languages,
  Tag,
  Link2,
} from 'lucide-react';
import {
  CareerBlog,
  CareerBlogFormData,
  BlogLanguage,
  CareerBlogCategory,
} from '../../../types/careerBlog';
import {
  getCareerBlogByIdAdmin,
  createCareerBlog,
  updateCareerBlog,
  getAllCareerBlogCategories,
  generateBlogSlug,
} from '../../../lib/careerBlogsService';
import { uploadPostImage } from '../../../lib/postsService';
import { RichTextEditor } from '../../../components/RichTextEditor';
import { LiveCareerBlogPreviewModal } from '../../../components/LiveCareerBlogPreviewModal';

export const AdminCareerBlogEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);

  const initialLang: BlogLanguage =
    (searchParams.get('lang') as BlogLanguage) === 'english' ? 'english' : 'hindi';

  const [categories, setCategories] = useState<CareerBlogCategory[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CareerBlogFormData>({
    language: initialLang,
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Career Guidance',
    tags: '',
    author_name: 'Prince Sharma',
    image_url: '',
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    canonical_url: '',
    published: false,
    published_at: new Date().toISOString(),
  });

  // Load categories and existing post if editing
  useEffect(() => {
    getAllCareerBlogCategories().then(setCategories);

    if (isEdit && id) {
      getCareerBlogByIdAdmin(id).then((blog) => {
        if (blog) {
          setFormData({
            language: blog.language,
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            category: blog.category,
            tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
            author_name: blog.author_name || 'Prince Sharma',
            image_url: blog.image_url || '',
            meta_title: blog.meta_title || '',
            meta_description: blog.meta_description || '',
            focus_keyword: blog.focus_keyword || '',
            canonical_url: blog.canonical_url || '',
            published: blog.published,
            published_at: blog.published_at || blog.created_at,
          });
        }
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  // Auto-generate slug when title changes (if user hasn't explicitly customized slug)
  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => {
      const shouldAutoSlug = !isEdit && (!prev.slug || prev.slug === generateBlogSlug(prev.title));
      return {
        ...prev,
        title: newTitle,
        slug: shouldAutoSlug ? generateBlogSlug(newTitle) : prev.slug,
        meta_title: prev.meta_title ? prev.meta_title : newTitle,
      };
    });
  };

  const handleSlugRegenerate = () => {
    if (formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: generateBlogSlug(prev.title),
      }));
    }
  };

  // Image Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Use uploadPostImage helper or FileReader data URL fallback
      const uploadedUrl = await uploadPostImage(file);
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
        setStatusMessage({ type: 'success', text: 'Image uploaded successfully!' });
      }
    } catch (err) {
      console.warn('Image upload fallback to data URL:', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, image_url: reader.result as string }));
          setStatusMessage({ type: 'success', text: 'Image converted and attached.' });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (publishState?: boolean) => {
    if (!formData.title.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a title for the blog.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const isPublished = publishState !== undefined ? publishState : formData.published;

    const payload: CareerBlogFormData = {
      ...formData,
      published: isPublished,
      slug: formData.slug.trim() || generateBlogSlug(formData.title),
    };

    try {
      if (isEdit && id) {
        await updateCareerBlog(id, payload);
        setStatusMessage({
          type: 'success',
          text: `Article updated successfully (${isPublished ? 'Published' : 'Draft'})!`,
        });
      } else {
        const created = await createCareerBlog(payload);
        setStatusMessage({
          type: 'success',
          text: `Article created successfully (${isPublished ? 'Published' : 'Draft'})!`,
        });
        // Navigate to edit URL
        setTimeout(() => {
          navigate(`/admin/career-blogs/${created.id}/edit`);
        }, 1200);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to save blog. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-bold text-slate-500">
        Loading blog editor...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/career-blogs/${formData.language}`}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {isEdit ? 'Edit Career Blog' : 'Write New Career Blog'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Create rich, SEO-optimized career articles for AllIndiaSarkari
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-300/80"
          >
            <Eye className="h-4 w-4" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-black transition-colors shadow-xs disabled:opacity-50"
          >
            <Send className="h-4 w-4 text-amber-300" />
            <span>{isEdit ? 'Update & Publish' : 'Publish Now'}</span>
          </button>
        </div>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div
          className={`rounded-xl p-3.5 text-xs font-bold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Title, Excerpt, Content, SEO */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Language */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            {/* Field 1: Language */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1.5">
                Target Language / भाषा *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, language: 'hindi' }))}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all border ${
                    formData.language === 'hindi'
                      ? 'bg-amber-400 text-blue-950 border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  हिंदी (Hindi Career Blog)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, language: 'english' }))}
                  className={`py-2 px-3 rounded-xl text-xs font-black transition-all border ${
                    formData.language === 'english'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  English (Career Blog)
                </button>
              </div>
            </div>

            {/* Field 2: Title */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1">
                Article Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder={
                  formData.language === 'hindi'
                    ? 'उदा. पहली नौकरी के इंटरव्यू में सफलता कैसे पाएं - टॉप 10 टिप्स'
                    : 'e.g., How to Clear Any Technical HR Interview on First Attempt'
                }
                className="w-full px-3.5 py-2.5 text-sm sm:text-base font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
              />
            </div>

            {/* Field 3: Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  URL Slug (Unique per language) *
                </label>
                <button
                  type="button"
                  onClick={handleSlugRegenerate}
                  className="text-[11px] font-bold text-blue-900 hover:underline"
                >
                  Auto Generate from Title
                </button>
              </div>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden text-xs">
                <span className="px-3 text-slate-400 font-mono select-none">
                  /blogs/{formData.language}/
                </span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="interview-tips-for-freshers"
                  className="w-full py-2.5 pr-3 text-xs font-mono font-semibold bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Field 5: Short Description / Excerpt */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1">
                Short Description / Excerpt *
              </label>
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
                placeholder="2-3 concise summary sentences for card previews and meta description fallback..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
              />
            </div>
          </div>

          {/* Field 6: Rich Content Editor */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Full Article Content *
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                Use headings, tables, bullet lists, tips & bold key points
              </span>
            </div>

            <RichTextEditor
              value={formData.content}
              onChange={(html) => setFormData((p) => ({ ...p, content: html }))}
              placeholder="Write your in-depth career article here. You can insert tables, headings, ordered/unordered lists, external links, blockquotes..."
            />
          </div>

          {/* Fields 10-13: SEO & Meta Settings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles className="h-4 w-4 text-blue-900" />
              <span>Search Engine Optimization (SEO) & Meta Data</span>
            </h3>

            {/* Field 10: Meta Title */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Meta Title</label>
                <span
                  className={`text-[10px] font-mono ${
                    (formData.meta_title || '').length > 60
                      ? 'text-amber-600 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {(formData.meta_title || '').length} / 60 chars
                </span>
              </div>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData((p) => ({ ...p, meta_title: e.target.value }))}
                placeholder="SEO Title | All India Sarkari"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Field 11: Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700">Meta Description</label>
                <span
                  className={`text-[10px] font-mono ${
                    (formData.meta_description || '').length > 160
                      ? 'text-amber-600 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {(formData.meta_description || '').length} / 160 chars
                </span>
              </div>
              <textarea
                rows={2}
                value={formData.meta_description}
                onChange={(e) => setFormData((p) => ({ ...p, meta_description: e.target.value }))}
                placeholder="Brief summary that appears in Google search engine snippets..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Field 12: Focus Keyword */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={formData.focus_keyword}
                  onChange={(e) => setFormData((p) => ({ ...p, focus_keyword: e.target.value }))}
                  placeholder="e.g. interview tips freshers"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Field 13: Canonical URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custom Canonical URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.canonical_url}
                  onChange={(e) => setFormData((p) => ({ ...p, canonical_url: e.target.value }))}
                  placeholder={`https://allindiasarkari.com/blogs/${formData.language}/${formData.slug || 'slug'}`}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Category, Featured Image, Author, Publishing Status */}
        <div className="space-y-6">
          {/* Publishing Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Publishing Controls
            </h3>

            {/* Field 14: Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Publication Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, published: false }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    !formData.published
                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Draft (Private)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, published: true }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    formData.published
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Published (Live)
                </button>
              </div>
            </div>

            {/* Field 15: Publish Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Publication Date
              </label>
              <input
                type="datetime-local"
                value={
                  formData.published_at
                    ? new Date(formData.published_at).toISOString().slice(0, 16)
                    : ''
                }
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    published_at: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : new Date().toISOString(),
                  }))
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            {/* Field 8: Author Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={formData.author_name}
                onChange={(e) => setFormData((p) => ({ ...p, author_name: e.target.value }))}
                placeholder="Prince Sharma"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Category & Tags Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Category & Tags
            </h3>

            {/* Field 4: Category */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Career Category *
                </label>
                <Link
                  to="/admin/career-blogs/categories"
                  className="text-[11px] font-bold text-blue-900 hover:underline"
                >
                  + Edit Categories
                </Link>
              </div>
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 7: Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                placeholder="career guidance, interview, freshers, salary"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Separate tags with commas. E.g. resume, cv, tips
              </span>
            </div>
          </div>

          {/* Field 9: Featured Image Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Featured Image
            </h3>

            {formData.image_url ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-36">
                <img
                  src={formData.image_url}
                  alt="Featured preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, image_url: '' }))}
                  className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 hover:bg-red-700 text-white rounded text-[10px] font-bold transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="h-28 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-3 text-center">
                <ImageIcon className="h-6 w-6 text-slate-300 mb-1" />
                <span className="text-xs font-medium text-slate-400">
                  No image attached yet
                </span>
              </div>
            )}

            {/* Image URL input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Image URL or Unsplash Link
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData((p) => ({ ...p, image_url: e.target.value }))}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <button
                type="button"
                disabled={uploadingImage}
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-300/80 disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <LiveCareerBlogPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        blog={{
          ...formData,
          id: id || 'preview-temp-id',
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }}
      />
    </div>
  );
};
