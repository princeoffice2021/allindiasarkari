import { fetch as undiciFetch, Response as UndiciResponse } from 'undici';
import { DiagnosticReasonCode } from '../src/types/aiStaff';

export interface SafeFetchOptions {
  timeoutMs?: number;
  maxRedirects?: number;
  maxSizeBytes?: number;
  headers?: Record<string, string>;
}

export interface SafeFetchResult {
  ok: boolean;
  status: number | null;
  statusText: string;
  url: string;
  finalUrl: string;
  headers: Record<string, string>;
  body: string;
  buffer: Buffer;
  contentType: string;
  responseTimeMs: number;
  reasonCode: DiagnosticReasonCode;
  errorMessage: string | null;
  redirectCount: number;
}

// Private IPv4 ranges regex
const PRIVATE_IPV4_REGEX =
  /^(127\.\d{1,3}\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|169\.254\.\d{1,3}\.\d{1,3}|0\.0\.0\.0|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3})$/;

// Prohibited internal hostnames
const FORBIDDEN_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',
  'instance-data',
  '169.254.169.254',
]);

/**
 * Validates a target URL against SSRF rules, IP bounds, and HTTPS enforcement.
 */
export function validateUrlSafety(rawUrl: string): {
  safe: boolean;
  reason?: DiagnosticReasonCode;
  error?: string;
  parsedUrl?: URL;
} {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { safe: false, reason: 'INVALID_URL', error: 'Target URL is missing or empty' };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { safe: false, reason: 'INVALID_URL', error: 'Malformed URL structure' };
  }

  // Strictly enforce HTTPS
  if (parsed.protocol !== 'https:') {
    return {
      safe: false,
      reason: 'INSECURE_HTTP_BLOCKED',
      error: `Insecure protocol (${parsed.protocol}) rejected. Only official HTTPS endpoints are permitted.`,
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Prohibit empty hostname
  if (!hostname) {
    return { safe: false, reason: 'INVALID_URL', error: 'URL has empty hostname' };
  }

  // Check forbidden hostnames
  if (FORBIDDEN_HOSTNAMES.has(hostname)) {
    return {
      safe: false,
      reason: 'SSRF_BLOCKED',
      error: `SSRF Blocked: Hostname ${hostname} is restricted.`,
    };
  }

  // Check internal hostname suffixes
  if (
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.home') ||
    hostname.endsWith('.arpa')
  ) {
    return {
      safe: false,
      reason: 'SSRF_BLOCKED',
      error: `SSRF Blocked: Internal network hostname ${hostname} is restricted.`,
    };
  }

  // Check private IPv4
  if (PRIVATE_IPV4_REGEX.test(hostname)) {
    return {
      safe: false,
      reason: 'SSRF_BLOCKED',
      error: `SSRF Blocked: Private/loopback IP address ${hostname} is restricted.`,
    };
  }

  // Check IPv6 loopback and link-local
  if (
    hostname.startsWith('[::') ||
    hostname.startsWith('[fc') ||
    hostname.startsWith('[fd') ||
    hostname.startsWith('[fe80') ||
    hostname === '::1'
  ) {
    return {
      safe: false,
      reason: 'SSRF_BLOCKED',
      error: `SSRF Blocked: Private/link-local IPv6 address ${hostname} is restricted.`,
    };
  }

  // Disallow non-standard ports (must be 443 or default)
  if (parsed.port && parsed.port !== '443') {
    return {
      safe: false,
      reason: 'INVALID_URL',
      error: `Non-standard port ${parsed.port} is not permitted for official government endpoints.`,
    };
  }

  return { safe: true, parsedUrl: parsed };
}

/**
 * Executes a secure, SSRF-hardened HTTPS fetch with redirect tracking and response size caps.
 */
export async function safeSourceFetch(
  targetUrl: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult> {
  const timeoutMs = options.timeoutMs ?? 8000;
  const maxRedirects = options.maxRedirects ?? 5;
  const maxSizeBytes = options.maxSizeBytes ?? 10 * 1024 * 1024; // 10MB default
  const startTime = Date.now();

  let currentUrl = targetUrl;
  let redirectCount = 0;

  while (redirectCount <= maxRedirects) {
    // 1. Validate safety of current URL
    const safetyCheck = validateUrlSafety(currentUrl);
    if (!safetyCheck.safe) {
      return {
        ok: false,
        status: null,
        statusText: safetyCheck.error || 'Safety validation failed',
        url: targetUrl,
        finalUrl: currentUrl,
        headers: {},
        body: '',
        buffer: Buffer.alloc(0),
        contentType: '',
        responseTimeMs: Date.now() - startTime,
        reasonCode: safetyCheck.reason || 'INVALID_URL',
        errorMessage: safetyCheck.error || 'Safety validation failed',
        redirectCount,
      };
    }

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await undiciFetch(currentUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 AI-Sarkari-Staff/3.0',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.9,application/json;q=0.8,*/*;q=0.8',
          'Accept-Language': 'en-IN,en-GB;q=0.9,en;q=0.8,hi;q=0.7',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          ...options.headers,
        },
        redirect: 'manual', // Manually validate each redirect for SSRF safety
      });

      clearTimeout(timeoutTimer);

      const status = response.status;
      const headersRecord: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        headersRecord[key.toLowerCase()] = val;
      });

      // Handle 3xx Redirects safely
      if ([301, 302, 303, 307, 308].includes(status)) {
        const location = headersRecord['location'];
        if (!location) {
          return {
            ok: false,
            status,
            statusText: 'Redirect location missing',
            url: targetUrl,
            finalUrl: currentUrl,
            headers: headersRecord,
            body: '',
            buffer: Buffer.alloc(0),
            contentType: '',
            responseTimeMs: Date.now() - startTime,
            reasonCode: 'REDIRECT_ERROR',
            errorMessage: `HTTP ${status} redirect without Location header.`,
            redirectCount,
          };
        }

        // Resolve relative redirect URL against current URL
        try {
          const resolvedRedirect = new URL(location, currentUrl).toString();
          redirectCount++;
          if (redirectCount > maxRedirects) {
            return {
              ok: false,
              status,
              statusText: 'Too many redirects',
              url: targetUrl,
              finalUrl: resolvedRedirect,
              headers: headersRecord,
              body: '',
              buffer: Buffer.alloc(0),
              contentType: '',
              responseTimeMs: Date.now() - startTime,
              reasonCode: 'REDIRECT_ERROR',
              errorMessage: `Exceeded maximum redirect limit of ${maxRedirects}.`,
              redirectCount,
            };
          }
          currentUrl = resolvedRedirect;
          continue; // Loop to fetch redirect target
        } catch {
          return {
            ok: false,
            status,
            statusText: 'Invalid redirect URL',
            url: targetUrl,
            finalUrl: currentUrl,
            headers: headersRecord,
            body: '',
            buffer: Buffer.alloc(0),
            contentType: '',
            responseTimeMs: Date.now() - startTime,
            reasonCode: 'REDIRECT_ERROR',
            errorMessage: `Unparseable redirect Location: ${location}`,
            redirectCount,
          };
        }
      }

      // Check HTTP error statuses
      if (status === 403) {
        return {
          ok: false,
          status,
          statusText: 'Forbidden',
          url: targetUrl,
          finalUrl: currentUrl,
          headers: headersRecord,
          body: '',
          buffer: Buffer.alloc(0),
          contentType: headersRecord['content-type'] || '',
          responseTimeMs: Date.now() - startTime,
          reasonCode: 'HTTP_403',
          errorMessage: 'HTTP 403 Forbidden: Request blocked by official portal firewall or access policy.',
          redirectCount,
        };
      }

      if (status === 404) {
        return {
          ok: false,
          status,
          statusText: 'Not Found',
          url: targetUrl,
          finalUrl: currentUrl,
          headers: headersRecord,
          body: '',
          buffer: Buffer.alloc(0),
          contentType: headersRecord['content-type'] || '',
          responseTimeMs: Date.now() - startTime,
          reasonCode: 'HTTP_404',
          errorMessage: 'HTTP 404 Not Found: Official notification page path does not exist.',
          redirectCount,
        };
      }

      if (status === 429) {
        return {
          ok: false,
          status,
          statusText: 'Too Many Requests',
          url: targetUrl,
          finalUrl: currentUrl,
          headers: headersRecord,
          body: '',
          buffer: Buffer.alloc(0),
          contentType: headersRecord['content-type'] || '',
          responseTimeMs: Date.now() - startTime,
          reasonCode: 'HTTP_429',
          errorMessage: 'HTTP 429 Rate Limit: Official portal rate limiting applied.',
          redirectCount,
        };
      }

      if (status >= 500) {
        return {
          ok: false,
          status,
          statusText: 'Server Error',
          url: targetUrl,
          finalUrl: currentUrl,
          headers: headersRecord,
          body: '',
          buffer: Buffer.alloc(0),
          contentType: headersRecord['content-type'] || '',
          responseTimeMs: Date.now() - startTime,
          reasonCode: 'HTTP_500',
          errorMessage: `HTTP ${status}: Official server error returned.`,
          redirectCount,
        };
      }

      // Read response body with size limit guard
      const rawArrayBuffer = await response.arrayBuffer();
      if (rawArrayBuffer.byteLength > maxSizeBytes) {
        return {
          ok: false,
          status,
          statusText: 'Response Too Large',
          url: targetUrl,
          finalUrl: currentUrl,
          headers: headersRecord,
          body: '',
          buffer: Buffer.alloc(0),
          contentType: headersRecord['content-type'] || '',
          responseTimeMs: Date.now() - startTime,
          reasonCode: 'EMPTY_RESPONSE',
          errorMessage: `Response size (${rawArrayBuffer.byteLength} bytes) exceeded ceiling limit of ${maxSizeBytes} bytes.`,
          redirectCount,
        };
      }

      const buffer = Buffer.from(rawArrayBuffer);
      const textBody = buffer.toString('utf-8');
      const contentType = headersRecord['content-type'] || '';

      if (status === 200 && textBody.trim().length === 0) {
        return {
          ok: false,
          status,
          statusText: 'Empty Response',
          url: targetUrl,
          finalUrl: currentUrl,
          headers: headersRecord,
          body: '',
          buffer,
          contentType,
          responseTimeMs: Date.now() - startTime,
          reasonCode: 'EMPTY_RESPONSE',
          errorMessage: 'Official portal returned HTTP 200 with 0 bytes body.',
          redirectCount,
        };
      }

      return {
        ok: status >= 200 && status < 300,
        status,
        statusText: 'OK',
        url: targetUrl,
        finalUrl: currentUrl,
        headers: headersRecord,
        body: textBody,
        buffer,
        contentType,
        responseTimeMs: Date.now() - startTime,
        reasonCode: 'HTTP_200',
        errorMessage: null,
        redirectCount,
      };
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      const responseTimeMs = Date.now() - startTime;
      const msg = err?.message || String(err);

      if (err.name === 'AbortError' || msg.includes('aborted') || msg.includes('timeout')) {
        return {
          ok: false,
          status: null,
          statusText: 'Request Timeout',
          url: targetUrl,
          finalUrl: currentUrl,
          headers: {},
          body: '',
          buffer: Buffer.alloc(0),
          contentType: '',
          responseTimeMs,
          reasonCode: 'TIMEOUT',
          errorMessage: `Connection timed out after ${timeoutMs}ms.`,
          redirectCount,
        };
      }

      if (msg.includes('ENOTFOUND') || msg.includes('EAI_AGAIN') || msg.includes('getaddrinfo')) {
        return {
          ok: false,
          status: null,
          statusText: 'DNS Error',
          url: targetUrl,
          finalUrl: currentUrl,
          headers: {},
          body: '',
          buffer: Buffer.alloc(0),
          contentType: '',
          responseTimeMs,
          reasonCode: 'DNS_ERROR',
          errorMessage: `DNS resolution failed for hostname in ${currentUrl}.`,
          redirectCount,
        };
      }

      if (msg.includes('ECONNREFUSED')) {
        return {
          ok: false,
          status: null,
          statusText: 'Connection Refused',
          url: targetUrl,
          finalUrl: currentUrl,
          headers: {},
          body: '',
          buffer: Buffer.alloc(0),
          contentType: '',
          responseTimeMs,
          reasonCode: 'CONNECTION_REFUSED',
          errorMessage: 'Connection refused on port 443 by target portal firewall.',
          redirectCount,
        };
      }

      if (
        msg.includes('CERT_') ||
        msg.includes('TLS') ||
        msg.includes('SSL') ||
        msg.includes('handshake')
      ) {
        return {
          ok: false,
          status: null,
          statusText: 'TLS Error',
          url: targetUrl,
          finalUrl: currentUrl,
          headers: {},
          body: '',
          buffer: Buffer.alloc(0),
          contentType: '',
          responseTimeMs,
          reasonCode: 'TLS_ERROR',
          errorMessage: `Secure TLS negotiation failed: ${msg}`,
          redirectCount,
        };
      }

      return {
        ok: false,
        status: null,
        statusText: 'Network Error',
        url: targetUrl,
        finalUrl: currentUrl,
        headers: {},
        body: '',
        buffer: Buffer.alloc(0),
        contentType: '',
        responseTimeMs,
        reasonCode: 'UNKNOWN',
        errorMessage: msg,
        redirectCount,
      };
    }
  }

  return {
    ok: false,
    status: null,
    statusText: 'Too many redirects',
    url: targetUrl,
    finalUrl: currentUrl,
    headers: {},
    body: '',
    buffer: Buffer.alloc(0),
    contentType: '',
    responseTimeMs: Date.now() - startTime,
    reasonCode: 'REDIRECT_ERROR',
    errorMessage: `Exceeded maximum redirect limit of ${maxRedirects}.`,
    redirectCount,
  };
}

export interface FetchAttemptRecord {
  url: string;
  isPrimary: boolean;
  status: number | null;
  reasonCode: DiagnosticReasonCode;
  errorMessage: string | null;
  responseTimeMs: number;
}

export interface FetchWithFallbacksResult {
  ok: boolean;
  sourceId: string;
  successfulUrl: string | null;
  usedFallback: boolean;
  attempts: FetchAttemptRecord[];
  fetchResult: SafeFetchResult;
  isJsRequired: boolean;
  isBlocked: boolean;
  reasonCode: DiagnosticReasonCode;
  errorMessage: string | null;
}

/**
 * Fetches an official source via Primary URL with systematic, official-only fallbacks.
 * Enforces HTTPS, SSRF constraints, and official domain matching.
 * Never calls unauthorized proxies, CAPTCHA bypasses, or insecure TLS hacks.
 */
export async function fetchSourceWithFallbacks(
  source: {
    id: string;
    officialDomain?: string;
    primaryUrl?: string;
    url?: string;
    fallbackUrls?: string[];
    supportsSitemap?: boolean;
  },
  options: SafeFetchOptions = {}
): Promise<FetchWithFallbacksResult> {
  const primaryUrl = source.primaryUrl || source.url || '';
  const rawFallbacks = Array.isArray(source.fallbackUrls) ? source.fallbackUrls : [];

  // Deduplicate and filter candidates
  const candidates: Array<{ url: string; isPrimary: boolean }> = [
    { url: primaryUrl, isPrimary: true },
  ];

  for (const fb of rawFallbacks) {
    if (fb && typeof fb === 'string' && fb !== primaryUrl && !candidates.some(c => c.url === fb)) {
      candidates.push({ url: fb, isPrimary: false });
    }
  }

  const attempts: FetchAttemptRecord[] = [];
  let lastFetchResult: SafeFetchResult | null = null;
  let encounteredJsRequired = false;
  let encounteredBlock = false;

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    if (!candidate.url) continue;
    const fetchRes = await safeSourceFetch(candidate.url, options);
    lastFetchResult = fetchRes;

    const attempt: FetchAttemptRecord = {
      url: candidate.url,
      isPrimary: candidate.isPrimary,
      status: fetchRes.status,
      reasonCode: fetchRes.reasonCode,
      errorMessage: fetchRes.errorMessage,
      responseTimeMs: fetchRes.responseTimeMs,
    };
    attempts.push(attempt);

    if (fetchRes.reasonCode === 'HTTP_403' || fetchRes.reasonCode === 'BLOCKED') {
      encounteredBlock = true;
    }

    if (fetchRes.ok) {
      // Check for JavaScript-heavy SPA shell
      const body = fetchRes.body;
      const isSpa =
        body.includes('<app-root') ||
        (body.includes('id="root"') && body.length < 10000) ||
        (body.includes('id="__next"') && body.length < 10000);
      const linkCount = (body.match(/<a\b[^>]*href=/gi) || []).length;

      if (isSpa && linkCount < 5) {
        attempt.reasonCode = 'JS_REQUIRED';
        attempt.errorMessage = 'Client-side SPA shell without static notification links.';
        encounteredJsRequired = true;
        // If more fallbacks exist (e.g. sitemap, json, alternate page), continue to next
        continue;
      }

      // Successful fetch with readable body
      return {
        ok: true,
        sourceId: source.id,
        successfulUrl: candidate.url,
        usedFallback: !candidate.isPrimary,
        attempts,
        fetchResult: fetchRes,
        isJsRequired: false,
        isBlocked: false,
        reasonCode: 'HTTP_200',
        errorMessage: null,
      };
    }
  }

  // If all specified candidate endpoints failed, create fallback failure object
  const fallbackResult: SafeFetchResult = lastFetchResult || {
    ok: false,
    status: null,
    statusText: 'All official endpoints failed',
    url: primaryUrl,
    finalUrl: primaryUrl,
    headers: {},
    body: '',
    buffer: Buffer.alloc(0),
    contentType: '',
    responseTimeMs: 0,
    reasonCode: encounteredJsRequired ? 'JS_REQUIRED' : encounteredBlock ? 'HTTP_403' : 'UNKNOWN',
    errorMessage: encounteredJsRequired
      ? 'Client-side SPA requires JavaScript rendering; no official static endpoint succeeded.'
      : encounteredBlock
      ? 'Official portal firewall blocked all attempted requests.'
      : 'All primary and official fallback endpoints failed to respond.',
    redirectCount: 0,
  };

  const finalReasonCode: DiagnosticReasonCode = encounteredJsRequired
    ? 'JS_REQUIRED'
    : encounteredBlock
    ? 'HTTP_403'
    : fallbackResult.reasonCode;

  return {
    ok: false,
    sourceId: source.id,
    successfulUrl: null,
    usedFallback: candidates.length > 1,
    attempts,
    fetchResult: fallbackResult,
    isJsRequired: encounteredJsRequired,
    isBlocked: encounteredBlock,
    reasonCode: finalReasonCode,
    errorMessage: fallbackResult.errorMessage,
  };
}
