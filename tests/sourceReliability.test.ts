import assert from 'node:assert';
import {
  resolveUrl,
  extractAdvtNumber,
  extractDateText,
  generateNoticeFingerprint,
  bpscAdapter,
  uppscAdapter,
  upprpbAdapter,
  ntaAdapter,
  genericHtmlAdapter,
  pdfAdapter,
  toStructuredNoticeDiscovery,
} from '../server/sourceAdapters';
import { testSingleSource } from '../server/sourceDiagnostics';
import { StaffSource } from '../src/types/aiStaff';

const mockSource: StaffSource = {
  id: 'test-src-001',
  name: 'Test Govt Commission',
  organization: 'Test State Personnel Department',
  department: 'State Personnel Dept',
  officialDomain: 'testportal.gov.in',
  primaryUrl: 'https://testportal.gov.in/notifications',
  url: 'https://testportal.gov.in/notifications',
  fallbackUrls: ['https://testportal.gov.in/notices-archive'],
  sourceType: 'Recruitment Boards',
  contentType: 'HTML_LIST',
  priority: 'HIGH',
  jurisdiction: 'State',
  state: 'Uttar Pradesh',
  stateCode: 'UP',
  stateName: 'Uttar Pradesh',
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
  verificationStatus: 'VERIFIED',
};

async function runTests() {
  console.log('--- STARTING AUTOMATED FAILURE CASE & RELIABILITY TESTS ---');
  let passedCount = 0;
  let totalCount = 0;

  function runCase(name: string, fn: () => void | Promise<void>) {
    totalCount++;
    try {
      fn();
      console.log(`✅ PASS: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ FAIL: ${name}`, err);
    }
  }

  async function runAsyncCase(name: string, fn: () => Promise<void>) {
    totalCount++;
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ FAIL: ${name}`, err);
    }
  }

  // 1. URL Resolution & Edge Cases
  runCase('Relative URLs resolve accurately against baseUrl', () => {
    const resolved = resolveUrl('/uploads/notice_2026.pdf', 'https://uppsc.up.nic.in/home.aspx');
    assert.strictEqual(resolved, 'https://uppsc.up.nic.in/uploads/notice_2026.pdf');
  });

  runCase('Malformed, anchor-only, or javascript: URLs return null without crashing', () => {
    assert.strictEqual(resolveUrl('javascript:void(0)', 'https://uppsc.up.nic.in'), null);
    assert.strictEqual(resolveUrl('#content', 'https://uppsc.up.nic.in'), null);
    assert.strictEqual(resolveUrl('', 'https://uppsc.up.nic.in'), null);
    assert.strictEqual(resolveUrl(undefined, 'https://uppsc.up.nic.in'), null);
  });

  // 2. Advertisement Number Extraction
  runCase('Extracts diverse Indian Govt Advt numbers reliably', () => {
    assert.strictEqual(extractAdvtNumber('Important Notice regarding Advt. No. 12/2026'), '12/2026');
    assert.strictEqual(extractAdvtNumber('Direct Recruitment Advt. No. D-2/E-1/2025 for RO/ARO'), 'D-2/E-1/2025');
    assert.strictEqual(extractAdvtNumber('CEN No. 01/2024 (ALP Recruitment)'), '01/2024');
    assert.strictEqual(extractAdvtNumber('General Notice without number'), null);
  });

  // 3. Date Text Parsing
  runCase('Extracts DD/MM/YYYY and Word Month dates safely, returns null if unparseable', () => {
    assert.strictEqual(extractDateText('Exam date scheduled on 15/09/2026 in Patna'), '15/09/2026');
    assert.strictEqual(extractDateText('Published on 04 Sep 2026 by Commission'), '04 Sep 2026');
    assert.strictEqual(extractDateText('No date mentioned anywhere'), null);
  });

  // 4. Duplicate Fingerprint Deduplication
  runCase('Notice fingerprints are deterministic and consistent', () => {
    const fp1 = generateNoticeFingerprint('uppsc.up.nic.in', 'A-1/2026', 'https://uppsc.up.nic.in/doc.pdf', 'https://uppsc.up.nic.in/doc.pdf', 'Review Officer', '12/09/2026');
    const fp2 = generateNoticeFingerprint('uppsc.up.nic.in', 'A-1/2026', 'https://uppsc.up.nic.in/other_page.html', null, 'Review Officer (Diff Title)', '15/09/2026');
    // Both share advt number, so priority 1 matches
    assert.strictEqual(fp1, fp2);
  });

  // 5. Malformed HTML handling
  runCase('Malformed HTML does not throw exceptions and yields safe results', () => {
    const brokenHtml = '<html><body><table><tr><td>No tags closed<td><td><div>Broken table</tr>';
    const notices = genericHtmlAdapter.parse(mockSource, brokenHtml, 'https://testportal.gov.in');
    assert(Array.isArray(notices));
  });

  // 6. Notice without title or empty elements
  runCase('Empty anchors and whitespace-only links are safely discarded', () => {
    const emptyHtml = '<div><a href="/doc1.pdf">   </a><a href="/doc2.pdf">Short</a></div>';
    const notices = genericHtmlAdapter.parse(mockSource, emptyHtml, 'https://testportal.gov.in');
    assert.strictEqual(notices.length, 0);
  });

  // 7. Structured Notice Discovery Mapping
  runCase('toStructuredNoticeDiscovery attaches all required Indian Govt metadata', () => {
    const mockParsed = {
      id: 'n-001',
      title: 'UP Combined State Upper Subordinate Exam 2026 Notification',
      url: 'https://uppsc.up.nic.in/Open_PDF_DB.aspx?id=123',
      pdfUrl: 'https://uppsc.up.nic.in/Open_PDF_DB.aspx?id=123',
      dateText: '04-09-2026',
      advtNumber: 'A-2/E-1/2026',
      categoryHint: 'Sarkari Naukri' as const,
      snippet: 'Important recruitment notice',
      fingerprint: 'abcdef123456',
    };

    const discovery = toStructuredNoticeDiscovery(mockParsed, mockSource);
    assert.strictEqual(discovery.officialDomain, 'testportal.gov.in');
    assert.strictEqual(discovery.jurisdiction, 'State');
    assert.strictEqual(discovery.stateName, 'Uttar Pradesh');
    assert.strictEqual(discovery.isPdf, true);
    assert.strictEqual(discovery.advtNumber, 'A-2/E-1/2026');
    assert(discovery.discoveredAt.length > 10);
  });

  // 8. Direct PDF Adapter Handling
  runCase('Direct PDF adapter handles direct notification links cleanly', () => {
    const pdfNotices = pdfAdapter.parse({ ...mockSource, contentType: 'PDF' }, '', 'https://uppsc.up.nic.in/notices/exam_2026.pdf');
    assert.strictEqual(pdfNotices.length, 1);
    assert.strictEqual(pdfNotices[0].pdfUrl, 'https://uppsc.up.nic.in/notices/exam_2026.pdf');
  });

  // 9. UPPSC Adapter specific testing
  runCase('UPPSC adapter filters Angular translation tokens and parses Open_PDF links', () => {
    const uppscHtml = `
      <div>
        <a href="Home.aspx">{{'Header_Menu' | translate}}</a>
        <a href="Open_PDF_DB.aspx?id=99">Important Notice regarding Advt. No. D-2/E-1/2025 Medical Officer Screening 2026</a>
      </div>
    `;
    const notices = uppscAdapter.parse(mockSource, uppscHtml, 'https://uppsc.up.nic.in');
    assert.strictEqual(notices.length, 1);
    assert.strictEqual(notices[0].advtNumber, 'D-2/E-1/2025');
    assert.strictEqual(notices[0].pdfUrl, 'https://uppsc.up.nic.in/Open_PDF_DB.aspx?id=99');
  });

  // 10. NTA Adapter "Read More" Parent Extraction
  runCase('NTA adapter extracts full notification title when link text is "Read More"', () => {
    const ntaHtml = `
      <div class="news-block">
        <p>Release of Admit Card for the UGC-NET June 2026 re-examination on 9th and 10th September 2026 -reg</p>
        <a href="/Download/Notice/Notice_20260904214736.pdf">Read More</a>
      </div>
    `;
    const notices = ntaAdapter.parse(mockSource, ntaHtml, 'https://nta.ac.in');
    assert.strictEqual(notices.length, 1);
    assert(notices[0].title.includes('UGC-NET June 2026'));
    assert.strictEqual(notices[0].pdfUrl, 'https://nta.ac.in/Download/Notice/Notice_20260904214736.pdf');
    assert.strictEqual(notices[0].dateText, '2026-09-04');
  });

  // 11. Network Diagnostic Failure Simulation (Invalid Domain / DNS failure)
  await runAsyncCase('Network diagnostic handles invalid domains gracefully with status FAILED', async () => {
    const badSource = { ...mockSource, url: 'https://non-existent-domain-nic-gov-in.org' };
    const res = await testSingleSource(badSource);
    assert.strictEqual(res.healthStatus, 'FAILED');
    assert.strictEqual(res.potentialNotificationsCount, 0);
    assert(res.failureReason !== null);
  });

  console.log(`\n--- TEST SUITE COMPLETE: ${passedCount}/${totalCount} tests passed ---`);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
