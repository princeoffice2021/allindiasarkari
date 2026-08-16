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
    const { title, content, postType, organization } = body || {};

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'allindiasarkari-ai' } },
    });

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
    return sendJson(res, 200, JSON.parse(jsonText));
  } catch (err: any) {
    console.error('API Error in generate-seo:', err);
    return sendJson(res, 500, { error: err.message || 'Failed to generate SEO' });
  }
}
