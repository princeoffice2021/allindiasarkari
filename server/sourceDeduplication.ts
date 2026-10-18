import crypto from 'crypto';
import { OfficialFactObject, ExtractedFacts, AIDraftData, NoticeChangeStatus, StructuredNoticeDiscovery } from '../src/types/aiStaff';
import { CategoryType } from '../src/types';

/**
 * Canonicalizes a URL by normalizing protocol, host, removing tracking/session params and trailing slashes.
 */
export function canonicalizeUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.protocol = 'https:';
    parsed.hash = '';

    // Strip common tracking/session tokens
    const stripParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'jsessionid',
      'phpsessid',
      'asp.net_sessionid',
      'sid',
      'fbclid',
      'gclid',
    ];
    for (const p of stripParams) {
      parsed.searchParams.delete(p);
    }

    let pathname = parsed.pathname.replace(/\/+$/, '');
    if (!pathname) pathname = '/';
    parsed.pathname = pathname;

    return parsed.toString();
  } catch {
    return rawUrl.trim().toLowerCase().replace(/\/+$/, '');
  }
}

/**
 * Computes deterministic multi-signal content fingerprint
 */
export function computeNoticeFingerprint(item: {
  advtNumber?: string | null;
  pdfUrl?: string | null;
  url: string;
  title: string;
  date?: string | null;
}): string {
  const normTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const normUrl = canonicalizeUrl(item.url);

  if (item.advtNumber && item.advtNumber.trim().length > 3) {
    const cleanAdvt = item.advtNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `fp-advt-${cleanAdvt}`;
  }

  if (item.pdfUrl && item.pdfUrl.trim().length > 5) {
    const normPdf = canonicalizeUrl(item.pdfUrl);
    const hash = crypto.createHash('sha256').update(normPdf).digest('hex').substring(0, 16);
    return `fp-pdf-${hash}`;
  }

  const payload = `${normTitle}|${normUrl}|${item.date || ''}`;
  const hash = crypto.createHash('sha256').update(payload).digest('hex').substring(0, 16);
  return `fp-title-${hash}`;
}

/**
 * Computes simple word token Jaccard similarity between two strings
 */
export function computeTitleSimilarity(a: string, b: string): number {
  const wordsA = new Set(
    a.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2)
  );
  const wordsB = new Set(
    b.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2)
  );

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  wordsA.forEach(w => {
    if (wordsB.has(w)) intersection++;
  });

  const union = new Set([...wordsA, ...wordsB]).size;
  return union === 0 ? 0 : intersection / union;
}

export interface ExistingNoticeRecord {
  url: string;
  canonicalUrl: string;
  advtNumber?: string | null;
  title: string;
  publicationDate?: string | null;
  fingerprint: string;
  contentHash?: string;
  sourceDomain: string;
}

/**
 * Checks if a candidate notice is a duplicate against existing known records using multiple signals.
 */
export function checkDuplicateSignal(
  candidate: {
    url: string;
    advtNumber?: string | null;
    title: string;
    pdfUrl?: string | null;
    publicationDate?: string | null;
    sourceDomain: string;
  },
  existingRecords: ExistingNoticeRecord[]
): { isDuplicate: boolean; matchedBy?: string; existingItem?: ExistingNoticeRecord } {
  const candCanonical = canonicalizeUrl(candidate.url);
  const candPdfCanonical = candidate.pdfUrl ? canonicalizeUrl(candidate.pdfUrl) : null;
  const candFp = computeNoticeFingerprint(candidate);

  for (const item of existingRecords) {
    // 1. Direct URL or Canonical URL match
    if (item.url === candidate.url || item.canonicalUrl === candCanonical) {
      return { isDuplicate: true, matchedBy: 'EXACT_URL', existingItem: item };
    }

    // 2. Direct PDF URL match
    if (candPdfCanonical && item.url === candPdfCanonical) {
      return { isDuplicate: true, matchedBy: 'PDF_URL', existingItem: item };
    }

    // 3. Fingerprint match
    if (item.fingerprint && item.fingerprint === candFp) {
      return { isDuplicate: true, matchedBy: 'FINGERPRINT', existingItem: item };
    }

    // 4. Advt Number match within same domain
    if (
      candidate.advtNumber &&
      item.advtNumber &&
      candidate.advtNumber.trim().length > 3 &&
      candidate.sourceDomain === item.sourceDomain
    ) {
      const cleanA = candidate.advtNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanB = item.advtNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanA === cleanB) {
        return { isDuplicate: true, matchedBy: 'ADVT_NUMBER', existingItem: item };
      }
    }

    // 5. Title high similarity (>85%) within same domain
    if (candidate.sourceDomain === item.sourceDomain) {
      const sim = computeTitleSimilarity(candidate.title, item.title);
      if (sim >= 0.85) {
        return { isDuplicate: true, matchedBy: 'TITLE_SIMILARITY', existingItem: item };
      }
    }
  }

  return { isDuplicate: false };
}

/**
 * Builds a strictly verified OfficialFactObject.
 * Unknown fields MUST remain null/empty. NEVER hallucinate.
 */
export function buildVerifiedOfficialFacts(notice: {
  title: string;
  organization: string;
  advtNumber?: string | null;
  publicationDate?: string | null;
  applicationStartDate?: string | null;
  applicationLastDate?: string | null;
  vacancy?: string | null;
  qualification?: string | null;
  ageLimit?: string | null;
  fee?: string | null;
  selectionProcess?: string | null;
  salary?: string | null;
  officialApplyUrl?: string | null;
  officialNotificationUrl?: string | null;
  sourceUrl: string;
}): OfficialFactObject {
  return {
    title: notice.title.trim(),
    organization: notice.organization.trim(),
    notificationNumber: notice.advtNumber ? notice.advtNumber.trim() : null,
    publicationDate: notice.publicationDate ? notice.publicationDate.trim() : null,
    applicationStartDate: notice.applicationStartDate ? notice.applicationStartDate.trim() : null,
    applicationLastDate: notice.applicationLastDate ? notice.applicationLastDate.trim() : null,
    vacancy: notice.vacancy ? notice.vacancy.trim() : null,
    qualification: notice.qualification ? notice.qualification.trim() : null,
    ageLimit: notice.ageLimit ? notice.ageLimit.trim() : null,
    fee: notice.fee ? notice.fee.trim() : null,
    selectionProcess: notice.selectionProcess ? notice.selectionProcess.trim() : null,
    salary: notice.salary ? notice.salary.trim() : null,
    officialApplyUrl: notice.officialApplyUrl ? canonicalizeUrl(notice.officialApplyUrl) : null,
    officialNotificationUrl: notice.officialNotificationUrl
      ? canonicalizeUrl(notice.officialNotificationUrl)
      : canonicalizeUrl(notice.sourceUrl),
    sourceUrl: canonicalizeUrl(notice.sourceUrl),
    sourceRetrievedAt: new Date().toISOString(),
  };
}

/**
 * Prepares article draft sections only for verified facts.
 */
export function prepareArticleDraftContent(
  facts: OfficialFactObject,
  category: CategoryType,
  state: string
): AIDraftData {
  const sections: string[] = [];

  // Title
  const cleanTitle = facts.title;
  const org = facts.organization;

  // Introduction
  sections.push(
    `## Introduction\n\nOfficial recruitment notification has been published by **${org}** regarding **${cleanTitle}**${
      facts.notificationNumber ? ` under Notification/Advt No: **${facts.notificationNumber}**` : ''
    }. Eligible candidates can review the official eligibility criteria and application timelines outlined below.`
  );

  // Highlights
  sections.push(
    `## Important Highlights\n\n` +
      `- **Recruiting Organization**: ${org}\n` +
      `- **Notification / Advt No**: ${facts.notificationNumber || 'Refer to official notification'}\n` +
      `- **Total Vacancies**: ${facts.vacancy || 'To be notified in detailed brochure'}\n` +
      `- **Jurisdiction**: ${state}\n` +
      `- **Official Website**: [${org} Portal](${facts.sourceUrl})`
  );

  // Dates (only if available)
  if (facts.publicationDate || facts.applicationStartDate || facts.applicationLastDate) {
    let datesContent = `## Important Dates\n\n`;
    if (facts.publicationDate) datesContent += `- **Notification Date**: ${facts.publicationDate}\n`;
    if (facts.applicationStartDate) datesContent += `- **Online Application Start Date**: ${facts.applicationStartDate}\n`;
    if (facts.applicationLastDate) datesContent += `- **Last Date to Apply Online**: ${facts.applicationLastDate}\n`;
    sections.push(datesContent.trim());
  }

  // Vacancy & Eligibility (only if available)
  if (facts.vacancy || facts.qualification) {
    let vacContent = `## Vacancy & Educational Qualification\n\n`;
    if (facts.vacancy) vacContent += `- **Total Posts**: ${facts.vacancy}\n`;
    if (facts.qualification) vacContent += `- **Eligibility / Qualification**: ${facts.qualification}\n`;
    sections.push(vacContent.trim());
  }

  // Age Limit (only if available)
  if (facts.ageLimit) {
    sections.push(`## Age Limit Criteria\n\n${facts.ageLimit}\n\n*Age relaxation is applicable as per government reservation rules.*`);
  }

  // Application Fee (only if available)
  if (facts.fee) {
    sections.push(`## Application Fee\n\n${facts.fee}`);
  }

  // Selection Process (only if available)
  if (facts.selectionProcess) {
    sections.push(`## Selection Process\n\n${facts.selectionProcess}`);
  }

  // Salary / Pay Scale (only if available)
  if (facts.salary) {
    sections.push(`## Pay Scale & Remuneration\n\n${facts.salary}`);
  }

  // How to Apply
  sections.push(
    `## How to Apply\n\n` +
      `1. Visit the official website: [${facts.sourceUrl}](${facts.sourceUrl}).\n` +
      `2. Read the official advertisement details carefully before filling out the form.\n` +
      `3. Complete the online registration / application form with required personal and educational details.\n` +
      `4. Upload scanned copies of photographs, signature, and required certificates.\n` +
      `5. Submit the application fee (if applicable) and download the confirmation page for future reference.`
  );

  // Official Links (preserving authoritative URLs)
  let linksMarkdown = `## Official Links & Documents\n\n`;
  linksMarkdown += `- **Official Notification / PDF**: [Download Official Notification](${facts.officialNotificationUrl || facts.sourceUrl})\n`;
  if (facts.officialApplyUrl) {
    linksMarkdown += `- **Online Application Link**: [Apply Online](${facts.officialApplyUrl})\n`;
  }
  linksMarkdown += `- **Official Department Portal**: [Visit Portal](${facts.sourceUrl})\n`;
  sections.push(linksMarkdown.trim());

  // FAQ
  sections.push(
    `## Frequently Asked Questions (FAQs)\n\n` +
      `**Q1. What is the recruiting body for this post?**\n` +
      `Ans. The recruitment is conducted by ${org}.\n\n` +
      `**Q2. Where can I verify the official notice?**\n` +
      `Ans. The verified notification can be checked directly on the official portal at ${facts.sourceUrl}.`
  );

  const importantLinks = [
    { label: 'Official Notification (PDF)', url: facts.officialNotificationUrl || facts.sourceUrl },
    { label: 'Official Website', url: facts.sourceUrl },
  ];
  if (facts.officialApplyUrl) {
    importantLinks.unshift({ label: 'Apply Online', url: facts.officialApplyUrl });
  }

  return {
    title: `${org} ${cleanTitle}`,
    shortDescription: `Official recruitment notification by ${org} for ${cleanTitle}. Check eligibility, notification dates and official download link.`,
    category,
    state,
    content: sections.join('\n\n'),
    metaTitle: `${org} ${cleanTitle} Notification | Check Details`,
    metaDescription: `Read official ${org} notification for ${cleanTitle}. Direct official PDF link, eligibility, and verified dates.`,
    keywords: [org, cleanTitle, 'Sarkari Naukri', 'Recruitment Notification', state, 'Official Notice'],
    suggestedSlug: `${org.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}`.replace(/-+/g, '-').substring(0, 80),
    importantLinks,
    faqs: [
      {
        question: `What is the recruiting organization?`,
        answer: `The recruitment notice has been issued by ${org}.`,
      },
      {
        question: `How can I download the official notification?`,
        answer: `You can access the verified official notification directly via the official link provided above.`,
      },
    ],
  };
}
