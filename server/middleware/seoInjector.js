const { getSeoMetadataForPath, getPreRenderedBodyForPath } = require('../config/seoRoutes');

/**
 * Escapes attribute values for safe HTML rendering
 */
function escapeHtmlAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Injects route-specific SEO metadata and unique pre-rendered HTML body
 * into an HTML index template string.
 * @param {string} htmlTemplate - Raw HTML index content
 * @param {string} reqPath - Request path (e.g. /interview-questions/react)
 * @returns {string} Injected HTML content
 */
function injectSeoMetadata(htmlTemplate, reqPath) {
  if (!htmlTemplate || typeof htmlTemplate !== 'string') {
    return htmlTemplate;
  }

  const meta = getSeoMetadataForPath(reqPath);
  const routeBodyHtml = getPreRenderedBodyForPath(reqPath);

  // 1. Remove any existing title, description, robots, canonical, og, twitter, or previous injected comment blocks
  let cleanedHtml = htmlTemplate
    .replace(/<!--\s*Primary SEO Metadata[\s\S]*?<!--\s*Twitter Card Metadata[^>]*-->/gi, '')
    .replace(/<title>[^<]*<\/title>/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+name=["']robots["'][^>]*\/?>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*\/?>/gi, '');

  // 2. Construct fresh, clean SEO head block
  const seoHeadTags = `
    <!-- Primary SEO Metadata (Server-Injected) -->
    <title>${escapeHtmlAttr(meta.title)}</title>
    <meta name="description" content="${escapeHtmlAttr(meta.description)}" />
    <meta name="robots" content="${escapeHtmlAttr(meta.robots)}" />
    <link rel="canonical" href="${escapeHtmlAttr(meta.canonical)}" />

    <!-- Open Graph Metadata -->
    <meta property="og:site_name" content="HireReady" />
    <meta property="og:title" content="${escapeHtmlAttr(meta.ogTitle || meta.title)}" />
    <meta property="og:description" content="${escapeHtmlAttr(meta.ogDescription || meta.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtmlAttr(meta.ogUrl || meta.canonical)}" />
    <meta property="og:image" content="${escapeHtmlAttr(meta.ogImage)}" />

    <!-- Twitter Card Metadata -->
    <meta name="twitter:card" content="${escapeHtmlAttr(meta.twitterCard || 'summary_large_image')}" />
    <meta name="twitter:title" content="${escapeHtmlAttr(meta.ogTitle || meta.title)}" />
    <meta name="twitter:description" content="${escapeHtmlAttr(meta.ogDescription || meta.description)}" />
    <meta name="twitter:image" content="${escapeHtmlAttr(meta.twitterImage || meta.ogImage)}" />
`;

  // 3. Inject head metadata before </head>
  if (cleanedHtml.includes('</head>')) {
    cleanedHtml = cleanedHtml.replace('</head>', `${seoHeadTags}\n  </head>`);
  } else {
    cleanedHtml = `${seoHeadTags}\n${cleanedHtml}`;
  }

  // 4. Inject route-specific pre-rendered semantic HTML body into <div id="root">
  if (routeBodyHtml && cleanedHtml.includes('<div id="root">')) {
    cleanedHtml = cleanedHtml.replace(
      /<div id="root">[\s\S]*?<\/div>(\s*<\/body>)/i,
      `<div id="root">\n${routeBodyHtml}\n    </div>\n  </body>`
    );
  }

  return cleanedHtml;
}

module.exports = {
  injectSeoMetadata,
  escapeHtmlAttr,
};
