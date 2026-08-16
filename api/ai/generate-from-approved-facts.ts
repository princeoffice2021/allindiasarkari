import { GoogleGenAI, Type } from '@google/genai';

function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

async function parseBody(req: any): Promise<any> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return req.body;
      }
    }
    return req.body;
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk: any) => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve(data);
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res: any, status: number, data: any) {
  res.setHeader('Content-Type', 'application/json');
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

const SYSTEM_INSTRUCTION_APPROVED_FACTS = `
You are the Chief Editorial AI Assistant for "All India Sarkari" (allindiasarkari.com).

YOUR CORE MISSION:
Generate an authoritative, well-structured, mobile-responsive HTML article based EXCLUSIVELY on the approved structured information provided by the editor.

CRITICAL SOURCE-OF-TRUTH & COMPLIANCE RULES:
1. STRICT FACTUAL BOUNDARY: The approved structured information is the absolute factual source of truth. Do not introduce any specific fact that is absent from it (no invented dates, numbers, vacancy counts, fees, age limits, qualifications, salary, selection stages, or URLs).
2. ABSENT SECTIONS: If no approved information exists for a specific topic (e.g., no exam date, or no physical fitness criteria), OMIT that section or table row entirely. Do NOT output fake placeholders like "[TO BE ANNOUNCED]" or guess values.
3. STRUCTURE & FORMATTING:
   - Output clean semantic HTML (<h2>, <h3>, <p>, <ul>, <ol>, <table>).
   - Use clean, responsive table wrappers:
     <div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
       <div class="bg-blue-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">[SECTION TITLE]</div>
       <div class="overflow-x-auto">
         <table class="w-full text-left text-xs sm:text-sm">...</table>
       </div>
     </div>
   - Use ordered lists <ol> for application steps.
   - Use unordered lists <ul> for document checklists & eligibility details.
   - Include a candidate statutory notice blockquote:
     <blockquote class="my-4 rounded-xl border-l-4 border-amber-500 bg-amber-50/80 p-4 text-xs text-amber-950">...</blockquote>
4. IMPORTANT LINKS: Only include links that were explicitly supplied in the approved information. Never guess or create dummy URLs.
5. FAQS: Generate FAQs ONLY for questions where the answers are fully supported by approved facts. Do not invent answers to unsupported questions.
`;

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(200).end();
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: `Method ${req.method} Not Allowed. This endpoint requires POST with JSON body.` });
  }

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return sendJson(res, 500, {
        error: 'GEMINI_API_KEY is not configured on the server. Please set the GEMINI_API_KEY environment variable.',
      });
    }

    const body = await parseBody(req);
    const approvedInfo = body?.approvedInfo || body;

    if (!approvedInfo) {
      return sendJson(res, 400, { error: 'Missing approved factual information parameter' });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'allindiasarkari-ai' } },
    });

    const prompt = `
Generate a comprehensive, high-quality, strictly accurate Sarkari article based EXCLUSIVELY on this APPROVED FACTUAL INFORMATION:

Post Type: ${approvedInfo.postType || 'recruitment'}
Language Tone Style: ${approvedInfo.languageTone || 'professional_en_hi'}

=== APPROVED BASIC INFO ===
Organization: ${approvedInfo.basic?.organization || ''}
Notification Name: ${approvedInfo.basic?.notificationName || ''}
Post Name: ${approvedInfo.basic?.postName || ''}
Advt No: ${approvedInfo.basic?.advertisementNumber || ''}
Total Vacancies: ${approvedInfo.basic?.totalVacancies || ''}
Post-Wise Breakdown: ${approvedInfo.basic?.postWiseVacancies || ''}

=== APPROVED DATES ===
Notification Date: ${approvedInfo.dates?.notificationDate || ''}
Start Date: ${approvedInfo.dates?.applicationStartDate || ''}
Last Date: ${approvedInfo.dates?.applicationLastDate || ''}
Fee Last Date: ${approvedInfo.dates?.feePaymentLastDate || ''}
Correction Window: ${approvedInfo.dates?.correctionWindow || ''}
Exam Date: ${approvedInfo.dates?.examDate || ''}
Admit Card Date: ${approvedInfo.dates?.admitCardDate || ''}
Result Date: ${approvedInfo.dates?.resultDate || ''}

=== APPROVED APPLICATION FEE ===
General: ${approvedInfo.fee?.general || ''}
OBC / EWS: ${approvedInfo.fee?.obcEws || ''}
SC / ST: ${approvedInfo.fee?.scSt || ''}
Female: ${approvedInfo.fee?.female || ''}
PH / PwD: ${approvedInfo.fee?.pwd || ''}
Payment Mode: ${approvedInfo.fee?.paymentMode || ''}
Other Fee: ${approvedInfo.fee?.other || ''}

=== APPROVED AGE CRITERIA ===
Min Age: ${approvedInfo.age?.minimumAge || ''}
Max Age: ${approvedInfo.age?.maximumAge || ''}
Cut-off Date: ${approvedInfo.age?.cutOffDate || ''}
Age Relaxation: ${approvedInfo.age?.ageRelaxation || ''}

=== APPROVED ELIGIBILITY ===
Educational Qualification: ${approvedInfo.eligibility?.educationalQualification || ''}
Experience: ${approvedInfo.eligibility?.experience || ''}
Nationality: ${approvedInfo.eligibility?.nationality || ''}
Other Conditions: ${approvedInfo.eligibility?.otherConditions || ''}

=== APPROVED RECRUITMENT / EXAM ===
Selection Process: ${approvedInfo.recruitment?.selectionProcess || ''}
Exam Pattern: ${approvedInfo.recruitment?.examPattern || ''}
Physical Standards: ${approvedInfo.recruitment?.physicalEligibility || ''}
Salary / Pay Scale: ${approvedInfo.recruitment?.salaryPayScale || ''}

=== APPROVED APPLICATION INSTRUCTIONS ===
How to Apply Steps: ${approvedInfo.application?.howToApply || ''}
Required Documents: ${approvedInfo.application?.requiredDocuments || ''}
Important Instructions: ${approvedInfo.application?.importantInstructions || ''}

=== APPROVED LINKS ===
Apply Online Link: ${approvedInfo.links?.applyOnline || ''}
Official Notification PDF: ${approvedInfo.links?.officialNotification || ''}
Official Website: ${approvedInfo.links?.officialWebsite || ''}
Other Official Links: ${approvedInfo.links?.otherOfficialLinks || ''}

=== STATUTORY CITATION ===
Official Source Provided By Editor: ${approvedInfo.officialSourceUrl || 'Direct notification document'}

ARTICLE GENERATION MANDATES:
1. ONLY USE FACTS LISTED ABOVE. If a field is blank, omit it from the article or tables. Do not generate fake numbers or placeholders.
2. Structure HTML with <h2> and <h3> headings, responsive tables (<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">...</div>), ordered lists <ol> for application steps, and unordered lists <ul> for eligibility requirements.
3. Build the "Important Links" array using ONLY the non-empty approved links from above. If a link was not provided, do not include it.
4. Build FAQs ONLY for questions with clear factual answers supported by the approved information above. Do not invent generic fake answers.

Return the JSON object strictly matching this schema:
{
  "title": "Clear, CTR-optimized SEO Title (60-80 chars)",
  "slug": "url-friendly-slug-lowercase",
  "excerpt": "Compelling 2-sentence summary strictly based on approved facts",
  "metaDescription": "Optimized meta description (150-160 chars) matching approved facts",
  "keywords": ["5 to 8 relevant keywords"],
  "htmlContent": "Full structured HTML article with <h2>, <h3>, responsive tables, lists, and callouts",
  "importantLinks": [
    { "label": "Apply Online", "url": "url" }
  ],
  "faqs": [
    { "question": "Question?", "answer": "Factual answer backed by approved facts." }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_APPROVED_FACTS,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            slug: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            htmlContent: { type: Type.STRING },
            importantLinks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  url: { type: Type.STRING },
                },
                required: ['label', 'url'],
              },
            },
            faqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
                required: ['question', 'answer'],
              },
            },
          },
          required: ['title', 'slug', 'excerpt', 'metaDescription', 'keywords', 'htmlContent', 'importantLinks', 'faqs'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');

    if (Array.isArray(parsed.importantLinks)) {
      parsed.importantLinks = parsed.importantLinks.filter(
        (l: any) => l.url && l.url.trim() && l.url !== '#' && l.url !== 'https://' && l.url !== 'http://'
      );
    }

    return sendJson(res, 200, parsed);
  } catch (err: any) {
    console.error('API Error in generate-from-approved-facts:', err);
    return sendJson(res, 500, { error: err.message || 'Failed to generate article from approved facts' });
  }
}
