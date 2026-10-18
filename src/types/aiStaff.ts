import { CategoryType } from '../types';

export type SourceType =
  | 'Central Government'
  | 'State Government'
  | 'Recruitment Boards'
  | 'UPSC'
  | 'SSC'
  | 'Railways'
  | 'Banking'
  | 'Defence'
  | 'Police'
  | 'Teaching'
  | 'Universities'
  | 'Exams'
  | 'Admit Cards'
  | 'Results'
  | 'Answer Keys'
  | 'Government Schemes'
  | 'Admissions'
  | 'Government Notifications';

export type SourceHealthStatus =
  | 'HEALTHY'
  | 'PARTIAL'
  | 'FAILED'
  | 'JS_REQUIRED'
  | 'PDF_ONLY'
  | 'BLOCKED'
  | 'INVALID_URL'
  | 'DEGRADED'
  | 'EMPTY_NOTICES'
  | 'UNVERIFIED';

export type DeterministicSourceStatus =
  | 'HEALTHY'
  | 'PARTIAL'
  | 'JS_REQUIRED'
  | 'BLOCKED'
  | 'DEGRADED'
  | 'FAILED'
  | 'UNVERIFIED';

export interface SourceStatusMetrics {
  total: number;
  active: number;
  healthy: number;
  partial: number;
  jsRequired: number;
  blocked: number;
  degraded: number;
  failed: number;
  unverified: number;
  isReconciled: boolean;
}

export function getDeterministicStatus(source: StaffSource): DeterministicSourceStatus {
  if (source.verificationStatus === 'UNVERIFIED' && !source.lastHttpStatus) {
    return 'UNVERIFIED';
  }
  if (source.healthStatus === 'HEALTHY') return 'HEALTHY';
  if (source.healthStatus === 'PARTIAL' || source.healthStatus === 'PDF_ONLY') return 'PARTIAL';
  if (source.healthStatus === 'JS_REQUIRED') return 'JS_REQUIRED';
  if (source.healthStatus === 'BLOCKED') return 'BLOCKED';
  if (source.healthStatus === 'DEGRADED') return 'DEGRADED';
  if (
    source.healthStatus === 'FAILED' ||
    source.healthStatus === 'INVALID_URL' ||
    source.healthStatus === 'EMPTY_NOTICES'
  ) {
    return 'FAILED';
  }
  if (source.healthStatus === 'UNVERIFIED') return 'UNVERIFIED';
  return 'DEGRADED';
}

export function computeSourceMetrics(sources: StaffSource[]): SourceStatusMetrics {
  let healthy = 0;
  let partial = 0;
  let jsRequired = 0;
  let blocked = 0;
  let degraded = 0;
  let failed = 0;
  let unverified = 0;
  let active = 0;

  for (const s of sources) {
    if (s.active) active++;
    const status = getDeterministicStatus(s);
    switch (status) {
      case 'HEALTHY':
        healthy++;
        break;
      case 'PARTIAL':
        partial++;
        break;
      case 'JS_REQUIRED':
        jsRequired++;
        break;
      case 'BLOCKED':
        blocked++;
        break;
      case 'DEGRADED':
        degraded++;
        break;
      case 'FAILED':
        failed++;
        break;
      case 'UNVERIFIED':
        unverified++;
        break;
    }
  }

  const sum = healthy + partial + jsRequired + blocked + degraded + failed + unverified;
  return {
    total: sources.length,
    active,
    healthy,
    partial,
    jsRequired,
    blocked,
    degraded,
    failed,
    unverified,
    isReconciled: sum === sources.length,
  };
}

export type SourceContentType =
  | 'HTML_LIST'
  | 'HTML_DETAIL'
  | 'PDF'
  | 'RSS'
  | 'JSON_API'
  | 'JS_HEAVY'
  | 'UNKNOWN';

export type SourcePriority = 'P0' | 'P1' | 'P2' | 'P3' | 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

export type SourceVerificationStatus = 'VERIFIED' | 'UNVERIFIED' | 'FAILED' | 'BLOCKED';

export type DiagnosticReasonCode =
  | 'HTTP_200'
  | 'HTTP_403'
  | 'HTTP_404'
  | 'HTTP_429'
  | 'HTTP_500'
  | 'TIMEOUT'
  | 'DNS_ERROR'
  | 'CONNECTION_REFUSED'
  | 'TLS_ERROR'
  | 'SSL_ERROR'
  | 'EMPTY_RESPONSE'
  | 'EMPTY_NOTICES'
  | 'JS_REQUIRED'
  | 'PDF_PARSE_FAILED'
  | 'INVALID_URL'
  | 'REDIRECT_ERROR'
  | 'BLOCKED'
  | 'SSRF_BLOCKED'
  | 'INSECURE_HTTP_BLOCKED'
  | 'UNKNOWN';

export type NoticeChangeStatus = 'NEW' | 'UPDATED' | 'UNCHANGED' | 'DUPLICATE';

export interface StaffSource {
  id: string;
  name: string;
  organization: string;
  department?: string; // alias for organization
  category: CategoryType;
  state: string; // 'Central' or specific Indian State / UT
  officialDomain: string;
  primaryUrl: string;
  url?: string; // alias for primaryUrl
  fallbackUrls: string[];
  recommendedUrl?: string;
  sourceType: SourceType;
  priority: SourcePriority;
  enabled: boolean;
  active?: boolean; // alias for enabled
  scanFrequency: 'daily' | 'twice_daily' | 'manual';
  lastChecked: string | null;
  lastSuccessful: string | null;
  lastSuccessfulCheck?: string | null; // alias for lastSuccessful
  lastChanged: string | null;
  failureCount: number;
  totalFailures?: number; // alias for failureCount
  consecutiveFailures: number;
  lastError: string | null;
  healthStatus: SourceHealthStatus;
  supportsPdf: boolean;
  supportsHtml: boolean;
  supportsRss: boolean;
  supportsJson: boolean;
  supportsSitemap: boolean;
  supportsApi: boolean;
  adapter: string;
  verificationStatus: SourceVerificationStatus;

  // Metadata & display fields
  lastHttpStatus?: number | null;
  lastResponseTimeMs?: number | null;
  failureReason?: string | null;
  lastReasonCode?: DiagnosticReasonCode | null;
  discoveriesCount: number;
  lastDiscoveryDate?: string | null;
  requiresJs?: boolean;
  isBlocked?: boolean;
  pdfLinksDiscoverable?: boolean;
  hasListingContainer?: boolean;
  contentHash?: string;
  notes?: string;
  jurisdiction?: 'Central' | 'State' | 'UT';
  stateCode?: string;
  stateName?: string;
  contentType?: SourceContentType;
  scanSchedule?: 'daily' | 'manual';
  createdAt: string;
}

export interface OfficialFactObject {
  title: string;
  organization: string;
  notificationNumber: string | null;
  publicationDate: string | null;
  applicationStartDate: string | null;
  applicationLastDate: string | null;
  vacancy: string | null;
  qualification: string | null;
  ageLimit: string | null;
  fee: string | null;
  selectionProcess: string | null;
  salary: string | null;
  officialApplyUrl: string | null;
  officialNotificationUrl: string | null;
  sourceUrl: string;
  sourceRetrievedAt: string;
}

export type DraftStatus =
  | 'DISCOVERED'
  | 'PROCESSING'
  | 'PENDING_REVIEW'
  | 'ADMIN_EDITED'
  | 'EDITED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'DUPLICATE'
  | 'NEEDS_VERIFICATION'
  | 'FAILED';

export interface ExtractedNoticeItem {
  id: string;
  title: string;
  url: string;
  pdfUrl?: string | null;
  dateText?: string | null;
  advtNumber?: string | null;
  snippet?: string;
}

export interface ExtractedFacts {
  recruitmentName: string;
  organization: string;
  advtNumber: string;
  totalVacancies: string;
  applicationStartDate: string;
  applicationEndDate: string;
  examDate: string;
  applicationFee: {
    general_obc_ews: string;
    sc_st_pwd: string;
    paymentMode: string;
  };
  ageLimit: {
    minimum: string;
    maximum: string;
    relaxation: string;
  };
  educationalQualification: string;
  selectionProcess: string[];
  salaryPayScale: string;
  howToApply: string[];
  requiredDocuments: string[];
  officialNotificationPdf?: string;
  applyOnlineUrl?: string;
  officialWebsite?: string;
  unverifiedFields: string[];
  extractionMode?: 'AI_GENERATED' | 'DETERMINISTIC_FALLBACK';
}

export type ExtractionMode = 'AI_GENERATED' | 'DETERMINISTIC_FALLBACK';

export interface AIDraftData {
  title: string;
  shortDescription: string;
  category: CategoryType;
  state: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  suggestedSlug: string;
  importantLinks: { label: string; url: string }[];
  faqs: { question: string; answer: string }[];
}

export interface AIDraft {
  id: string;
  batchId?: string; // e.g. "batch-2026-09-07"
  batchDate?: string; // "2026-09-07"
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  sourceDomain: string;
  sourcePublicationDate: string | null;
  sourceFetchedAt: string;
  notificationNumber: string | null;
  pdfUrl: string | null;
  status: DraftStatus;
  confidenceScore: number;
  duplicateSignal?: string;
  rejectionReason?: string;
  publishedPostId?: string;
  changeStatus?: 'NEW' | 'UPDATED';
  diffSummary?: string;
  contentHash?: string;
  extractedFacts: ExtractedFacts;
  draftData: AIDraftData;
  adminEdited: boolean;
  extractionMode?: ExtractionMode;
  createdAt: string;
  updatedAt: string;
}

export interface TopNewNotificationItem {
  id: string;
  title: string;
  organization: string;
  category: string;
  detectedTime: string;
  officialSource: string;
  pdfAvailable: boolean;
  pdfUrl?: string | null;
  verificationStatus: 'VERIFIED' | 'NEEDS_VERIFICATION';
  changeStatus?: 'NEW' | 'UPDATED';
  extractionMode?: ExtractionMode;
}

export interface SourceTestResult {
  sourceId?: string;
  sourceName?: string;
  domain?: string;
  department?: string;
  jurisdiction?: 'Central' | 'State' | 'UT';
  category?: string;
  priority?: SourcePriority;
  url: string;
  httpStatus: number | null;
  responseTimeMs: number;
  contentType: string;
  detectedType: SourceContentType;
  pageTitle: string;
  linksFoundCount: number;
  pdfLinksCount: number;
  potentialNotificationsCount: number;
  sampleItems: Array<{ title: string; url: string; pdfUrl?: string; dateText?: string }>;
  discoveredNotices?: StructuredNoticeDiscovery[];
  newNoticesCount?: number;
  updatedNoticesCount?: number;
  unchangedNoticesCount?: number;
  duplicateNoticesCount?: number;
  lastSuccessfulFetch?: string | null;
  retryAttempts?: number;
  parserUsed: string;
  requiresJs: boolean;
  isBlocked: boolean;
  healthStatus: SourceHealthStatus;
  reasonCode?: DiagnosticReasonCode;
  fallbackUsed?: string | null;
  officialDomain?: string;
  verificationStatus?: SourceVerificationStatus;
  failureReason: string | null;
  recommendations?: string;
}

export interface StructuredNoticeDiscovery {
  title: string;
  url: string;
  sourceName: string;
  officialDomain: string;
  publishedDate: string | null;
  lastUpdatedDate: string | null;
  noticeType: string;
  category: CategoryType;
  department: string;
  jurisdiction: 'Central' | 'State' | 'UT';
  stateCode: string;
  stateName: string;
  isPdf: boolean;
  discoveredAt: string;
  fingerprint: string;
  pdfUrl?: string | null;
  advtNumber?: string | null;
  changeStatus?: NoticeChangeStatus;
}

export interface AIResearchBatch {
  id: string; // e.g. "batch-2026-09-07-0600"
  batchName: string; // "2026-09-07 Daily Research Batch"
  date: string; // YYYY-MM-DD
  timestamp: string;
  timezone: string; // "Asia/Kolkata"
  sourcesChecked: number;
  successfulSources: number;
  failedSources: number;
  newNotificationsFound: number;
  draftsCreated: number;
  duplicatesDetected: number;
  needsVerification: number;
  pendingReview: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PARTIAL' | 'FAILED';
  errors: { sourceName: string; error: string }[];
}

export interface DailyStaffReport {
  id: string;
  batchId: string;
  date: string;
  title: string;
  scanTimeIST: string;
  timezone: string;
  sourcesChecked: number;
  successful: number;
  failed: number;
  healthySourcesCount?: number;
  degradedSourcesCount?: number;
  failedSourcesCount?: number;
  jsRequiredSourcesCount?: number;
  newNotifications: number;
  updatedNotifications?: number;
  draftsCreated: number;
  duplicates: number;
  needsVerification: number;
  pendingReview: number;
  lastScanIST: string;
  summaryNotes?: string;
  topNotifications?: TopNewNotificationItem[];
}

export interface StaffActivityLog {
  id: string;
  timestamp: string;
  source: string;
  action:
    | 'SCAN'
    | 'DETECTION'
    | 'EXTRACTION'
    | 'DUPLICATE_CHECK'
    | 'DRAFT'
    | 'ADMIN_REVIEW'
    | 'EDIT'
    | 'PUBLISH'
    | 'REJECT'
    | 'SCHEDULE'
    | 'ERROR';
  result: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO';
  error?: string;
}

export interface AIStaffSettings {
  enabled: boolean;
  scanFrequency: 'daily' | 'twice_daily' | 'manual';
  scanTime: string; // Default: "06:00"
  timezone: string; // Default: "Asia/Kolkata"
  maxSourcesPerScan: number;
  autoCreateDraft: boolean;
  requireSource: boolean;
  autoPublish: false; // MUST ALWAYS BE FALSE
  minConfidence: number;
  lastScan: string | null;
  nextScan: string | null;
}

export interface AIStaffDashboardStats {
  sourcesMonitored: number;
  sourcesCheckedToday: number;
  newNotificationsFound: number;
  newDrafts: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  errors: number;
  lastScan: string | null;
  nextScan: string | null;
  todayBatch?: AIResearchBatch | null;
  latestReport?: DailyStaffReport | null;
  sourceMetrics?: SourceStatusMetrics;
}
