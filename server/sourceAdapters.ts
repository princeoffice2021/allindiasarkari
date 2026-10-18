import * as cheerio from 'cheerio';
import * as crypto from 'node:crypto';
import { StaffSource, StructuredNoticeDiscovery } from '../src/types/aiStaff';
import { CategoryType } from '../src/types';

export interface ParsedNotificationNotice {
  id: string;
  title: string;
  url: string;
  pdfUrl?: string | null;
  dateText?: string | null;
  advtNumber?: string | null;
  categoryHint?: CategoryType;
  snippet?: string;
  fingerprint: string;
}

export interface SourceAdapter {
  name: string;
  canHandle(source: StaffSource, url: string, html: string): boolean;
  parse(source: StaffSource, html: string, baseUrl: string): ParsedNotificationNotice[];
}

// ----------------------------------------------------
// UTILITY HELPERS
// ----------------------------------------------------

export function resolveUrl(href: string | undefined | null, baseUrl: string): string | null {
  if (!href) return null;
  const cleanHref = href.trim();
  if (cleanHref === '' || cleanHref.startsWith('javascript:') || cleanHref.startsWith('#')) return null;
  try {
    return new URL(cleanHref, baseUrl).href;
  } catch {
    return null;
  }
}

export function extractAdvtNumber(text: string): string | null {
  const advtPatterns = [
    /(?:Advt\.?\s*No\.?|Advertisement\s*No\.?|Notice\s*No\.?|Notification\s*No\.?|CEN\s*No\.?|Emp\.?\s*Notice\s*No\.?)\s*[:\-–]?\s*([A-Za-z0-9\/\-_\.]+)/i,
    /(CEN\s*(?:[0-9]{2}\/[0-9]{4}|[0-9]{1,2}\/[0-9]{4}))/i,
    /(Advt\.?\s*[0-9]{1,4}\/[0-9]{4})/i,
    /(EN\s*[0-9]{1,3}\/[0-9]{2,4})/i,
    /([A-Z]-[0-9]\/[A-Z]-[0-9]\/[0-9]{4})/i,
    /([0-9]{1,3}\/[0-9]{4})/i,
  ];
  for (const pattern of advtPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

export function extractDateText(text: string): string | null {
  const datePatterns = [
    /(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4})/,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i,
    /([0-9]{4}[0-9]{2}[0-9]{2})/,
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
}

export function classifyCategoryHint(title: string): CategoryType {
  const lower = title.toLowerCase();
  if (lower.includes('admit card') || lower.includes('hall ticket') || lower.includes('call letter') || lower.includes('e-admit')) {
    return 'Admit Card';
  }
  if (lower.includes('result') || lower.includes('merit list') || lower.includes('score card') || lower.includes('marks list') || lower.includes('selected candidate')) {
    return 'Results';
  }
  if (lower.includes('answer key') || lower.includes('response sheet') || lower.includes('objection key')) {
    return 'Answer Key';
  }
  if (lower.includes('syllabus') || lower.includes('exam pattern')) {
    return 'Syllabus';
  }
  if (lower.includes('scholarship') || lower.includes('fellowship') || lower.includes('stipend')) {
    return 'Scholarship';
  }
  if (lower.includes('scheme') || lower.includes('yojana') || lower.includes('kisan') || lower.includes('awas') || lower.includes('ration')) {
    return 'Sarkari Yojana';
  }
  if (lower.includes('exam') || lower.includes('cbt') || lower.includes('schedule') || lower.includes('postponed') || lower.includes('examination date') || lower.includes('calendar')) {
    return 'Admit Card';
  }
  return 'Sarkari Naukri';
}

export function generateNoticeFingerprint(
  sourceDomain: string,
  advtNumber: string | null | undefined,
  noticeUrl: string,
  pdfUrl: string | null | undefined,
  title: string,
  dateText: string | null | undefined
): string {
  // Fingerprint Priority per specification:
  // 1. notification/advertisement number
  // 2. PDF URL
  // 3. official notification URL
  // 4. normalized title + published date
  if (advtNumber && advtNumber.length > 3) {
    return crypto.createHash('sha256').update(`${sourceDomain}:advt:${advtNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}`).digest('hex');
  }
  if (pdfUrl && pdfUrl.startsWith('http')) {
    const cleanPdf = pdfUrl.split('?')[0].toLowerCase();
    return crypto.createHash('sha256').update(`pdf:${cleanPdf}`).digest('hex');
  }
  if (noticeUrl && noticeUrl.startsWith('http') && !noticeUrl.endsWith('.gov.in') && !noticeUrl.endsWith('.gov.in/')) {
    const cleanUrl = noticeUrl.split('#')[0].toLowerCase();
    return crypto.createHash('sha256').update(`url:${cleanUrl}`).digest('hex');
  }
  const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normDate = (dateText || '').replace(/[^0-9]/g, '');
  return crypto.createHash('sha256').update(`title:${normTitle}:date:${normDate}`).digest('hex');
}

export function toStructuredNoticeDiscovery(
  notice: ParsedNotificationNotice,
  source: StaffSource
): StructuredNoticeDiscovery {
  let domain = 'official.gov.in';
  try {
    domain = new URL(source.url).hostname;
  } catch {
    domain = source.url;
  }

  const isPdf = Boolean(
    notice.pdfUrl ||
    notice.url.toLowerCase().endsWith('.pdf') ||
    notice.url.toLowerCase().includes('.pdf') ||
    notice.url.includes('Open_PDF') ||
    notice.url.includes('FilesUploaded')
  );

  return {
    title: notice.title,
    url: notice.url,
    sourceName: source.name,
    officialDomain: domain,
    publishedDate: notice.dateText || null,
    lastUpdatedDate: notice.dateText || null,
    noticeType: notice.categoryHint || source.category || 'Sarkari Naukri',
    category: notice.categoryHint || source.category,
    department: source.department,
    jurisdiction: source.jurisdiction,
    stateCode: source.stateCode || (source.jurisdiction === 'Central' ? 'ALL' : 'IN'),
    stateName: source.stateName || source.state,
    isPdf,
    discoveredAt: new Date().toISOString(),
    fingerprint: notice.fingerprint,
    pdfUrl: notice.pdfUrl || (isPdf ? notice.url : null),
    advtNumber: notice.advtNumber || null,
  };
}

// ----------------------------------------------------
// 1. BPSC ADAPTER (Bihar Public Service Commission)
// ----------------------------------------------------
export const bpscAdapter: SourceAdapter = {
  name: 'bpsc-adapter',
  canHandle(source, url) {
    return url.includes('bpsc.bih.nic.in') || url.includes('bpsc.bihar.gov.in') || source.name.toLowerCase().includes('bpsc');
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html);
    const notices: ParsedNotificationNotice[] = [];
    const domain = 'bpsc.bihar.gov.in';

    // Check table rows first
    $('table tr').each((_, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      if (cells.length >= 3) {
        const rowText = $row.text().replace(/\s+/g, ' ').trim();
        const dateText = $(cells[cells.length >= 4 ? 2 : 1]).text().trim();
        const advtCellText = cells.length >= 4 ? $(cells[3]).text().trim() : '';
        
        let title = '';
        if (cells.length >= 5) {
          title = $(cells[4]).text().replace(/\s+/g, ' ').trim();
        } else {
          title = rowText;
        }

        if (!title || title.length < 10) return;

        let pdfUrl: string | null = null;
        $row.find('a[href*=".pdf" i], a[href*="uploads" i]').each((_, a) => {
          const href = $(a).attr('href');
          const resolved = resolveUrl(href, baseUrl);
          if (resolved && !pdfUrl) pdfUrl = resolved;
        });

        const link = $row.find('a').attr('href');
        const noticeUrl = resolveUrl(link, baseUrl) || pdfUrl || baseUrl;
        const advtNum = extractAdvtNumber(advtCellText || title);
        const fingerprint = generateNoticeFingerprint(domain, advtNum, noticeUrl, pdfUrl, title, dateText);

        if (!notices.some(n => n.fingerprint === fingerprint)) {
          notices.push({
            id: `notice-bpsc-${fingerprint.substring(0, 10)}`,
            title,
            url: noticeUrl,
            pdfUrl,
            dateText: extractDateText(dateText) || dateText,
            advtNumber: advtNum,
            categoryHint: classifyCategoryHint(title),
            snippet: `BPSC Bihar Notice: ${title.substring(0, 140)}`,
            fingerprint,
          });
        }
      }
    });

    // Also check direct PDF anchors
    $('a[href*=".pdf" i]').each((_, a) => {
      const $a = $(a);
      const text = $a.text().replace(/\s+/g, ' ').trim();
      const href = $a.attr('href');
      const pdfUrl = resolveUrl(href, baseUrl);
      if (text.length >= 15 && pdfUrl) {
        const advtNum = extractAdvtNumber(text);
        const dateText = extractDateText(text);
        const fingerprint = generateNoticeFingerprint(domain, advtNum, pdfUrl, pdfUrl, text, dateText);
        if (!notices.some(n => n.fingerprint === fingerprint)) {
          notices.push({
            id: `notice-bpsc-${fingerprint.substring(0, 10)}`,
            title: text,
            url: pdfUrl,
            pdfUrl,
            dateText,
            advtNumber: advtNum,
            categoryHint: classifyCategoryHint(text),
            snippet: `BPSC Bihar Notice: ${text.substring(0, 140)}`,
            fingerprint,
          });
        }
      }
    });

    return notices.slice(0, 15);
  },
};

// ----------------------------------------------------
// 2. UPPSC ADAPTER (Uttar Pradesh Public Service Commission)
// ----------------------------------------------------
export const uppscAdapter: SourceAdapter = {
  name: 'uppsc-adapter',
  canHandle(source, url) {
    return url.includes('uppsc.up.nic.in') || source.name.toLowerCase().includes('uppsc');
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html);
    const notices: ParsedNotificationNotice[] = [];
    const domain = 'uppsc.up.nic.in';

    $('a').each((_, a) => {
      const $a = $(a);
      const text = $a.text().replace(/\s+/g, ' ').trim();
      const href = $a.attr('href');
      if (!href) return;

      // Filter out untranslated Angular tokens like {{'Setting_HM' | translate }}
      if (text.includes('{{') || text.includes('translate')) return;
      if (text.length < 15) return;

      const isNoticeLink =
        href.includes('Open_PDF') ||
        href.includes('Open_PDF_DB') ||
        href.includes('CandidatePages') ||
        href.includes('Notice') ||
        href.includes('Advertis') ||
        text.toLowerCase().includes('notice') ||
        text.toLowerCase().includes('advt') ||
        text.toLowerCase().includes('exam calendar') ||
        text.toLowerCase().includes('result') ||
        text.toLowerCase().includes('selected candidate');

      if (!isNoticeLink) return;

      const resolved = resolveUrl(href, baseUrl);
      if (!resolved) return;

      const isPdf = href.includes('Open_PDF') || href.includes('.pdf');
      const pdfUrl = isPdf ? resolved : null;
      const advtNum = extractAdvtNumber(text);
      const dateText = extractDateText(text);
      const fingerprint = generateNoticeFingerprint(domain, advtNum, resolved, pdfUrl, text, dateText);

      if (!notices.some(n => n.fingerprint === fingerprint)) {
        notices.push({
          id: `notice-uppsc-${fingerprint.substring(0, 10)}`,
          title: text,
          url: resolved,
          pdfUrl,
          dateText,
          advtNumber: advtNum,
          categoryHint: classifyCategoryHint(text),
          snippet: `UPPSC Official Announcement: ${text.substring(0, 140)}`,
          fingerprint,
        });
      }
    });

    return notices.slice(0, 15);
  },
};

// ----------------------------------------------------
// 3. UPPRPB ADAPTER (UP Police Recruitment & Promotion Board)
// ----------------------------------------------------
export const upprpbAdapter: SourceAdapter = {
  name: 'upprpb-adapter',
  canHandle(source, url) {
    return url.includes('uppbpb.gov.in') || source.name.toLowerCase().includes('upprpb') || source.name.toLowerCase().includes('up police');
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html);
    const notices: ParsedNotificationNotice[] = [];
    const domain = 'uppbpb.gov.in';

    $('a[href*=".pdf" i], a[href*="Notice" i], a[href*="FilesUploaded" i]').each((_, a) => {
      const $a = $(a);
      const text = $a.text().replace(/\s+/g, ' ').trim();
      const href = $a.attr('href');
      const resolved = resolveUrl(href, baseUrl);
      if (!resolved || text.length < 15 || text.toLowerCase() === 'notices' || text.toLowerCase().includes('more..')) return;

      const isPdf = resolved.toLowerCase().endsWith('.pdf') || resolved.includes('pdf') || resolved.includes('FilesUploaded');
      const pdfUrl = isPdf ? resolved : null;
      const advtNum = extractAdvtNumber(text);
      const dateText = extractDateText(text);
      const fingerprint = generateNoticeFingerprint(domain, advtNum, resolved, pdfUrl, text, dateText);

      if (!notices.some(n => n.fingerprint === fingerprint)) {
        notices.push({
          id: `notice-upprpb-${fingerprint.substring(0, 10)}`,
          title: text,
          url: resolved,
          pdfUrl,
          dateText,
          advtNumber: advtNum,
          categoryHint: classifyCategoryHint(text),
          snippet: `UP Police Recruitment Update: ${text.substring(0, 140)}`,
          fingerprint,
        });
      }
    });

    return notices.slice(0, 15);
  },
};

// ----------------------------------------------------
// 4. NTA ADAPTER (National Testing Agency)
// ----------------------------------------------------
export const ntaAdapter: SourceAdapter = {
  name: 'nta-adapter',
  canHandle(source, url) {
    return url.includes('nta.ac.in') || source.name.toLowerCase().includes('nta');
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html);
    const notices: ParsedNotificationNotice[] = [];
    const domain = 'nta.ac.in';

    // On NTA, anchors pointing to /Download/Notice/...pdf often have anchor text 'Read More',
    // while the parent element contains the full notification title
    $('a[href*="/Download/Notice/" i], a[href*=".pdf" i]').each((_, a) => {
      const $a = $(a);
      const href = $a.attr('href');
      const resolved = resolveUrl(href, baseUrl);
      if (!resolved) return;

      let title = $a.text().replace(/\s+/g, ' ').trim();
      if (!title || title.toLowerCase() === 'read more' || title.length < 12) {
        // Extract title from parent container or previous sibling
        const parentText = $a.closest('tr, li, div, p').text().replace(/\s+/g, ' ').trim();
        const cleanParent = parentText.replace(/Read More.*$/i, '').trim();
        if (cleanParent.length >= 15) {
          title = cleanParent;
        }
      }

      if (!title || title.length < 12 || title.toLowerCase() === 'archive') return;

      // Extract date from filename if present (e.g. Notice_20260904214736.pdf)
      let dateText: string | null = null;
      const dateInUrlMatch = resolved.match(/Notice_(\d{4})(\d{2})(\d{2})/);
      if (dateInUrlMatch) {
        dateText = `${dateInUrlMatch[1]}-${dateInUrlMatch[2]}-${dateInUrlMatch[3]}`;
      } else {
        dateText = extractDateText(title);
      }

      const advtNum = extractAdvtNumber(title);
      const fingerprint = generateNoticeFingerprint(domain, advtNum, resolved, resolved, title, dateText);

      if (!notices.some(n => n.fingerprint === fingerprint)) {
        notices.push({
          id: `notice-nta-${fingerprint.substring(0, 10)}`,
          title,
          url: resolved,
          pdfUrl: resolved,
          dateText,
          advtNumber: advtNum,
          categoryHint: classifyCategoryHint(title),
          snippet: `NTA National Exam Announcement: ${title.substring(0, 140)}`,
          fingerprint,
        });
      }
    });

    return notices.slice(0, 15);
  },
};

// ----------------------------------------------------
// 5. EMPLOYMENT NEWS ADAPTER (Rozgar Samachar)
// ----------------------------------------------------
export const employmentNewsAdapter: SourceAdapter = {
  name: 'employment-news-adapter',
  canHandle(source, url) {
    return url.includes('employmentnews.gov.in') || source.name.toLowerCase().includes('employment news');
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html);
    const notices: ParsedNotificationNotice[] = [];
    const domain = 'employmentnews.gov.in';

    $('a').each((_, a) => {
      const $a = $(a);
      const title = $a.text().replace(/\s+/g, ' ').trim();
      const href = $a.attr('href');
      if (!href || title.length < 18) return;

      // Filter out navigation boilerplate
      const lower = title.toLowerCase();
      if (
        lower.includes('buy books') ||
        lower.includes('how to advertise') ||
        lower.includes('feedback') ||
        lower.includes('subscription') ||
        lower.includes('subscribe') ||
        lower.includes('policy')
      ) {
        return;
      }

      const isJobOrNotice =
        href.includes('SpecialContent') ||
        href.includes('InDepthJobs') ||
        href.includes('WebExclusive') ||
        href.includes('.pdf') ||
        lower.includes('recruitment') ||
        lower.includes('vacancy') ||
        lower.includes('career') ||
        lower.includes('notice');

      if (!isJobOrNotice) return;

      const resolved = resolveUrl(href, baseUrl);
      if (!resolved) return;

      const pdfUrl = resolved.toLowerCase().endsWith('.pdf') ? resolved : null;
      const dateText = extractDateText(title);
      const advtNum = extractAdvtNumber(title);
      const fingerprint = generateNoticeFingerprint(domain, advtNum, resolved, pdfUrl, title, dateText);

      if (!notices.some(n => n.fingerprint === fingerprint)) {
        notices.push({
          id: `notice-emp-${fingerprint.substring(0, 10)}`,
          title,
          url: resolved,
          pdfUrl,
          dateText,
          advtNumber: advtNum,
          categoryHint: 'Sarkari Naukri',
          snippet: `Employment News Govt Vacancy: ${title.substring(0, 140)}`,
          fingerprint,
        });
      }
    });

    return notices.slice(0, 12);
  },
};

// ----------------------------------------------------
// 6. IBPS ADAPTER (Institute of Banking Personnel Selection)
// ----------------------------------------------------
export const ibpsAdapter: SourceAdapter = {
  name: 'ibps-adapter',
  canHandle(source, url) {
    return url.includes('ibps.in') || source.name.toLowerCase().includes('ibps') || source.name.toLowerCase().includes('banking');
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html);
    const notices: ParsedNotificationNotice[] = [];
    const domain = 'ibps.in';

    $('a').each((_, a) => {
      const $a = $(a);
      const title = $a.text().replace(/\s+/g, ' ').trim();
      const href = $a.attr('href');
      if (!href || title.length < 15) return;

      const lower = title.toLowerCase();
      const isBankNotice =
        href.includes('crp') ||
        href.includes('ibpsreg') ||
        href.includes('.pdf') ||
        lower.includes('recruitment') ||
        lower.includes('apply online') ||
        lower.includes('crp-') ||
        lower.includes('officer') ||
        lower.includes('clerk') ||
        lower.includes('probationary');

      if (!isBankNotice) return;

      const resolved = resolveUrl(href, baseUrl);
      if (!resolved) return;

      const pdfUrl = resolved.toLowerCase().endsWith('.pdf') ? resolved : null;
      const advtNum = extractAdvtNumber(title);
      const dateText = extractDateText(title);
      const fingerprint = generateNoticeFingerprint(domain, advtNum, resolved, pdfUrl, title, dateText);

      if (!notices.some(n => n.fingerprint === fingerprint)) {
        notices.push({
          id: `notice-ibps-${fingerprint.substring(0, 10)}`,
          title,
          url: resolved,
          pdfUrl,
          dateText,
          advtNumber: advtNum,
          categoryHint: classifyCategoryHint(title),
          snippet: `IBPS Banking Recruitment: ${title.substring(0, 140)}`,
          fingerprint,
        });
      }
    });

    return notices.slice(0, 12);
  },
};

// ----------------------------------------------------
// 7. RAILWAY RRB ADAPTER
// ----------------------------------------------------
export const rrbAdapter: SourceAdapter = {
  name: 'rrb-adapter',
  canHandle(source, url) {
    return url.includes('rrb') || url.includes('indianrailways.gov.in') || source.name.toLowerCase().includes('railway');
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html);
    const notices: ParsedNotificationNotice[] = [];

    $('table tr').each((_, row) => {
      const $row = $(row);
      const text = $row.text().replace(/\s+/g, ' ').trim();
      if (!text || text.length < 15) return;

      let pdfUrl: string | null = null;
      $row.find('a[href*=".pdf" i]').each((_, a) => {
        const href = $(a).attr('href');
        const resolved = resolveUrl(href, baseUrl);
        if (resolved && !pdfUrl) pdfUrl = resolved;
      });

      const rowLink = $row.find('a').attr('href');
      const noticeUrl = resolveUrl(rowLink, baseUrl) || pdfUrl || baseUrl;
      const advtNum = extractAdvtNumber(text);
      const dateText = extractDateText(text);
      const fingerprint = generateNoticeFingerprint('railway.rrb', advtNum, noticeUrl, pdfUrl, text, dateText);

      if (!notices.some(n => n.fingerprint === fingerprint)) {
        notices.push({
          id: `notice-rrb-${fingerprint.substring(0, 10)}`,
          title: text.substring(0, 160),
          url: noticeUrl,
          pdfUrl,
          dateText,
          advtNumber: advtNum,
          categoryHint: classifyCategoryHint(text),
          snippet: `Indian Railways Official Update: ${text.substring(0, 140)}`,
          fingerprint,
        });
      }
    });

    return notices.slice(0, 10);
  },
};

// ----------------------------------------------------
// 8. DSSSB ADAPTER (Delhi Subordinate Services Selection Board)
// ----------------------------------------------------
export const dsssbAdapter: SourceAdapter = {
  name: 'dsssb-adapter',
  canHandle(source, url) {
    return url.includes('dsssb.delhi.gov.in') || source.name.toLowerCase().includes('dsssb');
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html);
    const notices: ParsedNotificationNotice[] = [];
    const domain = 'dsssb.delhi.gov.in';

    $('a[href*=".pdf" i], .views-row a, table tr a').each((_, a) => {
      const $a = $(a);
      const text = $a.text().replace(/\s+/g, ' ').trim();
      const href = $a.attr('href');
      if (!href || text.length < 15) return;

      const resolved = resolveUrl(href, baseUrl);
      if (!resolved) return;

      const pdfUrl = resolved.toLowerCase().endsWith('.pdf') ? resolved : null;
      const advtNum = extractAdvtNumber(text);
      const dateText = extractDateText(text);
      const fingerprint = generateNoticeFingerprint(domain, advtNum, resolved, pdfUrl, text, dateText);

      if (!notices.some(n => n.fingerprint === fingerprint)) {
        notices.push({
          id: `notice-dsssb-${fingerprint.substring(0, 10)}`,
          title: text,
          url: resolved,
          pdfUrl,
          dateText,
          advtNumber: advtNum,
          categoryHint: classifyCategoryHint(text),
          snippet: `DSSSB Delhi Notice: ${text.substring(0, 140)}`,
          fingerprint,
        });
      }
    });

    return notices.slice(0, 10);
  },
};

// ----------------------------------------------------
// 9. MPESB ADAPTER (MP Employees Selection Board)
// ----------------------------------------------------
export const esbMpAdapter: SourceAdapter = {
  name: 'esb-mp-adapter',
  canHandle(source, url) {
    return url.includes('esb.mp.gov.in') || source.name.toLowerCase().includes('mpesb') || source.name.toLowerCase().includes('mppeb');
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html);
    const notices: ParsedNotificationNotice[] = [];
    const domain = 'esb.mp.gov.in';

    $('a[href*=".pdf" i], .marquee a, table tr a').each((_, a) => {
      const $a = $(a);
      const text = $a.text().replace(/\s+/g, ' ').trim();
      const href = $a.attr('href');
      if (!href || text.length < 15) return;

      const resolved = resolveUrl(href, baseUrl);
      if (!resolved) return;

      const pdfUrl = resolved.toLowerCase().endsWith('.pdf') ? resolved : null;
      const advtNum = extractAdvtNumber(text);
      const dateText = extractDateText(text);
      const fingerprint = generateNoticeFingerprint(domain, advtNum, resolved, pdfUrl, text, dateText);

      if (!notices.some(n => n.fingerprint === fingerprint)) {
        notices.push({
          id: `notice-esb-${fingerprint.substring(0, 10)}`,
          title: text,
          url: resolved,
          pdfUrl,
          dateText,
          advtNumber: advtNum,
          categoryHint: classifyCategoryHint(text),
          snippet: `MPESB Bhopal Notice: ${text.substring(0, 140)}`,
          fingerprint,
        });
      }
    });

    return notices.slice(0, 10);
  },
};

// ----------------------------------------------------
// 10. DIRECT PDF ADAPTER
// ----------------------------------------------------
export const pdfAdapter: SourceAdapter = {
  name: 'direct-pdf-adapter',
  canHandle(source, url) {
    return source.contentType === 'PDF' || url.toLowerCase().endsWith('.pdf');
  },
  parse(source, _html, baseUrl) {
    let domain = 'official.gov.in';
    try {
      domain = new URL(baseUrl).hostname;
    } catch {
      domain = baseUrl;
    }
    const title = source.name.includes('PDF') ? source.name : `${source.name} Official Notification Document`;
    const advtNum = extractAdvtNumber(title);
    const fingerprint = generateNoticeFingerprint(domain, advtNum, baseUrl, baseUrl, title, null);

    return [
      {
        id: `notice-pdf-${fingerprint.substring(0, 10)}`,
        title,
        url: baseUrl,
        pdfUrl: baseUrl,
        dateText: null,
        advtNumber: advtNum,
        categoryHint: source.category || 'Sarkari Naukri',
        snippet: `Direct Official PDF Notification Document: ${baseUrl}`,
        fingerprint,
      },
    ];
  },
};

// ----------------------------------------------------
// 11. RSS / XML ADAPTER
// ----------------------------------------------------
export const rssAdapter: SourceAdapter = {
  name: 'rss-feed-adapter',
  canHandle(source, url, html) {
    return (
      source.contentType === 'RSS' ||
      url.includes('.rss') ||
      url.includes('/feed') ||
      html.startsWith('<?xml') ||
      html.includes('<rss') ||
      html.includes('<feed')
    );
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html, { xmlMode: true });
    const notices: ParsedNotificationNotice[] = [];
    let domain = 'official.gov.in';
    try {
      domain = new URL(baseUrl).hostname;
    } catch {
      domain = baseUrl;
    }

    $('item, entry').each((_, el) => {
      const $el = $(el);
      const title = $el.find('title').text().trim();
      const link = $el.find('link').text().trim() || $el.find('link').attr('href') || baseUrl;
      const pubDate = $el.find('pubDate, updated').text().trim();
      const resolved = resolveUrl(link, baseUrl) || baseUrl;
      if (!title || title.length < 8) return;

      const pdfUrl = resolved.toLowerCase().endsWith('.pdf') ? resolved : null;
      const advtNum = extractAdvtNumber(title);
      const dateText = extractDateText(pubDate) || pubDate;
      const fingerprint = generateNoticeFingerprint(domain, advtNum, resolved, pdfUrl, title, dateText);

      notices.push({
        id: `notice-rss-${fingerprint.substring(0, 10)}`,
        title,
        url: resolved,
        pdfUrl,
        dateText,
        advtNumber: advtNum,
        categoryHint: classifyCategoryHint(title),
        snippet: `Official RSS Update: ${title.substring(0, 140)}`,
        fingerprint,
      });
    });

    return notices.slice(0, 15);
  },
};

// ----------------------------------------------------
// 12. JSON / REST API ADAPTER
// ----------------------------------------------------
export const jsonApiAdapter: SourceAdapter = {
  name: 'json-api-adapter',
  canHandle(source, url, html) {
    if (source.contentType === 'JSON_API') return true;
    const trimmed = html.trim();
    return (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'));
  },
  parse(source, html, baseUrl) {
    const notices: ParsedNotificationNotice[] = [];
    let domain = 'official.gov.in';
    try {
      domain = new URL(baseUrl).hostname;
    } catch {
      domain = baseUrl;
    }

    try {
      const data = JSON.parse(html);
      const items = Array.isArray(data) ? data : (data.items || data.notices || data.data || data.results || []);

      for (const item of items) {
        if (!item || typeof item !== 'object') continue;
        const title = item.title || item.subject || item.name || item.heading || '';
        if (typeof title !== 'string' || title.length < 10) continue;

        const itemUrl = item.url || item.link || item.pdfUrl || baseUrl;
        const resolved = resolveUrl(itemUrl, baseUrl) || baseUrl;
        const pdfUrl = item.pdfUrl ? resolveUrl(item.pdfUrl, baseUrl) : (resolved.toLowerCase().endsWith('.pdf') ? resolved : null);
        const advtNum = item.advtNumber || extractAdvtNumber(title);
        const dateText = item.date || item.publishedDate || extractDateText(title);
        const fingerprint = generateNoticeFingerprint(domain, advtNum, resolved, pdfUrl, title, dateText);

        notices.push({
          id: `notice-api-${fingerprint.substring(0, 10)}`,
          title,
          url: resolved,
          pdfUrl,
          dateText,
          advtNumber: advtNum,
          categoryHint: classifyCategoryHint(title),
          snippet: `Official API Notice: ${title.substring(0, 140)}`,
          fingerprint,
        });
      }
    } catch {
      // JSON parse fallback
    }

    return notices.slice(0, 15);
  },
};

// ----------------------------------------------------
// 13. JS-HEAVY / SPA ADAPTER
// ----------------------------------------------------
export const jsHeavyAdapter: SourceAdapter = {
  name: 'js-heavy-spa-adapter',
  canHandle(source, _url, html) {
    if (source.contentType === 'JS_HEAVY') return true;
    return (
      html.includes('<app-root') ||
      (html.includes('id="root"') && html.length < 5000) ||
      (html.includes('id="__next"') && html.length < 5000)
    );
  },
  parse(_source, _html, _baseUrl) {
    // Client-side Angular/React SPA shells do not expose static links without browser execution
    return [];
  },
};

// ----------------------------------------------------
// 14. GENERIC ROBUST HTML ADAPTER (Safe Fallback)
// ----------------------------------------------------
export const genericHtmlAdapter: SourceAdapter = {
  name: 'generic-html-adapter',
  canHandle() {
    return true; // Universal fallback
  },
  parse(source, html, baseUrl) {
    const $ = cheerio.load(html);
    const notices: ParsedNotificationNotice[] = [];
    let domain = 'official.gov.in';
    try {
      domain = new URL(baseUrl).hostname;
    } catch {
      domain = baseUrl;
    }

    // Pattern A: Table rows
    $('table tr').each((_, row) => {
      const $row = $(row);
      const text = $row.text().replace(/\s+/g, ' ').trim();
      if (text.length < 15 || text.length > 500) return;

      let pdfUrl: string | null = null;
      let noticeUrl: string | null = null;

      $row.find('a').each((_, a) => {
        const href = $(a).attr('href');
        const resolved = resolveUrl(href, baseUrl);
        if (!resolved) return;
        if (resolved.toLowerCase().endsWith('.pdf') || resolved.includes('pdf')) {
          if (!pdfUrl) pdfUrl = resolved;
        } else if (!noticeUrl) {
          noticeUrl = resolved;
        }
      });

      if (!pdfUrl && !noticeUrl) return;

      const title = text.replace(/\s+/g, ' ');
      const advtNum = extractAdvtNumber(title);
      const dateText = extractDateText(title);
      const finalUrl = noticeUrl || pdfUrl || baseUrl;
      const fingerprint = generateNoticeFingerprint(domain, advtNum, finalUrl, pdfUrl, title, dateText);

      notices.push({
        id: `notice-gen-${fingerprint.substring(0, 10)}`,
        title: title.substring(0, 160),
        url: finalUrl,
        pdfUrl,
        dateText,
        advtNumber: advtNum,
        categoryHint: classifyCategoryHint(title),
        snippet: `Government Announcement: ${title.substring(0, 140)}`,
        fingerprint,
      });
    });

    // Pattern B: List items and article blocks with PDF or recruitment anchors
    if (notices.length < 3) {
      $('a[href*=".pdf" i], a[href*="notification" i], a[href*="recruitment" i], a[href*="advt" i], a[href*="notice" i]').each((_, a) => {
        const $a = $(a);
        const text = $a.text().replace(/\s+/g, ' ').trim();
        const href = $a.attr('href');
        const resolved = resolveUrl(href, baseUrl);
        if (!resolved || text.length < 12) return;

        const isPdf = resolved.toLowerCase().endsWith('.pdf') || resolved.includes('pdf');
        const pdfUrl = isPdf ? resolved : null;
        const advtNum = extractAdvtNumber(text);
        const dateText = extractDateText(text);
        const fingerprint = generateNoticeFingerprint(domain, advtNum, resolved, pdfUrl, text, dateText);

        if (!notices.some(n => n.fingerprint === fingerprint)) {
          notices.push({
            id: `notice-gen-${fingerprint.substring(0, 10)}`,
            title: text.substring(0, 160),
            url: resolved,
            pdfUrl,
            dateText,
            advtNumber: advtNum,
            categoryHint: classifyCategoryHint(text),
            snippet: `Official Government Link: ${text.substring(0, 140)}`,
            fingerprint,
          });
        }
      });
    }

    return notices.slice(0, 12);
  },
};

// ----------------------------------------------------
// ADAPTER REGISTRY & SELECTOR
// ----------------------------------------------------
const ALL_ADAPTERS: SourceAdapter[] = [
  pdfAdapter,
  rssAdapter,
  jsonApiAdapter,
  bpscAdapter,
  uppscAdapter,
  upprpbAdapter,
  ntaAdapter,
  employmentNewsAdapter,
  ibpsAdapter,
  rrbAdapter,
  dsssbAdapter,
  esbMpAdapter,
  jsHeavyAdapter,
  genericHtmlAdapter,
];

export function getAdapterForSource(source: StaffSource, url: string, html: string): SourceAdapter {
  for (const adapter of ALL_ADAPTERS) {
    if (adapter.canHandle(source, url, html)) {
      return adapter;
    }
  }
  return genericHtmlAdapter;
}
