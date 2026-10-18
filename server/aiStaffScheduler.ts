import { StaffSource, AIDraft, AIStaffSettings, AIResearchBatch, DailyStaffReport } from '../src/types/aiStaff';
import { INITIAL_STAFF_SOURCES, DEFAULT_AI_STAFF_SETTINGS } from '../src/data/aiStaffDefaults';
import { executeSourceScan, ScanResult } from './aiStaffScanner';

// ----------------------------------------------------
// SERVER SCHEDULER STATE (In-Memory + Safe Persistence)
// ----------------------------------------------------

interface SchedulerState {
  enabled: boolean;
  scanFrequency: 'daily' | 'twice_daily' | 'manual';
  scanTime: string; // "06:00"
  timezone: string; // "Asia/Kolkata"
  isScanning: boolean;
  lastRanISTDate: string | null;
  lastScanTimestamp: string | null;
  latestBatch: AIResearchBatch | null;
  latestReport: DailyStaffReport | null;
  recentBatches: AIResearchBatch[];
  recentReports: DailyStaffReport[];
}

const schedulerState: SchedulerState = {
  enabled: true,
  scanFrequency: 'daily',
  scanTime: '06:00',
  timezone: 'Asia/Kolkata',
  isScanning: false,
  lastRanISTDate: null,
  lastScanTimestamp: null,
  latestBatch: null,
  latestReport: null,
  recentBatches: [],
  recentReports: [],
};

// In-memory store of drafts generated during server runs so admin API can sync
const serverDraftsQueue: AIDraft[] = [];

// Helper to get time details in Asia/Kolkata
export function getKolkataTime() {
  const now = new Date();
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const currentHM = timeFormatter.format(now); // e.g. "06:00"

  const dateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const currentISTDate = dateFormatter.format(now); // e.g. "2026-09-07"

  return { currentHM, currentISTDate, nowIso: now.toISOString() };
}

// Calculate next scheduled run string
export function getNextScheduledRunIST(): string {
  const { currentHM, currentISTDate } = getKolkataTime();
  if (schedulerState.scanFrequency === 'manual' || !schedulerState.enabled) {
    return 'Manual Trigger Only';
  }
  return `Tomorrow at ${schedulerState.scanTime} AM (Asia/Kolkata)`;
}

// ----------------------------------------------------
// CORE SCHEDULER EXECUTION PIPELINE
// ----------------------------------------------------

export async function runSchedulerScan(
  triggerReason: string = 'Automated Daily Schedule',
  customSources?: StaffSource[],
  force: boolean = false
): Promise<ScanResult> {
  if (schedulerState.isScanning) {
    throw new Error('A scan is already actively in progress.');
  }

  const { currentISTDate, nowIso } = getKolkataTime();

  // Duplicate Execution Protection:
  // If a batch has already successfully run today (Asia/Kolkata date) and force is not requested,
  // return existing batch data without re-triggering AI/network operations.
  if (!force && schedulerState.lastRanISTDate === currentISTDate && schedulerState.latestBatch && schedulerState.latestReport) {
    console.log(
      `[AI Staff Scheduler] Duplicate execution protection: Batch for ${currentISTDate} already completed today. Returning existing batch summary.`
    );
    return {
      sourcesChecked: schedulerState.latestBatch.sourcesChecked,
      successfulSources: schedulerState.latestBatch.successfulSources,
      failedSources: schedulerState.latestBatch.failedSources,
      newNoticesFound: schedulerState.latestBatch.newNotificationsFound,
      newDraftsCreated: schedulerState.latestBatch.draftsCreated,
      duplicatesSkipped: schedulerState.latestBatch.duplicatesDetected,
      needsVerificationCount: schedulerState.latestBatch.needsVerification,
      errorsEncountered: schedulerState.latestBatch.errors.length,
      batchId: schedulerState.latestBatch.id,
      batchName: schedulerState.latestBatch.batchName,
      batchDate: schedulerState.latestBatch.date,
      newDrafts: serverDraftsQueue.filter(d => d.batchDate === currentISTDate),
      newLogs: [],
      batchSummary: schedulerState.latestBatch,
      dailyReport: schedulerState.latestReport,
    };
  }

  schedulerState.isScanning = true;
  console.log(`[AI Staff Scheduler] Starting scan: "${triggerReason}" at ${nowIso} (IST Date: ${currentISTDate})`);

  try {
    const sourcesToScan = customSources && customSources.length > 0 ? customSources : INITIAL_STAFF_SOURCES;
    const settings: AIStaffSettings = {
      ...DEFAULT_AI_STAFF_SETTINGS,
      enabled: schedulerState.enabled,
      scanFrequency: schedulerState.scanFrequency,
      scanTime: schedulerState.scanTime,
      timezone: schedulerState.timezone,
      autoPublish: false, // HARD-CODED STRICTLY FALSE
    };

    // Execute research pipeline across official portals
    const scanResult = await executeSourceScan(
      sourcesToScan,
      serverDraftsQueue,
      [],
      settings
    );

    // Save newly generated drafts into memory queue (never published)
    for (const draft of scanResult.newDrafts) {
      // Ensure draft has batchId and pending status
      draft.status = draft.status === 'NEEDS_VERIFICATION' ? 'NEEDS_VERIFICATION' : 'PENDING_REVIEW';
      serverDraftsQueue.unshift(draft);
    }

    // Keep queue trimmed
    if (serverDraftsQueue.length > 100) {
      serverDraftsQueue.splice(100);
    }

    // Update state
    schedulerState.lastRanISTDate = currentISTDate;
    schedulerState.lastScanTimestamp = new Date().toISOString();
    schedulerState.latestBatch = scanResult.batchSummary;
    schedulerState.latestReport = scanResult.dailyReport;

    // Add to recent batches
    schedulerState.recentBatches.unshift(scanResult.batchSummary);
    if (schedulerState.recentBatches.length > 30) {
      schedulerState.recentBatches.pop();
    }

    schedulerState.recentReports.unshift(scanResult.dailyReport);
    if (schedulerState.recentReports.length > 30) {
      schedulerState.recentReports.pop();
    }

    console.log(
      `[AI Staff Scheduler] Completed [${scanResult.batchName}]: ${scanResult.newDraftsCreated} drafts created, ${scanResult.duplicatesSkipped} duplicates skipped, ${scanResult.failedSources} failed sources.`
    );

    return scanResult;
  } finally {
    schedulerState.isScanning = false;
  }
}

// ----------------------------------------------------
// TICK LOOP (Evaluated every 60 seconds)
// ----------------------------------------------------

let tickerInterval: NodeJS.Timeout | null = null;

export function checkAndTriggerScheduledScan() {
  if (!schedulerState.enabled) return;
  if (schedulerState.scanFrequency === 'manual') return;
  if (schedulerState.isScanning) return;

  const { currentHM, currentISTDate } = getKolkataTime();
  const targetTime = schedulerState.scanTime; // e.g. "06:00"

  if (schedulerState.scanFrequency === 'daily') {
    // Check if time matches target time and hasn't already run today
    if (currentHM === targetTime && schedulerState.lastRanISTDate !== currentISTDate) {
      console.log(`[AI Staff Scheduler] Daily target time ${targetTime} IST reached. Triggering automatic daily scan...`);
      runSchedulerScan(`Daily Scheduled Run at ${targetTime} IST`).catch(err => {
        console.error('[AI Staff Scheduler] Scheduled daily scan error:', err);
      });
    }
  } else if (schedulerState.scanFrequency === 'twice_daily') {
    // Run at targetTime and 12 hours later (e.g. 06:00 and 18:00)
    const [hStr, mStr] = targetTime.split(':');
    const hNum = parseInt(hStr, 10);
    const eveningHour = ((hNum + 12) % 24).toString().padStart(2, '0');
    const eveningTime = `${eveningHour}:${mStr}`;

    const hasRunMorning = schedulerState.lastRanISTDate === `${currentISTDate}-morning`;
    const hasRunEvening = schedulerState.lastRanISTDate === `${currentISTDate}-evening`;

    if (currentHM === targetTime && !hasRunMorning) {
      schedulerState.lastRanISTDate = `${currentISTDate}-morning`;
      runSchedulerScan(`Twice-Daily Morning Run at ${targetTime} IST`).catch(err => {
        console.error('[AI Staff Scheduler] Twice-daily morning scan error:', err);
      });
    } else if (currentHM === eveningTime && !hasRunEvening) {
      schedulerState.lastRanISTDate = `${currentISTDate}-evening`;
      runSchedulerScan(`Twice-Daily Evening Run at ${eveningTime} IST`).catch(err => {
        console.error('[AI Staff Scheduler] Twice-daily evening scan error:', err);
      });
    }
  }
}

// Start background ticker (Fallback for Standalone Node / Container; Vercel uses Vercel Cron)
export function initAIScheduler() {
  if (tickerInterval) {
    clearInterval(tickerInterval);
  }

  // On Vercel Serverless, Node.js background setInterval is unsafe/frozen between requests.
  // Vercel Cron (/api/cron/ai-staff-scan at 00:30 UTC = 06:00 IST) is the authoritative production trigger.
  if (process.env.VERCEL === '1') {
    console.log(
      '[AI Staff Scheduler] Detected Vercel Serverless environment. Authoritative production schedule runs via Vercel Cron (/api/cron/ai-staff-scan at 00:30 UTC = 06:00 AM IST). In-memory setInterval ticker disabled.'
    );
    return;
  }

  console.log(
    `[AI Staff Scheduler] Initializing Daily Automation (Standalone/Dev Fallback). Configured Scan Time: ${schedulerState.scanTime} AM (${schedulerState.timezone}). Authoritative Production Trigger: Vercel Cron at 00:30 UTC.`
  );

  // Run initial check after 5 seconds to catch up if started during scan window
  setTimeout(() => {
    checkAndTriggerScheduledScan();
  }, 5000);

  // Tick every 60 seconds (local / container runtime)
  tickerInterval = setInterval(() => {
    checkAndTriggerScheduledScan();
  }, 60 * 1000);
}

// ----------------------------------------------------
// STATE ACCESSORS AND SYNC HELPERS FOR API ROUTES
// ----------------------------------------------------

export function getSchedulerStatus() {
  const { currentHM, currentISTDate } = getKolkataTime();
  return {
    enabled: schedulerState.enabled,
    isScanning: schedulerState.isScanning,
    scanFrequency: schedulerState.scanFrequency,
    scanTime: schedulerState.scanTime,
    timezone: schedulerState.timezone,
    currentTimeIST: `${currentHM} IST`,
    currentISTDate,
    lastRanISTDate: schedulerState.lastRanISTDate,
    lastScanTimestamp: schedulerState.lastScanTimestamp,
    nextScheduledRunIST: getNextScheduledRunIST(),
    autoPublishStatus: 'PERMANENTLY_DISABLED_HARDCODED',
    latestBatch: schedulerState.latestBatch,
    latestReport: schedulerState.latestReport,
    queuedDraftsCount: serverDraftsQueue.filter(d => d.status === 'PENDING_REVIEW' || d.status === 'NEEDS_VERIFICATION').length,
  };
}

export function updateSchedulerSettings(settings: Partial<AIStaffSettings>) {
  if (typeof settings.enabled === 'boolean') {
    schedulerState.enabled = settings.enabled;
  }
  if (settings.scanFrequency) {
    schedulerState.scanFrequency = settings.scanFrequency;
  }
  if (settings.scanTime) {
    schedulerState.scanTime = settings.scanTime;
  }
  if (settings.timezone) {
    schedulerState.timezone = settings.timezone;
  }
  return getSchedulerStatus();
}

export function getServerDraftsQueue(): AIDraft[] {
  return serverDraftsQueue;
}

export function getRecentBatches(): AIResearchBatch[] {
  return schedulerState.recentBatches;
}

export function getRecentReports(): DailyStaffReport[] {
  return schedulerState.recentReports;
}
