import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required for AI features.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION_EXTRACTION = `
You are the Official Government Information Extractor for "All India Sarkari" (allindiasarkari.com).

YOUR STRICT MISSION:
Extract only information explicitly stated in the provided text.
Do not infer, guess, calculate, complete, or invent dates, numbers, fees, eligibility, vacancies, URLs, salary, selection process, or other factual details.

CRITICAL EXTRACTION RULES:
1. ABSENT INFORMATION: If any specific field (e.g. exam date, fee amount, vacancy count, age limit, website URL) is not explicitly mentioned in the source text, leave the string completely EMPTY ("").
2. NEVER INVENT: Never write placeholders like "To Be Announced", "N/A", "Check Notification", or imaginary numbers/dates. Leave it empty ("").
3. ACCURACY: Extract exact names, advertisement numbers, qualifications, and date strings as stated in the text.
4. LINKS: Extract only URLs explicitly written in the text. Do not invent domains or URLs.
`;

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health & AI Status Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/ai/status', (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      configured: hasKey,
      model: 'gemini-3.7-flash',
      platform: 'All India Sarkari AI Editorial Assistant',
    });
  });

  // =========================================================================
  // WORKFLOW 1: EXTRACT ONLY FACTS FROM RAW OFFICIAL INFORMATION
  // =========================================================================
  app.post('/api/ai/extract-official-information', async (req, res) => {
    try {
      const { postType, officialSourceUrl, officialNotificationTitle, rawOfficialInformation } = req.body;

      if (!rawOfficialInformation && !officialNotificationTitle) {
        return res.status(400).json({ error: 'Please provide official notification title or raw text.' });
      }

      const ai = getAI();

      const prompt = `
Extract structured government notification facts from the provided inputs.

INPUTS:
- Post Type: ${postType || 'recruitment'}
- Official Source URL: ${officialSourceUrl || ''}
- Official Notification Title: ${officialNotificationTitle || ''}
- Raw Official Information:
${rawOfficialInformation || 'No additional raw text provided.'}

EXTRACTION INSTRUCTIONS:
- Extract ONLY information explicitly present in the provided text.
- If any detail is absent, set the field to an empty string "".
- Do not infer, assume, or invent any fact.

Return a JSON object conforming to this schema:
{
  "basic": {
    "organization": "string or empty",
    "notificationName": "string or empty",
    "postName": "string or empty",
    "advertisementNumber": "string or empty",
    "totalVacancies": "string or empty",
    "postWiseVacancies": "string or empty"
  },
  "dates": {
    "notificationDate": "string or empty",
    "applicationStartDate": "string or empty",
    "applicationLastDate": "string or empty",
    "feePaymentLastDate": "string or empty",
    "correctionWindow": "string or empty",
    "examDate": "string or empty",
    "admitCardDate": "string or empty",
    "resultDate": "string or empty"
  },
  "fee": {
    "general": "string or empty",
    "obcEws": "string or empty",
    "scSt": "string or empty",
    "female": "string or empty",
    "pwd": "string or empty",
    "other": "string or empty",
    "paymentMode": "string or empty"
  },
  "age": {
    "minimumAge": "string or empty",
    "maximumAge": "string or empty",
    "cutOffDate": "string or empty",
    "ageRelaxation": "string or empty"
  },
  "eligibility": {
    "educationalQualification": "string or empty",
    "experience": "string or empty",
    "nationality": "string or empty",
    "otherConditions": "string or empty"
  },
  "recruitment": {
    "selectionProcess": "string or empty",
    "examPattern": "string or empty",
    "physicalEligibility": "string or empty",
    "salaryPayScale": "string or empty"
  },
  "application": {
    "howToApply": "string or empty",
    "requiredDocuments": "string or empty",
    "importantInstructions": "string or empty"
  },
  "links": {
    "applyOnline": "string (URL only if present in text) or empty",
    "officialNotification": "string (URL only if present in text) or empty",
    "officialWebsite": "string (URL only if present in text or officialSourceUrl) or empty",
    "otherOfficialLinks": "string or empty"
  }
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION_EXTRACTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              basic: {
                type: Type.OBJECT,
                properties: {
                  organization: { type: Type.STRING },
                  notificationName: { type: Type.STRING },
                  postName: { type: Type.STRING },
                  advertisementNumber: { type: Type.STRING },
                  totalVacancies: { type: Type.STRING },
                  postWiseVacancies: { type: Type.STRING },
                },
              },
              dates: {
                type: Type.OBJECT,
                properties: {
                  notificationDate: { type: Type.STRING },
                  applicationStartDate: { type: Type.STRING },
                  applicationLastDate: { type: Type.STRING },
                  feePaymentLastDate: { type: Type.STRING },
                  correctionWindow: { type: Type.STRING },
                  examDate: { type: Type.STRING },
                  admitCardDate: { type: Type.STRING },
                  resultDate: { type: Type.STRING },
                },
              },
              fee: {
                type: Type.OBJECT,
                properties: {
                  general: { type: Type.STRING },
                  obcEws: { type: Type.STRING },
                  scSt: { type: Type.STRING },
                  female: { type: Type.STRING },
                  pwd: { type: Type.STRING },
                  other: { type: Type.STRING },
                  paymentMode: { type: Type.STRING },
                },
              },
              age: {
                type: Type.OBJECT,
                properties: {
                  minimumAge: { type: Type.STRING },
                  maximumAge: { type: Type.STRING },
                  cutOffDate: { type: Type.STRING },
                  ageRelaxation: { type: Type.STRING },
                },
              },
              eligibility: {
                type: Type.OBJECT,
                properties: {
                  educationalQualification: { type: Type.STRING },
                  experience: { type: Type.STRING },
                  nationality: { type: Type.STRING },
                  otherConditions: { type: Type.STRING },
                },
              },
              recruitment: {
                type: Type.OBJECT,
                properties: {
                  selectionProcess: { type: Type.STRING },
                  examPattern: { type: Type.STRING },
                  physicalEligibility: { type: Type.STRING },
                  salaryPayScale: { type: Type.STRING },
                },
              },
              application: {
                type: Type.OBJECT,
                properties: {
                  howToApply: { type: Type.STRING },
                  requiredDocuments: { type: Type.STRING },
                  importantInstructions: { type: Type.STRING },
                },
              },
              links: {
                type: Type.OBJECT,
                properties: {
                  applyOnline: { type: Type.STRING },
                  officialNotification: { type: Type.STRING },
                  officialWebsite: { type: Type.STRING },
                  otherOfficialLinks: { type: Type.STRING },
                },
              },
            },
            required: ['basic', 'dates', 'fee', 'age', 'eligibility', 'recruitment', 'application', 'links'],
          },
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');

      // Server-side validation & sanitize empty strings
      const sanitizeObj = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return {};
        const result: Record<string, any> = {};
        for (const [key, val] of Object.entries(obj)) {
          if (typeof val === 'string') {
            const clean = val.trim();
            // Remove any legacy placeholders if model produced them
            if (clean.toLowerCase().includes('to be announced') || clean.toLowerCase().includes('verify in official')) {
              result[key] = '';
            } else {
              result[key] = clean;
            }
          } else if (typeof val === 'object' && val !== null) {
            result[key] = sanitizeObj(val);
          } else {
            result[key] = '';
          }
        }
        return result;
      };

      const cleanData = sanitizeObj(parsed);

      // Add user-provided inputs if missing in extraction
      if (!cleanData.basic.notificationName && officialNotificationTitle) {
        cleanData.basic.notificationName = officialNotificationTitle.trim();
      }
      if (!cleanData.links.officialWebsite && officialSourceUrl) {
        cleanData.links.officialWebsite = officialSourceUrl.trim();
      }

      // Count extracted vs missing fields
      let extractedCount = 0;
      let missingCount = 0;
      const countFields = (obj: any) => {
        for (const val of Object.values(obj)) {
          if (typeof val === 'string') {
            if (val.trim()) extractedCount++;
            else missingCount++;
          } else if (typeof val === 'object' && val !== null) {
            countFields(val);
          }
        }
      };
      countFields(cleanData);

      const responsePayload = {
        extractedData: {
          postType: postType || 'recruitment',
          officialSourceUrl: officialSourceUrl || '',
          officialNotificationTitle: officialNotificationTitle || '',
          rawOfficialInformation: rawOfficialInformation || '',
          basic: cleanData.basic || {},
          dates: cleanData.dates || {},
          fee: cleanData.fee || {},
          age: cleanData.age || {},
          eligibility: cleanData.eligibility || {},
          recruitment: cleanData.recruitment || {},
          application: cleanData.application || {},
          links: cleanData.links || {},
        },
        metadata: {
          extractedFieldsCount: extractedCount,
          missingFieldsCount: missingCount,
          extractionNotice: 'AI organizes information from the text you provide. Review all details against the official source before publishing.',
        },
      };

      return res.json(responsePayload);
    } catch (err: any) {
      console.error('Error extracting official information:', err);
      return res.status(500).json({ error: err.message || 'Failed to extract official information' });
    }
  });

  // =========================================================================
  // WORKFLOW 2: GENERATE ARTICLE FROM APPROVED FACTUAL INFORMATION ONLY
  // =========================================================================
  app.post('/api/ai/generate-from-approved-facts', async (req, res) => {
    try {
      const { approvedInfo } = req.body;
      if (!approvedInfo) {
        return res.status(400).json({ error: 'Missing approved factual information' });
      }

      const ai = getAI();

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

      // Filter important links to remove any empty or dummy URLs
      if (Array.isArray(parsed.importantLinks)) {
        parsed.importantLinks = parsed.importantLinks.filter(
          (l: any) => l.url && l.url.trim() && l.url !== '#' && l.url !== 'https://' && l.url !== 'http://'
        );
      }

      return res.json(parsed);
    } catch (err: any) {
      console.error('Error generating article from approved facts:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate article from approved facts' });
    }
  });

  // =========================================================================
  // LEGACY / DIRECT GENERATORS
  // =========================================================================
  app.post('/api/ai/generate-draft', async (req, res) => {
    try {
      const { facts } = req.body;
      if (!facts) {
        return res.status(400).json({ error: 'Missing facts parameter' });
      }

      const ai = getAI();

      const prompt = `
Generate a comprehensive, high-quality Government Article based on the following verified facts:

Post Type: ${facts.postType || 'recruitment'}
Organization / Board: ${facts.organization || 'Government Department'}
Post / Scheme Name: ${facts.postName || 'Recruitment'}
Total Vacancies / Scope: ${facts.totalVacancies || ''}
Official Portal URL: ${facts.officialWebsite || ''}
State / Region: ${facts.state || 'All India / Central'}
Important Dates: ${JSON.stringify(facts.importantDates || {})}
Eligibility / Qualification: ${facts.eligibilityQualification || ''}
Age Limit: ${facts.ageLimit || ''}
Application Fee / Assistance: ${facts.applicationFee || ''}
Salary / Pay Scale: ${facts.salaryPayScale || ''}
Selection Process: ${facts.selectionProcess || ''}
Additional Notes / Notification Text:
${facts.rawNotesOrNotificationText || ''}

Language Preference: ${facts.languageStyle || 'english'}

MANDATE: Only use facts present in the data. If a specific metric is absent, omit it instead of inventing fake numbers or placeholders.

Return the response as a JSON object matching this schema:
{
  "title": "Clear, CTR-optimized SEO Title (60-80 chars)",
  "slug": "url-friendly-slug-lowercase",
  "excerpt": "Compelling 2-sentence summary for preview cards",
  "metaDescription": "Optimized meta description between 150 and 160 characters",
  "keywords": ["5 to 8 relevant keywords"],
  "htmlContent": "Full structured HTML article with <h2>, <h3>, tables with clean classes, lists, and callouts",
  "importantLinks": [
    { "label": "Official Department Website", "url": "url" }
  ],
  "faqs": [
    { "question": "Question?", "answer": "Factual answer backed by verified facts." }
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

      const jsonText = response.text?.trim() || '{}';
      const parsed = JSON.parse(jsonText);
      return res.json(parsed);
    } catch (err: any) {
      console.error('Error generating AI draft:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate AI draft' });
    }
  });

  // Generate Outline Only
  app.post('/api/ai/generate-outline', async (req, res) => {
    try {
      const { facts } = req.body;
      const ai = getAI();

      const prompt = `
Generate a structured article outline and list of recommended section headings for:
Post Type: ${facts?.postType || 'recruitment'}
Title / Topic: ${facts?.postName || 'Government Recruitment'}
Organization: ${facts?.organization || 'Department'}

Provide the outline as a JSON object with:
- headings: array of section heading strings
- outlineText: formatted summary description of what each section covers
- recommendedStructure: recommended HTML wireframe snippet
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
              headings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              outlineText: { type: Type.STRING },
              recommendedStructure: { type: Type.STRING },
            },
            required: ['headings', 'outlineText', 'recommendedStructure'],
          },
        },
      });

      const jsonText = response.text?.trim() || '{}';
      return res.json(JSON.parse(jsonText));
    } catch (err: any) {
      console.error('Error generating AI outline:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate outline' });
    }
  });

  // Generate SEO Meta Package (Title, Slug, Excerpt, Meta Description, Keywords)
  app.post('/api/ai/generate-seo', async (req, res) => {
    try {
      const { title, content, postType, organization } = req.body;
      const ai = getAI();

      const prompt = `
Generate optimized SEO metadata for this Sarkari article:
Current Title / Topic: ${title || 'Government Notification'}
Post Type: ${postType || 'recruitment'}
Organization: ${organization || ''}
Content Snippet: ${(content || '').slice(0, 1500)}

Requirements:
1. title: High-CTR, accurate title (60-80 chars) including Year 2026.
2. slug: Lowercase URL slug without special characters.
3. excerpt: 2-sentence summary (approx 120-150 chars) without inventing absent facts.
4. metaDescription: Strict length between 145 and 160 characters, containing main target search query.
5. keywords: 6-10 highly targeted comma-separated search terms.
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
            },
            required: ['title', 'slug', 'excerpt', 'metaDescription', 'keywords'],
          },
        },
      });

      const jsonText = response.text?.trim() || '{}';
      return res.json(JSON.parse(jsonText));
    } catch (err: any) {
      console.error('Error generating SEO:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate SEO' });
    }
  });

  // Generate FAQ Section & Schema Items
  app.post('/api/ai/generate-faqs', async (req, res) => {
    try {
      const { title, content, postType } = req.body;
      const ai = getAI();

      const prompt = `
Generate 4-6 high-value, realistic FAQs for candidates searching about:
Title: ${title}
Post Type: ${postType || 'recruitment'}
Article Content: ${(content || '').slice(0, 2000)}

MANDATE: Only answer questions that have factual backing in the article content. Do not invent numbers or dates.
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
            required: ['faqs'],
          },
        },
      });

      const jsonText = response.text?.trim() || '{}';
      return res.json(JSON.parse(jsonText));
    } catch (err: any) {
      console.error('Error generating FAQs:', err);
      return res.status(500).json({ error: err.message || 'Failed to generate FAQs' });
    }
  });

  // Improve & Polish Existing Content
  app.post('/api/ai/improve-content', async (req, res) => {
    try {
      const { htmlContent, instruction } = req.body;
      if (!htmlContent) {
        return res.status(400).json({ error: 'Missing htmlContent parameter' });
      }

      const ai = getAI();

      const prompt = `
Review and improve the following Sarkari article HTML content.

Specific Instruction: ${instruction || 'Format with clear headings, responsive tables, bullet lists, fix grammar, and make it look professional while keeping all factual data intact.'}

Existing HTML Content:
${htmlContent}

Requirements:
1. Preserve all existing factual details (numbers, dates, names, URLs). Do not invent new facts.
2. Clean up awkward wording, grammar mistakes, and raw formatting.
3. Structure tables inside <div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs"> wrappers.
4. Return valid HTML in 'improvedHtml' and a short 1-sentence 'summaryOfChanges'.
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
              improvedHtml: { type: Type.STRING },
              summaryOfChanges: { type: Type.STRING },
            },
            required: ['improvedHtml', 'summaryOfChanges'],
          },
        },
      });

      const jsonText = response.text?.trim() || '{}';
      return res.json(JSON.parse(jsonText));
    } catch (err: any) {
      console.error('Error improving content:', err);
      return res.status(500).json({ error: err.message || 'Failed to improve content' });
    }
  });

  // Fact Completeness & Anti-Hallucination Audit
  app.post('/api/ai/check-facts', async (req, res) => {
    try {
      const { title, htmlContent, postType } = req.body;
      const ai = getAI();

      const prompt = `
Perform a fact completeness and structure audit on this government article:

Title: ${title}
Post Type: ${postType}
HTML Content:
${(htmlContent || '').slice(0, 4000)}

Evaluate:
1. Completeness Score (0-100) based on whether critical sections (Overview, Dates, Eligibility, Fee, How to Apply, Official Source) exist.
2. Missing Facts: What key information is absent (e.g. missing last date, missing application fee, missing educational criteria, missing official portal link).
3. Hallucination / Unverified Warnings: Any dubious claims or unverified text that needs admin verification.
4. Suggestions: 2-4 actionable editorial recommendations.
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
              completenessScore: { type: Type.INTEGER },
              status: {
                type: Type.STRING,
                enum: ['excellent', 'good', 'needs_attention'],
              },
              missingFacts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              hallucinationWarnings: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['completenessScore', 'status', 'missingFacts', 'hallucinationWarnings', 'suggestions'],
          },
        },
      });

      const jsonText = response.text?.trim() || '{}';
      return res.json(JSON.parse(jsonText));
    } catch (err: any) {
      console.error('Error checking facts:', err);
      return res.status(500).json({ error: err.message || 'Failed to audit facts' });
    }
  });

  // Vite middleware in dev / Static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`All India Sarkari Server running on http://localhost:${PORT}`);
  });
}

startServer();
