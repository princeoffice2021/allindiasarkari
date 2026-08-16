import { handleCors, sendJson } from '../_utils';
import { isAIConfigured } from '../../src/server/aiEngine';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: `Method ${req.method} Not Allowed. Use GET.` });
  }

  const configured = isAIConfigured();

  return sendJson(res, 200, {
    status: 'ok',
    aiConfigured: configured,
    model: 'gemini-3.7-flash',
    platform: 'All India Sarkari AI Editorial Assistant',
    timestamp: new Date().toISOString(),
  });
}
