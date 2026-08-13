import React, { useEffect } from 'react';
import { updateSEO } from '../lib/seo';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Sidebar } from '../components/Sidebar';
import { BookOpen, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle, Mail, FileCheck } from 'lucide-react';

export const EditorialPolicyPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Editorial & Content Policy - All India Sarkari',
      description: 'Read the Editorial Policy, Fact-Checking Standards, Source Verification and Corrections Policy of All India Sarkari (allindiasarkari.com).',
      canonicalUrl: '/editorial-policy',
    });
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <Breadcrumbs items={[{ label: 'Editorial Policy' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-blue-800" />
              Editorial & Content Policy
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Effective Date: January 1, 2026 • Published by All India Sarkari Editorial Board (allindiasarkari.com)
            </p>
          </div>

          {/* Overview */}
          <div className="space-y-3">
            <p className="text-base font-semibold text-slate-900 leading-relaxed">
              At <strong>All India Sarkari</strong>, we are committed to maintaining the highest journalistic and informational standards in reporting government employment notices, welfare schemes, examination results, admit cards, and recruitment schedules across India.
            </p>
            <p>
              This Editorial Policy outlines how our editorial team researches, verifies, writes, reviews, and updates content published on <a href="https://allindiasarkari.com" className="text-blue-800 font-bold hover:underline">allindiasarkari.com</a>.
            </p>
          </div>

          {/* Section 1: Source Verification */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide border-l-4 border-blue-900 pl-3 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-blue-800" />
              1. Source Verification & Authenticity
            </h2>
            <p>
              Every article published on All India Sarkari undergoes strict primary source verification before publication. Our team references only authoritative and authentic government channels:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Official Government Portals:</strong> Primary notifications released on official central and state government domains (ending in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-900 font-bold">.gov.in</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-900 font-bold">.nic.in</code>), such as UPSC (<code className="text-xs">upsc.gov.in</code>), SSC (<code className="text-xs">ssc.gov.in</code>), RRB, NTA, IBPS, and State Public Service Commissions.
              </li>
              <li>
                <strong>Employment News (Rozgar Samachar):</strong> Official weekly gazettes published by the Ministry of Information and Broadcasting, Government of India.
              </li>
              <li>
                <strong>State Gazette Notifications:</strong> Official legislative and department orders released by respective State and Union Territory administrations.
              </li>
              <li>
                <strong>Press Information Bureau (PIB):</strong> Official press releases and policy announcements by the Central Government.
              </li>
            </ul>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <strong>Mandatory Rule:</strong> We do not publish recruitment rumors, unverified social media claims, or third-party WhatsApp forwards without official departmental corroboration.
            </p>
          </section>

          {/* Section 2: Fact-Checking Standards */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide border-l-4 border-blue-900 pl-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              2. Fact-Checking Standards
            </h2>
            <p>
              Our editorial staff meticulously cross-checks every crucial data point prior to publishing:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <span className="font-bold text-slate-900 block text-xs uppercase">Important Dates</span>
                <span className="text-xs text-slate-600">Cross-verified against official advertisement timelines for application start, deadline, correction window, and exam date.</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <span className="font-bold text-slate-900 block text-xs uppercase">Eligibility & Age Limit</span>
                <span className="text-xs text-slate-600">Educational criteria, cut-off qualification dates, and government category-wise age relaxations (SC/ST/OBC/EWS/PWD/Ex-Servicemen).</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <span className="font-bold text-slate-900 block text-xs uppercase">Application Fees</span>
                <span className="text-xs text-slate-600">Category-specific exam fees, exemption rules, and accepted payment modes (SBI Challan, UPI, Net Banking).</span>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 bg-slate-50">
                <span className="font-bold text-slate-900 block text-xs uppercase">Direct Official Links</span>
                <span className="text-xs text-slate-600">Direct links to official PDF notifications and authorized recruitment application portals.</span>
              </div>
            </div>
          </section>

          {/* Section 3: Corrections & Updates Policy */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide border-l-4 border-blue-900 pl-3 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-700" />
              3. Corrections & Corrigendum Policy
            </h2>
            <p>
              When recruitment boards issue corrigendums, date extensions, vacancy revisions, or revised answer keys:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Our team immediately updates the respective article to reflect the amended notification details.</li>
              <li>The article timestamp (<code className="text-xs">updated_at</code>) is modified to alert readers of the latest revision.</li>
              <li>If a typographical error or factual discrepancy is brought to our attention, our editors investigate and correct it promptly within 24 hours.</li>
            </ul>
          </section>

          {/* Section 4: Editorial Independence */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide border-l-4 border-blue-900 pl-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-700" />
              4. Editorial Independence & Ethics
            </h2>
            <p>
              <strong>All India Sarkari</strong> is an independent digital news and education portal. We maintain complete editorial independence:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>We do not accept payments, sponsorships, or inducements to favor any private coaching institute or job placement agency.</li>
              <li>Advertising placements (such as Google AdSense) are strictly separated from editorial decisions and are clearly distinguished with the label <span className="font-bold text-slate-900">"ADVERTISEMENT"</span>.</li>
              <li>We never publish sponsored government job listings that are not backed by legitimate statutory departments.</li>
            </ul>
          </section>

          {/* Section 5: Reader Feedback & Redressal */}
          <section className="space-y-3 pt-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide border-l-4 border-blue-900 pl-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-600" />
              5. Reader Feedback & Grievance Redressal
            </h2>
            <p>
              We welcome corrections, suggestions, and feedback from candidates, educators, and department officials. If you spot an error in any published post or have an official corrigendum to submit, please reach out to our editorial desk:
            </p>
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2 text-xs text-blue-950">
              <div className="font-bold text-sm text-blue-900">Editorial Desk Contact:</div>
              <p>Email: <a href="mailto:editorial@allindiasarkari.com" className="font-bold underline text-blue-900">editorial@allindiasarkari.com</a></p>
              <p>General Inquiries: <a href="mailto:contact@allindiasarkari.com" className="font-bold underline text-blue-900">contact@allindiasarkari.com</a></p>
              <p>Turnaround SLA: All correction requests are reviewed and resolved within 24–48 business hours.</p>
            </div>
          </section>
        </main>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
