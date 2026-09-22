const http = require('http');

const targetUrls = [
  '/',
  '/interview-questions',
  '/interview-questions/javascript',
  '/interview-questions/react',
  '/interview-questions/nodejs',
  '/interview-questions/java',
  '/interview-questions/sql',
  '/full-stack-interview-roadmap',
  '/privacy',
  '/terms',
  '/contact',
];

function fetchRawHtml(urlPath) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://localhost:5000${urlPath}`, res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, html: data }));
      })
      .on('error', reject);
  });
}

async function runLiveVerification() {
  console.log('================================================================');
  console.log('RAW HTTP RESPONSE VERIFICATION FROM LIVE SERVER (http://localhost:5000)');
  console.log('================================================================\n');

  let allPassed = true;

  for (const urlPath of targetUrls) {
    try {
      const { status, html } = await fetchRawHtml(urlPath);
      const matches = [...html.matchAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/gi)];
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

      const rootCanonicalLeak =
        html.includes('href="https://hireready-1-0hvc.onrender.com/"') && urlPath !== '/';

      console.log(`URL: ${urlPath} (HTTP ${status})`);
      console.log(`  Canonical Tag Count:    ${matches.length}`);
      console.log(`  Raw Canonical Tag:      ${matches.length > 0 ? matches[0][0] : 'MISSING'}`);
      console.log(`  Extracted Canonical:    ${matches.length > 0 ? matches[0][1] : 'NONE'}`);
      console.log(`  Extracted Title:        ${titleMatch ? titleMatch[1] : 'NONE'}`);
      console.log(`  Extracted H1 Body:      ${h1Match ? h1Match[1] : 'NONE'}`);
      console.log(`  Root Canonical Leak?:   ${rootCanonicalLeak ? '❌ LEAK FOUND' : '✅ CLEAN'}`);
      console.log('----------------------------------------------------------------');

      if (matches.length !== 1 || rootCanonicalLeak || !titleMatch || !h1Match) {
        allPassed = false;
      }
    } catch (err) {
      console.error(`Failed to fetch ${urlPath}:`, err.message);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('🎉 ALL LIVE RAW HTTP RESPONSE VERIFICATIONS PASSED 100% PERFECTLY!');
  } else {
    console.error('❌ LIVE HTTP VERIFICATION FAILED FOR SOME ROUTES');
    process.exit(1);
  }
}

runLiveVerification();
