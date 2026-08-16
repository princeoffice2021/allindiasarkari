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
Generate an authoritative, well-structured, mobile-responsive HTML article based EXCLUSIVELY on the structured information provided by the editor.

CRITICAL SOURCE-OF-TRUTH RULES:
1. Only state facts that are present in the provided prompt.
2. If any detail is absent, omit it instead of inventing fake numbers or placeholders.
3. Structure HTML cleanly with <h2>, <h3>, tables, and lists.
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
    const facts = body?.facts || body;

    if (!facts) {
      return sendJson(res, 400, { error: 'Missing facts parameter' });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'allindiasarkari-ai' } },
    });

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
    return sendJson(res, 200, JSON.parse(jsonText));
  } catch (err: any) {
    console.error('API Error in generate-draft:', err);
    return sendJson(res, 500, { error: err.message || 'Failed to generate AI draft' });
  }
}
