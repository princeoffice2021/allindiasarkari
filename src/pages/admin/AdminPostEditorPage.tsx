import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PostFormData, CategoryType } from '../../types';
import { getPostByIdAdmin, createPost, updatePost, generateSlug, uploadPostImage } from '../../lib/postsService';
import { updateSEO } from '../../lib/seo';
import { CATEGORIES_CONFIG, ALL_STATES_AND_UTS } from '../../data/statesAndCategories';
import { useToast } from '../../components/AdminToast';
import { RichTextEditor } from '../../components/RichTextEditor';
import { ArticleStructureBuilder } from '../../components/ArticleStructureBuilder';
import { SEOContentQualityAudit } from '../../components/SEOContentQualityAudit';
import { LiveArticlePreviewModal } from '../../components/LiveArticlePreviewModal';
import {
  FileText,
  Save,
  ArrowLeft,
  Eye,
  Image as ImageIcon,
  Tag,
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  HelpCircle,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface LinkItem {
  label: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export const AdminPostEditorPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'Sarkari Naukri',
    state: '',
    image_url: '',
    meta_description: '',
    official_source_url: '',
    keywords: '',
    published: true,
  });

  const [importantLinks, setImportantLinks] = useState<LinkItem[]>([
    { label: 'Apply Online Form', url: 'https://' },
    { label: 'Download Official Notification PDF', url: 'https://' },
    { label: 'Official Department Website', url: 'https://' },
  ]);

  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      question: 'What is the last date to apply online?',
      answer: 'The last date to submit online application form is mentioned in the official notification table above.',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSuccess, setImageSuccess] = useState(false);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setImageSuccess(false);
    setUploadingImage(true);

    try {
      const uploadedUrl = await uploadPostImage(file);
      setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
      setImageSuccess(true);
      showToast('Featured image uploaded to Supabase Storage!', 'success');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      const msg = err.message || 'Failed to upload image. Please try again.';
      setImageError(msg);
      showToast(msg, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const [autoSlug, setAutoSlug] = useState(true);
  const [showLivePreview, setShowLivePreview] = useState(false);

  useEffect(() => {
    updateSEO({
      title: isEditing ? 'Edit Article - Admin Portal' : 'Create New Article - Admin Portal',
      noindex: true,
    });

    if (localStorage.getItem('admin_authenticated') !== 'true') {
      navigate('/admin/login');
      return;
    }

    if (isEditing && id) {
      setFetching(true);
      getPostByIdAdmin(id).then((post) => {
        if (post) {
          setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            category: post.category,
            state: post.state || '',
            image_url: post.image_url || '',
            meta_description: post.meta_description || '',
            official_source_url: post.official_source_url || '',
            keywords: post.keywords ? post.keywords.join(', ') : '',
            published: post.published,
          });
          setAutoSlug(false);
        } else {
          setErrorMsg('Post not found for editing.');
        }
        setFetching(false);
      });
    }
  }, [id, isEditing, navigate]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: autoSlug ? generateSlug(val) : prev.slug,
    }));
  };

  // Helper to insert pre-formatted HTML Snippet Tables into Content
  const insertTemplateSnippet = (type: string) => {
    let snippet = '';
    if (type === 'overview') {
      snippet = `\n<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-blue-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Post Overview & Highlights</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Recruitment Board</th><td class="p-3">Staff Selection Commission (SSC) / Department</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Post Name</th><td class="p-3">Constable / Officer / Assistant</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Total Vacancies</th><td class="p-3">5,000+ Posts</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Pay Scale / Salary</th><td class="p-3">Pay Level-3 (₹21,700 - ₹69,100)</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Job Location</th><td class="p-3">All India / State-wise</td></tr>
</table>
</div>\n`;
    } else if (type === 'dates') {
      snippet = `\n<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Important Dates</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Application Start Date</th><td class="p-3 font-semibold text-emerald-700">Available Now</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Last Date to Apply Online</th><td class="p-3 font-semibold text-red-600">30 Days from Notification</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Exam Date</th><td class="p-3">To Be Announced Soon</td></tr>
</table>
</div>\n`;
    } else if (type === 'fee') {
      snippet = `\n<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-amber-900 text-amber-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider">Application Fee</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">General / OBC / EWS</th><td class="p-3">₹100 / ₹500</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">SC / ST / Female / PWD</th><td class="p-3 font-bold text-emerald-700">Exempted / ₹0</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Payment Mode</th><td class="p-3">Debit Card, Credit Card, Net Banking, UPI</td></tr>
</table>
</div>\n`;
    } else if (type === 'eligibility') {
      snippet = `\n<h3>Age Limit & Educational Qualification</h3>
<ul>
  <li><strong>Educational Qualification:</strong> Passed 10th (Matriculation) / 12th (Intermediate) / Graduation Degree from any recognized board/university in India.</li>
  <li><strong>Age Limit:</strong> 18 to 27 years (Age relaxation applicable as per Government rules: SC/ST - 5 Years, OBC - 3 Years).</li>
</ul>\n`;
    }

    setFormData((prev) => ({ ...prev, content: prev.content + snippet }));
    showToast('Template snippet added to content!', 'info');
  };

  const handleAddLink = () => {
    setImportantLinks([...importantLinks, { label: 'New Link Label', url: 'https://' }]);
  };

  const handleRemoveLink = (idx: number) => {
    setImportantLinks(importantLinks.filter((_, i) => i !== idx));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: 'New Question?', answer: 'Detailed answer here.' }]);
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent, publishOverride?: boolean) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Title is required');
      showToast('Title is required', 'error');
      return;
    }
    if (!formData.content.trim()) {
      setErrorMsg('Article content is required');
      showToast('Article content is required', 'error');
      return;
    }

    setLoading(true);

    // Append Important Links and FAQs to content HTML if provided
    let finalContent = formData.content;

    if (importantLinks.length > 0 && !finalContent.includes('Important Links Section')) {
      let linksHtml = `\n<!-- Important Links Section -->\n<div className="my-6 rounded-xl border-2 border-blue-900 bg-white overflow-hidden shadow-xs"><div className="bg-blue-900 text-amber-300 px-4 py-3 text-xs font-black uppercase tracking-wide flex items-center gap-2">🔗 Important Direct Links</div><div className="divide-y divide-slate-200">\n`;
      importantLinks.forEach((l) => {
        linksHtml += `<div className="flex flex-wrap items-center justify-between p-3.5 hover:bg-slate-50 gap-2"><span className="text-xs sm:text-sm font-extrabold text-slate-900">${l.label}</span><a href="${l.url}" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-4 py-1.5 text-xs font-black uppercase text-white hover:bg-red-700">Click Here ↗</a></div>\n`;
      });
      linksHtml += `</div></div>\n`;
      finalContent += linksHtml;
    }

    const payload: PostFormData = {
      ...formData,
      content: finalContent,
      published: publishOverride !== undefined ? publishOverride : formData.published,
    };

    try {
      if (isEditing && id) {
        await updatePost(id, payload);
        showToast('Article updated successfully!', 'success');
      } else {
        const created = await createPost(payload);
        showToast('New article created successfully!', 'success');
      }
      navigate('/admin/posts');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save post');
      showToast('Failed to save post', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 text-center text-slate-600 font-semibold">
        Loading article data...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 text-white p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/posts"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black uppercase text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-amber-400" />
              {isEditing ? 'Edit Post' : 'Create Government Article'}
            </h1>
            <p className="text-xs text-slate-400">
              Publish national government notifications, recruitment forms & exam results
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLivePreview(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-800 px-4 py-2 text-xs font-black uppercase text-amber-300 hover:bg-blue-700 shadow-md transition-colors"
            title="Live Preview without saving"
          >
            <Sparkles className="h-4 w-4 text-amber-400" /> Live Article Preview
          </button>

          {isEditing && id && (
            <Link
              to={`/admin/posts/${id}/preview`}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Eye className="h-4 w-4 text-slate-400" /> Saved Page Preview
            </Link>
          )}

          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-amber-900/40 border border-amber-600/50 px-4 py-2 text-xs font-bold uppercase text-amber-300 hover:bg-amber-900/80 transition-colors"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2 text-xs font-black uppercase text-blue-950 shadow-md hover:bg-amber-300 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Publish Article'}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Layout */}
      <form onSubmit={(e) => handleSubmit(e)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Article Title <span className="text-red-600">*</span>
                </label>
                <span
                  className={`text-[11px] font-bold ${
                    formData.title.length < 20 || formData.title.length > 80
                      ? 'text-amber-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {formData.title.length} chars {formData.title.length < 20 && '(Short)'} {formData.title.length > 80 && '(Long)'}
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. SSC GD Constable Recruitment 2026: Apply Online for 26,146 Posts"
                className="w-full rounded-lg border border-slate-300 p-3 text-base font-extrabold text-slate-900 focus:border-blue-800 focus:outline-hidden"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  SEO Slug Path
                </label>
                <button
                  type="button"
                  onClick={() => setAutoSlug(!autoSlug)}
                  className="text-[10px] font-bold text-blue-800 hover:underline"
                >
                  {autoSlug ? 'Switch to Manual Edit' : 'Auto Generate'}
                </button>
              </div>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  setFormData({ ...formData, slug: e.target.value });
                }}
                placeholder="ssc-gd-constable-recruitment-2026"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono text-slate-700 bg-slate-50 focus:border-blue-800 focus:outline-hidden"
              />
            </div>

            {/* Short Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Short Excerpt / Card Summary
              </label>
              <textarea
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary displayed on homepage cards and search results..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-800 focus:outline-hidden"
              />
            </div>

            {/* Article Structure Assistant & Templates */}
            <ArticleStructureBuilder
              onInsertStructure={(htmlToInsert, mode) => {
                setFormData((prev) => ({
                  ...prev,
                  content:
                    mode === 'replace'
                      ? htmlToInsert
                      : prev.content
                      ? `${prev.content}\n${htmlToInsert}`
                      : htmlToInsert,
                }));
                showToast('Article structure template inserted!', 'info');
              }}
            />

            {/* Visual WYSIWYG Rich Text Article Editor */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                  Full Article Content (Visual Rich Text Editor) <span className="text-red-600">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {formData.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLivePreview(true)}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-800 hover:text-blue-950 underline"
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview Look
                  </button>
                </div>
              </div>

              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                placeholder="Start typing your structured article or click any template block above..."
              />
            </div>
          </div>

          {/* Important Links Builder Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-blue-900" /> Important Links Section Builder
              </h3>
              <button
                type="button"
                onClick={handleAddLink}
                className="text-xs font-extrabold text-blue-800 hover:underline inline-flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Link
              </button>
            </div>

            <div className="space-y-3">
              {importantLinks.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...importantLinks];
                      updated[idx].label = e.target.value;
                      setImportantLinks(updated);
                    }}
                    placeholder="Link Label (e.g. Apply Online)"
                    className="flex-1 rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-800"
                  />
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => {
                      const updated = [...importantLinks];
                      updated[idx].url = e.target.value;
                      setImportantLinks(updated);
                    }}
                    placeholder="https://official-portal.gov.in"
                    className="flex-1 rounded-lg border border-slate-300 p-2 text-xs font-mono text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    className="p-1.5 text-red-600 hover:text-red-800 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Builder Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-500" /> FAQ Builder (Generates FAQ Schema)
              </h3>
              <button
                type="button"
                onClick={handleAddFaq}
                className="text-xs font-extrabold text-blue-800 hover:underline inline-flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Question
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...faqs];
                        updated[idx].question = e.target.value;
                        setFaqs(updated);
                      }}
                      placeholder="Frequently Asked Question?"
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="p-1.5 text-red-600 hover:text-red-800 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => {
                      const updated = [...faqs];
                      updated[idx].answer = e.target.value;
                      setFaqs(updated);
                    }}
                    placeholder="Clear answer explaining procedure or dates..."
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Options & Metadata Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Category & State
            </h3>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as CategoryType })
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
              >
                {CATEGORIES_CONFIG.map((cat) => (
                  <option key={cat.slug} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                State / UT
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-semibold text-slate-800 focus:outline-hidden"
              >
                <option value="">Central / All India</option>
                {ALL_STATES_AND_UTS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Featured Image & Meta</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Supabase Storage (`post-images`)
              </span>
            </h3>

            {/* Supabase Storage Upload Button */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Upload className="h-3.5 w-3.5 text-blue-700" /> Upload Image to Storage
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed p-3 text-xs font-bold transition-colors cursor-pointer ${
                  uploadingImage
                    ? 'border-blue-400 bg-blue-50 text-blue-800'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}>
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
                      <span>Uploading to Supabase Storage...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 text-blue-700" />
                      <span>Choose JPG, PNG, WEBP file (Max 5MB)</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleImageFileUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {imageError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700 font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{imageError}</span>
                </div>
              )}

              {imageSuccess && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Image uploaded successfully to `post-images` bucket!</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5 text-blue-700" /> Image URL / Preview
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://... or uploaded image URL"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-hidden"
              />
              {formData.image_url && (
                <div className="mt-2 rounded-xl border border-slate-200 p-2 bg-slate-50">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Image Preview:</p>
                  <img
                    src={formData.image_url}
                    alt="Featured Preview"
                    className="h-32 w-full object-cover rounded-lg border border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>


            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <ExternalLink className="h-3.5 w-3.5 text-blue-700" /> Official Source URL
              </label>
              <input
                type="url"
                value={formData.official_source_url || ''}
                onChange={(e) => setFormData({ ...formData, official_source_url: e.target.value })}
                placeholder="https://ssc.gov.in / official portal"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Only valid http:// or https:// URLs will be rendered on post page.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-blue-700" /> Meta Description
                </label>
                <span
                  className={`text-[11px] font-bold ${
                    formData.meta_description.length < 50 || formData.meta_description.length > 170
                      ? 'text-amber-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {formData.meta_description.length}/160
                </span>
              </div>
              <textarea
                rows={3}
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Google search snippet (150-160 characters recommended)..."
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-blue-700" /> Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="SSC GD 2026, Constable Recruitment, Sarkari Result"
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Quality Audit Summary Panel */}
          <SEOContentQualityAudit
            title={formData.title}
            metaDescription={formData.meta_description}
            slug={formData.slug}
            content={formData.content}
            imageUrl={formData.image_url}
            officialSourceUrl={formData.official_source_url}
            importantLinksCount={importantLinks.length}
            faqsCount={faqs.length}
          />
        </div>
      </form>

      {/* Live Article Preview Modal (Simulates Exact Public Post View) */}
      <LiveArticlePreviewModal
        isOpen={showLivePreview}
        onClose={() => setShowLivePreview(false)}
        title={formData.title}
        category={formData.category}
        state={formData.state}
        excerpt={formData.excerpt}
        content={formData.content}
        imageUrl={formData.image_url}
        officialSourceUrl={formData.official_source_url}
        importantLinks={importantLinks}
        faqs={faqs}
        keywords={
          formData.keywords
            ? formData.keywords
                .split(',')
                .map((k) => k.trim())
                .filter(Boolean)
            : []
        }
      />
    </div>
  );
};
