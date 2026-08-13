import React, { useEffect, useState } from 'react';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { Mail, Send, CheckCircle2, AlertCircle, Clock, MapPin, ShieldAlert, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subjectCategory: 'Correction / Post Update',
    customSubject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updateSEO({
      title: 'Contact Us - All India Sarkari (allindiasarkari.com)',
      description: 'Contact the All India Sarkari editorial desk for article corrections, notification inquiries, feedback, or editorial questions.',
      canonicalUrl: '/contact',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
      }, 400);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <Mail className="h-7 w-7 text-blue-800" />
              Contact All India Sarkari
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Have feedback, factual corrections, notification inquiries, or partnership questions? Reach out directly.
            </p>
          </div>

          {/* Contact Details Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
                <Mail className="h-4 w-4 text-blue-800" />
                Editorial & Corrections
              </div>
              <p className="text-xs text-slate-600">
                For notification errors, date extensions, or corrigendum updates:
              </p>
              <a
                href="mailto:editorial@allindiasarkari.com"
                className="text-xs font-bold text-blue-900 hover:underline block"
              >
                editorial@allindiasarkari.com
              </a>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
                <MessageSquare className="h-4 w-4 text-emerald-700" />
                General Inquiries & Support
              </div>
              <p className="text-xs text-slate-600">
                For general questions, technical feedback, or suggestions:
              </p>
              <a
                href="mailto:contact@allindiasarkari.com"
                className="text-xs font-bold text-blue-900 hover:underline block"
              >
                contact@allindiasarkari.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-blue-50/70 border border-blue-200/80 p-3 rounded-xl">
            <Clock className="h-4 w-4 text-blue-800 shrink-0" />
            <span>
              <strong>Editorial Response SLA:</strong> Our team reviews and responds to incoming inquiries within <strong>24 to 48 business hours</strong>.
            </span>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg sm:text-xl font-bold text-emerald-950">Thank You For Reaching Out!</h2>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                Your message regarding <strong>"{formData.subjectCategory}"</strong> has been received by the All India Sarkari team. We will review and reply to <strong>{formData.email}</strong> promptly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    subjectCategory: 'Correction / Post Update',
                    customSubject: '',
                    message: '',
                  });
                }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-xs font-bold uppercase text-white hover:bg-blue-950 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-800 focus:border-blue-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-800 focus:border-blue-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Topic / Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.subjectCategory}
                    onChange={(e) => setFormData({ ...formData, subjectCategory: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs font-semibold text-slate-800 focus:border-blue-800 focus:outline-hidden"
                  >
                    <option value="Correction / Post Update">Correction / Post Update</option>
                    <option value="New Notification Suggestion">New Notification Suggestion</option>
                    <option value="Broken Link Report">Broken Link Report</option>
                    <option value="Editorial Feedback">Editorial Feedback</option>
                    <option value="Privacy / Data Inquiry">Privacy / Data Inquiry</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Specific Subject / Article Title
                  </label>
                  <input
                    type="text"
                    value={formData.customSubject}
                    onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
                    placeholder="e.g. SSC GD 2026 application date error"
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-blue-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Message Details <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your query, feedback, or correction in detail..."
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-800 focus:border-blue-800 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Important Notice:</strong> All India Sarkari is an independent information publication. We do not conduct examinations, release admit cards directly, or collect job application fees. For official status checks or candidate grievances regarding specific exam boards, please visit the respective government recruitment authority portal.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-blue-900 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-blue-950 transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Sending Message...' : 'Submit Message'}
              </button>
            </form>
          )}
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

