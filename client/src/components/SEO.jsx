import { Helmet } from 'react-helmet-async';

const DEFAULT_SITE_URL = import.meta.env.VITE_SITE_URL || 'https://hireready-1-0hvc.onrender.com';
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/og-image.webp`;
const DEFAULT_TITLE = 'HireReady | AI-Powered Interview Preparation Platform';
const DEFAULT_DESCRIPTION =
  'Prepare for technical, aptitude, and HR interviews with AI-powered mock interviews, real-time feedback, skill radar, resume building, and curated practice tests.';

const SEO = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_OG_IMAGE,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  robots = 'index, follow',
  jsonLd,
}) => {
  const finalTitle = title.includes('HireReady') ? title : `${title} | HireReady`;
  const finalOgTitle = ogTitle || finalTitle;
  const finalOgDescription = ogDescription || description;
  const finalTwitterTitle = twitterTitle || finalOgTitle;
  const finalTwitterDescription = twitterDescription || finalOgDescription;
  const finalTwitterImage = twitterImage || ogImage;

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const finalCanonical = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${DEFAULT_SITE_URL}${canonical}`
    : `${DEFAULT_SITE_URL}${currentPath}`;

  const finalOgUrl = ogUrl || finalCanonical;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph */}
      <meta property="og:site_name" content="HireReady" />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalOgUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />

      {/* Structured Data (JSON-LD) */}
      {jsonLd && (
        <script type="application/ld+json">
          {typeof jsonLd === 'string' ? jsonLd : JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
