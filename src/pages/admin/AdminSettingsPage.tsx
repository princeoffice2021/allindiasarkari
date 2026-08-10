import React, { useEffect, useState } from 'react';
import { updateSEO } from '../../lib/seo';
import { useToast } from '../../components/AdminToast';
import { Settings, Save, Globe, Shield, Radio, CheckCircle2 } from 'lucide-react';

interface SiteSettingsForm {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  defaultMetaDescription: string;
  defaultOgImage: string;
  googleSearchConsole: string;
  adsenseClientId: string;
  adsenseEnabled: boolean;
}

const SETTINGS_STORAGE_KEY = 'all_india_sarkari_settings';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState<SiteSettingsForm>({
    siteName: 'All India Sarkari',
    siteDescription: 'Latest Government Jobs, Admit Cards, Results & Sarkari Yojana',
    siteUrl: 'https://allindiasarkari.com',
    contactEmail: 'contact@allindiasarkari.com',
    defaultMetaDescription: 'All India Sarkari - Real-time updates on Indian Sarkari Naukri, Results, Admit Cards, and Schemes.',
    defaultOgImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    googleSearchConsole: '',
    adsenseClientId: import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-xxxxxxxxxxxxxxxx',
    adsenseEnabled: false,
  });

  useEffect(() => {
    updateSEO({ title: 'Site Settings - Admin Portal', noindex: true });

    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (e) {
      console.error('Failed reading settings', e);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      showToast('Site Configuration Saved Successfully!', 'success');
    } catch (err) {
      showToast('Failed to save settings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 text-white p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-amber-400 font-black shadow-inner">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase text-white">Global Portal Settings</h1>
            <p className="text-xs text-slate-400">Configure site identity, SEO tags & AdSense integration</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-xs font-black uppercase text-blue-950 shadow-md hover:bg-amber-300 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> Save Configuration
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-800" /> Portal Identity & Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                required
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-bold text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Canonical Site URL
              </label>
              <input
                type="url"
                required
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              required
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Default Portal Description
            </label>
            <textarea
              rows={2}
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-hidden"
            />
          </div>
        </div>

        {/* AdSense Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Radio className="h-4 w-4 text-amber-500" /> Google AdSense Configuration
            </h2>

            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, adsenseEnabled: !settings.adsenseEnabled })
              }
              className={`rounded-lg px-3 py-1 text-xs font-black uppercase tracking-wider transition-colors ${
                settings.adsenseEnabled
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {settings.adsenseEnabled ? 'ADSENSE_ENABLED = TRUE' : 'ADSENSE_ENABLED = FALSE'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              AdSense Client ID (ca-pub-xxxxxxxxxxxxxxxx)
            </label>
            <input
              type="text"
              value={settings.adsenseClientId}
              onChange={(e) => setSettings({ ...settings, adsenseClientId: e.target.value })}
              placeholder="ca-pub-1234567890123456"
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono text-slate-800 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              When ADSENSE_ENABLED is false, ad units clean up space without broken placeholders.
            </p>
          </div>
        </div>

        {/* SEO Search Console */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-800" /> Search Engines Verification
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Google Search Console HTML Meta Tag Verification
            </label>
            <input
              type="text"
              value={settings.googleSearchConsole}
              onChange={(e) => setSettings({ ...settings, googleSearchConsole: e.target.value })}
              placeholder="e.g. google-site-verification=xxxxxxx"
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-mono text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
