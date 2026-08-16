import { handleCors, sendJson } from './_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: `Method ${req.method} Not Allowed. Use GET.` });
  }

  return sendJson(res, 200, {
    status: 'ok',
    environment: process.env.NODE_ENV || 'production',
    time: new Date().toISOString(),
  });
}
