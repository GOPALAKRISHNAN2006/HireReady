/**
 * Unit tests for GA4 Analytics Service
 */
import { initGA, trackPageView, trackEvent } from '../src/services/analytics';

describe('GA4 Analytics Service', () => {
  beforeEach(() => {
    delete window.gtag;
    delete window.dataLayer;
  });

  test('initGA no-ops safely when VITE_GA_MEASUREMENT_ID is empty', () => {
    const result = initGA();
    expect(result).toBe(false);
    expect(window.gtag).toBeUndefined();
  });

  test('trackPageView no-ops safely without errors when GA is not initialized', () => {
    expect(() => {
      trackPageView('/test-path', 'Test Title');
    }).not.toThrow();
  });

  test('trackEvent no-ops safely without errors when GA is not initialized', () => {
    expect(() => {
      trackEvent('login_success', { email: 'secret@example.com', method: 'email' });
    }).not.toThrow();
  });
});
