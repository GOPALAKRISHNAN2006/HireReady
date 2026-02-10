const { test, expect } = require('@playwright/test');

// ===========================================
// API Integration E2E Tests
// ===========================================

const API_URL = 'http://localhost:5000/api';

test.describe('API Endpoints', () => {
  
  test.describe('Health Check', () => {
    test('server health endpoint should respond', async ({ request }) => {
      const response = await request.get('http://localhost:5000/health');
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Auth API', () => {
    test('should return 401 for invalid login', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/login`, {
        data: {
          email: 'invalid@example.com',
          password: 'wrongpassword'
        }
      });
      expect(response.status()).toBe(401);
    });

    test('should return 400 for missing registration fields', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/register`, {
        data: {
          email: 'test@example.com'
          // Missing required fields
        }
      });
      expect(response.status()).toBe(400);
    });

    test('should return success for forgot password request', async ({ request }) => {
      const response = await request.post(`${API_URL}/auth/forgot-password`, {
        data: {
          email: 'test@example.com'
        }
      });
      // Should return 200 regardless of email existence (security)
      expect(response.status()).toBe(200);
    });
  });

  test.describe('Protected Routes', () => {
    test('should return 401 for accessing user profile without token', async ({ request }) => {
      const response = await request.get(`${API_URL}/auth/me`);
      expect(response.status()).toBe(401);
    });

    test('should return 401 for accessing interviews without token', async ({ request }) => {
      const response = await request.get(`${API_URL}/interviews`);
      expect(response.status()).toBe(401);
    });

    test('should return 401 for accessing analytics without token', async ({ request }) => {
      const response = await request.get(`${API_URL}/analytics`);
      expect(response.status()).toBe(401);
    });
  });

  test.describe('Public Routes', () => {
    test('should get questions without authentication (if public)', async ({ request }) => {
      const response = await request.get(`${API_URL}/questions`);
      // Either 200 (public) or 401 (protected)
      expect([200, 401]).toContain(response.status());
    });
  });
});

test.describe('Error Handling', () => {
  
  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('http://localhost:4173/nonexistent-page');
    
    // Should show 404 page or redirect
    const notFound = page.locator('text=/404|not found|page doesn\'t exist/i');
    await expect(notFound.first()).toBeVisible({ timeout: 5000 }).catch(() => {
      // If no 404 text, check if redirected
      expect(page.url()).not.toContain('nonexistent-page');
    });
  });

  test('should handle server errors gracefully', async ({ page }) => {
    // Navigate to a page that might trigger an error
    await page.goto('http://localhost:4173');
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Performance', () => {
  
  test('home page should load within 5 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:4173');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
  });

  test('login page should load within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:4173/login');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });
});
