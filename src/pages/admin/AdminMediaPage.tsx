import React, { useState } from 'react';
import { updateSEO } from '../../lib/seo';
import { useToast } from '../../components/AdminToast';
import { Image as ImageIcon, Copy, Plus, Trash2, ExternalLink, Sparkles } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  url: string;
  alt: string;
  created_at: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: '1',
    title: 'PM Kisan Banner',
    url: 'https://images.unsplash.com/photo-1595009552535-be753447727e?auto=format&fit=crop&q=80&w=800',
    alt: 'PM Kisan Samman Nidhi Banner',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Police Constable Recruitment',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    alt: 'Police Constable Uniform',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'SSC Results & Exams',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    alt: 'Exams and Result Paper',
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Indian Railways Train',
    url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800',
    alt: 'RRB Loco Pilot Train',
    created_at: new Date().toISOString(),
  },
];

export const AdminMediaPage: React.FC = () => {
  const { showToast } = useToast();
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');

  React.useEffect(() => {
    updateSEO({ title: 'Media Gallery - Admin Portal', noindex: true });
  }, []);

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newItem: MediaItem = {
      id: String(Date.now()),
      title: newTitle.trim() || 'Featured Image',
      url: newUrl.trim(),
      alt: newAlt.trim() || newTitle.trim() || 'Sarkari Notification Image',
      created_at: new Date().toISOString(),
    };

    setMediaList([newItem, ...mediaList]);
    setNewTitle('');
    setNewUrl('');
    setNewAlt('');
    showToast('Image URL added to media gallery!', 'success');
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Image URL copied to clipboard!', 'success');
  };

  const handleDelete = (id: string) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
    showToast('Media reference removed.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 text-white p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-amber-400 font-black shadow-inner">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase text-white">Media Gallery</h1>
            <p className="text-xs text-slate-400">Manage article featured image links and assets</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Add Media Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 h-fit">
          <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-800" /> Add Image Reference
          </h2>

          <form onSubmit={handleAddMedia} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Image Title
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. UPSC Prelims Banner"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                placeholder="SEO description of the image"
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-800 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-900 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-blue-950 transition-colors"
            >
              Add Image
            </button>
          </form>
        </div>

        {/* Media Grid */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-black uppercase text-slate-900 border-b border-slate-100 pb-2">
            Available Media Assets ({mediaList.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mediaList.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-2xs space-y-2 p-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 border border-slate-300">
                    <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1">{m.title}</h3>
                    <p className="text-[10px] text-slate-500 font-mono truncate">{m.url}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-xs">
                  <button
                    onClick={() => copyToClipboard(m.url)}
                    className="inline-flex items-center gap-1 font-bold text-blue-900 hover:text-blue-950 bg-blue-100 px-2.5 py-1 rounded-md"
                  >
                    <Copy className="h-3 w-3" /> Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded-md"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
