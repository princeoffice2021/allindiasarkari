import React, { useState, useEffect } from 'react';
import { AIDraft, AIDraftData } from '../../../types/aiStaff';
import { CategoryType } from '../../../types';
import { CATEGORIES_CONFIG, ALL_STATES_AND_UTS } from '../../../data/statesAndCategories';
import { X, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface AIDraftEditModalProps {
  draft: AIDraft | null;
  onClose: () => void;
  onSave: (draftId: string, updatedDraftData: Partial<AIDraftData>) => void;
  onApproveAndPublish: (draftId: string, finalData: AIDraftData) => void;
}

export const AIDraftEditModal: React.FC<AIDraftEditModalProps> = ({
  draft,
  onClose,
  onSave,
  onApproveAndPublish,
}) => {
  if (!draft) return null;

  const [formData, setFormData] = useState<AIDraftData>({
    title: draft.draftData.title,
    shortDescription: draft.draftData.shortDescription,
    category: draft.draftData.category,
    state: draft.draftData.state,
    content: draft.draftData.content,
    metaTitle: draft.draftData.metaTitle,
    metaDescription: draft.draftData.metaDescription,
    keywords: draft.draftData.keywords,
    suggestedSlug: draft.draftData.suggestedSlug,
    importantLinks: draft.draftData.importantLinks || [],
    faqs: draft.draftData.faqs || [],
  });

  const [keywordsStr, setKeywordsStr] = useState(draft.draftData.keywords.join(', '));

  useEffect(() => {
    if (draft) {
      setFormData({
        title: draft.draftData.title,
        shortDescription: draft.draftData.shortDescription,
        category: draft.draftData.category,
        state: draft.draftData.state,
        content: draft.draftData.content,
        metaTitle: draft.draftData.metaTitle,
        metaDescription: draft.draftData.metaDescription,
        keywords: draft.draftData.keywords,
        suggestedSlug: draft.draftData.suggestedSlug,
        importantLinks: draft.draftData.importantLinks || [],
        faqs: draft.draftData.faqs || [],
      });
      setKeywordsStr(draft.draftData.keywords.join(', '));
    }
  }, [draft]);

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedKeywords = keywordsStr
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    onSave(draft.id, {
      ...formData,
      keywords: updatedKeywords,
    });
    onClose();
  };

  const handleApproveFromEditor = () => {
    const updatedKeywords = keywordsStr
      .split(',')
      .map(k => k.trim())
      .filter(Boolean);

    const finalData = {
      ...formData,
      keywords: updatedKeywords,
    };
    onApproveAndPublish(draft.id, finalData);
    onClose();
  };

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      importantLinks: [...prev.importantLinks, { label: 'New Link', url: 'https://' }],
    }));
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      importantLinks: prev.importantLinks.filter((_, i) => i !== index),
    }));
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const next = [...formData.importantLinks];
    next[index][field] = value;
    setFormData(prev => ({ ...prev, importantLinks: next }));
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: 'New Question?', answer: 'Answer here.' }],
    }));
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const next = [...formData.faqs];
    next[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: next }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-4 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-white">
              Edit AI Staff Draft
            </h2>
            <p className="text-[11px] text-slate-400">
              Source: <span className="text-amber-300 font-bold">{draft.sourceName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSaveDraft} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Article Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-blue-700 focus:outline-hidden"
            />
          </div>

          {/* Short Excerpt */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Short Description / Excerpt *
            </label>
            <textarea
              rows={2}
              value={formData.shortDescription}
              onChange={e => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              required
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-blue-700 focus:outline-hidden"
            />
          </div>

          {/* Category & State Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as CategoryType }))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 focus:border-blue-700 focus:outline-hidden"
              >
                {CATEGORIES_CONFIG.map(c => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                State / Central Jurisdiction
              </label>
              <select
                value={formData.state}
                onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:border-blue-700 focus:outline-hidden"
              >
                <option value="Central">Central / All India</option>
                {ALL_STATES_AND_UTS.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content HTML Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                Article Body & Tables (HTML) *
              </label>
              <span className="text-[11px] text-slate-400">Standard All India Sarkari markup</span>
            </div>
            <textarea
              rows={12}
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              className="w-full font-mono text-xs rounded-xl border border-slate-300 p-4 leading-relaxed text-slate-800 focus:border-blue-700 focus:outline-hidden"
            />
          </div>

          {/* Important Links Builder */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Important Links
              </span>
              <button
                type="button"
                onClick={addLink}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-700 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-800"
              >
                <Plus className="h-3.5 w-3.5" /> Add Link
              </button>
            </div>

            <div className="space-y-2">
              {formData.importantLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={e => updateLink(idx, 'label', e.target.value)}
                    placeholder="Link Label"
                    className="w-1/3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={e => updateLink(idx, 'url', e.target.value)}
                    placeholder="https://"
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(idx)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Builder */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Frequently Asked Questions (FAQs)
              </span>
              <button
                type="button"
                onClick={addFaq}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-700 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-800"
              >
                <Plus className="h-3.5 w-3.5" /> Add FAQ
              </button>
            </div>

            <div className="space-y-3">
              {formData.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-lg bg-white p-3 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={e => updateFaq(idx, 'question', e.target.value)}
                      placeholder="Question"
                      className="w-full rounded-lg border border-slate-300 px-3 py-1 text-xs font-bold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={e => updateFaq(idx, 'answer', e.target.value)}
                    placeholder="Answer"
                    className="w-full rounded-lg border border-slate-300 px-3 py-1 text-xs text-slate-700"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Suggested URL Slug *
              </label>
              <input
                type="text"
                value={formData.suggestedSlug}
                onChange={e => setFormData(prev => ({ ...prev, suggestedSlug: e.target.value }))}
                required
                className="w-full font-mono text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={e => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                SEO Meta Description
              </label>
              <textarea
                rows={2}
                value={formData.metaDescription}
                onChange={e => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-blue-700 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={keywordsStr}
                onChange={e => setKeywordsStr(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-700 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
              >
                <Save className="h-4 w-4" /> Save Draft Changes
              </button>

              {draft.status !== 'PUBLISHED' && (
                <button
                  type="button"
                  onClick={handleApproveFromEditor}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-black uppercase text-white shadow-sm hover:bg-emerald-500 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve & Publish
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
