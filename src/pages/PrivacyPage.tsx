import React, { useEffect } from 'react';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { ShieldCheck, Lock, Cookie, Eye, CheckCircle2, Mail } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Privacy Policy - All India Sarkari (allindiasarkari.com)',
      description: 'Read the official Privacy Policy of All India Sarkari (allindiasarkari.com). Details on cookies, Google AdSense, DART cookies, analytics, and data protection.',
      canonicalUrl: '/privacy-policy',
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-blue-800" />
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Last Updated: January 1, 2026 • Official Policy for allindiasarkari.com
            </p>
          </div>

          <p>
            At <strong>All India Sarkari</strong> (accessible at <a href="https://allindiasarkari.com" className="text-blue-800 font-bold hover:underline">https://allindiasarkari.com</a>), we value and respect the privacy of our visitors. This Privacy Policy outlines the types of information collected and recorded by All India Sarkari and how we utilize and protect it.
          </p>

          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:contact@allindiasarkari.com" className="text-blue-800 font-bold underline">contact@allindiasarkari.com</a>.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-800" />
            1. Information We Collect
          </h2>
          <p>
            <strong>All India Sarkari</strong> is a public informational platform. We do not require users to register accounts, provide national identity numbers (such as Aadhaar or PAN), or enter banking credentials to access published government notifications, syllabus breakdowns, answer keys, or exam results.
          </p>
          <p>
            If you contact us directly via our contact form or email, we may receive additional information such as your name, email address, the contents of the message and/or attachments you may send us, and any other information you choose to provide.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-800" />
            2. Log Files & Server Diagnostics
          </h2>
          <p>
            All India Sarkari follows a standard procedure of utilizing log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These details are not linked to any personally identifiable information and are used solely for analyzing trends, administering the site, tracking user movement, and gathering demographic information.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1 flex items-center gap-2">
            <Cookie className="h-4 w-4 text-amber-600" />
            3. Google DoubleClick DART Cookies & AdSense
          </h2>
          <p>
            Google is a third-party vendor on our site. It uses cookies, commonly known as <strong>DART cookies</strong>, to serve advertisements to our site visitors based upon their visit to <code className="text-xs">allindiasarkari.com</code> and other sites on the internet.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on All India Sarkari, which are sent directly to users' browsers.
            </li>
            <li>
              They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
            </li>
            <li>
              Visitors may opt out of the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-800 font-bold underline">https://policies.google.com/technologies/ads</a>
            </li>
          </ul>
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong>Please Note:</strong> All India Sarkari has no access to or control over these cookies that are used by third-party advertisers.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            4. Third-Party Privacy Policies
          </h2>
          <p>
            All India Sarkari's Privacy Policy does not apply to other advertisers or websites. Thus, we advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>
          <p>
            You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers' respective websites.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            5. CCPA & GDPR Privacy Rights
          </h2>
          <p>
            We respect candidate data privacy. Under data protection regulations, users are entitled to the following:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The right to request disclosure of personal data categories collected.</li>
            <li>The right to request erasure of any personal feedback data we maintain.</li>
            <li>The right to request that a business does not sell the consumer's personal data. (All India Sarkari does not sell any personal user data).</li>
          </ul>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            6. Children's Information
          </h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. All India Sarkari does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>

          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1">
            7. Consent
          </h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

