import {
  AIArticleFacts,
  AIDraftResponse,
  AIOutlineResponse,
  AISEOResponse,
  AIFaqResponse,
  AIContentAuditResponse,
  AIImproveResponse,
  ApprovedOfficialInformation,
  ExtractOfficialInfoResponse,
} from '../types/ai';

export async function checkAIServiceStatus(): Promise<{ configured: boolean; model: string }> {
  try {
    const res = await fetch('/api/ai/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('AI status check failed:', e);
  }
  return { configured: false, model: 'gemini-3.7-flash' };
}

// 1. Extract structured official facts from raw notification text
export async function extractOfficialInformation(params: {
  postType: string;
  officialSourceUrl?: string;
  officialNotificationTitle?: string;
  rawOfficialInformation: string;
}): Promise<ExtractOfficialInfoResponse> {
  const res = await fetch('/api/ai/extract-official-information', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Information extraction failed with status ${res.status}`);
  }

  return await res.json();
}

// 2. Generate full article draft strictly from approved factual information
export async function generateFromApprovedFacts(params: {
  approvedInfo: ApprovedOfficialInformation;
}): Promise<AIDraftResponse> {
  const res = await fetch('/api/ai/generate-from-approved-facts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Article generation from approved facts failed with status ${res.status}`);
  }

  return await res.json();
}

// Legacy / Direct helpers
export async function generateAIDraft(facts: AIArticleFacts): Promise<AIDraftResponse> {
  const res = await fetch('/api/ai/generate-draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ facts }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `AI generation failed with status ${res.status}`);
  }

  return await res.json();
}

export async function generateAIOutline(facts: Partial<AIArticleFacts>): Promise<AIOutlineResponse> {
  const res = await fetch('/api/ai/generate-outline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ facts }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Outline generation failed with status ${res.status}`);
  }

  return await res.json();
}

export async function generateAISEO(params: {
  title: string;
  content: string;
  postType: string;
  organization?: string;
}): Promise<AISEOResponse> {
  const res = await fetch('/api/ai/generate-seo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `SEO generation failed with status ${res.status}`);
  }

  return await res.json();
}

export async function generateAIFAQs(params: {
  title: string;
  content: string;
  postType: string;
}): Promise<AIFaqResponse> {
  const res = await fetch('/api/ai/generate-faqs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `FAQ generation failed with status ${res.status}`);
  }

  return await res.json();
}

export async function improveAIContent(params: {
  htmlContent: string;
  instruction?: string;
}): Promise<AIImproveResponse> {
  const res = await fetch('/api/ai/improve-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Content improvement failed with status ${res.status}`);
  }

  return await res.json();
}

export async function auditAIFacts(params: {
  title: string;
  htmlContent: string;
  postType: string;
}): Promise<AIContentAuditResponse> {
  const res = await fetch('/api/ai/check-facts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Fact audit failed with status ${res.status}`);
  }

  return await res.json();
}
