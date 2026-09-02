/**
 * Google Analytics 4 (GA4) Service for HireReady
 *
 * Privacy & Security Rules:
 * 1. Measurement ID is loaded strictly from import.meta.env.VITE_GA_MEASUREMENT_ID.
 * 2. If VITE_GA_MEASUREMENT_ID is absent, all tracking calls safely no-op.
 * 3. Never send PII (emails, names, passwords, tokens, user IDs, resumes, private notes).
 * 4. Automatic page_view tracking via React Router location listener.
 */

const getMeasurementId = () => {
  try {
    const metaEnv = Function(
      'return typeof import.meta !== "undefined" ? import.meta.env : null'
    )();
    if (metaEnv && metaEnv.VITE_GA_MEASUREMENT_ID) {
      return metaEnv.VITE_GA_MEASUREMENT_ID;
    }
  } catch (e) {
    // Ignore error in non-ESM environments
  }
  if (typeof process !== 'undefined' && process.env && process.env.VITE_GA_MEASUREMENT_ID) {
    return process.env.VITE_GA_MEASUREMENT_ID;
  }
  return '';
};

const GA_MEASUREMENT_ID = getMeasurementId();
let isInitialized = false;

// Blocklist of sensitive keys to strictly enforce PII protection
const PII_KEYS = [
  'email',
  'password',
  'name',
  'firstName',
  'lastName',
  'phone',
  'token',
  'accessToken',
  'refreshToken',
  'jwt',
  'userId',
  'user_id',
  'id',
  'resume',
  'note',
  'notes',
  'content',
];

/**
 * Filter out any accidentally passed sensitive parameters
 */

const sanitizeParams = (params = {}) => {
  const safe = {};
  for (const [key, val] of Object.entries(params)) {
    if (!PII_KEYS.includes(key.toLowerCase())) {
      safe[key] = typeof val === 'string' ? val.slice(0, 100) : val;
    }
  }
  return safe;
};

/**
 * Initialize GA4 dynamically when Measurement ID is configured
 */

export const initGA = () => {
  if (isInitialized) return true;
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return false;

  try {
    // Check if script already injected
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // Page views handled dynamically by React Router listener
      anonymize_ip: true,
    });

    isInitialized = true;
    return true;
  } catch (err) {
    console.warn('GA4 Initialization skipped:', err.message);
    return false;
  }
};

/**
 * Track SPA Page Views
 */

export const trackPageView = (path, title) => {
  if (!initGA()) return;
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      send_to: GA_MEASUREMENT_ID,
    });
  }
};

/**
 * Track Custom Product Events (PII-Safe)
 */

export const trackEvent = (eventName, params = {}) => {
  if (!initGA()) return;
  if (window.gtag && GA_MEASUREMENT_ID) {
    const safeParams = sanitizeParams(params);
    window.gtag('event', eventName, safeParams);
  }
};

export default {
  initGA,
  trackPageView,
  trackEvent,
};
