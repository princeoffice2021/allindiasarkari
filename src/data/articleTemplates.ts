export type PostTypeTemplate =
  | 'recruitment'
  | 'admit_card'
  | 'result'
  | 'answer_key'
  | 'yojana'
  | 'exam_admission'
  | 'govt_news'
  | 'general_sarkari';

export interface TemplateOption {
  id: PostTypeTemplate;
  label: string;
  category: string;
  description: string;
}

export const POST_TYPE_TEMPLATES: TemplateOption[] = [
  {
    id: 'recruitment',
    label: '1. Recruitment / Job Vacancy',
    category: 'Sarkari Naukri',
    description: 'Complete notification for government recruitment, posts, vacancies, age limit, salary & application steps.',
  },
  {
    id: 'admit_card',
    label: '2. Admit Card / Hall Ticket',
    category: 'Admit Card',
    description: 'Exam hall ticket release, download steps, exam shift timings, and exam day instructions.',
  },
  {
    id: 'result',
    label: '3. Result / Scorecard / Merit List',
    category: 'Result',
    description: 'Scorecard declaration, cutoff marks, roll number merit list, and score verification steps.',
  },
  {
    id: 'answer_key',
    label: '4. Answer Key & Objection Link',
    category: 'Answer Key',
    description: 'Provisional/final answer keys, objection fee per question, and response sheet download.',
  },
  {
    id: 'yojana',
    label: '5. Government Scheme / Sarkari Yojana',
    category: 'Sarkari Yojana',
    description: 'Welfare schemes, beneficiary financial assistance, eligibility criteria, and registration guide.',
  },
  {
    id: 'exam_admission',
    label: '6. Exam / Admission Notification',
    category: 'Admission',
    description: 'Entrance exam, counseling process, seat allocation, and entrance syllabus details.',
  },
  {
    id: 'govt_news',
    label: '7. Government News & Policy Update',
    category: 'Sarkari Naukri',
    description: 'Cabinet decisions, age relaxation orders, recruitment policy changes, and official press releases.',
  },
  {
    id: 'general_sarkari',
    label: '8. General Sarkari Information',
    category: 'Sarkari Naukri',
    description: 'Standard educational guidance, certificate verification, and public service resources.',
  },
];

export interface SectionDefinition {
  id: string;
  label: string;
  iconName?: string;
  guidance: string;
  generateHtml: () => string;
}

export const ARTICLE_SECTIONS: Record<string, SectionDefinition> = {
  overview: {
    id: 'overview',
    label: 'Introduction / Overview',
    guidance: 'Explain clearly what this recruitment/update is, who can apply/check it, and why it is important.',
    generateHtml: () => `
<h2>Overview & Recruitment Highlights</h2>
<p>The recruitment board/department has officially released the detailed notification for eligible candidates across India. Interested and eligible candidates are advised to read the full notification details, age eligibility, vacancy distribution, and selection process carefully before applying online.</p>
<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-blue-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Recruitment Summary Overview</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Conducting Authority</th><td class="p-3">Staff Selection Commission / Department Name</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Post / Job Name</th><td class="p-3">Assistant / Officer / Technical Post</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Total Number of Vacancies</th><td class="p-3">Mention Total Posts</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Mode of Application</th><td class="p-3">Online Mode Only</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Official Website</th><td class="p-3">official-department.gov.in</td></tr>
</table>
</div>
<p></p>
`,
  },
  notification_details: {
    id: 'notification_details',
    label: 'Notification Details',
    guidance: 'Mention official advertisement number, date of issue, and official issuing agency.',
    generateHtml: () => `
<h2>Official Notification Details</h2>
<p>The official notification bulletin (Advt No: <strong>SPECIFY_ADVT_NO</strong>) contains complete instructions regarding post-wise reservation quotas, examination centers, syllabus, and online submission guidelines. Candidates can download the official notification PDF directly from the links provided below.</p>
`,
  },
  important_dates: {
    id: 'important_dates',
    label: 'Important Dates',
    guidance: 'List exact start date, last date, fee payment deadline, correction window, and exam date.',
    generateHtml: () => `
<h2>Important Dates & Schedule</h2>
<p>Candidates must take note of the schedule to avoid missing critical registration deadlines:</p>
<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Important Event Schedule</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Online Application Starts</th><td class="p-3 font-semibold text-emerald-700">DD Month YYYY</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Last Date to Apply Online</th><td class="p-3 font-semibold text-red-600">DD Month YYYY (Till 11:59 PM)</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Last Date for Fee Payment</th><td class="p-3">DD Month YYYY</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Application Correction Window</th><td class="p-3">DD to DD Month YYYY</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Admit Card Release Date</th><td class="p-3">7–10 Days before Exam</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Written Examination Date</th><td class="p-3">To be Announced Soon</td></tr>
</table>
</div>
<p></p>
`,
  },
  application_fee: {
    id: 'application_fee',
    label: 'Application Fee',
    guidance: 'Specify category-wise application and processing fees, and accepted payment modes.',
    generateHtml: () => `
<h2>Application Fee Details</h2>
<p>The examination fee can be paid online through Net Banking, Debit/Credit Card, or UPI mode:</p>
<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-amber-900 text-amber-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider">Category-Wise Application Fee</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">General / OBC / EWS Candidates</th><td class="p-3 font-bold text-slate-900">₹100 / ₹500</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">SC / ST / PWD Candidates</th><td class="p-3 font-bold text-emerald-700">₹0 (Exempted)</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">All Female Candidates</th><td class="p-3 font-bold text-emerald-700">₹0 (Exempted)</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Accepted Payment Mode</th><td class="p-3">Online (Debit Card, Credit Card, Net Banking, UPI)</td></tr>
</table>
</div>
<p></p>
`,
  },
  age_limit: {
    id: 'age_limit',
    label: 'Age Limit',
    guidance: 'Provide minimum & maximum age as of cutoff date and statutory age relaxation for reserved categories.',
    generateHtml: () => `
<h2>Age Limit & Cutoff Criteria</h2>
<p>The crucial date for calculating age limit criteria is <strong>[Cutoff Date as per Notification]</strong>:</p>
<ul>
  <li><strong>Minimum Age Requirement:</strong> 18 Years</li>
  <li><strong>Maximum Age Requirement:</strong> 27 / 30 Years (Post-wise)</li>
  <li><strong>Age Relaxation Rules:</strong> Relaxation in upper age limit is applicable as per Government of India guidelines:
    <ul>
      <li>SC / ST Candidates: 5 Years Relaxation</li>
      <li>OBC (Non-Creamy Layer) Candidates: 3 Years Relaxation</li>
      <li>PwBD Candidates: 10–15 Years Relaxation</li>
      <li>Ex-Servicemen: As per official norms</li>
    </ul>
  </li>
</ul>
`,
  },
  vacancy_details: {
    id: 'vacancy_details',
    label: 'Vacancy Details',
    guidance: 'Outline total vacancies by post name and category (UR, OBC, SC, ST, EWS).',
    generateHtml: () => `
<h2>Vacancy Details & Category Distribution</h2>
<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-blue-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Post-Wise Vacancy Breakdown</div>
<table class="w-full text-left text-xs sm:text-sm">
  <thead>
    <tr class="bg-slate-100 border-b border-slate-200 font-bold text-slate-800">
      <th class="p-3">Post Name</th>
      <th class="p-3">UR</th>
      <th class="p-3">OBC</th>
      <th class="p-3">EWS</th>
      <th class="p-3">SC</th>
      <th class="p-3">ST</th>
      <th class="p-3">Total</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-slate-200"><td class="p-3 font-semibold">Post Designation 1</td><td class="p-3">100</td><td class="p-3">60</td><td class="p-3">25</td><td class="p-3">40</td><td class="p-3">20</td><td class="p-3 font-bold text-blue-900">245</td></tr>
    <tr class="border-b border-slate-200"><td class="p-3 font-semibold">Post Designation 2</td><td class="p-3">150</td><td class="p-3">80</td><td class="p-3">35</td><td class="p-3">55</td><td class="p-3">30</td><td class="p-3 font-bold text-blue-900">350</td></tr>
  </tbody>
</table>
</div>
<p></p>
`,
  },
  eligibility: {
    id: 'eligibility',
    label: 'Eligibility Criteria',
    guidance: 'Describe nationality, domicile, medical/character fitness, and basic conditions.',
    generateHtml: () => `
<h2>Eligibility Criteria</h2>
<p>To be eligible for this government recruitment examination, applicants must satisfy the following conditions:</p>
<ul>
  <li><strong>Nationality:</strong> Candidate must be a citizen of India, or a subject of Nepal/Bhutan.</li>
  <li><strong>State Domicile:</strong> Open to All India candidates (State-specific quota candidates must hold valid domicile certificate).</li>
  <li><strong>Character & Medical Fitness:</strong> Candidates must be of good mental and bodily health and free from any defect likely to interfere with official duties.</li>
</ul>
`,
  },
  educational_qualification: {
    id: 'educational_qualification',
    label: 'Educational Qualification',
    guidance: 'Mention required degrees/diplomas from recognized institutions.',
    generateHtml: () => `
<h2>Educational Qualification Required</h2>
<p>Candidates must possess the requisite academic qualifications from a recognized Board, Council, or University as of the closing date:</p>
<ul>
  <li><strong>For Matric / Secondary Posts:</strong> Passed 10th Standard (Matriculation) from any recognized state/central education board.</li>
  <li><strong>For 10+2 / Intermediate Posts:</strong> Passed 12th Standard or equivalent exam.</li>
  <li><strong>For Graduate Level Posts:</strong> Bachelor's Degree in any stream (BA, B.Sc, B.Com, B.Tech) or equivalent recognized degree.</li>
</ul>
`,
  },
  selection_process: {
    id: 'selection_process',
    label: 'Selection Process',
    guidance: 'Outline stages: Written Test / CBT, Skill Test, Physical Test, Document Verification & Medical Exam.',
    generateHtml: () => `
<h2>Selection Process Stages</h2>
<p>The recruitment board will conduct the selection through the following successive phases:</p>
<ol>
  <li><strong>Stage 1:</strong> Computer Based Examination (CBT / Written Test).</li>
  <li><strong>Stage 2:</strong> Physical Efficiency Test (PET) / Physical Standard Test (PST) or Skill / Typing Test (where applicable).</li>
  <li><strong>Stage 3:</strong> Detailed Document Verification (DV).</li>
  <li><strong>Stage 4:</strong> Detailed Medical Examination (DME) & Final Merit List.</li>
</ol>
`,
  },
  physical_eligibility: {
    id: 'physical_eligibility',
    label: 'Physical Eligibility (PET / PST)',
    guidance: 'List height, chest measurement, running time, and physical standard requirements for male/female candidates.',
    generateHtml: () => `
<h2>Physical Standard & Efficiency Test (PST / PET)</h2>
<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Physical Standards Criteria</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Male Height (General/OBC/SC)</th><td class="p-3">170 cm (ST: 162.5 cm)</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Female Height (General/OBC/SC)</th><td class="p-3">157 cm (ST: 150 cm)</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Male Chest Measurement</th><td class="p-3">80 cm unexpanded (with 5 cm minimum expansion)</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Running Endurance Test (Male)</th><td class="p-3">5 Kilometers in 24 Minutes</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Running Endurance Test (Female)</th><td class="p-3">1.6 Kilometers in 8.5 Minutes</td></tr>
</table>
</div>
<p></p>
`,
  },
  salary: {
    id: 'salary',
    label: 'Salary / Pay Scale',
    guidance: 'Provide Pay Level, initial basic pay, allowances (DA, HRA, TA), and in-hand pay structure.',
    generateHtml: () => `
<h2>Pay Scale & In-Hand Salary</h2>
<p>Selected candidates will receive compensation as per the 7th Central Pay Commission (CPC) Pay Matrix:</p>
<ul>
  <li><strong>Pay Level:</strong> Pay Matrix Level-3 / Level-4 (₹21,700 to ₹69,100 / ₹25,500 to ₹81,100).</li>
  <li><strong>Allowances & Perks:</strong> In addition to basic salary, candidates are entitled to Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and Government Health Scheme coverage.</li>
</ul>
`,
  },
  how_to_apply: {
    id: 'how_to_apply',
    label: 'How to Apply Online',
    guidance: 'Step-by-step instructions from registration to final submission and printout.',
    generateHtml: () => `
<h2>How to Apply Online Step-by-Step</h2>
<p>Follow these simple steps to fill out the online application form accurately:</p>
<ol>
  <li><strong>Visit Official Website:</strong> Go to the official recruitment portal URL provided in the direct links table below.</li>
  <li><strong>New Registration:</strong> Click on "New Candidate Registration / Sign Up" and fill in your Name, Mobile Number, and Email ID.</li>
  <li><strong>Fill Application Form:</strong> Login using your Registration ID and Password. Fill in educational credentials, category, and communication address.</li>
  <li><strong>Upload Documents:</strong> Upload scanned copies of your recent passport-size photograph, signature, and category certificate in prescribed format.</li>
  <li><strong>Pay Application Fee:</strong> Verify all entered details in the preview page and submit the application fee online.</li>
  <li><strong>Print Confirmation:</strong> Save and print the final submitted application form PDF for future reference.</li>
</ol>
`,
  },
  required_documents: {
    id: 'required_documents',
    label: 'Required Documents',
    guidance: 'List certificates needed: Aadhaar, 10th marksheet, category certificate, photo, signature.',
    generateHtml: () => `
<h2>Required Documents for Online Application</h2>
<ul>
  <li>Recent Passport Size Photograph with clean light background.</li>
  <li>Scanned Signature in JPG format.</li>
  <li>Valid Identity Proof (Aadhaar Card, Voter ID, PAN Card, or Driving License).</li>
  <li>Class 10th (Matriculation) Certificate & Marksheet for Date of Birth verification.</li>
  <li>Educational Certificates & Degree Marksheets.</li>
  <li>Category Certificate (EWS, OBC Non-Creamy Layer, SC, ST) if claiming reservation benefits.</li>
</ul>
`,
  },
  important_instructions: {
    id: 'important_instructions',
    label: 'Important Instructions',
    guidance: 'Add warnings about deadlines, official documents, eligibility verification, and official website confirmation.',
    generateHtml: () => `
<h2>Important Instructions for Candidates</h2>
<blockquote>
<strong>⚠️ Notice to Candidates:</strong> Candidates must double-check all details such as Name, Date of Birth, and Father's Name against their 10th Class Marksheet before final submission. Applications with invalid photographs, blurry signatures, or unverified fee receipts will be rejected without prior notice. Always verify official notifications on the primary government portal.
</blockquote>
`,
  },
  official_source: {
    id: 'official_source',
    label: 'Official Source',
    guidance: 'Official link reminder for verifying dates and terms.',
    generateHtml: () => `
<h2>Official Notification & Source</h2>
<p>Candidates must verify all terms, vacancy reservations, and examination dates directly from the official notification PDF published by the department.</p>
`,
  },
  conclusion: {
    id: 'conclusion',
    label: 'Conclusion',
    guidance: 'Summarize next steps and timeline for candidates.',
    generateHtml: () => `
<h2>Summary & Next Steps</h2>
<p>Eligible aspirants are advised not to wait for the last date of registration to avoid last-minute server congestion. Prepare your documents beforehand and keep visiting All India Sarkari for real-time updates regarding admit cards, exam dates, answer keys, and result announcements.</p>
`,
  },
};

/**
 * Returns a complete, cohesive article structure tailored for a specific post type
 */
export function getRecommendedTemplateHtml(type: PostTypeTemplate): string {
  switch (type) {
    case 'recruitment':
      return [
        ARTICLE_SECTIONS.overview.generateHtml(),
        ARTICLE_SECTIONS.notification_details.generateHtml(),
        ARTICLE_SECTIONS.important_dates.generateHtml(),
        ARTICLE_SECTIONS.application_fee.generateHtml(),
        ARTICLE_SECTIONS.age_limit.generateHtml(),
        ARTICLE_SECTIONS.vacancy_details.generateHtml(),
        ARTICLE_SECTIONS.educational_qualification.generateHtml(),
        ARTICLE_SECTIONS.eligibility.generateHtml(),
        ARTICLE_SECTIONS.selection_process.generateHtml(),
        ARTICLE_SECTIONS.salary.generateHtml(),
        ARTICLE_SECTIONS.how_to_apply.generateHtml(),
        ARTICLE_SECTIONS.required_documents.generateHtml(),
        ARTICLE_SECTIONS.important_instructions.generateHtml(),
        ARTICLE_SECTIONS.conclusion.generateHtml(),
      ].join('\n');

    case 'result':
      return `
<h2>Result Declaration & Overview</h2>
<p>The examination authority has officially announced the results for the written/computer-based examination. Candidates who appeared in the exam can now check their qualifying status, roll-number wise merit list, and scorecard from the official portal.</p>

<h2>Important Dates for Result & Next Stage</h2>
<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Result Schedule</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Exam Conducted On</th><td class="p-3">DD Month YYYY</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Result Announcement Date</th><td class="p-3 font-bold text-emerald-700">Available Now</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Scorecard Download Link</th><td class="p-3 font-semibold text-blue-800">Active Online</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Next Stage (Skill/DV) Date</th><td class="p-3">To be Announced Soon</td></tr>
</table>
</div>

<h2>Cutoff Marks & Merit Criteria</h2>
<p>The qualifying cutoff marks for different reservation categories (General, EWS, OBC, SC, ST, PWD) have been released alongside the merit list PDF. Qualified candidates will be called for document verification and subsequent rounds.</p>

<h2>How to Check & Download Result Scorecard</h2>
<ol>
  <li>Go to the official department website or click the direct result link below.</li>
  <li>Locate the link titled "Recruitment Result / Merit List PDF".</li>
  <li>Enter your <strong>Roll Number / Registration ID</strong> and <strong>Date of Birth / Password</strong>.</li>
  <li>View your marks, sectional scores, and qualifying status on the screen.</li>
  <li>Download and take a printout of the scorecard for the upcoming document verification round.</li>
</ol>

<h2>Required Login Details</h2>
<ul>
  <li>Registration Number / Application ID</li>
  <li>Roll Number (from Admit Card)</li>
  <li>Date of Birth (in DD/MM/YYYY format)</li>
</ul>

<h2>Important Instructions for Qualified Candidates</h2>
<blockquote>
<strong>⚠️ Next Stage Notice:</strong> Candidates shortlisted in the result must preserve their original documents, category certificates, and admit cards for the upcoming document verification and skill test phase.
</blockquote>
`;

    case 'admit_card':
      return `
<h2>Admit Card / Hall Ticket Overview</h2>
<p>The conducting authority has officially released the Admit Card / Hall Ticket for the upcoming examination. All registered candidates must download and print their admit card well ahead of the exam date to avoid last-minute server rush.</p>

<h2>Exam Schedule & Shift Details</h2>
<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Exam & Admit Card Schedule</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Admit Card Release Date</th><td class="p-3 font-bold text-emerald-700">Available Now</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Date of Examination</th><td class="p-3 font-semibold text-blue-900">DD Month YYYY</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Exam Timing / Shifts</th><td class="p-3">Shift 1 (Morning) / Shift 2 (Afternoon)</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Reporting Time</th><td class="p-3 text-red-700 font-bold">Mentioned on Hall Ticket</td></tr>
</table>
</div>

<h2>How to Download Admit Card Online</h2>
<ol>
  <li>Click on the direct "Download Admit Card" link given in the links section below.</li>
  <li>Enter your <strong>Registration Number / Roll Number</strong>.</li>
  <li>Enter your <strong>Date of Birth / Password</strong> and security captcha.</li>
  <li>Click on "Submit / Login".</li>
  <li>Your hall ticket will appear on screen. Verify personal details, exam center name, and shift timing carefully.</li>
  <li>Download and print at least 2 copies on clean A4 paper.</li>
</ol>

<h2>Mandatory Documents to Carry on Exam Day</h2>
<ul>
  <li><strong>Printed Copy of Admit Card:</strong> Clear, legible printout with visible photograph.</li>
  <li><strong>Original Photo ID Proof:</strong> Aadhaar Card, Voter ID, Driving License, or Passport.</li>
  <li><strong>Passport Size Photographs:</strong> 2 recent colored passport size photos matching the application form.</li>
  <li><strong>Transparent Ballpoint Pen:</strong> Blue or black ballpoint pen (if required for OMR/attendance).</li>
</ul>

<h2>Important Exam Hall Instructions</h2>
<blockquote>
<strong>⚠️ Prohibited Items:</strong> Electronic gadgets, smart watches, mobile phones, calculators, Bluetooth devices, and study notes are strictly forbidden inside the examination hall. Candidates must report at the center before the gate closing time.
</blockquote>
`;

    case 'answer_key':
      return `
<h2>Answer Key & Objection Window Overview</h2>
<p>The examination board has released the Provisional Answer Key and Candidate Response Sheets for the recently concluded examination. Candidates can cross-check their recorded responses with the official master answer key and calculate their tentative raw scores.</p>

<h2>Important Dates for Answer Key & Objections</h2>
<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Answer Key Timeline</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Answer Key Release Date</th><td class="p-3 font-bold text-emerald-700">Available Now</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Objection Submission Starts</th><td class="p-3">DD Month YYYY</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Last Date to Challenge Question</th><td class="p-3 font-bold text-red-600">DD Month YYYY (5:00 PM)</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Objection Fee per Question</th><td class="p-3 font-semibold">₹50 / ₹100 per question challenged</td></tr>
</table>
</div>

<h2>How to Download Answer Key & Submit Objections</h2>
<ol>
  <li>Click on the direct Answer Key link in the table below.</li>
  <li>Login with your Roll Number and Password.</li>
  <li>Download your individual response sheet and official question key.</li>
  <li>If you find any discrepancy in any question, click on "Raise Objection".</li>
  <li>Select the Question Number, upload valid reference proof/textbook documentation, and pay the non-refundable challenge fee online.</li>
</ol>

<h2>Important Instructions regarding Final Answer Key</h2>
<blockquote>
<strong>⚠️ Note:</strong> Challenges submitted without authenticated standard textbook proofs or after the deadline will not be entertained by the exam committee.
</blockquote>
`;

    case 'yojana':
      return `
<h2>Scheme Overview & Objectives</h2>
<p>The government has launched this welfare scheme to provide financial security, skill opportunities, and social assistance to eligible citizens. The scheme aims to simplify direct benefit transfers (DBT) directly into bank accounts of verified beneficiaries.</p>

<h2>Key Benefits & Financial Assistance</h2>
<ul>
  <li><strong>Direct Financial Support:</strong> Financial grant/pension credited periodically via DBT mode.</li>
  <li><strong>Subsidized Services:</strong> Access to healthcare, education, or agricultural equipment benefits.</li>
  <li><strong>Insurance & Social Security:</strong> Accidental insurance and health coverage support for families.</li>
</ul>

<h2>Eligibility Criteria for Beneficiaries</h2>
<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-blue-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Eligibility Conditions</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Citizenship</th><td class="p-3">Permanent Resident of India / State Resident</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Age Criteria</th><td class="p-3">18 to 60 Years (Category specific)</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Annual Family Income</th><td class="p-3">Less than ₹2,50,000 per annum / BPL Category</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Bank Account</th><td class="p-3">Aadhaar Linked & DBT Enabled Bank Account</td></tr>
</table>
</div>

<h2>Required Documents for Scheme Registration</h2>
<ul>
  <li>Aadhaar Card (Linked with active Mobile Number).</li>
  <li>Permanent Resident / Domicile Certificate.</li>
  <li>Income Certificate issued by competent revenue authority.</li>
  <li>Bank Passbook copy showing IFSC code and Account Number.</li>
  <li>Ration Card (BPL / APL / Antyodaya).</li>
  <li>Passport Size Photographs.</li>
</ul>

<h2>How to Apply Online for the Scheme</h2>
<ol>
  <li>Visit the official portal or nearest CSC (Common Service Center).</li>
  <li>Click on "New Citizen Registration / Apply for Scheme".</li>
  <li>Fill in applicant details and verify Aadhaar via OTP.</li>
  <li>Upload required income and identity certificates.</li>
  <li>Submit the application and note the Application Reference Number for tracking.</li>
</ol>

<h2>Official Portal & Helpline Details</h2>
<blockquote>
<strong>⚠️ Official Helpline:</strong> In case of issues in application status or DBT transfer, beneficiaries can contact the official toll-free helpline number or visit their district welfare office.
</blockquote>
`;

    case 'exam_admission':
      return `
<h2>Entrance Exam & Admission Overview</h2>
<p>Official notification has been published for admission into undergraduate/postgraduate/diploma courses for the upcoming academic session. Eligible candidates seeking admission must submit their registration form before the deadline.</p>

<h2>Important Dates for Admission Process</h2>
<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
<div class="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Admission Schedule</div>
<table class="w-full text-left text-xs sm:text-sm">
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Application Form Starts</th><td class="p-3 font-semibold text-emerald-700">DD Month YYYY</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Last Date to Submit Application</th><td class="p-3 font-semibold text-red-600">DD Month YYYY</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Entrance Exam Date</th><td class="p-3">DD Month YYYY</td></tr>
  <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Counseling / Seat Allotment</th><td class="p-3">To be Announced Soon</td></tr>
</table>
</div>

<h2>Courses Offered & Minimum Academic Eligibility</h2>
<ul>
  <li><strong>Eligibility:</strong> Minimum 50% marks in qualifying examination from recognized Board/University (45% for reserved categories).</li>
  <li><strong>Age Requirement:</strong> As prescribed in the institutional admission guidelines.</li>
</ul>

<h2>How to Apply for Admission</h2>
<ol>
  <li>Access the official admission portal.</li>
  <li>Complete user registration and generate login credentials.</li>
  <li>Fill in course preferences and personal information.</li>
  <li>Upload qualifying certificates and photograph.</li>
  <li>Submit the registration fee and take a printout of the application confirmation page.</li>
</ol>
`;

    case 'govt_news':
      return `
<h2>Official Government Update & Announcement</h2>
<p>The concerned government ministry/department has issued an official announcement regarding policy revisions, recruitment schedules, and administrative decisions affecting public aspirants.</p>

<h2>Key Highlights of the Announcement</h2>
<ul>
  <li><strong>Decision Overview:</strong> Key decision approved by the competent authority.</li>
  <li><strong>Effective Date:</strong> Applicable with immediate effect or from upcoming recruitment cycle.</li>
  <li><strong>Target Beneficiaries:</strong> Job seekers, government employees, and general public.</li>
</ul>

<h2>Detailed Explanation of the Policy / Order</h2>
<p>According to the official circular, the revised guidelines aim to streamline examination procedures, enhance transparency, and provide timely opportunities for candidates across India.</p>

<h2>Official Circular Verification</h2>
<blockquote>
<strong>⚠️ Reference Circular:</strong> For the official gazette notification or signed order PDF, refer to the official ministry link provided below.
</blockquote>
`;

    case 'general_sarkari':
    default:
      return [
        ARTICLE_SECTIONS.overview.generateHtml(),
        ARTICLE_SECTIONS.notification_details.generateHtml(),
        ARTICLE_SECTIONS.important_dates.generateHtml(),
        ARTICLE_SECTIONS.eligibility.generateHtml(),
        ARTICLE_SECTIONS.how_to_apply.generateHtml(),
        ARTICLE_SECTIONS.important_instructions.generateHtml(),
        ARTICLE_SECTIONS.conclusion.generateHtml(),
      ].join('\n');
  }
}
