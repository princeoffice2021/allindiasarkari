import { AIDraft, StaffActivityLog } from '../types/aiStaff';

export const INITIAL_STAFF_DRAFTS: AIDraft[] = [
  {
    id: 'draft-ssc-cgl-2026',
    sourceId: 'src-ssc',
    sourceName: 'Staff Selection Commission (SSC)',
    sourceUrl: 'https://ssc.gov.in/notice-cgl-2026',
    sourceDomain: 'ssc.gov.in',
    sourcePublicationDate: '2026-03-01',
    sourceFetchedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    notificationNumber: 'Notice No. 3/1/2026-P&P-I',
    pdfUrl: 'https://ssc.gov.in/portal/pdf/notice_cgl_2026.pdf',
    status: 'PENDING_REVIEW',
    confidenceScore: 96,
    extractedFacts: {
      recruitmentName: 'Combined Graduate Level Examination (CGL) 2026',
      organization: 'Staff Selection Commission (SSC)',
      advtNumber: 'Notice No. 3/1/2026-P&P-I',
      totalVacancies: '14,582 Posts (Tentative)',
      applicationStartDate: '05 March 2026',
      applicationEndDate: '04 April 2026',
      examDate: 'June - July 2026 (Tier-1)',
      applicationFee: {
        general_obc_ews: '₹100',
        sc_st_pwd: 'Exempted (₹0)',
        paymentMode: 'BHIM UPI, Net Banking, Visa, Mastercard, RuPay',
      },
      ageLimit: {
        minimum: '18 Years',
        maximum: '30/32 Years (Post-wise)',
        relaxation: 'SC/ST: 5 Yrs, OBC: 3 Yrs, PwD: 10 Yrs',
      },
      educationalQualification: 'Bachelor’s Degree in any discipline from a recognized University or equivalent.',
      selectionProcess: [
        'Tier-I Computer Based Examination (Objective)',
        'Tier-II Computer Based Examination (Objective & Descriptive/Skill Test)',
        'Data Entry Speed Test (DEST)',
        'Document Verification & Medical Examination',
      ],
      salaryPayScale: 'Pay Level-4 (₹25,500 - ₹81,100) to Pay Level-8 (₹47,600 - ₹1,51,100)',
      howToApply: [
        'Visit the new official portal ssc.gov.in.',
        'Complete One-Time Registration (OTR) if not done previously.',
        'Fill online application form and upload live photo via SSC mobile/web camera.',
        'Pay application fee online before the deadline.',
        'Download and print final submitted application confirmation page.',
      ],
      requiredDocuments: [
        'Aadhaar Card / Government Photo ID Proof',
        'Graduation Final Marksheet / Degree Certificate',
        '10th (Matriculation) Certificate for Date of Birth verification',
        'Category / Caste Certificate (OBC/EWS/SC/ST) in central format',
      ],
      officialNotificationPdf: 'https://ssc.gov.in/portal/pdf/notice_cgl_2026.pdf',
      applyOnlineUrl: 'https://ssc.gov.in/apply',
      officialWebsite: 'https://ssc.gov.in',
      unverifiedFields: [],
    },
    draftData: {
      title: 'SSC CGL Notification 2026: Apply Online for 14,582 Vacancies at ssc.gov.in',
      shortDescription: 'Staff Selection Commission releases SSC CGL 2026 Notification for 14,582 Group B and C posts. Check eligibility, syllabus, important dates and apply online.',
      category: 'Sarkari Naukri',
      state: 'Central',
      content: `<h2>Staff Selection Commission (SSC) Combined Graduate Level (CGL) Examination 2026</h2>
<p>The Staff Selection Commission has officially released the detailed recruitment notification for the <strong>Combined Graduate Level Examination, 2026</strong>. Over 14,500 tentative vacancies have been announced across various Ministries, Departments, and Organizations of the Government of India.</p>

<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
  <div class="bg-blue-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Recruitment Overview & Highlights</div>
  <table class="w-full text-left text-xs sm:text-sm">
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Recruiting Body</th><td class="p-3">Staff Selection Commission (SSC)</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Exam Name</th><td class="p-3">SSC CGL 2026 Examination</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Advt / Notice Number</th><td class="p-3 font-mono font-bold">Notice No. 3/1/2026-P&P-I</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Total Tentative Posts</th><td class="p-3 font-bold text-blue-900">14,582 Posts</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Pay Scale</th><td class="p-3">Pay Level-4 (₹25,500) to Pay Level-8 (₹1,51,100)</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Job Location</th><td class="p-3">All India Posting</td></tr>
  </table>
</div>

<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
  <div class="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Important Dates</div>
  <table class="w-full text-left text-xs sm:text-sm">
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Online Registration Starts</th><td class="p-3 font-semibold text-emerald-700">05 March 2026</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Last Date to Submit Application</th><td class="p-3 font-semibold text-red-600">04 April 2026 (23:00 hrs)</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Application Correction Window</th><td class="p-3">09 - 10 April 2026</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">CBT Tier-1 Examination Date</th><td class="p-3">June - July 2026</td></tr>
  </table>
</div>

<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
  <div class="bg-amber-900 text-amber-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider">Application Fee Details</div>
  <table class="w-full text-left text-xs sm:text-sm">
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">General / OBC / EWS Male</th><td class="p-3">₹100/-</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">SC / ST / PwD / Female (All Categories)</th><td class="p-3 font-bold text-emerald-700">Exempted (Nil / ₹0)</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Payment Modes</th><td class="p-3">BHIM UPI, Net Banking, Credit/Debit Cards</td></tr>
  </table>
</div>

<h3>Age Limit & Eligibility Criteria</h3>
<ul>
  <li><strong>Age Limit:</strong> 18 to 30/32 years (depending on post group). Age relaxation of 5 years for SC/ST and 3 years for OBC applies as per Govt of India rules.</li>
  <li><strong>Educational Qualification:</strong> Must possess a Bachelor's Degree from a recognized University or Institution. For Statistical Investigator posts, degree with Statistics is required.</li>
</ul>

<h3>Stages of Selection Process</h3>
<ol>
  <li>Tier-I Computer Based Test (CBT) consisting of General Intelligence, General Awareness, Quantitative Aptitude, and English Comprehension.</li>
  <li>Tier-II Computer Based Test (Mathematical Abilities, Reasoning, English, General Awareness, and Computer Knowledge Module).</li>
  <li>Data Entry Speed Test (DEST) wherever mandatory.</li>
  <li>Document Verification and Final Medical Examination.</li>
</ol>`,
      metaTitle: 'SSC CGL 2026 Notification: 14,582 Vacancies, Eligibility, Form Link',
      metaDescription: 'SSC CGL Notification 2026 released for 14582 posts. Check dates, age limit, educational qualification, syllabus and direct apply online link.',
      keywords: ['SSC CGL 2026', 'SSC CGL Notification', 'Sarkari Naukri 2026', 'SSC Recruitment'],
      suggestedSlug: 'ssc-cgl-notification-2026-apply-online-14582-posts',
      importantLinks: [
        { label: 'Apply Online (SSC Portal)', url: 'https://ssc.gov.in/apply' },
        { label: 'Download Official Notification PDF', url: 'https://ssc.gov.in/portal/pdf/notice_cgl_2026.pdf' },
        { label: 'Official SSC Portal', url: 'https://ssc.gov.in' },
      ],
      faqs: [
        {
          question: 'What is the last date to apply for SSC CGL 2026?',
          answer: 'The last date to submit online application forms is 04 April 2026 up to 23:00 hours.',
        },
        {
          question: 'What is the minimum qualification required for SSC CGL?',
          answer: 'Candidates must possess a Bachelor’s Degree in any discipline from a recognized University.',
        },
      ],
    },
    adminEdited: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'draft-rrb-ntpc-2026',
    sourceId: 'src-rrb',
    sourceName: 'Railway Recruitment Control Board (RRB)',
    sourceUrl: 'https://indianrailways.gov.in/ntpc-cen-02-2026',
    sourceDomain: 'indianrailways.gov.in',
    sourcePublicationDate: '2026-03-02',
    sourceFetchedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    notificationNumber: 'CEN No. 02/2026 (NTPC)',
    pdfUrl: 'https://indianrailways.gov.in/railwayboards/cen_02_2026.pdf',
    status: 'PENDING_REVIEW',
    confidenceScore: 94,
    extractedFacts: {
      recruitmentName: 'Non-Technical Popular Categories (NTPC) Graduate & Under Graduate Posts',
      organization: 'Railway Recruitment Boards (RRB)',
      advtNumber: 'CEN No. 02/2026',
      totalVacancies: '11,558 Posts',
      applicationStartDate: '10 March 2026',
      applicationEndDate: '09 April 2026',
      examDate: 'August - September 2026 (CBT-1)',
      applicationFee: {
        general_obc_ews: '₹500 (₹400 refundable on appearing in CBT-1)',
        sc_st_pwd: '₹250 (Full refundable on appearing in CBT-1)',
        paymentMode: 'Online Net Banking, UPI, Credit/Debit Cards',
      },
      ageLimit: {
        minimum: '18 Years',
        maximum: '33 Years (Undergraduate) / 36 Years (Graduate)',
        relaxation: 'SC/ST: 5 Years, OBC: 3 Years, Ex-Serviceman applicable',
      },
      educationalQualification: '12th Pass for Undergraduate posts; Bachelor’s Degree for Graduate posts.',
      selectionProcess: [
        '1st Stage Computer Based Test (CBT-1)',
        '2nd Stage Computer Based Test (CBT-2)',
        'Typing Skill Test / Computer Based Aptitude Test (CBAT) for designated posts',
        'Document Verification and Medical Examination',
      ],
      salaryPayScale: 'Level-2 (₹19,900) to Level-6 (₹35,400) + DA and allowances',
      howToApply: [
        'Select respective regional RRB portal based on preferred zone.',
        'Register online with mobile number and email ID.',
        'Upload required photograph and signature as per prescribed specifications.',
        'Submit post preference order and pay fee online.',
      ],
      requiredDocuments: [
        '10th / Matriculation Certificate for DOB',
        '12th or Degree Certificate and Marksheet',
        'Category Certificate (SC/ST/OBC-NCL/EWS)',
        'Scanned Photo and Signature',
      ],
      officialNotificationPdf: 'https://indianrailways.gov.in/railwayboards/cen_02_2026.pdf',
      applyOnlineUrl: 'https://www.rrbapply.gov.in',
      officialWebsite: 'https://indianrailways.gov.in',
      unverifiedFields: [],
    },
    draftData: {
      title: 'RRB NTPC Recruitment 2026: Apply Online for 11,558 Vacancies in Indian Railways',
      shortDescription: 'Railway Recruitment Board announces 11,558 NTPC vacancies for Graduate and Undergraduate posts. Check zone-wise vacancy, eligibility and fee details.',
      category: 'Sarkari Naukri',
      state: 'Central',
      content: `<h2>Railway Recruitment Boards (RRB) NTPC Recruitment 2026 (CEN 02/2026)</h2>
<p>The Ministry of Railways, Government of India, has published the Centralized Employment Notice <strong>CEN 02/2026</strong> for Non-Technical Popular Categories (NTPC) posts across all 21 regional Railway Recruitment Boards.</p>

<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
  <div class="bg-blue-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Railway NTPC Highlights</div>
  <table class="w-full text-left text-xs sm:text-sm">
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Recruiting Agency</th><td class="p-3">Railway Recruitment Boards (RRBs)</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">CEN Notice</th><td class="p-3 font-mono font-bold">CEN 02/2026</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Total Vacancies</th><td class="p-3 font-bold text-emerald-700">11,558 Posts</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Scale of Pay</th><td class="p-3">7th CPC Pay Matrix Level-2 to Level-6</td></tr>
  </table>
</div>

<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
  <div class="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Crucial Dates</div>
  <table class="w-full text-left text-xs sm:text-sm">
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Online Application Opening Date</th><td class="p-3 font-semibold text-emerald-700">10 March 2026</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Closing Date for Application</th><td class="p-3 font-semibold text-red-600">09 April 2026</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">CBT 1 Exam Schedule</th><td class="p-3">August - September 2026</td></tr>
  </table>
</div>`,
      metaTitle: 'RRB NTPC Recruitment 2026: 11,558 Vacancies, Eligibility, Apply Link',
      metaDescription: 'Railway NTPC 2026 Notification out for 11558 posts. Check salary, age limit, educational qualification and direct online application link.',
      keywords: ['RRB NTPC 2026', 'Railway Recruitment 2026', 'NTPC CEN 02 2026', 'Sarkari Job Railway'],
      suggestedSlug: 'rrb-ntpc-recruitment-2026-apply-online-11558-vacancies',
      importantLinks: [
        { label: 'Apply Online (RRB Apply Portal)', url: 'https://www.rrbapply.gov.in' },
        { label: 'Download CEN 02/2026 Notification PDF', url: 'https://indianrailways.gov.in/railwayboards/cen_02_2026.pdf' },
        { label: 'Official Railway Website', url: 'https://indianrailways.gov.in' },
      ],
      faqs: [
        {
          question: 'Is the RRB NTPC examination fee refundable?',
          answer: 'Yes, ₹400 out of ₹500 is refunded to General/OBC candidates, and ₹250 full fee is refunded to SC/ST/Female candidates upon appearing in CBT-1.',
        },
      ],
    },
    adminEdited: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export const INITIAL_STAFF_LOGS: StaffActivityLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    source: 'Staff Selection Commission (SSC)',
    action: 'SCAN',
    result: 'Scanned official portal ssc.gov.in. Detected 1 new recruitment notification.',
    status: 'SUCCESS',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 195).toISOString(),
    source: 'Staff Selection Commission (SSC)',
    action: 'DETECTION',
    result: 'Identified Notice No. 3/1/2026-P&P-I: Combined Graduate Level Examination 2026.',
    status: 'SUCCESS',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    source: 'AI Staff',
    action: 'DUPLICATE_CHECK',
    result: 'Zero duplicate records found in published posts or existing review queue. Verification clean.',
    status: 'SUCCESS',
  },
  {
    id: 'log-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    source: 'AI Staff',
    action: 'DRAFT',
    result: 'Draft prepared with complete tables, links, FAQs and SEO metadata. Queued for Admin Review.',
    status: 'SUCCESS',
  },
  {
    id: 'log-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    source: 'Railway Recruitment Control Board (RRB)',
    action: 'SCAN',
    result: 'Scanned official portal indianrailways.gov.in. Detected 1 new CEN notice.',
    status: 'SUCCESS',
  },
  {
    id: 'log-6',
    timestamp: new Date(Date.now() - 1000 * 60 * 125).toISOString(),
    source: 'AI Staff',
    action: 'DUPLICATE_CHECK',
    result: 'Verified against posts repository. No duplicate found for CEN 02/2026.',
    status: 'SUCCESS',
  },
  {
    id: 'log-7',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    source: 'AI Staff',
    action: 'DRAFT',
    result: 'Draft created for RRB NTPC 2026 (11,558 Posts). Queued for Admin Review. Auto-publish: strictly OFF.',
    status: 'SUCCESS',
  },
];
