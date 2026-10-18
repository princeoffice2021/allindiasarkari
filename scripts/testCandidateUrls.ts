import { safeSourceFetch } from '../server/sourceFetcher';

interface Candidate {
  id: string;
  name: string;
  domain: string;
  url: string;
  fallbacks: string[];
}

const candidates: Candidate[] = [
  // Central
  { id: 'src-upsc', name: 'Union Public Service Commission (UPSC)', domain: 'upsc.gov.in', url: 'https://upsc.gov.in', fallbacks: ['https://upsc.gov.in/whats-new'] },
  { id: 'src-ssc', name: 'Staff Selection Commission (SSC)', domain: 'ssc.gov.in', url: 'https://ssc.gov.in', fallbacks: ['https://ssc.nic.in'] },
  { id: 'src-nta', name: 'National Testing Agency (NTA)', domain: 'nta.ac.in', url: 'https://nta.ac.in', fallbacks: [] },
  { id: 'src-ibps', name: 'Institute of Banking Personnel Selection (IBPS)', domain: 'ibps.in', url: 'https://ibps.in', fallbacks: [] },
  { id: 'src-employment-news', name: 'Employment News', domain: 'employmentnews.gov.in', url: 'https://employmentnews.gov.in', fallbacks: [] },
  { id: 'src-indiapost', name: 'India Post', domain: 'indiapost.gov.in', url: 'https://www.indiapost.gov.in', fallbacks: ['https://www.indiapost.gov.in/VAS/Pages/Recruitment.aspx'] },
  { id: 'src-drdo', name: 'DRDO', domain: 'drdo.gov.in', url: 'https://drdo.gov.in', fallbacks: ['https://www.drdo.gov.in/careers'] },
  { id: 'src-isro', name: 'ISRO', domain: 'isro.gov.in', url: 'https://isro.gov.in', fallbacks: ['https://www.isro.gov.in/Careers.html'] },
  { id: 'src-sbi-careers', name: 'SBI Careers', domain: 'sbi.co.in', url: 'https://sbi.co.in/web/careers', fallbacks: [] },
  { id: 'src-rbi', name: 'RBI Opportunities', domain: 'rbi.org.in', url: 'https://rbi.org.in', fallbacks: ['https://opportunities.rbi.org.in'] },
  { id: 'src-nabard', name: 'NABARD', domain: 'nabard.org', url: 'https://www.nabard.org', fallbacks: ['https://www.nabard.org/careers-notices.aspx'] },
  { id: 'src-sebi', name: 'SEBI Careers', domain: 'sebi.gov.in', url: 'https://www.sebi.gov.in', fallbacks: ['https://www.sebi.gov.in/department/human-resources-department-37/career-37.html'] },
  { id: 'src-lic', name: 'LIC Careers', domain: 'licindia.in', url: 'https://licindia.in', fallbacks: ['https://licindia.in/Bottom-Links/Careers'] },
  { id: 'src-epfo', name: 'EPFO', domain: 'epfindia.gov.in', url: 'https://www.epfindia.gov.in', fallbacks: ['https://www.epfindia.gov.in/site_en/Recruitments.php'] },
  { id: 'src-esic', name: 'ESIC', domain: 'esic.gov.in', url: 'https://www.esic.gov.in', fallbacks: ['https://www.esic.gov.in/recruitments'] },
  { id: 'src-fci', name: 'FCI', domain: 'fci.gov.in', url: 'https://fci.gov.in', fallbacks: ['https://fci.gov.in/current-vacancies.php'] },
  { id: 'src-aiims-delhi', name: 'AIIMS New Delhi', domain: 'aiims.edu', url: 'https://www.aiims.edu', fallbacks: ['https://www.aiims.edu/en/notices/recruitment'] },
  { id: 'src-jipmer', name: 'JIPMER', domain: 'jipmer.edu.in', url: 'https://jipmer.edu.in', fallbacks: ['https://jipmer.edu.in/announcement/jobs'] },
  { id: 'src-cbse', name: 'CBSE', domain: 'cbse.gov.in', url: 'https://www.cbse.gov.in', fallbacks: [] },
  { id: 'src-cisce', name: 'CISCE', domain: 'cisce.org', url: 'https://cisce.org', fallbacks: [] },
  { id: 'src-indian-army', name: 'Indian Army Recruitment', domain: 'joinindianarmy.nic.in', url: 'https://joinindianarmy.nic.in', fallbacks: [] },
  { id: 'src-indian-navy', name: 'Indian Navy Recruitment', domain: 'joinindiannavy.gov.in', url: 'https://www.joinindiannavy.gov.in', fallbacks: [] },
  { id: 'src-indian-airforce', name: 'Indian Air Force (Agniveer Vayu)', domain: 'agnipathvayu.cdac.in', url: 'https://agnipathvayu.cdac.in', fallbacks: [] },
  { id: 'src-coast-guard', name: 'Indian Coast Guard', domain: 'joinindiancoastguard.cdac.in', url: 'https://joinindiancoastguard.cdac.in', fallbacks: [] },
  // States
  { id: 'src-bpsc', name: 'Bihar BPSC', domain: 'bpsc.bihar.gov.in', url: 'https://bpsc.bihar.gov.in', fallbacks: [] },
  { id: 'src-uppsc', name: 'UPPSC', domain: 'uppsc.up.nic.in', url: 'https://uppsc.up.nic.in', fallbacks: [] },
  { id: 'src-uppbpb', name: 'UPPRPB', domain: 'uppbpb.gov.in', url: 'https://uppbpb.gov.in', fallbacks: [] },
  { id: 'src-upsssc', name: 'UPSSSC', domain: 'upsssc.gov.in', url: 'https://upsssc.gov.in', fallbacks: [] },
  { id: 'src-rpsc', name: 'Rajasthan RPSC', domain: 'rpsc.rajasthan.gov.in', url: 'https://rpsc.rajasthan.gov.in', fallbacks: [] },
  { id: 'src-rssb', name: 'Rajasthan RSSB', domain: 'rsmssb.rajasthan.gov.in', url: 'https://rsmssb.rajasthan.gov.in', fallbacks: [] },
  { id: 'src-esb-mp', name: 'MPESB', domain: 'esb.mp.gov.in', url: 'https://esb.mp.gov.in', fallbacks: [] },
  { id: 'src-mppsc', name: 'MPPSC', domain: 'mppsc.mp.gov.in', url: 'https://mppsc.mp.gov.in', fallbacks: [] },
  { id: 'src-hpsc', name: 'Haryana HPSC', domain: 'hpsc.gov.in', url: 'https://hpsc.gov.in', fallbacks: [] },
  { id: 'src-hssc', name: 'Haryana HSSC', domain: 'hssc.gov.in', url: 'https://hssc.gov.in', fallbacks: [] },
  { id: 'src-ppsc', name: 'Punjab PPSC', domain: 'ppsc.gov.in', url: 'https://ppsc.gov.in', fallbacks: [] },
  { id: 'src-psssb', name: 'Punjab PSSSB', domain: 'sssb.punjab.gov.in', url: 'https://sssb.punjab.gov.in', fallbacks: [] },
  { id: 'src-hppsc', name: 'Himachal HPPSC', domain: 'hppsc.hp.gov.in', url: 'https://hppsc.hp.gov.in', fallbacks: [] },
  { id: 'src-ukpsc', name: 'Uttarakhand UKPSC', domain: 'psc.uk.gov.in', url: 'https://psc.uk.gov.in', fallbacks: [] },
  { id: 'src-uksssc', name: 'Uttarakhand UKSSSC', domain: 'sssc.uk.gov.in', url: 'https://sssc.uk.gov.in', fallbacks: [] },
  { id: 'src-dsssb', name: 'Delhi DSSSB', domain: 'dsssb.delhi.gov.in', url: 'https://dsssb.delhi.gov.in', fallbacks: [] },
  { id: 'src-gpsc', name: 'Gujarat GPSC', domain: 'gpsc.gujarat.gov.in', url: 'https://gpsc.gujarat.gov.in', fallbacks: [] },
  { id: 'src-gsssb', name: 'Gujarat GSSSB', domain: 'gsssb.gujarat.gov.in', url: 'https://gsssb.gujarat.gov.in', fallbacks: [] },
  { id: 'src-mpsc', name: 'Maharashtra MPSC', domain: 'mpsc.gov.in', url: 'https://mpsc.gov.in', fallbacks: [] },
  { id: 'src-wbpsc', name: 'West Bengal WBPSC', domain: 'psc.wb.gov.in', url: 'https://psc.wb.gov.in', fallbacks: [] },
  { id: 'src-wbprb', name: 'West Bengal Police WBPPRB', domain: 'prb.wb.gov.in', url: 'https://prb.wb.gov.in', fallbacks: [] },
  { id: 'src-opsc', name: 'Odisha OPSC', domain: 'opsc.gov.in', url: 'https://opsc.gov.in', fallbacks: [] },
  { id: 'src-osssc', name: 'Odisha OSSSC', domain: 'osssc.gov.in', url: 'https://osssc.gov.in', fallbacks: [] },
  { id: 'src-jpsc', name: 'Jharkhand JPSC', domain: 'jpsc.gov.in', url: 'https://jpsc.gov.in', fallbacks: [] },
  { id: 'src-jssc', name: 'Jharkhand JSSC', domain: 'jssc.nic.in', url: 'https://jssc.nic.in', fallbacks: [] },
  { id: 'src-cgpsc', name: 'Chhattisgarh CGPSC', domain: 'psc.cg.gov.in', url: 'https://psc.cg.gov.in', fallbacks: [] },
  { id: 'src-cgvyapam', name: 'Chhattisgarh Vyapam', domain: 'vyapam.cgstate.gov.in', url: 'https://vyapam.cgstate.gov.in', fallbacks: [] },
  { id: 'src-kpsc', name: 'Karnataka KPSC', domain: 'kpsc.kar.nic.in', url: 'https://kpsc.kar.nic.in', fallbacks: [] },
  { id: 'src-kea', name: 'Karnataka KEA', domain: 'cetonline.karnataka.gov.in', url: 'https://cetonline.karnataka.gov.in/kea/', fallbacks: [] },
  { id: 'src-tnpsc', name: 'Tamil Nadu TNPSC', domain: 'tnpsc.gov.in', url: 'https://tnpsc.gov.in', fallbacks: [] },
  { id: 'src-tnusrb', name: 'Tamil Nadu TNUSRB', domain: 'tnusrb.tn.gov.in', url: 'https://tnusrb.tn.gov.in', fallbacks: [] },
  { id: 'src-keralapsc', name: 'Kerala PSC', domain: 'keralapsc.gov.in', url: 'https://keralapsc.gov.in', fallbacks: [] },
  { id: 'src-appsc', name: 'Andhra Pradesh APPSC', domain: 'psc.ap.gov.in', url: 'https://psc.ap.gov.in', fallbacks: [] },
  { id: 'src-tspsc', name: 'Telangana TGPSC', domain: 'tspsc.gov.in', url: 'https://tspsc.gov.in', fallbacks: [] },
  { id: 'src-apsc', name: 'Assam APSC', domain: 'apsc.nic.in', url: 'https://apsc.nic.in', fallbacks: [] },
  { id: 'src-appsc-arunachal', name: 'Arunachal Pradesh APPSC', domain: 'appsc.gov.in', url: 'https://appsc.gov.in', fallbacks: [] },
  { id: 'src-mpsc-manipur', name: 'Manipur MPSC', domain: 'mpscmanipur.gov.in', url: 'https://mpscmanipur.gov.in', fallbacks: [] },
  { id: 'src-mpsc-meghalaya', name: 'Meghalaya MPSC', domain: 'mpsc.nic.in', url: 'https://mpsc.nic.in', fallbacks: [] },
  { id: 'src-mpsc-mizoram', name: 'Mizoram MPSC', domain: 'mpsc.mizoram.gov.in', url: 'https://mpsc.mizoram.gov.in', fallbacks: [] },
  { id: 'src-npsc-nagaland', name: 'Nagaland NPSC', domain: 'npsc.nagaland.gov.in', url: 'https://npsc.nagaland.gov.in', fallbacks: [] },
  { id: 'src-tpsc-tripura', name: 'Tripura TPSC', domain: 'tpsc.tripura.gov.in', url: 'https://tpsc.tripura.gov.in', fallbacks: [] },
  { id: 'src-spsc-sikkim', name: 'Sikkim SPSC', domain: 'spsc.sikkim.gov.in', url: 'https://spsc.sikkim.gov.in', fallbacks: [] },
  { id: 'src-gpsc-goa', name: 'Goa GPSC', domain: 'gpsc.goa.gov.in', url: 'https://gpsc.goa.gov.in', fallbacks: [] },
  { id: 'src-jkpsc', name: 'J&K JKPSC', domain: 'jkpsc.nic.in', url: 'https://jkpsc.nic.in', fallbacks: [] },
  { id: 'src-jkssb', name: 'J&K JKSSB', domain: 'jkssb.nic.in', url: 'https://jkssb.nic.in', fallbacks: [] },
  { id: 'src-ladakh', name: 'Ladakh Administration', domain: 'ladakh.gov.in', url: 'https://ladakh.gov.in', fallbacks: [] },
  // Regional RRBs (21)
  { id: 'src-rrb-ahmedabad', name: 'RRB Ahmedabad', domain: 'rrbahmedabad.gov.in', url: 'https://www.rrbahmedabad.gov.in', fallbacks: [] },
  { id: 'src-rrb-ajmer', name: 'RRB Ajmer', domain: 'rrbajmer.gov.in', url: 'https://www.rrbajmer.gov.in', fallbacks: [] },
  { id: 'src-rrb-ald', name: 'RRB Prayagraj', domain: 'rrbald.gov.in', url: 'https://www.rrbald.gov.in', fallbacks: [] },
  { id: 'src-rrb-bengaluru', name: 'RRB Bengaluru', domain: 'rrbbnc.gov.in', url: 'https://www.rrbbnc.gov.in', fallbacks: [] },
  { id: 'src-rrb-bhopal', name: 'RRB Bhopal', domain: 'rrbbhopal.gov.in', url: 'https://www.rrbbhopal.gov.in', fallbacks: [] },
  { id: 'src-rrb-bhubaneswar', name: 'RRB Bhubaneswar', domain: 'rrbbbs.gov.in', url: 'https://www.rrbbbs.gov.in', fallbacks: [] },
  { id: 'src-rrb-bilaspur', name: 'RRB Bilaspur', domain: 'rrbbilaspur.gov.in', url: 'https://www.rrbbilaspur.gov.in', fallbacks: [] },
  { id: 'src-rrb-chandigarh', name: 'RRB Chandigarh', domain: 'rrbcdg.gov.in', url: 'https://www.rrbcdg.gov.in', fallbacks: [] },
  { id: 'src-rrb-chennai', name: 'RRB Chennai', domain: 'rrbchennai.gov.in', url: 'https://www.rrbchennai.gov.in', fallbacks: [] },
  { id: 'src-rrb-gorakhpur', name: 'RRB Gorakhpur', domain: 'rrbgkp.gov.in', url: 'https://www.rrbgkp.gov.in', fallbacks: [] },
  { id: 'src-rrb-guwahati', name: 'RRB Guwahati', domain: 'rrbguwahati.gov.in', url: 'https://www.rrbguwahati.gov.in', fallbacks: [] },
  { id: 'src-rrb-jammu', name: 'RRB Jammu Srinagar', domain: 'rrbjammu.nic.in', url: 'https://www.rrbjammu.nic.in', fallbacks: [] },
  { id: 'src-rrb-kolkata', name: 'RRB Kolkata', domain: 'rrbkolkata.gov.in', url: 'https://www.rrbkolkata.gov.in', fallbacks: [] },
  { id: 'src-rrb-malda', name: 'RRB Malda', domain: 'rrbmalda.gov.in', url: 'https://www.rrbmalda.gov.in', fallbacks: [] },
  { id: 'src-rrb-mumbai', name: 'RRB Mumbai', domain: 'rrbmumbai.gov.in', url: 'https://www.rrbmumbai.gov.in', fallbacks: [] },
  { id: 'src-rrb-muzaffarpur', name: 'RRB Muzaffarpur', domain: 'rrbmuzaffarpur.gov.in', url: 'https://www.rrbmuzaffarpur.gov.in', fallbacks: [] },
  { id: 'src-rrb-patna', name: 'RRB Patna', domain: 'rrbpatna.gov.in', url: 'https://www.rrbpatna.gov.in', fallbacks: [] },
  { id: 'src-rrb-ranchi', name: 'RRB Ranchi', domain: 'rrbranchi.gov.in', url: 'https://www.rrbranchi.gov.in', fallbacks: [] },
  { id: 'src-rrb-secunderabad', name: 'RRB Secunderabad', domain: 'rrbsecunderabad.gov.in', url: 'https://www.rrbsecunderabad.gov.in', fallbacks: [] },
  { id: 'src-rrb-siliguri', name: 'RRB Siliguri', domain: 'rrbsiliguri.gov.in', url: 'https://www.rrbsiliguri.gov.in', fallbacks: [] },
  { id: 'src-rrb-thiruvananthapuram', name: 'RRB Thiruvananthapuram', domain: 'rrbthiruvananthapuram.gov.in', url: 'https://www.rrbthiruvananthapuram.gov.in', fallbacks: [] },
];

async function runTest() {
  console.log(`Starting real network testing of ${candidates.length} official candidates...`);
  const concurrency = 10;
  const results: any[] = [];

  for (let i = 0; i < candidates.length; i += concurrency) {
    const slice = candidates.slice(i, i + concurrency);
    const sliceResults = await Promise.all(
      slice.map(async c => {
        const res = await safeSourceFetch(c.url, { timeoutMs: 3500 });
        let isSpa = false;
        let noticeLinks = 0;
        let pdfLinks = 0;

        if (res.ok && res.body) {
          const lower = res.body.toLowerCase();
          isSpa = lower.includes('<app-root') || lower.includes('id="root"') || (lower.includes('<noscript>') && res.body.length < 5000);
          const pdfMatches = lower.match(/\.pdf/g);
          pdfLinks = pdfMatches ? pdfMatches.length : 0;
          const noticeMatches = lower.match(/(?:recruitment|notice|advt|notification|result|admit)/g);
          noticeLinks = noticeMatches ? noticeMatches.length : 0;
        }

        return {
          id: c.id,
          name: c.name,
          domain: c.domain,
          url: c.url,
          status: res.status,
          ok: res.ok,
          reason: res.reasonCode,
          responseTimeMs: res.responseTimeMs,
          isSpa,
          pdfLinks,
          noticeLinks,
          bodyLength: res.body.length,
        };
      })
    );
    results.push(...sliceResults);
    process.stdout.write(`Tested ${results.length}/${candidates.length}...\n`);
  }

  // Write results to json file
  const fs = await import('fs/promises');
  await fs.writeFile('candidate-test-results.json', JSON.stringify(results, null, 2));
  console.log('Results saved to candidate-test-results.json');
}

runTest().catch(console.error);
