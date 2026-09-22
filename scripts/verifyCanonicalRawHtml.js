const fs = require('fs');
const path = require('path');
const { injectSeoMetadata } = require('../server/middleware/seoInjector');

const distPath = path.join(__dirname, '../client/dist');
const rawDistIndex = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');

const targetUrls = [
  '/interview-questions',
  '/interview-questions/javascript',
  '/interview-questions/react',
  '/interview-questions/nodejs',
];

console.log('================================================================');
console.log('1. PRE-RENDERED STATIC RAW HTML FILES ON DISK');
console.log('================================================================\n');

targetUrls.forEach(url => {
  const filePath = path.join(distPath, url.replace(/^\//, ''), 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');

  const matches = [...html.matchAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/gi)];
  const rootCanonicalLeak = html.includes('href="https://hireready-1-0hvc.onrender.com/"');

  console.log(`URL: ${url}`);
  console.log(`  File Path:              ${filePath}`);
  console.log(`  Canonical Tag Count:    ${matches.length}`);
  console.log(`  Raw Canonical Tag:      ${matches.length > 0 ? matches[0][0] : 'MISSING'}`);
  console.log(`  Extracted Canonical:    ${matches.length > 0 ? matches[0][1] : 'NONE'}`);
  console.log(`  Root Canonical Leak?:   ${rootCanonicalLeak ? '❌ LEAK FOUND' : '✅ CLEAN'}`);
  console.log('----------------------------------------------------------------');
});

console.log('\n================================================================');
console.log('2. DYNAMIC SERVER RESPONSE RAW HTML (via injectSeoMetadata)');
console.log('================================================================\n');

targetUrls.forEach(url => {
  const html = injectSeoMetadata(rawDistIndex, url);

  const matches = [...html.matchAll(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/gi)];
  const rootCanonicalLeak = html.includes('href="https://hireready-1-0hvc.onrender.com/"');

  console.log(`URL: ${url}`);
  console.log(`  Canonical Tag Count:    ${matches.length}`);
  console.log(`  Raw Canonical Tag:      ${matches.length > 0 ? matches[0][0] : 'MISSING'}`);
  console.log(`  Extracted Canonical:    ${matches.length > 0 ? matches[0][1] : 'NONE'}`);
  console.log(`  Root Canonical Leak?:   ${rootCanonicalLeak ? '❌ LEAK FOUND' : '✅ CLEAN'}`);
  console.log('----------------------------------------------------------------');
});
