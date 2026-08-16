import React, { useEffect, useState } from 'react';
import { ALL_STATES_AND_UTS, stateToSlug } from '../../data/statesAndCategories';
import { getAllPostsAdmin } from '../../lib/postsService';
import { updateSEO } from '../../lib/seo';
import { useToast } from '../../components/AdminToast';
import { MapPin, Search, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

interface StateItem {
  name: string;
  slug: string;
  active: boolean;
  postCount: number;
}

export const AdminStatesPage: React.FC = () => {
  const { showToast } = useToast();
  const [statesList, setStatesList] = useState<StateItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateSEO({ title: 'States & UTs Management - Admin Portal', noindex: true });
    loadStates();
  }, []);

  async function loadStates() {
    setLoading(true);
    const posts = await getAllPostsAdmin();
    const counts: Record<string, number> = {};

    posts.forEach((p) => {
      if (p.state) {
        counts[p.state] = (counts[p.state] || 0) + 1;
      }
    });

    const items: StateItem[] = ALL_STATES_AND_UTS.map((st) => ({
      name: st,
      slug: stateToSlug(st),
      active: true,
      postCount: counts[st] || 0,
    }));

    setStatesList(items);
    setLoading(false);
  }

  const toggleStateActive = (slug: string) => {
    setStatesList((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, active: !s.active } : s))
    );
    showToast('State status updated successfully.', 'info');
  };

  const filteredStates = statesList.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 text-white p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-amber-400 font-black shadow-inner">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase text-white">Indian States & Union Territories</h1>
            <p className="text-xs text-slate-400">
              Manage state-wise Sarkari Naukri portal directories ({statesList.length} total)
            </p>
          </div>
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state/UT..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-amber-400 focus:outline-hidden"
          />
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Grid of States */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredStates.map((st) => (
          <div
            key={st.slug}
            className={`rounded-2xl border p-4 bg-white shadow-2xs space-y-2 transition-all ${
              st.active ? 'border-slate-200' : 'border-slate-300 opacity-60 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                {st.name}
              </span>
              <button
                onClick={() => toggleStateActive(st.slug)}
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                  st.active
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {st.active ? 'Active' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="font-mono text-blue-800">/jobs/{st.slug}</span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold">
                <FileText className="h-3 w-3 text-blue-800" />
                {st.postCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
