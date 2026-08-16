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
Audit government job & scheme article HTML content for factual completeness, missing dates, missing fee info, and potential hallucination risks.
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
    const { title, htmlContent, postType } = body || {};

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'allindiasarkari-ai' } },
    });

    const prompt = `
Perform a fact completeness and structure audit on this government article:

Title: ${title || 'Government Notification'}
Post Type: ${postType || 'recruitment'}
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
    return sendJson(res, 200, JSON.parse(jsonText));
  } catch (err: any) {
    console.error('API Error in check-facts:', err);
    return sendJson(res, 500, { error: err.message || 'Failed to audit facts' });
  }
}
