import * as cheerio from 'cheerio';
import * as crypto from 'node:crypto';
import {
  StaffSource,
  SourceTestResult,
  SourceHealthStatus,
  SourceContentType,
  StructuredNoticeDiscovery,
} from '../src/types/aiStaff';
import { getAdapterForSource, toStructuredNoticeDiscovery } from './sourceAdapters';
import { fetchSourceWithFallbacks } from './sourceFetcher';

export async function testSingleSource(
  sourceOrUrl: StaffSource | string,
  providedUrl?: string
): Promise<SourceTestResult> {
  const url = typeof sourceOrUrl === 'string' ? sourceOrUrl : (providedUrl || sourceOrUrl.url);

  let domain = 'official.gov.in';
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = url;
  }

  const source: StaffSource = typeof sourceOrUrl === 'object' ? sourceOrUrl : {
    id: 'test-source',
    name: 'Diagnostic Source',
    organization: 'Official Government Portal',
    department: 'Government Portal',
    officialDomain: domain,
    primaryUrl: url,
    url,
    fallbackUrls: [],
    sourceType: 'Central Government',
    contentType: 'HTML_LIST',
    priority: 'NORMAL',
    jurisdiction: 'Central',
    state: 'Central',
    category: 'Sarkari Naukri',
    enabled: true,
    active: true,
    scanFrequency: 'daily',
    healthStatus: 'HEALTHY',
    lastChecked: null,
    lastSuccessful: null,
    lastSuccessfulCheck: null,
    lastChanged: null,
    failureCount: 0,
    consecutiveFailures: 0,
    totalFailures: 0,
    lastError: null,
    discoveriesCount: 0,
    scanSchedule: 'manual',
    createdAt: new Date().toISOString(),
    supportsPdf: true,
    supportsHtml: true,
    supportsRss: false,
    supportsJson: false,
    supportsSitemap: false,
    supportsApi: false,
    adapter: 'generic-html-adapter',
    verificationStatus: 'UNVERIFIED',
  };

  const startTime = Date.now();
  let httpStatus: number | null = null;
  let contentType = 'text/html';
  let pageTitle = '';
  let linksFoundCount = 0;
  let pdfLinksCount = 0;
  let potentialNotificationsCount = 0;
  let sampleItems: Array<{ title: string; url: string; pdfUrl?: string; dateText?: string }> = [];
  let discoveredNotices: StructuredNoticeDiscovery[] = [];
  let parserUsed = 'none';
  let requiresJs = false;
  let isBlocked = false;
  let healthStatus: SourceHealthStatus = 'HEALTHY';
  let detectedType: SourceContentType = source.contentType || 'HTML_LIST';
  let failureReason: string | null = null;
  let recommendations = '';

  // Execute secure HTTPS fetch with systematic primary + fallback resolution and SSRF protection
  const fetchOutcome = await fetchSourceWithFallbacks(source, { timeoutMs: 8000 });
  const responseTimeMs = Date.now() - startTime;
  const retryAttempts = fetchOutcome.attempts.length;
  httpStatus = fetchOutcome.fetchResult.status;
  contentType = fetchOutcome.fetchResult.contentType || 'text/html';
  const responseText = fetchOutcome.fetchResult.body;

  // 1. Check if fetch failed completely across primary & fallbacks
  if (!fetchOutcome.ok) {
    const errMsg = fetchOutcome.errorMessage || 'Network fetch failed';
    failureReason = errMsg;

    if (fetchOutcome.isBlocked || fetchOutcome.reasonCode === 'HTTP_403' || errMsg.includes('ECONNREFUSED')) {
      healthStatus = 'BLOCKED';
      isBlocked = true;
      recommendations = 'Connection blocked or restricted by portal firewall. Portal may restrict access to Indian domestic IP ranges.';
    } else if (fetchOutcome.isJsRequired || fetchOutcome.reasonCode === 'JS_REQUIRED') {
      requiresJs = true;
      detectedType = 'JS_HEAVY';
      healthStatus = 'JS_REQUIRED';
      parserUsed = 'js-heavy-spa-adapter';
      recommendations = 'Portal requires client-side JavaScript rendering or dedicated JSON API/RSS endpoint.';
    } else if (fetchOutcome.reasonCode === 'TIMEOUT') {
      healthStatus = responseTimeMs > 6000 ? 'DEGRADED' : 'FAILED';
      recommendations = 'Official government server did not respond within timeout window. Geo-throttling or heavy server load.';
    } else if (fetchOutcome.reasonCode === 'HTTP_404') {
      healthStatus = 'FAILED';
      recommendations = 'Official notification page path not found (HTTP 404). Verify official recruitment URL path.';
    } else {
      healthStatus = 'FAILED';
      recommendations = `Fetch error: ${errMsg}. Check domain name and HTTPS certificates.`;
    }

    return {
      sourceId: source.id,
      sourceName: source.name,
      domain,
      department: source.department,
      jurisdiction: source.jurisdiction,
      category: source.category,
      priority: source.priority,
      url: fetchOutcome.successfulUrl || url,
      httpStatus: httpStatus || null,
      responseTimeMs,
      contentType,
      detectedType: requiresJs ? 'JS_HEAVY' : 'UNKNOWN',
      pageTitle: requiresJs ? 'Single Page Application (JS Required)' : (isBlocked ? 'Access Blocked' : 'Connection Failed'),
      linksFoundCount: 0,
      pdfLinksCount: 0,
      potentialNotificationsCount: 0,
      sampleItems: [],
      discoveredNotices: [],
      newNoticesCount: 0,
      updatedNoticesCount: 0,
      unchangedNoticesCount: 0,
      duplicateNoticesCount: 0,
      lastSuccessfulFetch: source.lastSuccessfulCheck || null,
      retryAttempts,
      parserUsed,
      requiresJs,
      isBlocked,
      healthStatus,
      failureReason,
      recommendations,
    };
  }

  // 2. Check HTTP status blocks (403, 401)
  if (httpStatus === 403 || httpStatus === 401) {
    isBlocked = true;
    healthStatus = 'BLOCKED';
    failureReason = `HTTP ${httpStatus} Access Denied / WAF Firewall protection`;
    recommendations = 'Server has active WAF or geographic IP firewall filtering. Access requires domestic network route.';
    return {
      sourceId: source.id,
      sourceName: source.name,
      domain,
      department: source.department,
      jurisdiction: source.jurisdiction,
      category: source.category,
      priority: source.priority,
      url,
      httpStatus,
      responseTimeMs,
      contentType,
      detectedType: 'UNKNOWN',
      pageTitle: 'Access Blocked',
      linksFoundCount: 0,
      pdfLinksCount: 0,
      potentialNotificationsCount: 0,
      sampleItems: [],
      discoveredNotices: [],
      newNoticesCount: 0,
      updatedNoticesCount: 0,
      unchangedNoticesCount: 0,
      duplicateNoticesCount: 0,
      lastSuccessfulFetch: source.lastSuccessfulCheck || null,
      retryAttempts,
      parserUsed: 'none',
      requiresJs: false,
      isBlocked: true,
      healthStatus,
      failureReason,
      recommendations,
    };
  }

  // 3. Direct PDF Document Handling
  if (contentType.toLowerCase().includes('application/pdf') || url.toLowerCase().endsWith('.pdf')) {
    detectedType = 'PDF';
    healthStatus = 'PDF_ONLY';
    pdfLinksCount = 1;
    linksFoundCount = 1;
    potentialNotificationsCount = 1;

    const pdfNotice: StructuredNoticeDiscovery = {
      title: `${source.name} Official Notification PDF`,
      url,
      sourceName: source.name,
      officialDomain: domain,
      publishedDate: null,
      lastUpdatedDate: null,
      noticeType: source.category || 'Sarkari Naukri',
      category: source.category || 'Sarkari Naukri',
      department: source.department,
      jurisdiction: source.jurisdiction,
      stateCode: source.stateCode || (source.jurisdiction === 'Central' ? 'ALL' : 'IN'),
      stateName: source.stateName || source.state,
      isPdf: true,
      discoveredAt: new Date().toISOString(),
      fingerprint: crypto.createHash('sha256').update(`pdf:${url}`).digest('hex'),
      pdfUrl: url,
    };

    return {
      sourceId: source.id,
      sourceName: source.name,
      domain,
      department: source.department,
      jurisdiction: source.jurisdiction,
      category: source.category,
      priority: source.priority,
      url,
      httpStatus,
      responseTimeMs,
      contentType,
      detectedType,
      pageTitle: 'Direct Official PDF Document',
      linksFoundCount: 1,
      pdfLinksCount: 1,
      potentialNotificationsCount: 1,
      sampleItems: [{ title: pdfNotice.title, url, pdfUrl: url }],
      discoveredNotices: [pdfNotice],
      newNoticesCount: 1,
      updatedNoticesCount: 0,
      unchangedNoticesCount: 0,
      duplicateNoticesCount: 0,
      lastSuccessfulFetch: new Date().toISOString(),
      retryAttempts,
      parserUsed: 'direct-pdf-adapter',
      requiresJs: false,
      isBlocked: false,
      healthStatus,
      failureReason: null,
      recommendations: 'Official direct PDF notice. Preserved as primary official document link.',
    };
  }

  // 4. HTML / XML Parsing
  const html = responseText;
  const $ = cheerio.load(html);
  pageTitle = $('title').text().replace(/\s+/g, ' ').trim() || 'Official Portal';

  // Count links and PDFs in DOM
  $('a').each((_, a) => {
    linksFoundCount++;
    const href = $(a).attr('href') || '';
    if (
      href.toLowerCase().includes('.pdf') ||
      href.includes('Open_PDF') ||
      href.includes('FilesUploaded') ||
      href.toLowerCase().includes('download')
    ) {
      pdfLinksCount++;
    }
  });

  // Check for JavaScript-Heavy Single Page Applications (SPA)
  const isAngularOrReact =
    html.includes('<app-root') ||
    (html.includes('id="root"') && html.length < 10000) ||
    (html.includes('id="__next"') && html.length < 10000);

  if (isAngularOrReact && linksFoundCount < 5) {
    requiresJs = true;
    detectedType = 'JS_HEAVY';
    healthStatus = 'JS_REQUIRED';
    parserUsed = 'js-heavy-spa-adapter';
    failureReason = 'Client-side SPA (Angular app-root). HTML is an empty placeholder shell without static notice links.';
    recommendations = 'This portal requires browser execution or dedicated official API/RSS endpoints to read notices.';

    return {
      sourceId: source.id,
      sourceName: source.name,
      domain,
      department: source.department,
      jurisdiction: source.jurisdiction,
      category: source.category,
      priority: source.priority,
      url,
      httpStatus,
      responseTimeMs,
      contentType,
      detectedType,
      pageTitle,
      linksFoundCount,
      pdfLinksCount,
      potentialNotificationsCount: 0,
      sampleItems: [],
      discoveredNotices: [],
      newNoticesCount: 0,
      updatedNoticesCount: 0,
      unchangedNoticesCount: 0,
      duplicateNoticesCount: 0,
      lastSuccessfulFetch: source.lastSuccessfulCheck || null,
      retryAttempts,
      parserUsed,
      requiresJs: true,
      isBlocked: false,
      healthStatus,
      failureReason,
      recommendations,
    };
  }

  // 5. Select & Execute Adapter
  const adapter = getAdapterForSource(source, url, html);
  parserUsed = adapter.name;
  const parsedItems = adapter.parse(source, html, url);
  potentialNotificationsCount = parsedItems.length;

  discoveredNotices = parsedItems.map(p => toStructuredNoticeDiscovery(p, source));
  sampleItems = parsedItems.slice(0, 5).map(p => ({
    title: p.title,
    url: p.url,
    pdfUrl: p.pdfUrl || undefined,
    dateText: p.dateText || undefined,
  }));

  // 6. Deterministic Health Classification
  // Rule: HEALTHY only when:
  // 1. request succeeds (HTTP 200)
  // 2. useful content is extracted
  // 3. notice links can be identified
  // 4. parser returns structured discovery data
  if (potentialNotificationsCount >= 2 && (pdfLinksCount >= 1 || linksFoundCount >= 10)) {
    healthStatus = responseTimeMs > 6000 ? 'DEGRADED' : 'HEALTHY';
    detectedType = 'HTML_LIST';
    recommendations = 'Source is healthy and actively producing structured recruitment notices with verifiable links.';
  } else if (potentialNotificationsCount > 0) {
    healthStatus = 'PARTIAL';
    detectedType = 'HTML_LIST';
    recommendations = 'Notices were extracted, but fewer PDF or listing links than expected were found on page.';
  } else {
    // HTTP 200 succeeded, but 0 notices could be extracted
    healthStatus = 'PARTIAL';
    detectedType = 'HTML_DETAIL';
    failureReason = 'HTTP 200 OK received, but no recruitment notices matched portal selectors. Page may be intro splash, language gateway, or modified layout.';
    recommendations = 'Configure direct listing endpoint (e.g. /AllNotifications.aspx, /Whats-new) or inspect updated portal selectors.';
  }

  return {
    sourceId: source.id,
    sourceName: source.name,
    domain,
    department: source.department,
    jurisdiction: source.jurisdiction,
    category: source.category,
    priority: source.priority,
    url,
    httpStatus,
    responseTimeMs,
    contentType,
    detectedType,
    pageTitle,
    linksFoundCount,
    pdfLinksCount,
    potentialNotificationsCount,
    sampleItems,
    discoveredNotices,
    newNoticesCount: potentialNotificationsCount,
    updatedNoticesCount: 0,
    unchangedNoticesCount: 0,
    duplicateNoticesCount: 0,
    lastSuccessfulFetch: healthStatus === 'HEALTHY' || healthStatus === 'PARTIAL' ? new Date().toISOString() : (source.lastSuccessfulCheck || null),
    retryAttempts,
    parserUsed,
    requiresJs: false,
    isBlocked: false,
    healthStatus,
    failureReason: healthStatus === 'HEALTHY' ? null : failureReason,
    recommendations,
  };
}

export async function runFullSourceAudit(sources: StaffSource[]): Promise<{
  testedAt: string;
  totalSources: number;
  healthyCount: number;
  partialCount: number;
  degradedCount: number;
  failedCount: number;
  jsRequiredCount: number;
  blockedCount: number;
  unverifiedCount: number;
  totalNoticesDiscovered: number;
  totalPdfsFound: number;
  results: SourceTestResult[];
}> {
  const results: SourceTestResult[] = [];
  let healthyCount = 0;
  let partialCount = 0;
  let degradedCount = 0;
  let failedCount = 0;
  let jsRequiredCount = 0;
  let blockedCount = 0;
  let unverifiedCount = 0;
  let totalNoticesDiscovered = 0;
  let totalPdfsFound = 0;

  for (const source of sources) {
    try {
      const result = await testSingleSource(source);
      results.push(result);
      totalNoticesDiscovered += result.potentialNotificationsCount || 0;
      totalPdfsFound += result.pdfLinksCount || 0;

      if (result.healthStatus === 'HEALTHY') healthyCount++;
      else if (result.healthStatus === 'PARTIAL' || result.healthStatus === 'PDF_ONLY') partialCount++;
      else if (result.healthStatus === 'DEGRADED') degradedCount++;
      else if (result.healthStatus === 'JS_REQUIRED') jsRequiredCount++;
      else if (result.healthStatus === 'BLOCKED') blockedCount++;
      else if (result.healthStatus === 'UNVERIFIED') unverifiedCount++;
      else failedCount++;
    } catch (e: any) {
      failedCount++;
      let domain = 'official.gov.in';
      try {
        domain = new URL(source.url).hostname;
      } catch {
        domain = source.url;
      }

      results.push({
        sourceId: source.id,
        sourceName: source.name,
        domain,
        department: source.department,
        jurisdiction: source.jurisdiction,
        category: source.category,
        priority: source.priority,
        url: source.url,
        httpStatus: null,
        responseTimeMs: 0,
        contentType: 'unknown',
        detectedType: 'UNKNOWN',
        pageTitle: 'Audit Exception',
        linksFoundCount: 0,
        pdfLinksCount: 0,
        potentialNotificationsCount: 0,
        sampleItems: [],
        discoveredNotices: [],
        newNoticesCount: 0,
        updatedNoticesCount: 0,
        unchangedNoticesCount: 0,
        duplicateNoticesCount: 0,
        lastSuccessfulFetch: source.lastSuccessfulCheck || null,
        retryAttempts: 1,
        parserUsed: 'none',
        requiresJs: false,
        isBlocked: false,
        healthStatus: 'FAILED',
        failureReason: e.message || 'Fatal diagnostic failure',
        recommendations: 'Check server logs for diagnostic execution error.',
      });
    }
  }

  return {
    testedAt: new Date().toISOString(),
    totalSources: sources.length,
    healthyCount,
    partialCount,
    degradedCount,
    failedCount,
    jsRequiredCount,
    blockedCount,
    unverifiedCount,
    totalNoticesDiscovered,
    totalPdfsFound,
    results,
  };
}
