const { test, expect } = require('@playwright/test');

// ===========================================
// Authentication E2E Tests
// ===========================================

const TEST_USER = {
  firstName: 'Test',
  lastName: 'User',
  email: `test.user.${Date.now()}@example.com`,
  password: 'TestPass123!'
};

test.describe('Authentication Flow', () => {
  
  test.describe('Registration', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('http://localhost:4173/signup');
      
      await expect(page.locator('input[name="firstName"], input[placeholder*="First"]')).toBeVisible();
      await expect(page.locator('input[name="lastName"], input[placeholder*="Last"]')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]').first()).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('http://localhost:4173/signup');
      
      // Click submit without filling form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.locator('text=/required|invalid/i').first()).toBeVisible();
    });

    test('should show password requirements', async ({ page }) => {
      await page.goto('http://localhost:4173/signup');
      
      // Enter weak password
      await page.fill('input[type="password"]', 'weak');
      await page.click('button[type="submit"]');
      
      // Should show password requirement error
      await expect(page.locator('text=/8 characters|uppercase|lowercase|number/i')).toBeVisible();
    });

    test('should show password mismatch error', async ({ page }) => {
      await page.goto('http://localhost:4173/signup');
      
      // Fill passwords that don't match
      const passwordInputs = page.locator('input[type="password"]');
      await passwordInputs.nth(0).fill('TestPass123!');
      await passwordInputs.nth(1).fill('DifferentPass123!');
      await page.click('button[type="submit"]');
      
      // Should show mismatch error
      await expect(page.locator('text=/match/i')).toBeVisible();
    });

    test('should have link to login page', async ({ page }) => {
      await page.goto('http://localhost:4173/signup');
      
      const loginLink = page.locator('a[href="/login"]');
      await expect(loginLink).toBeVisible();
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Login', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('http://localhost:4173/login');
      
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('http://localhost:4173/login');
      
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Wait for error message
      await expect(page.locator('text=/invalid|incorrect|error/i').first()).toBeVisible({ timeout: 10000 });
    });

    test('should have forgot password link', async ({ page }) => {
      await page.goto('http://localhost:4173/login');
      
      const forgotLink = page.locator('a[href*="forgot"]');
      await expect(forgotLink).toBeVisible();
    });

    test('should have link to signup page', async ({ page }) => {
      await page.goto('http://localhost:4173/login');
      
      const signupLink = page.locator('a[href="/signup"]');
      await expect(signupLink).toBeVisible();
    });
  });

  test.describe('Forgot Password', () => {
    test('should display forgot password form', async ({ page }) => {
      await page.goto('http://localhost:4173/forgot-password');
      
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should submit forgot password request', async ({ page }) => {
      await page.goto('http://localhost:4173/forgot-password');
      
      await page.fill('input[type="email"]', 'test@example.com');
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.locator('text=/sent|check|email/i').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
      await page.goto('http://localhost:4173/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    });

    test('should redirect to login when accessing profile without auth', async ({ page }) => {
      await page.goto('http://localhost:4173/profile');
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    });
  });
});
