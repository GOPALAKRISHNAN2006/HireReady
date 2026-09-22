/**
 * Post-Build Static HTML Prerenderer for Public SEO Routes
 * Generates pre-rendered index.html files with route-specific canonical tags & metadata
 * into client/dist/ for static file hosting and SSR fallback.
 */

const fs = require('fs');
const path = require('path');
const { PUBLIC_SEO_ROUTES } = require('../server/config/seoRoutes');
const { injectSeoMetadata } = require('../server/middleware/seoInjector');

const distPath = path.join(__dirname, '../client/dist');
const distIndexPath = path.join(distPath, 'index.html');

function prerenderSeoRoutes() {
  if (!fs.existsSync(distIndexPath)) {
    console.warn('⚠️ client/dist/index.html not found. Run vite build first.');
    return;
  }

  console.log('🚀 Starting Post-Build SEO HTML Prerendering...');
  const baseHtml = fs.readFileSync(distIndexPath, 'utf8');

  let prerenderedCount = 0;

  for (const routePath of Object.keys(PUBLIC_SEO_ROUTES)) {
    const injectedHtml = injectSeoMetadata(baseHtml, routePath);

    if (routePath === '/') {
      // Overwrite main dist/index.html with root SEO metadata
      fs.writeFileSync(distIndexPath, injectedHtml, 'utf8');
      prerenderedCount++;
      console.log(`  ✓ Prerendered root: / -> client/dist/index.html`);
    } else {
      // Create subfolder e.g. client/dist/interview-questions/react/index.html
      const routeDir = path.join(distPath, routePath.replace(/^\//, ''));
      fs.mkdirSync(routeDir, { recursive: true });
      const targetHtmlFile = path.join(routeDir, 'index.html');
      fs.writeFileSync(targetHtmlFile, injectedHtml, 'utf8');
      prerenderedCount++;
      console.log(
        `  ✓ Prerendered route: ${routePath} -> ${path.relative(distPath, targetHtmlFile)}`
      );
    }
  }

  console.log(`✅ SEO Prerendering complete! ${prerenderedCount} public routes prerendered.`);
}

if (require.main === module) {
  prerenderSeoRoutes();
}

module.exports = { prerenderSeoRoutes };
