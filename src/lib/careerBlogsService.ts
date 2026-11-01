import { supabase, isSupabaseConfigured } from './supabase';
import {
  CareerBlog,
  CareerBlogFormData,
  CareerBlogCategory,
  CareerBlogStats,
  BlogLanguage,
} from '../types/careerBlog';

const CAREER_BLOGS_STORAGE_KEY = 'allindia_career_blogs_v1';
const CAREER_CATEGORIES_STORAGE_KEY = 'allindia_career_categories_v1';

export const DEFAULT_CAREER_CATEGORIES: CareerBlogCategory[] = [
  { id: 'cat-1', name: 'Career Guidance', slug: 'career-guidance', description: 'Expert guidance for choosing the right career path and academic decisions.' },
  { id: 'cat-2', name: 'Career Options', slug: 'career-options', description: 'Comprehensive guides to emerging and traditional high-growth careers.' },
  { id: 'cat-3', name: 'Resume & CV', slug: 'resume-cv', description: 'ATS-friendly resume templates, formatting tips, and sample CVs.' },
  { id: 'cat-4', name: 'Interview Preparation', slug: 'interview-preparation', description: 'Common HR and technical interview questions, mock answers, and etiquette.' },
  { id: 'cat-5', name: 'Job Search Tips', slug: 'job-search-tips', description: 'Job hunting strategies, portal navigation, and networking advice.' },
  { id: 'cat-6', name: 'Government Jobs', slug: 'government-jobs', description: 'Preparation strategies, syllabus insights, and career perks of Sarkari Naukri.' },
  { id: 'cat-7', name: 'Private Jobs', slug: 'private-jobs', description: 'Corporate hiring trends, MNC careers, startups, and tech opportunities.' },
  { id: 'cat-8', name: 'Skills & Courses', slug: 'skills-courses', description: 'Certifications, free government online courses, and digital skill roadmaps.' },
  { id: 'cat-9', name: 'Salary & Career Growth', slug: 'salary-career-growth', description: 'Salary negotiation tips, appraisal strategies, and fast-track promotions.' },
  { id: 'cat-10', name: 'Work From Home', slug: 'work-from-home', description: 'Remote jobs, freelancing opportunities, and verified telecommute gigs.' },
  { id: 'cat-11', name: 'Study & Education', slug: 'study-education', description: 'Entrance exam planning, higher studies, scholarships, and diplomas.' },
];

export const INITIAL_CAREER_BLOGS: CareerBlog[] = [
  // HINDI CAREER BLOGS
  {
    id: 'hindi-blog-1',
    language: 'hindi',
    title: 'पहली नौकरी के इंटरव्यू में सफलता कैसे पाएं - टॉप 10 टिप्स और ट्रिक्स',
    slug: 'interview-tips-in-hindi-first-job',
    excerpt: 'कॉलेज पूरा करने के बाद फ्रेशर्स के लिए पहली नौकरी का इंटरव्यू क्रैक करने की संपूर्ण गाइड। जानिए ड्रेस कोड, बॉडी लैंग्वेज और पूछे जाने वाले सामान्य सवालों के सटीक जवाब।',
    content: `<h2>पहली नौकरी का इंटरव्यू: फ्रेशर्स के लिए सफलता की कुंजी</h2>
<p>कॉलेज की पढ़ाई पूरी होने के बाद किसी भी युवा के लिए पहली नौकरी का इंटरव्यू देना काफी रोमांचक और थोड़ा घबराहट भरा अनुभव हो सकता है। अधिकांश उम्मीदवारों के पास तकनीकी ज्ञान होता है, लेकिन सही तैयारी और आत्मविश्वास की कमी के कारण वे इंटरव्यू में चूक जाते हैं।</p>

<h3>1. कंपनी और पद के बारे में पूरी जानकारी हासिल करें</h3>
<p>इंटरव्यू देने जाने से पहले जिस कंपनी में आपने आवेदन किया है, उसकी आधिकारिक वेबसाइट, सोशल मीडिया पेज और हालिया उपलब्धियों के बारे में अवश्य पढ़ें। इंटरव्यूअर अक्सर पूछते हैं कि <em>"आप हमारी कंपनी में क्यों काम करना चाहते हैं?"</em> इसका सटीक जवाब आपकी तैयारी को प्रदर्शित करता है।</p>

<h3>2. अपना रिज्यूमे (Resume) पूरी तरह याद रखें</h3>
<p>अपने सीवी में लिखी हर एक लाइन, प्रोजेक्ट, इंटर्नशिप और स्किल की पूरी जानकारी रखें। कभी भी रिज्यूमे में ऐसी कोई बात न लिखें जिसे आप समझा न सकें।</p>

<h3>3. अक्सर पूछे जाने वाले कॉमन इंटरव्यू प्रश्न और उनके जवाब</h3>
<ul>
  <li><strong>Tell me about yourself (अपने बारे में बताएं):</strong> 2 मिनट में अपनी शैक्षणिक पृष्ठभूमि, रुचियां और इस नौकरी के प्रति अपने जुनून को संक्षेप में समझाएं।</li>
  <li><strong>आपकी सबसे बड़ी ताकत और कमजोरी क्या है?</strong> ताकत में अपनी ईमानदारी और सीखने की ललक बताएं। कमजोरी में ऐसी बात कहें जिस पर आप सक्रिय रूप से सुधार कर रहे हों।</li>
  <li><strong>अगले 5 वर्षों में आप खुद को कहां देखते हैं?</strong> कंपनी में निरंतर प्रगति और नई जिम्मेदारियां संभालने की इच्छा जाहिर करें।</li>
</ul>

<h3>इंटरव्यू की तैयारी का चेकलिस्ट</h3>
<table border="1" cellpadding="8" style="width:100%; border-collapse:collapse; margin:16px 0;">
  <thead style="background:#1e3a8a; color:white;">
    <tr>
      <th>तैयारी का चरण</th>
      <th>महत्वपूर्ण बिंदु</th>
      <th>समय सीमा</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>रिसर्च</td>
      <td>कंपनी प्रोफाइल और जॉब डिस्क्रिप्शन (JD) का अध्ययन</td>
      <td>इंटरव्यू से 2 दिन पहले</td>
    </tr>
    <tr>
      <td>दस्तावेज</td>
      <td>रिज्यूमे की 3 प्रतियां, सर्टिफिकेट्स और पासपोर्ट साइज फोटो</td>
      <td>इंटरव्यू से 1 दिन पहले</td>
    </tr>
    <tr>
      <td>बॉडी लैंग्वेज</td>
      <td>दृढ़ हैंडशेक, आई कॉन्टैक्ट और मुस्कान</td>
      <td>इंटरव्यू के दौरान</td>
    </tr>
  </tbody>
</table>

<h3>निष्कर्ष</h3>
<p>इंटरव्यू सिर्फ ज्ञान का टेस्ट नहीं है, बल्कि आपके स्वभाव और समस्या सुलझाने की क्षमता का मूल्यांकन भी है। सकारात्मक सोच के साथ जाएं और ईमानदारी से उत्तर दें।</p>`,
    category: 'Interview Preparation',
    tags: ['Interview Tips', 'Job For Freshers', 'Career Guide Hindi', 'First Job Success'],
    author_name: 'Prince Sharma',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    meta_title: 'पहली नौकरी के इंटरव्यू में सफलता कैसे पाएं - टॉप 10 टिप्स (Hindi Guide)',
    meta_description: 'फ्रेशर्स के लिए जॉब इंटरव्यू क्रैक करने के आसान तरीके, कॉमन इंटरव्यू सवाल और बॉडी लैंग्वेज टिप्स। जानिए पहली नौकरी पाने का अचूक फॉर्मूला।',
    focus_keyword: 'इंटरव्यू टिप्स हिंदी',
    canonical_url: 'https://allindiasarkari.com/blogs/hindi/interview-tips-in-hindi-first-job',
    published: true,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'hindi-blog-2',
    language: 'hindi',
    title: 'सरकारी नौकरी बनाम प्राइवेट नौकरी: 2026 में अपने करियर के लिए सही विकल्प कैसे चुनें?',
    slug: 'government-vs-private-job-career-choice',
    excerpt: 'सरकारी और निजी क्षेत्र के करियर में तुलना: वेतन, जॉब सिक्योरिटी, प्रमोशन के अवसर, वर्क-लाइफ बैलेंस और पेंशन लाभ का निष्पक्ष विश्लेषण।',
    content: `<h2>सरकारी नौकरी या प्राइवेट कॉर्पोरेट करियर: आपके लिए क्या बेहतर है?</h2>
<p>भारत में करियर का चयन करते समय हर युवा के सामने यह बड़ा सवाल उठता है: <strong>सरकारी नौकरी (Sarkari Naukri) की तैयारी करें या प्राइवेट सेक्टर में कॉर्पोरेट करियर बनाएं?</strong> दोनों ही क्षेत्रों के अपने फायदे और चुनौतियां हैं।</p>

<h3>1. जॉब सिक्योरिटी और स्थिरता (Job Security)</h3>
<p>सरकारी नौकरियों में जॉब सिक्योरिटी सबसे बड़ा आकर्षण है। एक बार नियमित पद पर नियुक्ति होने के बाद नौकरी जाने का जोखिम नगण्य होता है। प्राइवेट सेक्टर में प्रदर्शन और बाजार की स्थिति के आधार पर नौकरी में उतार-चढ़ाव आ सकता है, हालांकि टॉप परफॉर्मर्स के लिए उच्च अवसर भी होते हैं।</p>

<h3>2. वेतन और विकास की गति (Salary & Growth)</h3>
<p>शुरुआती स्तर पर 7वें वेतन आयोग के बाद सरकारी पदों पर आकर्षक वेतन और भत्ते (DA, HRA, मेडिकल) मिलते हैं। वहीं प्राइवेट सेक्टर में यदि आपके पास टेक्नोलॉजी, मैनेजमेंट या डेटा साइंस जैसी इन-डिमांड स्किल्स हैं, तो वेतन वृद्धि की कोई सीमा नहीं है।</p>

<h3>सरकारी और प्राइवेट नौकरी की तुलनात्मक तालिका</h3>
<table border="1" cellpadding="8" style="width:100%; border-collapse:collapse; margin:16px 0;">
  <thead style="background:#1e3a8a; color:white;">
    <tr>
      <th>पहलू</th>
      <th>सरकारी नौकरी (Sarkari)</th>
      <th>प्राइवेट नौकरी (Private)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>सुरक्षा</td>
      <td>अत्यधिक सुरक्षित</td>
      <td>प्रदर्शन पर निर्भर</td>
    </tr>
    <tr>
      <td>शुरुआती वेतन</td>
      <td>निश्चित पे-स्केल + भत्ते</td>
      <td>कौशल और कंपनी अनुसार</td>
    </tr>
    <tr>
      <td>वर्क-लाइफ बैलेंस</td>
      <td>निश्चित कार्य घंटे (अधिकांश पदों पर)</td>
      <td>प्रोजेक्ट डेडलाइन आधारित</td>
    </tr>
    <tr>
      <td>पदोन्नति (Promotion)</td>
      <td>वरिष्ठता व विभागीय परीक्षा</td>
      <td>मेरिट और बिजनेस परिणाम</td>
    </tr>
  </tbody>
</table>

<h3>अपने लिए सही निर्णय कैसे लें?</h3>
<ol>
  <li>यदि आप स्थिरता, सामाजिक प्रतिष्ठा और संतुलित जीवन चाहते हैं, तो संघ लोक सेवा आयोग (UPSC), राज्य लोक सेवा आयोग (State PSC), बैंकिंग और रेलवे जैसी सरकारी सेवाओं का लक्ष्य बनाएं।</li>
  <li>यदि आप तेजी से सीखने, वैश्विक माहौल में काम करने और तकनीकी नवाचार के प्रति उत्साही हैं, तो प्राइवेट सेक्टर आपके लिए बेहतर मंच प्रदान करता है।</li>
</ol>`,
    category: 'Career Options',
    tags: ['Sarkari Naukri vs Private', 'Career Guidance 2026', 'Govt Job Benefits', 'Career Options Hindi'],
    author_name: 'Prince Sharma',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    meta_title: 'सरकारी नौकरी बनाम प्राइवेट नौकरी: 2026 में क्या चुनें? (Complete Analysis)',
    meta_description: 'Sarkari Naukri vs Private Job: जानिए किसमें है बेहतर सैलरी, जॉब सिक्योरिटी और करियर ग्रोथ। पूरी तुलनात्मक गाइड हिंदी में।',
    focus_keyword: 'सरकारी नौकरी बनाम प्राइवेट नौकरी',
    canonical_url: 'https://allindiasarkari.com/blogs/hindi/government-vs-private-job-career-choice',
    published: true,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'hindi-blog-3',
    language: 'hindi',
    title: 'फ्रेशर्स के लिए प्रभावशाली रिज्यूमे कैसे बनाएं - स्टेप बाय स्टेप गाइड और फॉर्मेट',
    slug: 'resume-cv-making-guide-for-freshers',
    excerpt: 'बिना कार्य अनुभव के भी आकर्षक रिज्यूमे तैयार करने के व्यावहारिक तरीके। जानिए कौन से सेक्शंस शामिल करें ताकि आपका सीवी पहले राउंड में सेलेक्ट हो जाए।',
    content: `<h2>बिना अनुभव के भी बनाएं शानदार रिज्यूमे</h2>
<p>नौकरी तलाशते समय आपका रिज्यूमे (Resume) रिक्रूटर के सामने आपकी पहली पहचान होता है। एक आंकड़े के अनुसार रिक्रूटर एक रिज्यूमे को देखने में केवल 6 से 7 सेकंड का समय लगाते हैं। इसलिए आपका सीवी साफ, संक्षिप्त और प्रभावी होना चाहिए।</p>

<h3>रिज्यूमे के 5 सबसे जरूरी भाग</h3>
<ol>
  <li><strong>हेडर व संपर्क जानकारी:</strong> आपका पूरा नाम, लिंक्डइन प्रोफाइल लिंक, फोन नंबर और प्रोफेशनल ईमेल आईडी।</li>
  <li><strong>करियर ऑब्जेक्टिव (Career Objective):</strong> 2-3 पंक्तियों में बताएं कि आपकी शिक्षा कंपनी के लक्ष्यों में कैसे मददगार साबित होगी।</li>
  <li><strong>शैक्षणिक योग्यता (Education Details):</strong> 10वीं, 12वीं और ग्रेजुएशन के अंक, बोर्ड/विश्वविद्यालय और उत्तीर्ण होने का वर्ष रिवर्स क्रोनोलॉजिकल क्रम में लिखें।</li>
  <li><strong>प्रोजेक्ट्स और इंटर्नशिप (Projects & Internships):</strong> कॉलेज के दौरान किए गए प्रोजेक्ट्स, सेमीनार और प्रेजेंटेशन का संक्षिप्त विवरण दें।</li>
  <li><strong>स्किल्स और सर्टिफिकेट्स (Skills & Certifications):</strong> एमएस एक्सेल, कोडिंग, डिजिटल मार्केटिंग या कम्युनिकेशन स्किल्स का उल्लेख करें।</li>
</ol>

<h3>रिज्यूमे बनाते समय इन गलतियों से बचें</h3>
<ul>
  <li>फालतू व्यक्तिगत जानकारियां (जैसे माता-पिता का नाम, वैवाहिक स्थिति) लिखने से बचें।</li>
  <li>स्पेलिंग और व्याकरण (Grammar) की गलतियां बिल्कुल न हों।</li>
  <li>रिज्यूमे हमेशा PDF फॉर्मेट में ही सेव और शेयर करें।</li>
</ul>`,
    category: 'Resume & CV',
    tags: ['Resume Tips', 'CV Format Freshers', 'ATS Resume Hindi', 'Career Guidance'],
    author_name: 'Prince Sharma',
    image_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800',
    meta_title: 'फ्रेशर्स के लिए प्रभावशाली रिज्यूमे कैसे बनाएं - स्टेप बाय स्टेप गाइड',
    meta_description: 'बिना एक्सपीरियंस के शानदार रिज्यूमे बनाने की आसान टिप्स। जानिए कौन से स्किल्स और प्रोजेक्ट्स जोड़ें ताकि सीवी तुरंत शॉर्टलिस्ट हो।',
    focus_keyword: 'रिज्यूमे कैसे बनाएं',
    canonical_url: 'https://allindiasarkari.com/blogs/hindi/resume-cv-making-guide-for-freshers',
    published: true,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 80).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },

  // ENGLISH CAREER BLOGS
  {
    id: 'english-blog-1',
    language: 'english',
    title: 'How to Crack Your First Job Interview: 10 Essential Tips for Freshers in 2026',
    slug: 'how-to-crack-job-interview-freshers-guide-2026',
    excerpt: 'Step-by-step interview preparation blueprint for graduates and freshers. Master behavioral questions, technical rounds, virtual interview etiquette, and salary expectations.',
    content: `<h2>Ace Your First Job Interview: The Ultimate Graduate Playbook</h2>
<p>Landing your first job right after graduation is a pivotal milestone. While strong academic credentials get your resume noticed, your performance in the interview room determines whether you secure the official offer letter.</p>

<h3>1. Research the Organization Thoroughly</h3>
<p>Never walk into an interview relying solely on general knowledge. Explore the company’s recent press releases, clients, tech stack, and workplace culture. Understand the key responsibilities of the role you applied for so your answers mirror their real-world needs.</p>

<h3>2. Master the STAR Technique for Behavioral Questions</h3>
<p>When asked situational questions like <em>"Describe a time you solved a difficult problem under tight deadlines,"</em> structure your response using the <strong>STAR method</strong>:</p>
<ul>
  <li><strong>Situation:</strong> Set the context of the challenge.</li>
  <li><strong>Task:</strong> Explain what you needed to accomplish.</li>
  <li><strong>Action:</strong> Describe the exact steps and leadership you took.</li>
  <li><strong>Result:</strong> Share the quantifiable outcome (e.g., delivered 2 days ahead of schedule).</li>
</ul>

<h3>Key Phases of Interview Preparation</h3>
<table border="1" cellpadding="8" style="width:100%; border-collapse:collapse; margin:16px 0;">
  <thead style="background:#1e3a8a; color:white;">
    <tr>
      <th>Phase</th>
      <th>Key Focus Areas</th>
      <th>Deliverable</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Pre-Interview (Day -3)</td>
      <td>Role mapping & domain revision</td>
      <td>3 tailored questions for the interviewer</td>
    </tr>
    <tr>
      <td>Virtual Setup Check (Day -1)</td>
      <td>Camera angle, microphone, and lighting</td>
      <td>Quiet, distraction-free environment</td>
    </tr>
    <tr>
      <td>Interview Day</td>
      <td>Punctuality, calm delivery, professional posture</td>
      <td>Follow-up thank-you email within 24 hours</td>
    </tr>
  </tbody>
</table>

<h3>3. Asking Insightful Questions at the End</h3>
<p>When the interviewer asks, <em>"Do you have any questions for us?"</em> never say no. Inquire about team goals, upcoming initiatives, or what success looks like in the first 90 days. This demonstrates high commitment and intellectual curiosity.</p>`,
    category: 'Interview Preparation',
    tags: ['Interview Tips', 'Career Guidance', 'Fresher Jobs 2026', 'STAR Method'],
    author_name: 'Prince Sharma',
    image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800',
    meta_title: 'How to Crack Your First Job Interview in 2026: 10 Essential Tips for Freshers',
    meta_description: 'Master your first corporate job interview with proven freshers tips, STAR method examples, body language guidelines, and smart questions to ask recruiters.',
    focus_keyword: 'job interview tips for freshers',
    canonical_url: 'https://allindiasarkari.com/blogs/english/how-to-crack-job-interview-freshers-guide-2026',
    published: true,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: 'english-blog-2',
    language: 'english',
    title: 'Top High-Paying In-Demand Career Skills to Learn in 2026 for Rapid Career Growth',
    slug: 'top-high-paying-career-skills-to-learn',
    excerpt: 'Discover the most valuable technical, managerial, and digital competencies commanding high remuneration across tech, finance, analytics, and creative industries in 2026.',
    content: `<h2>Future-Proof Your Career: The Highest-Paying Skills in 2026</h2>
<p>The global job market is evolving at unprecedented speed. Professionals and students who continuously upskill with high-leverage abilities earn significantly higher starting compensation and transition smoothly across industries.</p>

<h3>1. Data Literacy and Business Analytics</h3>
<p>Organizations of all sizes rely on data-driven decision-making. Proficiency in SQL, Python, PowerBI, and data visualization tools enables candidates to turn raw metrics into actionable revenue growth insights.</p>

<h3>2. Cloud Infrastructure & Cyber Defense</h3>
<p>With cloud adoption accelerating across AWS, Azure, and Google Cloud, certified cloud architects and cybersecurity analysts enjoy robust job security, remote flexibility, and industry-leading compensation packages.</p>

<h3>Skill Demand and Salary Benchmark Overview</h3>
<table border="1" cellpadding="8" style="width:100%; border-collapse:collapse; margin:16px 0;">
  <thead style="background:#1e3a8a; color:white;">
    <tr>
      <th>Skill Domain</th>
      <th>Key Certifications / Tools</th>
      <th>Avg. Starting Range (INR)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cloud Computing</td>
      <td>AWS Solutions Architect, Azure Fundamentals</td>
      <td>₹6.5 - ₹12 LPA</td>
    </tr>
    <tr>
      <td>Data & Analytics</td>
      <td>Python, SQL, Tableau, PowerBI</td>
      <td>₹5.5 - ₹10 LPA</td>
    </tr>
    <tr>
      <td>Full Stack Engineering</td>
      <td>React, TypeScript, Node.js, PostgreSQL</td>
      <td>₹6.0 - ₹14 LPA</td>
    </tr>
    <tr>
      <td>Digital Growth & Product</td>
      <td>SEO, Product Analytics, Performance Marketing</td>
      <td>₹4.8 - ₹9 LPA</td>
    </tr>
  </tbody>
</table>

<h3>How to Start Learning Today for Free</h3>
<ol>
  <li>Utilize government portals such as SWAYAM and NPTEL for certified university courses.</li>
  <li>Build portfolio projects and open-source repositories to showcase practical problem solving.</li>
  <li>Document your learning journey publicly on LinkedIn to attract hiring managers.</li>
</ol>`,
    category: 'Skills & Courses',
    tags: ['High Paying Skills', 'Career Growth', 'Tech Jobs 2026', 'Upskilling Guide'],
    author_name: 'Prince Sharma',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    meta_title: 'Top High-Paying In-Demand Career Skills to Learn in 2026',
    meta_description: 'Discover the highest paying career skills in 2026. Explore salary trends, certifications, and free learning pathways across tech, data, and management.',
    focus_keyword: 'high paying career skills 2026',
    canonical_url: 'https://allindiasarkari.com/blogs/english/top-high-paying-career-skills-to-learn',
    published: true,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'english-blog-3',
    language: 'english',
    title: 'Complete Guide to Crafting an ATS-Friendly Resume That Gets You Shortlisted',
    slug: 'resume-building-guide-ats-friendly-format',
    excerpt: 'Learn how Applicant Tracking Systems screen your CV. Follow this practical checklist to format your resume, include relevant keywords, and boost interview callbacks.',
    content: `<h2>Beating the Applicant Tracking System (ATS) in 2026</h2>
<p>Over 75% of job applications are filtered out by automated Applicant Tracking Systems before a human recruiter ever sees them. Crafting an ATS-compliant resume is the single most critical factor in securing interview invites.</p>

<h3>Core Principles of an ATS-Compliant Resume</h3>
<ul>
  <li><strong>Clean Single-Column Layout:</strong> Avoid complex tables, text boxes, and multi-column designs that confuse automated parsers.</li>
  <li><strong>Keyword Optimization:</strong> Incorporate role-specific terms and competencies directly cited in the job advertisement.</li>
  <li><strong>Standard Section Headings:</strong> Use universal labels such as <em>Professional Summary, Experience, Education, and Skills</em>.</li>
  <li><strong>Action-Oriented Bullet Points:</strong> Start every responsibility with a strong action verb and quantify results wherever possible (e.g., <em>"Improved application load speed by 35%"</em>).</li>
</ul>

<h3>Do's and Don'ts for Your 2026 Resume</h3>
<table border="1" cellpadding="8" style="width:100%; border-collapse:collapse; margin:16px 0;">
  <thead style="background:#1e3a8a; color:white;">
    <tr>
      <th>Recommended (Do)</th>
      <th>Avoid (Don't)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Save and submit as a text-searchable PDF</td>
      <td>Submitting image-only scanned files</td>
    </tr>
    <tr>
      <td>Include verifiable LinkedIn and portfolio links</td>
      <td>Listing personal marital or religious status</td>
    </tr>
    <tr>
      <td>Highlight achievements with percentages and metrics</td>
      <td>Copy-pasting generic responsibilities</td>
    </tr>
    <tr>
      <td>Limit length to 1-2 pages maximum</td>
      <td>Using graphical skill progress bars</td>
    </tr>
  </tbody>
</table>`,
    category: 'Resume & CV',
    tags: ['ATS Resume', 'Resume Format', 'Job Search Tips', 'CV Writing 2026'],
    author_name: 'Prince Sharma',
    image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800',
    meta_title: 'Complete Guide to Crafting an ATS-Friendly Resume in 2026',
    meta_description: 'How to write an ATS-friendly resume that passes automated recruiter screening. Formatting rules, keyword strategies, and practical do’s and don’ts.',
    focus_keyword: 'ATS friendly resume guide',
    canonical_url: 'https://allindiasarkari.com/blogs/english/resume-building-guide-ats-friendly-format',
    published: true,
    published_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 100).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

// Helper to generate clean slug
export function generateBlogSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0900-\u097F-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Local Storage Helpers
function getStoredBlogs(): CareerBlog[] {
  if (typeof window === 'undefined') return INITIAL_CAREER_BLOGS;
  try {
    const raw = localStorage.getItem(CAREER_BLOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CAREER_BLOGS_STORAGE_KEY, JSON.stringify(INITIAL_CAREER_BLOGS));
      return INITIAL_CAREER_BLOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CAREER_BLOGS;
  } catch {
    return INITIAL_CAREER_BLOGS;
  }
}

function saveStoredBlogs(blogs: CareerBlog[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAREER_BLOGS_STORAGE_KEY, JSON.stringify(blogs));
  } catch (e) {
    console.warn('LocalStorage save career blogs error:', e);
  }
}

export function getStoredCategories(): CareerBlogCategory[] {
  if (typeof window === 'undefined') return DEFAULT_CAREER_CATEGORIES;
  try {
    const raw = localStorage.getItem(CAREER_CATEGORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CAREER_CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CAREER_CATEGORIES));
      return DEFAULT_CAREER_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CAREER_CATEGORIES;
  } catch {
    return DEFAULT_CAREER_CATEGORIES;
  }
}

function saveStoredCategories(cats: CareerBlogCategory[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CAREER_CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
  } catch (e) {
    console.warn('LocalStorage save career categories error:', e);
  }
}

// ----------------------------------------------------------------------
// CATEGORY OPERATIONS
// ----------------------------------------------------------------------

export async function getCareerBlogCategories(): Promise<CareerBlogCategory[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('career_blog_categories')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as CareerBlogCategory[];
      }
    } catch (e) {
      console.warn('Supabase getCareerBlogCategories fallback:', e);
    }
  }
  return getStoredCategories();
}

export const getAllCareerBlogCategories = getCareerBlogCategories;

export async function createCareerBlogCategory(name: string, description?: string): Promise<CareerBlogCategory> {
  const slug = generateBlogSlug(name);
  const newCat: CareerBlogCategory = {
    id: `cat-${Date.now()}`,
    name,
    slug,
    description: description || '',
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('career_blog_categories')
        .insert({
          name,
          slug,
          description: description || '',
        })
        .select()
        .single();
      if (!error && data) {
        return data as CareerBlogCategory;
      }
    } catch (e) {
      console.warn('Supabase createCareerBlogCategory fallback:', e);
    }
  }

  const existing = getStoredCategories();
  const updated = [...existing, newCat];
  saveStoredCategories(updated);
  return newCat;
}

export async function updateCareerBlogCategory(
  id: string,
  name: string,
  description?: string
): Promise<CareerBlogCategory> {
  const slug = generateBlogSlug(name);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('career_blog_categories')
        .update({ name, slug, description: description || '' })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return data as CareerBlogCategory;
      }
    } catch (e) {
      console.warn('Supabase updateCareerBlogCategory fallback:', e);
    }
  }

  const existing = getStoredCategories();
  const updated = existing.map((c) => (c.id === id ? { ...c, name, slug, description: description || '' } : c));
  saveStoredCategories(updated);
  const found = updated.find((c) => c.id === id);
  if (!found) throw new Error('Category not found');
  return found;
}

export async function deleteCareerBlogCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('career_blog_categories')
        .delete()
        .eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase deleteCareerBlogCategory fallback:', e);
    }
  }

  const existing = getStoredCategories();
  const updated = existing.filter((c) => c.id !== id);
  saveStoredCategories(updated);
  return true;
}

// ----------------------------------------------------------------------
// PUBLIC BLOG OPERATIONS
// ----------------------------------------------------------------------

export async function getPublishedCareerBlogs(
  language: BlogLanguage,
  page = 1,
  limit = 9,
  category?: string,
  searchQuery?: string
): Promise<{ blogs: CareerBlog[]; total: number; totalPages: number }> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('career_blogs')
        .select('*', { count: 'exact' })
        .eq('language', language)
        .eq('published', true)
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('published_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (searchQuery && searchQuery.trim()) {
        query = query.ilike('title', `%${searchQuery.trim()}%`);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!error && data) {
        const total = count || data.length;
        return {
          blogs: data as CareerBlog[],
          total,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }
    } catch (e) {
      console.warn('Supabase getPublishedCareerBlogs fallback:', e);
    }
  }

  // Fallback to local storage
  let items = getStoredBlogs().filter(
    (b) => b.language === language && b.published && !b.is_deleted
  );

  if (category && category !== 'all') {
    items = items.filter(
      (b) => b.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    items = items.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  items.sort(
    (a, b) =>
      new Date(b.published_at || b.created_at).getTime() -
      new Date(a.published_at || a.created_at).getTime()
  );

  const total = items.length;
  const startIndex = (page - 1) * limit;
  const paginated = items.slice(startIndex, startIndex + limit);

  return {
    blogs: paginated,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getCareerBlogBySlug(
  language: BlogLanguage,
  slug: string
): Promise<CareerBlog | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('career_blogs')
        .select('*')
        .eq('language', language)
        .eq('slug', slug)
        .eq('published', true)
        .or('is_deleted.is.null,is_deleted.eq.false')
        .maybeSingle();

      if (!error && data) {
        return data as CareerBlog;
      }
    } catch (e) {
      console.warn('Supabase getCareerBlogBySlug fallback:', e);
    }
  }

  const items = getStoredBlogs();
  const match = items.find(
    (b) => b.language === language && b.slug === slug && b.published && !b.is_deleted
  );
  return match || null;
}

export async function getRelatedCareerBlogs(
  currentBlogId: string,
  language: BlogLanguage,
  category: string,
  limit = 3
): Promise<CareerBlog[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('career_blogs')
        .select('*')
        .eq('language', language)
        .eq('published', true)
        .eq('category', category)
        .neq('id', currentBlogId)
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data as CareerBlog[];
      }
    } catch (e) {
      console.warn('Supabase getRelatedCareerBlogs fallback:', e);
    }
  }

  const items = getStoredBlogs().filter(
    (b) =>
      b.language === language &&
      b.published &&
      !b.is_deleted &&
      b.id !== currentBlogId
  );

  const categoryMatches = items.filter((b) => b.category === category);
  if (categoryMatches.length >= limit) {
    return categoryMatches.slice(0, limit);
  }

  const others = items.filter((b) => b.category !== category);
  return [...categoryMatches, ...others].slice(0, limit);
}

// ----------------------------------------------------------------------
// ADMIN BLOG OPERATIONS
// ----------------------------------------------------------------------

export async function getAllCareerBlogsAdmin(
  language?: BlogLanguage,
  searchQuery?: string,
  category?: string,
  status?: 'all' | 'published' | 'draft'
): Promise<CareerBlog[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('career_blogs')
        .select('*')
        .or('is_deleted.is.null,is_deleted.eq.false')
        .order('created_at', { ascending: false });

      if (language) {
        query = query.eq('language', language);
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (status === 'published') {
        query = query.eq('published', true);
      } else if (status === 'draft') {
        query = query.eq('published', false);
      }

      if (searchQuery && searchQuery.trim()) {
        query = query.ilike('title', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data as CareerBlog[];
      }
    } catch (e) {
      console.warn('Supabase getAllCareerBlogsAdmin fallback:', e);
    }
  }

  let items = getStoredBlogs().filter((b) => !b.is_deleted);

  if (language) {
    items = items.filter((b) => b.language === language);
  }

  if (category && category !== 'all') {
    items = items.filter((b) => b.category.toLowerCase() === category.toLowerCase());
  }

  if (status === 'published') {
    items = items.filter((b) => b.published);
  } else if (status === 'draft') {
    items = items.filter((b) => !b.published);
  }

  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    items = items.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q)
    );
  }

  return items.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getCareerBlogByIdAdmin(id: string): Promise<CareerBlog | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('career_blogs')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) {
        return data as CareerBlog;
      }
    } catch (e) {
      console.warn('Supabase getCareerBlogByIdAdmin fallback:', e);
    }
  }

  const items = getStoredBlogs();
  const match = items.find((b) => b.id === id);
  return match || null;
}

export async function createCareerBlog(formData: CareerBlogFormData): Promise<CareerBlog> {
  const slug = formData.slug?.trim() || generateBlogSlug(formData.title);
  const tagsArray = formData.tags
    ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const now = new Date().toISOString();
  const publishedAt = formData.published_at || (formData.published ? now : now);

  const payload: CareerBlog = {
    id: `blog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    language: formData.language,
    title: formData.title.trim(),
    slug,
    excerpt: formData.excerpt?.trim() || '',
    content: formData.content || '',
    category: formData.category || 'Career Guidance',
    tags: tagsArray,
    author_name: formData.author_name?.trim() || 'Prince Sharma',
    image_url: formData.image_url || null,
    meta_title: formData.meta_title?.trim() || formData.title.trim(),
    meta_description: formData.meta_description?.trim() || formData.excerpt?.trim() || '',
    focus_keyword: formData.focus_keyword?.trim() || null,
    canonical_url: formData.canonical_url?.trim() || null,
    published: Boolean(formData.published),
    is_deleted: false,
    published_at: publishedAt,
    created_at: now,
    updated_at: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('career_blogs')
        .insert({
          language: payload.language,
          title: payload.title,
          slug: payload.slug,
          excerpt: payload.excerpt,
          content: payload.content,
          category: payload.category,
          tags: payload.tags,
          author_name: payload.author_name,
          image_url: payload.image_url,
          meta_title: payload.meta_title,
          meta_description: payload.meta_description,
          focus_keyword: payload.focus_keyword,
          canonical_url: payload.canonical_url,
          published: payload.published,
          published_at: payload.published_at,
        })
        .select()
        .single();

      if (!error && data) {
        return data as CareerBlog;
      }
      if (error) {
        console.error('Supabase createCareerBlog error:', error);
      }
    } catch (e) {
      console.warn('Supabase createCareerBlog fallback:', e);
    }
  }

  // Local Storage Save
  const items = getStoredBlogs();
  const updated = [payload, ...items];
  saveStoredBlogs(updated);
  return payload;
}

export async function updateCareerBlog(
  id: string,
  formData: Partial<CareerBlogFormData>
): Promise<CareerBlog> {
  const now = new Date().toISOString();
  const tagsArray = typeof formData.tags === 'string'
    ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : undefined;

  const updates: Record<string, any> = {
    updated_at: now,
  };

  if (formData.language !== undefined) updates.language = formData.language;
  if (formData.title !== undefined) updates.title = formData.title.trim();
  if (formData.slug !== undefined) updates.slug = formData.slug.trim();
  if (formData.excerpt !== undefined) updates.excerpt = formData.excerpt.trim();
  if (formData.content !== undefined) updates.content = formData.content;
  if (formData.category !== undefined) updates.category = formData.category;
  if (tagsArray !== undefined) updates.tags = tagsArray;
  if (formData.author_name !== undefined) updates.author_name = formData.author_name.trim();
  if (formData.image_url !== undefined) updates.image_url = formData.image_url;
  if (formData.meta_title !== undefined) updates.meta_title = formData.meta_title.trim();
  if (formData.meta_description !== undefined) updates.meta_description = formData.meta_description.trim();
  if (formData.focus_keyword !== undefined) updates.focus_keyword = formData.focus_keyword.trim();
  if (formData.canonical_url !== undefined) updates.canonical_url = formData.canonical_url.trim();
  if (formData.published !== undefined) {
    updates.published = formData.published;
    if (formData.published) {
      updates.published_at = formData.published_at || now;
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('career_blogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return data as CareerBlog;
      }
      if (error) {
        console.error('Supabase updateCareerBlog error:', error);
      }
    } catch (e) {
      console.warn('Supabase updateCareerBlog fallback:', e);
    }
  }

  const items = getStoredBlogs();
  const existing = items.find((b) => b.id === id);
  if (!existing) throw new Error('Blog not found');

  const updatedBlog: CareerBlog = {
    ...existing,
    ...updates,
    tags: tagsArray !== undefined ? tagsArray : existing.tags,
  };

  const updatedList = items.map((b) => (b.id === id ? updatedBlog : b));
  saveStoredBlogs(updatedList);
  return updatedBlog;
}

export async function deleteCareerBlog(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('career_blogs')
        .update({ is_deleted: true, published: false })
        .eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase deleteCareerBlog fallback:', e);
    }
  }

  const items = getStoredBlogs();
  const updated = items.filter((b) => b.id !== id);
  saveStoredBlogs(updated);
  return true;
}

export async function toggleCareerBlogPublish(id: string): Promise<CareerBlog> {
  const current = await getCareerBlogByIdAdmin(id);
  if (!current) throw new Error('Blog not found');

  const newPublished = !current.published;
  return updateCareerBlog(id, {
    published: newPublished,
    published_at: newPublished ? new Date().toISOString() : current.published_at,
  });
}

export async function getCareerBlogStats(): Promise<CareerBlogStats> {
  const allBlogs = await getAllCareerBlogsAdmin();

  const hindiBlogs = allBlogs.filter((b) => b.language === 'hindi');
  const englishBlogs = allBlogs.filter((b) => b.language === 'english');

  const byCategory: Record<string, number> = {};
  allBlogs.forEach((b) => {
    byCategory[b.category] = (byCategory[b.category] || 0) + 1;
  });

  return {
    total: allBlogs.length,
    published: allBlogs.filter((b) => b.published).length,
    drafts: allBlogs.filter((b) => !b.published).length,
    hindiTotal: hindiBlogs.length,
    hindiPublished: hindiBlogs.filter((b) => b.published).length,
    hindiDrafts: hindiBlogs.filter((b) => !b.published).length,
    englishTotal: englishBlogs.length,
    englishPublished: englishBlogs.filter((b) => b.published).length,
    englishDrafts: englishBlogs.filter((b) => !b.published).length,
    byCategory,
  };
}
