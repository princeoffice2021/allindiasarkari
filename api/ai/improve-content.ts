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
Review and format government job & scheme article HTML content cleanly and professionally without modifying or inventing factual details.
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
    const { htmlContent, instruction } = body || {};

    if (!htmlContent) {
      return sendJson(res, 400, { error: 'Missing htmlContent parameter' });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'allindiasarkari-ai' } },
    });

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
    return sendJson(res, 200, JSON.parse(jsonText));
  } catch (err: any) {
    console.error('API Error in improve-content:', err);
    return sendJson(res, 500, { error: err.message || 'Failed to improve content' });
  }
}
