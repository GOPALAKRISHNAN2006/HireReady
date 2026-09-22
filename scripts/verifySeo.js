const fs = require('fs');
const path = require('path');
const { injectSeoMetadata } = require('../server/middleware/seoInjector');

const publicRoutes = [
  '/',
  '/interview-questions',
  '/interview-questions/react',
  '/interview-questions/javascript',
  '/interview-questions/nodejs',
  '/interview-questions/java',
  '/interview-questions/sql',
  '/full-stack-interview-roadmap',
  '/privacy',
  '/terms',
  '/contact',
];

const privateRoutes = ['/dashboard', '/profile', '/admin'];

const distPath = path.join(__dirname, '../client/dist');
const baseTemplate = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');

async function verifyAll() {
  console.log('🔍 Comprehensive Verification of Pre-Rendered & Dynamic Server SEO HTML...\n');

  let allPassed = true;

  // 1. Verify Public Pre-rendered Static HTML files
  for (const r of publicRoutes) {
    const cleanPath = r === '/' ? '/' : r.replace(/\/$/, '');
    const file =
      cleanPath === '/'
        ? path.join(distPath, 'index.html')
        : path.join(distPath, cleanPath.replace(/^\//, ''), 'index.html');

    if (!fs.existsSync(file)) {
      console.error(`❌ Offline file missing for route ${r}`);
      allPassed = false;
      continue;
    }

    const html = fs.readFileSync(file, 'utf8');

    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

    const homepageCanonicalLeak =
      html.includes('href="https://hireready-1-0hvc.onrender.com/"') && r !== '/';

    console.log(`==================================================`);
    console.log(`Public Route: ${r}`);
    console.log(`==================================================`);
    console.log(`  <link rel="canonical">: ${canonicalMatch ? canonicalMatch[1] : '❌ MISSING'}`);
    console.log(`  <title>:              ${titleMatch ? titleMatch[1] : '❌ MISSING'}`);
    console.log(`  <h1> (Unique Body):   ${h1Match ? h1Match[1] : '❌ MISSING'}`);
    console.log(`  <meta name="robots">:  ${robotsMatch ? robotsMatch[1] : '❌ MISSING'}`);
    console.log(
      `  Homepage Leak Check:   ${homepageCanonicalLeak ? '⚠️ LEAK DETECTED' : '✅ CLEAN'}`
    );
    console.log('');

    if (!canonicalMatch || !robotsMatch || !titleMatch || !h1Match || homepageCanonicalLeak) {
      allPassed = false;
    }
  }

  // 2. Verify Dynamic Injection for Private Routes
  for (const r of privateRoutes) {
    const dynamicHtml = injectSeoMetadata(baseTemplate, r);
    const robotsMatch = dynamicHtml.match(
      /<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i
    );
    const isNoIndex = robotsMatch && robotsMatch[1] === 'noindex, nofollow';

    console.log(`==================================================`);
    console.log(`Private Route: ${r}`);
    console.log(`==================================================`);
    console.log(`  <meta name="robots">: ${robotsMatch ? robotsMatch[1] : '❌ MISSING'}`);
    console.log(
      `  Protection Check:    ${isNoIndex ? '✅ PROTECTED (noindex)' : '❌ UNPROTECTED'}`
    );
    console.log('');

    if (!isNoIndex) {
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log('🎉 ALL PUBLIC & PRIVATE ROUTE SEO VERIFICATIONS PASSED PERFECTLY (100%)!');
  } else {
    console.error('❌ SOME ROUTE VERIFICATIONS FAILED');
    process.exit(1);
  }
}

verifyAll().catch(err => {
  console.error(err);
  process.exit(1);
});
