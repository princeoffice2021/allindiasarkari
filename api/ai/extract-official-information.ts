import { handleCors, parseBody, sendJson, sendError } from '../_utils';
import { extractOfficialInformationEngine } from '../../src/server/aiEngine';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: `Method ${req.method} Not Allowed. This endpoint requires POST with JSON body.` });
  }

  try {
    const body = await parseBody(req);
    const result = await extractOfficialInformationEngine(body);
    return sendJson(res, 200, result);
  } catch (err: any) {
    console.error('API Error in extract-official-information:', err);
    return sendError(res, 500, err.message || 'Failed to extract official information');
  }
}
