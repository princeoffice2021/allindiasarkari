import { INITIAL_STAFF_SOURCES } from '../src/data/aiStaffDefaults';
import { testSingleSource } from '../server/sourceDiagnostics';
import { discoverOfficialSitemap } from '../server/sitemapDiscovery';
import * as fs from 'fs/promises';

async function diagnoseConfiguredSources() {
  console.log(`Starting real diagnostic of all ${INITIAL_STAFF_SOURCES.length} configured sources...`);
  const concurrency = 8;
  const results: any[] = [];

  for (let i = 0; i < INITIAL_STAFF_SOURCES.length; i += concurrency) {
    const chunk = INITIAL_STAFF_SOURCES.slice(i, i + concurrency);
    const chunkResults = await Promise.all(
      chunk.map(async source => {
        try {
          const testRes = await testSingleSource(source);
          // Check if sitemap was found
          let sitemapFound = false;
          try {
            const sm = await discoverOfficialSitemap(source.primaryUrl || source.url, testRes.domain);
            sitemapFound = sm.hasSitemap;
          } catch {}

          return {
            sourceId: source.id,
            sourceName: source.name,
            officialDomain: testRes.domain,
            primaryUrl: source.primaryUrl || source.url,
            httpStatus: testRes.httpStatus,
            responseType: testRes.detectedType,
            noticesDiscovered: testRes.potentialNotificationsCount,
            pdfsDiscovered: testRes.pdfLinksCount,
            sitemapDiscovered: sitemapFound,
            fallbackUsed: testRes.fallbackUsed || null,
            finalStatus: testRes.healthStatus,
            errorReason: testRes.failureReason,
            enabled: source.enabled || source.active,
            verificationStatus: source.verificationStatus || 'UNVERIFIED',
            priority: source.priority || 'P2',
          };
        } catch (err: any) {
          return {
            sourceId: source.id,
            sourceName: source.name,
            officialDomain: source.officialDomain,
            primaryUrl: source.primaryUrl || source.url,
            httpStatus: null,
            responseType: 'HTML_LIST',
            noticesDiscovered: 0,
            pdfsDiscovered: 0,
            sitemapDiscovered: false,
            fallbackUsed: null,
            finalStatus: 'FAILED',
            errorReason: err.message || 'Diagnostic execution failed',
            enabled: source.enabled || source.active,
            verificationStatus: source.verificationStatus || 'UNVERIFIED',
            priority: source.priority || 'P2',
          };
        }
      })
    );

    results.push(...chunkResults);
    process.stdout.write(`Completed ${results.length}/${INITIAL_STAFF_SOURCES.length}...\n`);
  }

  await fs.writeFile('audit-64-sources.json', JSON.stringify(results, null, 2));
  console.log('Saved 64 source audit results to audit-64-sources.json');

  // Summary counts
  const summary = {
    total: results.length,
    enabled: results.filter(r => r.enabled).length,
    verified: results.filter(r => r.verificationStatus === 'VERIFIED').length,
    healthy: results.filter(r => r.finalStatus === 'HEALTHY').length,
    partial: results.filter(r => r.finalStatus === 'PARTIAL').length,
    emptyNotices: results.filter(r => r.finalStatus === 'EMPTY_NOTICES').length,
    jsRequired: results.filter(r => r.finalStatus === 'JS_REQUIRED').length,
    blocked: results.filter(r => r.finalStatus === 'BLOCKED').length,
    failed: results.filter(r => r.finalStatus === 'FAILED' || r.finalStatus === 'DEGRADED').length,
    unverified: results.filter(r => r.verificationStatus === 'UNVERIFIED').length,
  };

  console.log('\n--- LIVE AUDIT SUMMARY ---');
  console.log(JSON.stringify(summary, null, 2));
}

diagnoseConfiguredSources().catch(console.error);
