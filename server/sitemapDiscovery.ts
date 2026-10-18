import * as cheerio from 'cheerio';
import { safeSourceFetch } from './sourceFetcher';

export interface SitemapDiscoveryResult {
  hasSitemap: boolean;
  sitemapUrl: string | null;
  candidateUrls: string[];
  lastModifiedDates: Record<string, string>;
  error?: string;
}

const RECRUITMENT_URL_KEYWORDS = [
  'notice',
  'recruitment',
  'career',
  'vacancy',
  'advertisement',
  'advt',
  'circular',
  'notification',
  'result',
  'admit',
  'exam',
  'jobs',
];

/**
 * Discovers official sitemaps via robots.txt or standard sitemap.xml location
 * and collects candidate recruitment URLs without marking them as verified notices yet.
 */
export async function discoverOfficialSitemap(
  baseUrl: string,
  domain: string
): Promise<SitemapDiscoveryResult> {
  const candidateUrls = new Set<string>();
  const lastModifiedDates: Record<string, string> = {};
  let detectedSitemapUrl: string | null = null;

  try {
    const origin = new URL(baseUrl).origin;

    // 1. Check robots.txt for Sitemap declaration
    const robotsRes = await safeSourceFetch(`${origin}/robots.txt`, { timeoutMs: 4000 });
    if (robotsRes.ok && robotsRes.body) {
      const match = robotsRes.body.match(/^[Ss]itemap:\s*(https:\/\/[^\s\r\n]+)/m);
      if (match && match[1]) {
        detectedSitemapUrl = match[1].trim();
      }
    }

    // 2. If no sitemap found in robots.txt, try standard root sitemap.xml
    if (!detectedSitemapUrl) {
      detectedSitemapUrl = `${origin}/sitemap.xml`;
    }

    // 3. Fetch the sitemap
    const sitemapRes = await safeSourceFetch(detectedSitemapUrl, { timeoutMs: 6000 });
    if (!sitemapRes.ok || !sitemapRes.body) {
      return {
        hasSitemap: false,
        sitemapUrl: null,
        candidateUrls: [],
        lastModifiedDates: {},
      };
    }

    const xml = sitemapRes.body;
    const $ = cheerio.load(xml, { xmlMode: true });

    // 4. Check if it's a Sitemap Index
    const sitemaps = $('sitemap > loc');
    if (sitemaps.length > 0) {
      // Find sub-sitemaps mentioning recruitment or notices first
      let targetSubSitemaps: string[] = [];
      sitemaps.each((_, el) => {
        const loc = $(el).text().trim();
        if (loc.startsWith('https://')) {
          targetSubSitemaps.push(loc);
        }
      });

      // Filter sub-sitemaps by keyword if many, else take first 3
      const prioritySubs = targetSubSitemaps.filter(u =>
        RECRUITMENT_URL_KEYWORDS.some(kw => u.toLowerCase().includes(kw))
      );
      const toFetch = prioritySubs.length > 0 ? prioritySubs.slice(0, 3) : targetSubSitemaps.slice(0, 2);

      for (const subUrl of toFetch) {
        const subRes = await safeSourceFetch(subUrl, { timeoutMs: 5000 });
        if (subRes.ok && subRes.body) {
          const $sub = cheerio.load(subRes.body, { xmlMode: true });
          $sub('url').each((_, el) => {
            const loc = $sub(el).find('loc').text().trim();
            const lastmod = $sub(el).find('lastmod').text().trim();
            if (loc.startsWith('https://') && loc.includes(domain)) {
              if (RECRUITMENT_URL_KEYWORDS.some(kw => loc.toLowerCase().includes(kw))) {
                candidateUrls.add(loc);
                if (lastmod) lastModifiedDates[loc] = lastmod;
              }
            }
          });
        }
      }
    } else {
      // Direct URL set
      $('url').each((_, el) => {
        const loc = $(el).find('loc').text().trim();
        const lastmod = $(el).find('lastmod').text().trim();
        if (loc.startsWith('https://') && loc.includes(domain)) {
          if (RECRUITMENT_URL_KEYWORDS.some(kw => loc.toLowerCase().includes(kw))) {
            candidateUrls.add(loc);
            if (lastmod) lastModifiedDates[loc] = lastmod;
          }
        }
      });
    }

    return {
      hasSitemap: true,
      sitemapUrl: detectedSitemapUrl,
      candidateUrls: Array.from(candidateUrls).slice(0, 25),
      lastModifiedDates,
    };
  } catch (err: any) {
    return {
      hasSitemap: false,
      sitemapUrl: null,
      candidateUrls: [],
      lastModifiedDates: {},
      error: err.message || 'Sitemap discovery failed',
    };
  }
}

export interface DiscoveredSitemapNotice {
  title: string;
  url: string;
  publishedDate: string | null;
}

/**
 * Discovers recruitment notices via official sitemaps and formats them into candidate notice records.
 */
export async function discoverSitemapNotices(baseUrlOrDomain: string): Promise<DiscoveredSitemapNotice[]> {
  const url = baseUrlOrDomain.startsWith('http') ? baseUrlOrDomain : `https://${baseUrlOrDomain}`;
  let domain = baseUrlOrDomain;
  try {
    domain = new URL(url).hostname;
  } catch {
    // fallback
  }

  const result = await discoverOfficialSitemap(url, domain);
  if (!result.hasSitemap || result.candidateUrls.length === 0) {
    return [];
  }

  return result.candidateUrls.map(u => {
    const pathPart = u.split('/').pop() || '';
    const cleanTitle = decodeURIComponent(pathPart)
      .replace(/\.(pdf|html|aspx|php)$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const title = cleanTitle.length > 5 ? cleanTitle : `Official Notification: ${u}`;
    return {
      title,
      url: u,
      publishedDate: result.lastModifiedDates[u] || null,
    };
  });
}

