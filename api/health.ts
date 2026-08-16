export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      return res.status(200).end();
    }
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'GET') {
    const errorResponse = { error: `Method ${req.method} Not Allowed. Use GET.` };
    res.setHeader('Content-Type', 'application/json');
    if (typeof res.status === 'function') {
      return res.status(405).json(errorResponse);
    }
    res.statusCode = 405;
    return res.end(JSON.stringify(errorResponse));
  }

  const responseData = {
    status: 'ok',
    environment: process.env.NODE_ENV || 'production',
    time: new Date().toISOString(),
  };

  res.setHeader('Content-Type', 'application/json');
  if (typeof res.status === 'function') {
    return res.status(200).json(responseData);
  }
  res.statusCode = 200;
  return res.end(JSON.stringify(responseData));
}
