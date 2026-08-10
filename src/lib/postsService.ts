import { supabase, isSupabaseConfigured } from './supabase';
import { Post, PostFormData, CategoryType, PostStats } from '../types';
import { slugToCategory, categoryToSlug } from '../data/statesAndCategories';

// Pre-loaded initial articles for out-of-the-box operation before live Supabase credentials are plugged in
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'PM Kisan Samman Nidhi 19th Installment Date 2026 Out - Check Beneficiary Status & eKYC',
    slug: 'pm-kisan-19th-installment-date-2026-status',
    content: `<h2>PM Kisan Samman Nidhi Yojana 19th Installment 2026</h2>
<p>The Ministry of Agriculture and Farmers Welfare, Government of India, has announced the update regarding the release of the 19th installment under PM Kisan Samman Nidhi Scheme. Over 9.5 crore eligible farmers across India will receive direct bank transfers of ₹2,000.</p>
<h3>Key Highlights of PM Kisan 19th Installment</h3>
<ul>
  <li><strong>Scheme Name:</strong> PM Kisan Samman Nidhi Yojana</li>
  <li><strong>Benefit Amount:</strong> ₹2,000 per eligible farmer</li>
  <li><strong>Mode of Payment:</strong> Direct Benefit Transfer (DBT)</li>
  <li><strong>Mandatory Requirement:</strong> Aadhaar Seeding & Aadhaar-based eKYC</li>
</ul>
<h3>How to Check PM Kisan Beneficiary Status Online</h3>
<ol>
  <li>Visit the official PM Kisan portal at pmkisan.gov.in.</li>
  <li>Click on "Farmers Corner" on the homepage.</li>
  <li>Select "Beneficiary Status" option.</li>
  <li>Enter your Registered Mobile Number or Aadhaar Number.</li>
  <li>Click "Get Data" to view your payment installment status.</li>
</ol>
<p><strong>Note:</strong> Farmers who have not completed eKYC or bank Aadhaar linking will experience payment delays. Complete eKYC via OTP on PM Kisan portal or visit nearest CSC center.</p>`,
    excerpt: 'Government of India to transfer ₹2,000 under PM Kisan 19th Installment. Check your beneficiary status, payment date, and mandatory eKYC steps online.',
    category: 'Sarkari Yojana',
    state: null,
    image_url: 'https://images.unsplash.com/photo-1595009552535-be753447727e?auto=format&fit=crop&q=80&w=800',
    meta_description: 'PM Kisan 19th Installment Date 2026: Check beneficiary status, eligibility list and eKYC instructions on official portal pmkisan.gov.in.',
    keywords: ['PM Kisan 19th Installment', 'PM Kisan Status', 'Sarkari Yojana 2026', 'PM Kisan eKYC'],
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    title: 'UP Police Constable Bharti 2026: Apply Online for 60,244 Vacancies - Notification & Syllabus',
    slug: 'up-police-constable-bharti-2026-apply-online',
    content: `<h2>Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB) Constable Recruitment 2026</h2>
<p>The Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB) has invited online applications for the recruitment of 60,244 Constable (Civil Police) positions in UP Police.</p>
<h3>Vacancy Details & Qualification</h3>
<ul>
  <li><strong>Total Posts:</strong> 60,244</li>
  <li><strong>Qualification:</strong> Passed 10+2 (Intermediate) from any recognized board in India.</li>
  <li><strong>Age Limit:</strong> 18 to 25 Years for Male, 18 to 28 Years for Female (Age relaxation applicable as per UP Govt rules).</li>
  <li><strong>Pay Scale:</strong> Pay Matrix Level-3 (₹21,700 - ₹69,100)</li>
</ul>
<h3>Important Dates</h3>
<ul>
  <li>Online Application Start Date: 15 January 2026</li>
  <li>Last Date to Apply Online: 28 February 2026</li>
  <li>Exam Date: April 2026 (Tentative)</li>
</ul>
<h3>Selection Process</h3>
<ol>
  <li>Written OMR-Based Examination</li>
  <li>Physical Standard Test (PST) & Document Verification</li>
  <li>Physical Efficiency Test (PET - Running)</li>
  <li>Final Merit List</li>
</ol>`,
    excerpt: 'UPPRPB announces 60,244 Constable vacancies in Uttar Pradesh Police. Check eligibility criteria, age relaxation, syllabus, and online application process.',
    category: 'Sarkari Naukri',
    state: 'Uttar Pradesh',
    image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    meta_description: 'UP Police Constable Bharti 2026 online form link, syllabus, age limit, selection process and notification details.',
    keywords: ['UP Police Recruitment 2026', 'UP Police Constable Form', 'Sarkari Naukri UP', 'UPPRPB'],
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '3',
    title: 'SSC CGL Tier 1 Result 2026 Out: Download Cut-Off Marks & Merit List PDF',
    slug: 'ssc-cgl-tier-1-result-2026-download-cut-off',
    content: `<h2>Staff Selection Commission (SSC) CGL Tier 1 Result 2026</h2>
<p>The Staff Selection Commission (SSC) has officially declared the results for Combined Graduate Level (CGL) Tier-1 Examination 2026 on its official website ssc.gov.in.</p>
<h3>SSC CGL Tier 1 Category-Wise Cut Off Marks</h3>
<p>Thousands of candidates who appeared in the Tier-1 exam can now check category-wise cut-off marks and list of qualified candidates for Tier-2 examination.</p>
<ul>
  <li><strong>General (UR):</strong> 138.50</li>
  <li><strong>OBC:</strong> 132.25</li>
  <li><strong>EWS:</strong> 130.00</li>
  <li><strong>SC:</strong> 114.75</li>
  <li><strong>ST:</strong> 105.50</li>
</ul>
<h3>How to Download SSC CGL Result PDF</h3>
<ol>
  <li>Visit the official website: ssc.gov.in</li>
  <li>Click on "Results" tab on top menu.</li>
  <li>Select CGL examination section.</li>
  <li>Click on "Write Up" for Cut-off and "Result" link to check Roll Numbers.</li>
  <li>Search your Roll Number using Ctrl+F in the PDF file.</li>
</ol>`,
    excerpt: 'Staff Selection Commission declares SSC CGL Tier 1 Result 2026. Download merit list PDF and category-wise cut-off marks here.',
    category: 'Results',
    state: null,
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    meta_description: 'SSC CGL Tier 1 Result 2026 PDF download link, category cut off marks and qualified candidates merit list.',
    keywords: ['SSC CGL Result 2026', 'SSC Cut Off Marks', 'Sarkari Result 2026'],
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: '4',
    title: 'RRB ALP Admit Card 2026 Released: Download Assistant Loco Pilot Hall Ticket at rrbcdg.gov.in',
    slug: 'rrb-alp-admit-card-2026-download-hall-ticket',
    content: `<h2>Railway Recruitment Board (RRB) Assistant Loco Pilot (ALP) Admit Card 2026</h2>
<p>The Railway Recruitment Boards (RRBs) have uploaded the e-Admit Card and Exam City Intimation Slip for the CBT 1 Assistant Loco Pilot (ALP) Examination 2026.</p>
<h3>Exam Details</h3>
<ul>
  <li><strong>Exam Name:</strong> RRB ALP CBT-1 Exam 2026</li>
  <li><strong>Total Vacancies:</strong> 18,799 Posts</li>
  <li><strong>Exam Mode:</strong> Computer Based Test (CBT)</li>
  <li><strong>Admit Card Release Date:</strong> Available Now</li>
</ul>
<h3>Steps to Download RRB ALP Admit Card</h3>
<ol>
  <li>Select your respective regional RRB portal (e.g., RRB Chandigarh, RRB Bhopal, RRB Mumbai, RRB Kolkata).</li>
  <li>Click on the link "CEN 01/2026 ALP CBT-1 Admit Card / City Slip".</li>
  <li>Enter User ID / Registration Number and Password / Date of Birth.</li>
  <li>Your RRB ALP Admit Card will display on screen.</li>
  <li>Print two copies and carry original ID proof to exam center.</li>
</ol>`,
    excerpt: 'Railway Recruitment Board releases RRB ALP CBT 1 Admit Card 2026. Direct link to download hall ticket and check exam city intimation slip.',
    category: 'Admit Card',
    state: null,
    image_url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800',
    meta_description: 'RRB ALP Admit Card 2026 download link, exam city slip, exam date and guidelines for Assistant Loco Pilot exam.',
    keywords: ['RRB ALP Admit Card', 'Railway ALP CBT 1 Hall Ticket', 'RRB Exam City Slip'],
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: '5',
    title: 'Rajasthan Patwari Recruitment 2026: Apply Online for 2,998 Posts in RSMSSB',
    slug: 'rajasthan-patwari-recruitment-2026-rsmssb',
    content: `<h2>Rajasthan Subordinate and Ministerial Services Selection Board (RSMSSB) Patwari Vacancy 2026</h2>
<p>RSMSSB Jaipur has released notification for 2,998 Patwari posts in Revenue Department of Rajasthan. Eligible candidates can fill online application form at sso.rajasthan.gov.in.</p>
<h3>Vacancy Breakdown</h3>
<ul>
  <li>Non-TSP Area: 2,560 Posts</li>
  <li>TSP Area: 438 Posts</li>
  <li>Pay Scale: Pay Matrix L-5 (Grade Pay ₹2400)</li>
</ul>
<h3>Eligibility Criteria</h3>
<ul>
  <li>Degree (Graduation) in any stream from recognized university + RS-CIT or O level Computer Certificate.</li>
  <li>Age Limit: 18 to 40 Years (Age relaxation for SC/ST/OBC/EWS of Rajasthan).</li>
</ul>`,
    excerpt: 'RSMSSB opens recruitment for 2,998 Patwari posts in Rajasthan. Graduation + RSCIT required. Detailed notification, syllabus and online form info.',
    category: 'Sarkari Naukri',
    state: 'Rajasthan',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    meta_description: 'Rajasthan Patwari Bharti 2026 online form link, notification PDF, syllabus and eligibility details.',
    keywords: ['Rajasthan Patwari 2026', 'RSMSSB Patwari Form', 'Sarkari Naukri Rajasthan'],
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
  {
    id: '6',
    title: 'National Scholarship Portal (NSP) 2025-26: Pre & Post-Matric Application Form & Status',
    slug: 'national-scholarship-portal-nsp-2026-apply',
    content: `<h2>National Scholarship Portal (NSP 2.0) Central Schemes Registration 2025-26</h2>
<p>Ministry of Electronics & Information Technology, Govt of India, invites online applications for Central Sector Scholarships, Minority Scholarships, AICTE Fellowships, and SC/ST Post-Matric schemes via scholarships.gov.in.</p>
<h3>Popular Schemes on NSP</h3>
<ul>
  <li>Central Sector Scheme of Scholarships for College & University Students</li>
  <li>Post Matric Scholarships Scheme for Minorities</li>
  <li>PM-YASASVI Post-Matric Scholarship</li>
  <li>Pragati & Saksham Scholarship for Technical Education</li>
</ul>
<h3>Documents Required</h3>
<ol>
  <li>Aadhaar Card & Bank Account seeded with Aadhaar</li>
  <li>Income Certificate issued by competent authority</li>
  <li>Caste Certificate / Minority Declaration</li>
  <li>Previous Class Marksheet</li>
  <li>Course Fee Receipt & Bonafide Certificate</li>
</ol>`,
    excerpt: 'NSP Scholarship 2025-26 online registration open at scholarships.gov.in. Apply for Pre-Matric, Post-Matric and Higher Education Scholarships.',
    category: 'Scholarship',
    state: null,
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    meta_description: 'National Scholarship Portal NSP registration form, status check, eligible schemes list and last date.',
    keywords: ['NSP Scholarship 2026', 'National Scholarship Portal', 'Post Matric Scholarship'],
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: '7',
    title: 'Punjab Police Constable Recruitment 2026: Notification Out for 1,746 Posts',
    slug: 'punjab-police-constable-recruitment-2026',
    content: `<h2>Punjab Police Recruitment Board Constable Bharti 2026</h2>
<p>Punjab Police invites applications from eligible male and female candidates for District and Armed Police cadre Constables. Apply online at punjabpolice.gov.in.</p>
<h3>Highlights</h3>
<ul>
  <li>Total Vacancies: 1,746</li>
  <li>Qualification: 10+2 passed with Punjabi subject in Matriculation.</li>
  <li>Age Limit: 18 to 28 Years.</li>
  <li>Selection: Computer Based Test (CBT) followed by Physical Screening Test (PST).</li>
</ul>`,
    excerpt: 'Punjab Police announces 1,746 Constable positions in District and Armed cadres. Check physical standards, syllabus and online application dates.',
    category: 'Sarkari Naukri',
    state: 'Punjab',
    image_url: 'https://images.unsplash.com/photo-1508847154043-be5407f15ad6?auto=format&fit=crop&q=80&w=800',
    meta_description: 'Punjab Police Constable Recruitment 2026 online application link, eligibility and physical test details.',
    keywords: ['Punjab Police 2026', 'Punjab Constable Vacancy', 'Sarkari Naukri Punjab'],
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: '8',
    title: 'CTET January 2026 Official Answer Key Released - Submit Objections at ctet.nic.in',
    slug: 'ctet-january-2026-official-answer-key-released',
    content: `<h2>Central Teacher Eligibility Test (CTET) January 2026 Answer Key</h2>
<p>Central Board of Secondary Education (CBSE) has published the official OMR Answer Key and Question Papers for CTET Paper 1 and Paper 2 at ctet.nic.in.</p>
<h3>How to Download CTET Answer Key & Submit Challenges</h3>
<p>Candidates can log in using Roll Number and Date of Birth to view scanned OMR sheet and challenge answer keys by paying ₹1000 per question (refundable if challenge accepted).</p>`,
    excerpt: 'CBSE releases official CTET Answer Key & OMR sheet. Download Paper 1 & Paper 2 solutions and raise challenges online.',
    category: 'Answer Key',
    state: null,
    image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    meta_description: 'CTET Answer Key download link, OMR response sheet and key challenge process on ctet.nic.in.',
    keywords: ['CTET Answer Key', 'CBSE CTET 2026', 'Sarkari Answer Key'],
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 55).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 55).toISOString(),
  },
  {
    id: '9',
    title: 'UPSC Civil Services Examination (CSE) 2026 Detailed Syllabus & Exam Pattern',
    slug: 'upsc-cse-2026-detailed-syllabus-exam-pattern',
    content: `<h2>Union Public Service Commission (UPSC) IAS / IPS Exam Syllabus 2026</h2>
<p>The UPSC Civil Services Examination consists of three successive stages: Preliminary Examination, Main Examination (Written), and Personality Test (Interview).</p>
<h3>1. Preliminary Examination Syllabus (Objective Type)</h3>
<ul>
  <li><strong>GS Paper I (200 Marks):</strong> Current events, History of India, Indian and World Geography, Indian Polity and Governance, Economic & Social Development, Environmental Ecology, General Science.</li>
  <li><strong>GS Paper II - CSAT (200 Marks):</strong> Comprehension, Interpersonal skills, Logical reasoning, Decision making, Basic numeracy (Class X level). Qualifying with 33% marks.</li>
</ul>
<h3>2. Main Examination Syllabus (Written)</h3>
<p>Consists of 9 papers including 2 qualifying language papers, 1 Essay paper, 4 General Studies papers, and 2 Optional subject papers.</p>`,
    excerpt: 'Complete syllabus PDF and marking scheme for UPSC IAS Prelims & Mains Exam 2026. Download topic-wise subject breakdown.',
    category: 'Syllabus',
    state: null,
    image_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    meta_description: 'UPSC CSE Syllabus 2026 for Prelims & Mains GS papers, optional subjects and exam pattern PDF.',
    keywords: ['UPSC Syllabus 2026', 'IAS Prelims Syllabus', 'UPSC CSAT Pattern'],
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 65).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 65).toISOString(),
  },
  {
    id: '10',
    title: 'Daily Current Affairs 2026: National, Economic & Government Schemes GK Updates',
    slug: 'daily-current-affairs-2026-national-gk-updates',
    content: `<h2>Daily Current Affairs & GK Round-Up for Government Competitive Exams</h2>
<p>Stay updated with key daily news headlines, Union Cabinet approvals, bilateral agreements, sports awards, and socio-economic indices essential for UPSC, SSC, Banking, Railways, and State PSC exams.</p>
<h3>Today's Key Headlines</h3>
<ul>
  <li><strong>Union Cabinet:</strong> Approves Expansion of Digital India Initiative with ₹14,903 Crore outlay.</li>
  <li><strong>Economy:</strong> RBI keeps Repo Rate unchanged at 6.50% in Monetary Policy Committee (MPC) review.</li>
  <li><strong>Science & Tech:</strong> ISRO successfully conducts hot testing of semi-cryogenic engine for NGLV rocket.</li>
  <li><strong>Sports:</strong> India wins Asian Badminton Team Championship title.</li>
</ul>`,
    excerpt: 'Daily Current Affairs summary for UPSC, SSC, Bank PO, Railways and State Public Service Commission examinations.',
    category: 'Current Affairs',
    state: null,
    image_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
    meta_description: 'Daily Current Affairs 2026 PDF notes, GK questions and monthly roundups for competitive exams.',
    keywords: ['Current Affairs 2026', 'Daily GK Updates', 'Sarkari GK Notes'],
    published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  }
];

// Helper to manage posts with localStorage sync when Supabase is offline
const STORAGE_KEY = 'all_india_sarkari_posts';

function getLocalPosts(): Post[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed reading localStorage posts', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
  return INITIAL_POSTS;
}

function setLocalPosts(posts: Post[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed writing localStorage posts', e);
  }
}

// ==========================================
// PUBLIC POST FETCHING SERVICE METHODS
// ==========================================

export async function getLatestPosts(limit = 10): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data as Post[];
      }
    } catch (err) {
      console.warn('Supabase fetch fallback to local:', err);
    }
  }

  const posts = getLocalPosts().filter((p) => p.published);
  return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, limit);
}

export async function getPostsByCategory(
  categoryInput: string,
  page = 1,
  limit = 12,
  stateFilter?: string
): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  const normCategory = slugToCategory(categoryInput) || categoryInput;
  const normSlug = categoryToSlug(normCategory as CategoryType) || categoryInput;

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .or(`category.eq.${normCategory},category.eq.${normSlug},category.ilike.%${normCategory}%`);

      if (stateFilter) {
        query = query.ilike('state', `%${stateFilter}%`);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        const total = count || data.length;
        return {
          posts: data as Post[],
          total,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }
    } catch (err) {
      console.warn('Supabase category fetch fallback:', err);
    }
  }

  let posts = getLocalPosts().filter(
    (p) =>
      p.published &&
      (p.category.toLowerCase() === normCategory.toLowerCase() ||
        p.category.toLowerCase() === normSlug.toLowerCase())
  );
  if (stateFilter) {
    posts = posts.filter(
      (p) => p.state && p.state.toLowerCase().includes(stateFilter.toLowerCase())
    );
  }

  posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const total = posts.length;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + limit);

  return {
    posts: paginatedPosts,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getPostsByState(
  stateName: string,
  page = 1,
  limit = 12,
  categoryFilter?: string
): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .ilike('state', `%${stateName}%`);

      if (categoryFilter && categoryFilter !== 'All') {
        const normCat = slugToCategory(categoryFilter) || categoryFilter;
        query = query.or(`category.eq.${normCat},category.ilike.%${normCat}%`);
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        const total = count || data.length;
        return {
          posts: data as Post[],
          total,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }
    } catch (err) {
      console.warn('Supabase state fetch fallback:', err);
    }
  }

  let posts = getLocalPosts().filter(
    (p) => p.published && p.state && p.state.toLowerCase() === stateName.toLowerCase()
  );

  if (categoryFilter && categoryFilter !== 'All') {
    const normCat = (slugToCategory(categoryFilter) || categoryFilter).toLowerCase();
    posts = posts.filter((p) => p.category.toLowerCase() === normCat);
  }

  posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const total = posts.length;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + limit);

  return {
    posts: paginatedPosts,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getPostBySlug(slug: string, includeDrafts = false): Promise<Post | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('posts').select('*').eq('slug', slug);
      if (!includeDrafts) {
        query = query.eq('published', true);
      }
      const { data, error } = await query.single();

      if (!error && data) {
        return data as Post;
      }
    } catch (err) {
      console.warn('Supabase getPostBySlug fallback:', err);
    }
  }

  const posts = getLocalPosts();
  return posts.find((p) => p.slug === slug && (includeDrafts || p.published)) || null;
}

export async function searchPosts(
  searchQuery: string,
  category?: string,
  stateFilter?: string,
  page = 1,
  limit = 12
): Promise<{ posts: Post[]; total: number; totalPages: number }> {
  const queryTerm = searchQuery.trim().toLowerCase();

  if (isSupabaseConfigured && supabase && queryTerm) {
    try {
      let query = supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .or(`title.ilike.%${queryTerm}%,excerpt.ilike.%${queryTerm}%,content.ilike.%${queryTerm}%`);

      if (category) {
        query = query.eq('category', category);
      }
      if (stateFilter) {
        query = query.ilike('state', `%${stateFilter}%`);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        const total = count || data.length;
        return {
          posts: data as Post[],
          total,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }
    } catch (err) {
      console.warn('Supabase search fallback:', err);
    }
  }

  let posts = getLocalPosts().filter((p) => p.published);

  if (queryTerm) {
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(queryTerm) ||
        p.excerpt.toLowerCase().includes(queryTerm) ||
        p.content.toLowerCase().includes(queryTerm) ||
        (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(queryTerm)))
    );
  }

  if (category) {
    posts = posts.filter((p) => p.category === category);
  }

  if (stateFilter) {
    posts = posts.filter(
      (p) => p.state && p.state.toLowerCase().includes(stateFilter.toLowerCase())
    );
  }

  posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const total = posts.length;
  const startIndex = (page - 1) * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + limit);

  return {
    posts: paginatedPosts,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getRelatedPosts(
  category: CategoryType,
  currentSlug: string,
  limit = 4
): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .eq('category', category)
        .neq('slug', currentSlug)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data as Post[];
      }
    } catch (err) {
      console.warn('Supabase related posts fallback:', err);
    }
  }

  const posts = getLocalPosts().filter(
    (p) => p.published && p.category === category && p.slug !== currentSlug
  );
  return posts.slice(0, limit);
}

export async function getPopularPosts(limit = 6): Promise<Post[]> {
  return getLatestPosts(limit);
}

// ==========================================
// ADMIN MUTATION & MANAGEMENT METHODS
// ==========================================

export async function getAllPostsAdmin(): Promise<Post[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Post[];
      }
    } catch (err) {
      console.warn('Supabase getAllPostsAdmin fallback:', err);
    }
  }

  return getLocalPosts().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getPostByIdAdmin(id: string): Promise<Post | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as Post;
      }
    } catch (err) {
      console.warn('Supabase getPostByIdAdmin fallback:', err);
    }
  }

  const posts = getLocalPosts();
  return posts.find((p) => p.id === id) || null;
}

export async function createPost(formData: PostFormData): Promise<Post> {
  const slug = formData.slug || generateSlug(formData.title);
  const keywordsArray = formData.keywords
    ? formData.keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  const postPayload = {
    title: formData.title,
    slug,
    content: formData.content,
    excerpt: formData.excerpt,
    category: formData.category,
    state: formData.state || null,
    image_url: formData.image_url || null,
    meta_description: formData.meta_description || null,
    official_source_url: formData.official_source_url || null,
    keywords: keywordsArray,
    published: formData.published,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postPayload])
        .select()
        .single();

      if (!error && data) {
        return data as Post;
      } else if (error) {
        console.error('Supabase create error:', error);
      }
    } catch (err) {
      console.error('Supabase create exception:', err);
    }
  }

  // Local fallback creation
  const localPosts = getLocalPosts();
  const newPost: Post = {
    id: String(Date.now()),
    ...postPayload,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localPosts.unshift(newPost);
  setLocalPosts(localPosts);
  return newPost;
}

export async function updatePost(id: string, formData: PostFormData): Promise<Post> {
  const slug = formData.slug || generateSlug(formData.title);
  const keywordsArray = formData.keywords
    ? formData.keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : [];

  const postPayload = {
    title: formData.title,
    slug,
    content: formData.content,
    excerpt: formData.excerpt,
    category: formData.category,
    state: formData.state || null,
    image_url: formData.image_url || null,
    meta_description: formData.meta_description || null,
    official_source_url: formData.official_source_url || null,
    keywords: keywordsArray,
    published: formData.published,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(postPayload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as Post;
      }
    } catch (err) {
      console.error('Supabase update exception:', err);
    }
  }

  // Local fallback update
  const localPosts = getLocalPosts();
  const index = localPosts.findIndex((p) => p.id === id);
  if (index !== -1) {
    const updated: Post = {
      ...localPosts[index],
      ...postPayload,
    };
    localPosts[index] = updated;
    setLocalPosts(localPosts);
    return updated;
  }

  throw new Error('Post not found for update');
}

export async function deletePost(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (!error) {
        return true;
      }
    } catch (err) {
      console.error('Supabase delete exception:', err);
    }
  }

  const localPosts = getLocalPosts();
  const filtered = localPosts.filter((p) => p.id !== id);
  setLocalPosts(filtered);
  return true;
}

export async function getPostStats(): Promise<PostStats> {
  const posts = await getAllPostsAdmin();
  const stats: PostStats = {
    total: posts.length,
    published: posts.filter((p) => p.published).length,
    drafts: posts.filter((p) => !p.published).length,
    byCategory: {
      'Sarkari Yojana': 0,
      'Sarkari Naukri': 0,
      'Results': 0,
      'Admit Card': 0,
      'Answer Key': 0,
      'Syllabus': 0,
      'Scholarship': 0,
      'Current Affairs': 0,
    },
  };

  posts.forEach((p) => {
    if (stats.byCategory[p.category] !== undefined) {
      stats.byCategory[p.category]++;
    }
  });

  return stats;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function uploadPostImage(file: File): Promise<string> {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    throw new Error('Invalid image format. Only JPG, JPEG, PNG, and WEBP formats are allowed.');
  }

  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Image file is too large. Maximum allowed size is 5MB.');
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('post-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Supabase Storage upload error:', error);
        throw new Error(error.message || 'Failed to upload image to Supabase Storage');
      }

      const { data: publicUrlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('Invalid image format') || err.message.includes('file is too large'))) {
        throw err;
      }
      console.warn('Supabase Storage upload fallback:', err);
    }
  }

  // Local fallback (Data URL) for offline or development preview
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read image file locally'));
    reader.readAsDataURL(file);
  });
}

