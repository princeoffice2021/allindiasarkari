import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import {
  StaffSource,
  AIDraft,
  StaffActivityLog,
  AIStaffSettings,
  ExtractedFacts,
  AIResearchBatch,
  DailyStaffReport,
  TopNewNotificationItem,
} from '../src/types/aiStaff';
import { CategoryType } from '../src/types';
import { getAdapterForSource, ParsedNotificationNotice } from './sourceAdapters';
import { fetchSourceWithFallbacks } from './sourceFetcher';
import { checkDuplicateSignal, computeNoticeFingerprint, canonicalizeUrl } from './sourceDeduplication';
import { discoverSitemapNotices } from './sitemapDiscovery';

// Lazy Gemini client helper
export const GEMINI_ACTIVE_MODEL = 'gemini-3.6-flash';

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Global In-Memory Fingerprint Cache to protect against repeat API calls and redundant scans
const processedNoticeFingerprints = new Set<string>();

export interface ScanResult {
  sourcesChecked: number;
  successfulSources: number;
  failedSources: number;
  newNoticesFound: number;
  newDraftsCreated: number;
  duplicatesSkipped: number;
  needsVerificationCount: number;
  errorsEncountered: number;
  batchId: string;
  batchName: string;
  batchDate: string;
  newDrafts: AIDraft[];
  newLogs: StaffActivityLog[];
  batchSummary: AIResearchBatch;
  dailyReport: DailyStaffReport;
}

// Compute title similarity (simple token Jaccard)
function getTitleSimilarity(a: string, b: string): number {
  const cleanA = new Set(a.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2));
  const cleanB = new Set(b.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2));
  if (cleanA.size === 0 || cleanB.size === 0) return 0;
  let intersection = 0;
  cleanA.forEach(item => {
    if (cleanB.has(item)) intersection++;
  });
  const union = new Set([...cleanA, ...cleanB]).size;
  return intersection / union;
}

// Get IST Date string and human formatted time
function getISTDateStrings() {
  const now = new Date();
  const istDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now); // YYYY-MM-DD

  const istTime = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(now);

  return { istDate, istTime };
}

export async function executeSourceScan(
  sources: StaffSource[],
  existingDrafts: AIDraft[],
  existingPostsSlugsAndTitles: { title: string; slug: string; officialSourceUrl?: string }[],
  settings: AIStaffSettings
): Promise<ScanResult> {
  const { istDate, istTime } = getISTDateStrings();
  const batchId = `batch-${istDate}-${Date.now().toString(36).slice(-4)}`;
  const batchName = `${istDate} Daily Research Batch`;

  const failedSourcesList: { sourceName: string; error: string }[] = [];
  const topNotificationsList: TopNewNotificationItem[] = [];

  let healthySourcesCount = 0;
  let degradedSourcesCount = 0;
  let failedSourcesCount = 0;
  let jsRequiredSourcesCount = 0;
  let updatedNotificationsCount = 0;

  const result: ScanResult = {
    sourcesChecked: 0,
    successfulSources: 0,
    failedSources: 0,
    newNoticesFound: 0,
    newDraftsCreated: 0,
    duplicatesSkipped: 0,
    needsVerificationCount: 0,
    errorsEncountered: 0,
    batchId,
    batchName,
    batchDate: istDate,
    newDrafts: [],
    newLogs: [],
    batchSummary: {
      id: batchId,
      batchName,
      date: istDate,
      timestamp: new Date().toISOString(),
      timezone: settings.timezone || 'Asia/Kolkata',
      sourcesChecked: 0,
      successfulSources: 0,
      failedSources: 0,
      newNotificationsFound: 0,
      draftsCreated: 0,
      duplicatesDetected: 0,
      needsVerification: 0,
      pendingReview: 0,
      status: 'IN_PROGRESS',
      errors: [],
    },
    dailyReport: {
      id: `report-${batchId}`,
      batchId,
      date: istDate,
      title: `AI SARKARI STAFF - Daily Report (${istDate})`,
      scanTimeIST: istTime,
      timezone: settings.timezone || 'Asia/Kolkata',
      sourcesChecked: 0,
      successful: 0,
      failed: 0,
      healthySourcesCount: 0,
      degradedSourcesCount: 0,
      failedSourcesCount: 0,
      jsRequiredSourcesCount: 0,
      newNotifications: 0,
      updatedNotifications: 0,
      draftsCreated: 0,
      duplicates: 0,
      needsVerification: 0,
      pendingReview: 0,
      lastScanIST: `${istTime} IST`,
      summaryNotes: 'Batch executed successfully. Drafts prepared for Admin Review.',
      topNotifications: [],
    },
  };

  if (!settings.enabled) {
    result.newLogs.push({
      id: `log-${Date.now()}-disabled`,
      timestamp: new Date().toISOString(),
      source: 'AI Staff',
      action: 'SCAN',
      result: 'AI Staff is currently DISABLED by Admin. Scan aborted.',
      status: 'INFO',
    });
    result.batchSummary.status = 'COMPLETED';
    return result;
  }

  // Sort by priority: CRITICAL first, then HIGH, then NORMAL, then LOW
  const priorityWeight: Record<string, number> = {
    CRITICAL: 4,
    HIGH: 3,
    NORMAL: 2,
    LOW: 1,
  };
  const activeSources = [...sources]
    .filter(s => s.active)
    .sort((a, b) => (priorityWeight[b.priority || 'NORMAL'] || 2) - (priorityWeight[a.priority || 'NORMAL'] || 2))
    .slice(0, settings.maxSourcesPerScan);

  for (const source of activeSources) {
    result.sourcesChecked++;
    const scanTimestamp = new Date().toISOString();
    const sourceStartTime = Date.now();

    try {
      // 1. Log scan initiation
      const targetUrl = source.primaryUrl || source.url || '';
      result.newLogs.push({
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: scanTimestamp,
        source: source.name,
        action: 'SCAN',
        result: `[${batchName}] Scanning portal (${source.priority || 'NORMAL'}): ${targetUrl}`,
        status: 'INFO',
      });

      // 2. Fetch page using secure HTTPS fetch with systematic primary + fallback resolution
      const fetchOutcome = await fetchSourceWithFallbacks(source, { timeoutMs: 8000 });
      const responseTimeMs = Date.now() - sourceStartTime;
      const responseStatus = fetchOutcome.fetchResult.status;
      source.lastHttpStatus = responseStatus;
      source.lastResponseTimeMs = responseTimeMs;
      source.lastChecked = new Date().toISOString();

      if (!fetchOutcome.ok) {
        result.failedSources++;
        result.errorsEncountered++;
        source.consecutiveFailures = (source.consecutiveFailures || 0) + 1;
        source.totalFailures = (source.totalFailures || 0) + 1;
        source.lastError = fetchOutcome.errorMessage || 'Official portal connection failed';

        if (fetchOutcome.isJsRequired || fetchOutcome.reasonCode === 'JS_REQUIRED') {
          source.healthStatus = 'JS_REQUIRED';
          source.requiresJs = true;
          source.failureReason = 'Client-side SPA shell. HTML contains no static links.';
          jsRequiredSourcesCount++;
          result.newLogs.push({
            id: `log-${Date.now()}-spa`,
            timestamp: new Date().toISOString(),
            source: source.name,
            action: 'DETECTION',
            result: `Portal is client-rendered SPA. Static scanner detected no static notification links.`,
            status: 'WARNING',
          });
        } else if (fetchOutcome.isBlocked || fetchOutcome.reasonCode === 'HTTP_403') {
          source.healthStatus = 'BLOCKED';
          source.isBlocked = true;
          source.failureReason = 'Portal firewall / domestic IP filter blocked connection.';
          failedSourcesCount++;
        } else if (fetchOutcome.reasonCode === 'TIMEOUT') {
          source.healthStatus = 'DEGRADED';
          source.failureReason = 'Official portal connection timed out after 8,000ms.';
          degradedSourcesCount++;
        } else {
          source.healthStatus = 'FAILED';
          source.failureReason = fetchOutcome.errorMessage || 'Connection failure';
          failedSourcesCount++;
        }

        failedSourcesList.push({ sourceName: source.name, error: source.failureReason || fetchOutcome.errorMessage || 'Failed' });
        result.newLogs.push({
          id: `log-${Date.now()}-err`,
          timestamp: new Date().toISOString(),
          source: source.name,
          action: 'ERROR',
          result: `Source unavailable (${targetUrl}): ${source.failureReason}. Scanning continues gracefully.`,
          status: 'WARNING',
          error: source.failureReason,
        });
        continue;
      }

      // Fetch succeeded
      result.successfulSources++;
      const html = fetchOutcome.fetchResult.body;
      const activeUrl = fetchOutcome.successfulUrl || targetUrl;

      source.lastSuccessful = new Date().toISOString();
      source.lastSuccessfulCheck = new Date().toISOString();
      source.consecutiveFailures = 0;
      source.lastError = null;
      source.failureReason = null;
      source.healthStatus = 'HEALTHY';
      healthySourcesCount++;

      // Content Hashing: Check if the source page has changed since last scan
      const pageHash = crypto.createHash('sha256').update(html).digest('hex');
      if (source.contentHash && source.contentHash === pageHash) {
        result.duplicatesSkipped++;
        result.newLogs.push({
          id: `log-${Date.now()}-unchanged`,
          timestamp: new Date().toISOString(),
          source: source.name,
          action: 'DETECTION',
          result: `Page content hash unchanged (${pageHash.substring(0, 8)}). No new notices published. Skipping parsing.`,
          status: 'SUCCESS',
        });
        continue;
      }
      source.contentHash = pageHash;

      // 3. Parse HTML using Isolated Source Adapter
      const adapter = getAdapterForSource(source, activeUrl, html);
      let parsedNotices = adapter.parse(source, html, activeUrl);

      // Fallback: If 0 notices found and sitemap is supported, check sitemap discovery
      if (parsedNotices.length === 0 && source.supportsSitemap) {
        try {
          const domain = source.officialDomain || new URL(activeUrl).hostname;
          const sitemapNotices = await discoverSitemapNotices(domain);
          if (sitemapNotices.length > 0) {
            for (const sm of sitemapNotices.slice(0, 5)) {
              parsedNotices.push({
                id: `sitemap-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                title: sm.title,
                url: sm.url,
                pdfUrl: sm.url.toLowerCase().endsWith('.pdf') ? sm.url : null,
                dateText: sm.publishedDate || null,
                advtNumber: null,
                categoryHint: source.category,
                snippet: `Discovered via official sitemap: ${sm.url}`,
                fingerprint: computeNoticeFingerprint({
                  title: sm.title,
                  url: sm.url,
                  pdfUrl: sm.url.toLowerCase().endsWith('.pdf') ? sm.url : null,
                  date: sm.publishedDate || null,
                }),
              });
            }
          }
        } catch {
          // Ignore sitemap fallback errors gracefully
        }
      }

      result.newLogs.push({
        id: `log-${Date.now()}-adapter`,
        timestamp: new Date().toISOString(),
        source: source.name,
        action: 'EXTRACTION',
        result: `Parsed using ${adapter.name}: Found ${parsedNotices.length} candidate notice item(s).`,
        status: 'INFO',
      });

      if (parsedNotices.length === 0) {
        result.newLogs.push({
          id: `log-${Date.now()}-nonew`,
          timestamp: new Date().toISOString(),
          source: source.name,
          action: 'DETECTION',
          result: `Official portal scanned. No new candidate notices found matching recruitment selectors.`,
          status: 'SUCCESS',
        });
        continue;
      }

      // Filter and limit candidates per source to prevent flood
      const uniqueNotices = parsedNotices.slice(0, 3);

      // Prepare existing records for multi-signal deduplication
      const existingRecords = [
        ...existingDrafts.map(d => ({
          url: d.sourceUrl,
          canonicalUrl: canonicalizeUrl(d.sourceUrl),
          advtNumber: d.notificationNumber,
          title: d.draftData.title,
          fingerprint: d.contentHash,
          sourceDomain: d.sourceDomain,
        })),
        ...existingPostsSlugsAndTitles.map(p => ({
          url: p.officialSourceUrl || '',
          canonicalUrl: canonicalizeUrl(p.officialSourceUrl || ''),
          title: p.title,
          fingerprint: '',
          sourceDomain: '',
        })),
      ];

      for (const notice of uniqueNotices) {
        result.newNoticesFound++;

        // Cache fingerprint check
        if (processedNoticeFingerprints.has(notice.fingerprint)) {
          result.duplicatesSkipped++;
          continue;
        }

        // 4. DUPLICATE & UPDATE DETECTION ACROSS MULTIPLE SIGNALS
        const dupCheck = checkDuplicateSignal(
          {
            url: notice.url,
            advtNumber: notice.advtNumber,
            title: notice.title,
            pdfUrl: notice.pdfUrl,
            publicationDate: notice.dateText,
            sourceDomain: source.officialDomain || new URL(activeUrl).hostname,
          },
          existingRecords
        );

        // If exact same item already exists unchanged:
        if (dupCheck.isDuplicate && dupCheck.matchedBy === 'FINGERPRINT') {
          result.duplicatesSkipped++;
          processedNoticeFingerprints.add(notice.fingerprint);
          continue;
        }

        let changeStatus: 'NEW' | 'UPDATED' = 'NEW';
        let diffSummary: string | undefined = undefined;

        if (dupCheck.isDuplicate) {
          changeStatus = 'UPDATED';
          diffSummary = `Notice update detected (${dupCheck.matchedBy}). Crucial date or PDF notice revised by official portal.`;
          updatedNotificationsCount++;
        }

        result.newLogs.push({
          id: `log-${Date.now()}-dup-clean`,
          timestamp: new Date().toISOString(),
          source: 'AI Staff',
          action: 'DUPLICATE_CHECK',
          result: `${changeStatus === 'UPDATED' ? 'Update detected' : 'New opportunity discovered'}: "${notice.title.substring(0, 50)}...". Proceeding with factual draft preparation.`,
          status: 'SUCCESS',
        });

        // 5. EXTRACT FACTS & PREPARE DRAFT (NEVER AUTO-PUBLISH)
        const draft = await generateFactualDraft(notice, source, batchId, istDate, changeStatus, diffSummary);
        if (draft.status === 'NEEDS_VERIFICATION') {
          result.needsVerificationCount++;
        }
        result.newDrafts.push(draft);
        result.newDraftsCreated++;
        source.discoveriesCount = (source.discoveriesCount || 0) + 1;
        source.lastDiscoveryDate = new Date().toISOString();
        processedNoticeFingerprints.add(notice.fingerprint);

        // Add to Top Notifications for Daily Report
        topNotificationsList.push({
          id: draft.id,
          title: notice.title,
          organization: source.name,
          category: source.category,
          detectedTime: `${istTime} IST`,
          officialSource: source.url,
          pdfAvailable: !!notice.pdfUrl,
          pdfUrl: notice.pdfUrl || null,
          verificationStatus: draft.status === 'NEEDS_VERIFICATION' ? 'NEEDS_VERIFICATION' : 'VERIFIED',
          changeStatus,
          extractionMode: draft.extractionMode,
        });

        result.newLogs.push({
          id: `log-${Date.now()}-draft`,
          timestamp: new Date().toISOString(),
          source: source.name,
          action: 'DRAFT',
          result: `Draft generated (${changeStatus}, mode: ${draft.extractionMode || 'DETERMINISTIC_FALLBACK'}): "${draft.draftData.title.substring(0, 60)}...". Added to [${batchName}] with status PENDING_REVIEW.`,
          status: 'SUCCESS',
        });
      }
    } catch (sourceErr: any) {
      result.failedSources++;
      result.errorsEncountered++;
      failedSourcesList.push({ sourceName: source.name, error: sourceErr.message });
      result.newLogs.push({
        id: `log-${Date.now()}-err`,
        timestamp: new Date().toISOString(),
        source: source.name,
        action: 'ERROR',
        result: `Error processing source ${source.name}: ${sourceErr.message}. Continuing with remaining sources.`,
        status: 'ERROR',
        error: sourceErr.message,
      });
    }
  }

  // Finalize batch summary and daily report
  result.batchSummary.sourcesChecked = result.sourcesChecked;
  result.batchSummary.successfulSources = result.successfulSources;
  result.batchSummary.failedSources = result.failedSources;
  result.batchSummary.newNotificationsFound = result.newNoticesFound;
  result.batchSummary.draftsCreated = result.newDraftsCreated;
  result.batchSummary.duplicatesDetected = result.duplicatesSkipped;
  result.batchSummary.needsVerification = result.needsVerificationCount;
  result.batchSummary.pendingReview = result.newDraftsCreated;
  result.batchSummary.status =
    result.failedSources > 0 && result.successfulSources > 0
      ? 'PARTIAL'
      : result.failedSources > 0 && result.successfulSources === 0
      ? 'FAILED'
      : 'COMPLETED';
  result.batchSummary.errors = failedSourcesList;

  result.dailyReport.sourcesChecked = result.sourcesChecked;
  result.dailyReport.successful = result.successfulSources;
  result.dailyReport.failed = result.failedSources;
  result.dailyReport.healthySourcesCount = healthySourcesCount;
  result.dailyReport.degradedSourcesCount = degradedSourcesCount;
  result.dailyReport.failedSourcesCount = failedSourcesCount;
  result.dailyReport.jsRequiredSourcesCount = jsRequiredSourcesCount;
  result.dailyReport.newNotifications = result.newNoticesFound;
  result.dailyReport.updatedNotifications = updatedNotificationsCount;
  result.dailyReport.draftsCreated = result.newDraftsCreated;
  result.dailyReport.duplicates = result.duplicatesSkipped;
  result.dailyReport.needsVerification = result.needsVerificationCount;
  result.dailyReport.pendingReview = result.newDraftsCreated;
  result.dailyReport.topNotifications = topNotificationsList.slice(0, 10);

  if (result.newNoticesFound === 0) {
    result.dailyReport.summaryNotes =
      'Daily scan completed. No new verified notifications detected today across active government portals.';
  } else {
    result.dailyReport.summaryNotes = `Daily scan completed. Discovered ${result.newDraftsCreated} actionable recruitment/exam drafts (${updatedNotificationsCount} updates, ${result.newDraftsCreated - updatedNotificationsCount} new). All prepared strictly in PENDING_REVIEW for editorial verification.`;
  }

  return result;
}

// Helper to generate factual draft either via Gemini or rule-based parser
async function generateFactualDraft(
  notice: ParsedNotificationNotice,
  source: StaffSource,
  batchId: string,
  batchDate: string,
  changeStatus: 'NEW' | 'UPDATED' = 'NEW',
  diffSummary?: string
): Promise<AIDraft> {
  const cleanTitle = notice.title.replace(/\s+/g, ' ').trim();
  const domain = new URL(source.url).hostname;
  const draftId = `draft-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Default facts
  let facts: ExtractedFacts = {
    recruitmentName: cleanTitle,
    organization: source.name,
    advtNumber: notice.advtNumber || 'Not specified in official notification',
    totalVacancies: 'Not specified in official notification',
    applicationStartDate: notice.dateText || 'Not specified in official notification',
    applicationEndDate: 'Not specified in official notification',
    examDate: 'Not specified in official notification',
    applicationFee: {
      general_obc_ews: 'As per official notification rules',
      sc_st_pwd: 'As per official notification rules',
      paymentMode: 'Online Net Banking / Debit Card / UPI',
    },
    ageLimit: {
      minimum: 'As per official notification',
      maximum: 'As per official notification',
      relaxation: 'Age relaxation applicable as per Government rules',
    },
    educationalQualification: 'Please refer to the official notification document for post-specific qualification criteria.',
    selectionProcess: [
      'Written Examination / Computer Based Test',
      'Document Verification',
      'Medical Examination (as applicable)',
    ],
    salaryPayScale: 'As per applicable Government Pay Matrix',
    howToApply: [
      `Visit the official website at ${domain}.`,
      'Navigate to the Recruitment / Announcements section.',
      'Carefully read the official advertisement document.',
      'Submit your application along with required documents before the closing date.',
    ],
    requiredDocuments: [
      'Valid Government Photo Identity Proof',
      'Educational Certificates and Marksheets',
      'Caste / Category Certificate (if applicable)',
      'Passport size photograph and signature',
    ],
    officialNotificationPdf: notice.pdfUrl || undefined,
    applyOnlineUrl: notice.url,
    officialWebsite: source.url,
    unverifiedFields: [],
    extractionMode: 'DETERMINISTIC_FALLBACK',
  };

  let extractionMode: 'AI_GENERATED' | 'DETERMINISTIC_FALLBACK' = 'DETERMINISTIC_FALLBACK';

  // Try Gemini if configured to extract facts from title/url
  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `You are a factual government research assistant for AllIndiaSarkari.com.
Official Notice Title: "${cleanTitle}"
Official Source: "${source.name}" (${source.url})
Official Link: "${notice.url}"
Department: "${source.department}"
State/Jurisdiction: "${source.state}"
Category: "${notice.categoryHint || source.category}"
Advertisement Number: "${notice.advtNumber || 'N/A'}"
Date: "${notice.dateText || 'N/A'}"

Extract facts and format a clean JSON object.
CRITICAL RULES:
1. NEVER invent or fabricate dates, vacancies, fees, salaries, or notification numbers.
2. If any piece of information is NOT strictly mentioned in the title/link, write "Not specified in official notification".
3. Return a valid JSON object matching the fields:
- recruitmentName
- organization
- advtNumber
- totalVacancies
- applicationStartDate
- applicationEndDate
- examDate
- feeGeneral
- feeReserved
- qualification
- unverifiedFields (array of string names of any fields that could not be determined with 100% certainty)`;

      const response = await ai.models.generateContent({
        model: GEMINI_ACTIVE_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        if (parsed.recruitmentName) facts.recruitmentName = parsed.recruitmentName;
        if (parsed.advtNumber && parsed.advtNumber !== 'Not specified in official notification') {
          facts.advtNumber = parsed.advtNumber;
        }
        if (parsed.totalVacancies && parsed.totalVacancies !== 'Not specified in official notification') {
          facts.totalVacancies = parsed.totalVacancies;
        }
        if (parsed.applicationStartDate && parsed.applicationStartDate !== 'Not specified in official notification') {
          facts.applicationStartDate = parsed.applicationStartDate;
        }
        if (parsed.applicationEndDate && parsed.applicationEndDate !== 'Not specified in official notification') {
          facts.applicationEndDate = parsed.applicationEndDate;
        }
        if (parsed.examDate && parsed.examDate !== 'Not specified in official notification') {
          facts.examDate = parsed.examDate;
        }
        if (parsed.qualification && parsed.qualification !== 'Not specified in official notification') {
          facts.educationalQualification = parsed.qualification;
        }
        if (Array.isArray(parsed.unverifiedFields)) {
          facts.unverifiedFields = parsed.unverifiedFields;
        }
        extractionMode = 'AI_GENERATED';
      }
    } catch (geminiErr: any) {
      console.warn('[AI Staff Scanner] Gemini extraction fallback (using deterministic extraction):', geminiErr?.message || geminiErr);
    }
  }

  facts.extractionMode = extractionMode;

  // Determine if this item needs special verification flag
  const needsVerification = facts.unverifiedFields.length > 3 || (!notice.pdfUrl && cleanTitle.length < 15);

  // Generate structured HTML content with standard AllIndiaSarkari tables
  const suggestedTitle = `${source.name}: ${cleanTitle} – Check Details & Official Notification`;
  const suggestedSlug =
    cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80) + `-${Date.now().toString().slice(-4)}`;

  const contentHtml = `<h2>${source.name} Official Recruitment Notice</h2>
<p>Official notification has been published by <strong>${source.department} (${source.name})</strong> regarding <strong>${facts.recruitmentName}</strong>. Candidates are advised to read the official notice thoroughly before proceeding.</p>

${diffSummary ? `<div class="my-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm"><strong>Update Notice:</strong> ${diffSummary}</div>` : ''}

<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
  <div class="bg-blue-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Recruitment Overview</div>
  <table class="w-full text-left text-xs sm:text-sm">
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Organization</th><td class="p-3">${facts.organization}</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Notice / Advt Number</th><td class="p-3 font-mono font-bold">${facts.advtNumber}</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Total Vacancies</th><td class="p-3 font-bold text-blue-900">${facts.totalVacancies}</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Scale of Pay</th><td class="p-3">${facts.salaryPayScale}</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Jurisdiction / Location</th><td class="p-3">${source.state}</td></tr>
  </table>
</div>

<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
  <div class="bg-slate-900 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider">Crucial Dates</div>
  <table class="w-full text-left text-xs sm:text-sm">
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Application Start Date</th><td class="p-3 font-semibold text-emerald-700">${facts.applicationStartDate}</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Application Closing Date</th><td class="p-3 font-semibold text-red-600">${facts.applicationEndDate}</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Examination Schedule</th><td class="p-3">${facts.examDate}</td></tr>
  </table>
</div>

<div class="my-6 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
  <div class="bg-amber-900 text-amber-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider">Application Fee</div>
  <table class="w-full text-left text-xs sm:text-sm">
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">General / OBC / EWS</th><td class="p-3">${facts.applicationFee.general_obc_ews}</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">SC / ST / PwD / Female</th><td class="p-3 font-bold text-emerald-700">${facts.applicationFee.sc_st_pwd}</td></tr>
    <tr class="border-b border-slate-200"><th class="p-3 bg-slate-50 font-bold">Payment Methods</th><td class="p-3">${facts.applicationFee.paymentMode}</td></tr>
  </table>
</div>

<h3>Eligibility Criteria & Educational Qualification</h3>
<p>${facts.educationalQualification}</p>

<h3>How to Apply Online</h3>
<ol>
${facts.howToApply.map(s => `  <li>${s}</li>`).join('\n')}
</ol>`;

  const importantLinks = [
    {
      label: 'Official Notification Notice Link',
      url: notice.url,
    },
    ...(notice.pdfUrl
      ? [
          {
            label: 'Download Official Notification PDF',
            url: notice.pdfUrl,
          },
        ]
      : []),
    {
      label: `Official Website (${domain})`,
      url: source.url,
    },
  ];

  return {
    id: draftId,
    batchId,
    batchDate,
    sourceId: source.id,
    sourceName: source.name,
    sourceUrl: notice.url,
    sourceDomain: domain,
    sourcePublicationDate: batchDate,
    sourceFetchedAt: new Date().toISOString(),
    notificationNumber: facts.advtNumber !== 'Not specified in official notification' ? facts.advtNumber : null,
    pdfUrl: notice.pdfUrl || null,
    status: needsVerification ? 'NEEDS_VERIFICATION' : 'PENDING_REVIEW', // ALWAYS PENDING_REVIEW or NEEDS_VERIFICATION! NEVER AUTO-PUBLISH
    confidenceScore: needsVerification ? 70 : 92,
    changeStatus,
    diffSummary,
    contentHash: notice.fingerprint,
    extractedFacts: facts,
    draftData: {
      title: suggestedTitle,
      shortDescription: `Official recruitment update from ${source.name}. Check latest vacancy details, crucial dates, and official notification link.`,
      category: notice.categoryHint || source.category,
      state: source.state,
      content: contentHtml,
      metaTitle: `${suggestedTitle.slice(0, 55)} | All India Sarkari`,
      metaDescription: `Official details for ${cleanTitle} released by ${source.name}. Check eligibility, dates, and direct links.`,
      keywords: [source.name, 'Sarkari Naukri', 'Official Notification', 'Recruitment 2026'],
      suggestedSlug,
      importantLinks,
      faqs: [
        {
          question: `Where can I download the official notification for ${cleanTitle}?`,
          answer: `You can access the official notification directly from ${source.name} official portal at ${domain}.`,
        },
      ],
    },
    adminEdited: false,
    extractionMode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
