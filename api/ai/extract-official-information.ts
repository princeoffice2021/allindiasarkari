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

const sanitizeObj = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return {};
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      const clean = val.trim();
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
    const { postType, officialSourceUrl, officialNotificationTitle, rawOfficialInformation } = body || {};

    if (!rawOfficialInformation && !officialNotificationTitle) {
      return sendJson(res, 400, { error: 'Please provide official notification title or raw notification text.' });
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'allindiasarkari-ai' } },
    });

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
    const cleanData = sanitizeObj(parsed);

    if (!cleanData.basic.notificationName && officialNotificationTitle) {
      cleanData.basic.notificationName = officialNotificationTitle.trim();
    }
    if (!cleanData.links.officialWebsite && officialSourceUrl) {
      cleanData.links.officialWebsite = officialSourceUrl.trim();
    }

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

    const result = {
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

    return sendJson(res, 200, result);
  } catch (err: any) {
    console.error('API Error in extract-official-information:', err);
    return sendJson(res, 500, { error: err.message || 'Failed to extract official information' });
  }
}
