import React, { useEffect, useState } from 'react';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    updateSEO({
      title: 'Contact Us - All India Sarkari',
      description: 'Get in touch with the All India Sarkari editorial team for feedback, correction requests, or business inquiries.',
      canonicalUrl: '/contact',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
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
            <p className="text-xs text-slate-500 mt-1">Have feedback, corrections, or inquiries? Reach out to our team.</p>
          </div>

          {submitted ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold text-emerald-950">Thank You For Contacting Us!</h2>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Your message has been received. Our editorial team will review your inquiry and respond to <strong>{formData.email}</strong> within 24–48 hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="mt-2 text-xs font-bold text-blue-900 underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Correction in UP Police Bharti Post"
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-800 focus:border-blue-800 focus:outline-hidden"
                />
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
                  placeholder="Type your message or inquiry here..."
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm text-slate-800 focus:border-blue-800 focus:outline-hidden"
                />
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> We do not ask for personal government IDs or application fees. For official admit card issues or form submission, please visit the respective government board portal directly.
                </span>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blue-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-blue-950 transition-colors"
              >
                <Send className="h-4 w-4" /> Send Message
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
