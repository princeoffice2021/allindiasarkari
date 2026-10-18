import React, { useState } from 'react';
import { AIStaffSettings } from '../../../types/aiStaff';
import {
  Settings,
  ShieldCheck,
  Lock,
  Save,
  AlertTriangle,
  Zap,
  Clock,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface AISettingsTabProps {
  settings: AIStaffSettings;
  onSaveSettings: (settings: Partial<AIStaffSettings>) => void;
}

export const AISettingsTab: React.FC<AISettingsTabProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<AIStaffSettings>({
    ...settings,
    autoPublish: false, // Strictly false
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Non-Negotiable Auto-Publish Safeguard Banner */}
      <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              Automatic Publishing is Permanently Disabled
            </h3>
            <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
              In accordance with editorial safeguards, <strong>AI Sarkari Staff</strong> is strictly restricted to research, notification scanning, fact extraction, and draft preparation. Under no circumstances will any draft be published to the live site automatically. <strong>Human Admin approval is mandatory.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-900 flex items-center gap-2">
            <Sliders className="h-4 w-4 text-blue-700" />
            AI Staff General Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure how the AI Sarkari Staff assistant scans official sources and creates drafts.
          </p>
        </div>

        {/* Master Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
              AI Staff Research Module Status
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Turn off anytime to halt all scanning. Your manual article publishing remains 100% operational.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enabled}
              onChange={e => setFormData({ ...formData, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Scan Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-700" />
              Automated Scan Frequency
            </label>
            <select
              value={formData.scanFrequency}
              onChange={e => setFormData({ ...formData, scanFrequency: e.target.value as any })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-700 focus:outline-hidden"
            >
              <option value="daily">Daily Automated Scan (Recommended)</option>
              <option value="twice_daily">Twice Daily (Morning & Evening)</option>
              <option value="manual">Manual Only (No automated cron)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Max Sources Checked Per Scan
            </label>
            <select
              value={formData.maxSourcesPerScan}
              onChange={e => setFormData({ ...formData, maxSourcesPerScan: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-700 focus:outline-hidden"
            >
              <option value={5}>5 Sources (Fastest / Low load)</option>
              <option value={10}>10 Sources (Balanced)</option>
              <option value={15}>15 Sources (Comprehensive)</option>
              <option value={25}>25 Sources (Full scan)</option>
            </select>
          </div>
        </div>

        {/* Checkbox Controls */}
        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoCreateDraft}
              onChange={e => setFormData({ ...formData, autoCreateDraft: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded-md text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-800">
                Automatically Create Draft from New Verified Notices
              </span>
              <p className="text-[11px] text-slate-500">
                When new unread notifications are detected, automatically extract facts and generate draft in PENDING_REVIEW queue.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.requireSource}
              onChange={e => setFormData({ ...formData, requireSource: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded-md text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-800">
                Mandatory Official Source URL Requirement
              </span>
              <p className="text-[11px] text-slate-500">
                Require that every extracted notice has a verifiable government portal link before drafting.
              </p>
            </div>
          </label>

          {/* Permanent Auto-Publish Lockdown Control (Requirement 15 E) */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/80 border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-600" />
                Auto-Publish Drafts Directly to Live Website
              </span>
              <p className="text-[11px] text-slate-500">
                Permanently locked to OFF by system architecture. Every draft requires human Admin review and approval.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="rounded-md bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                Permanently OFF
              </span>
              <input
                type="checkbox"
                disabled
                checked={false}
                readOnly
                className="h-4 w-4 rounded-md text-slate-400 border-slate-300 cursor-not-allowed opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Confidence Threshold */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700">
              Minimum Confidence Threshold ({formData.minConfidence}%)
            </label>
            <span className="text-[11px] text-slate-500">
              Drafts below this threshold are flagged for extra review
            </span>
          </div>
          <input
            type="range"
            min={60}
            max={95}
            step={5}
            value={formData.minConfidence}
            onChange={e => setFormData({ ...formData, minConfidence: Number(e.target.value) })}
            className="w-full accent-blue-700"
          />
        </div>

        {/* Save Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Settings saved successfully!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black uppercase text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </div>
      </div>
    </form>
  );
};
