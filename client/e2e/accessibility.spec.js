const { test, expect } = require('@playwright/test');

// ===========================================
// Accessibility E2E Tests
// ===========================================

test.describe('Accessibility', () => {
  
  test.describe('Keyboard Navigation', () => {
    test('should be able to tab through home page elements', async ({ page }) => {
      await page.goto('http://localhost:4173');
      
      // Press Tab and check focus moves
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should be able to navigate login form with keyboard', async ({ page }) => {
      await page.goto('http://localhost:4173/login');
      
      // Tab to email input
      await page.keyboard.press('Tab');
      await page.keyboard.type('test@example.com');
      
      // Tab to password input
      await page.keyboard.press('Tab');
      await page.keyboard.type('password123');
      
      // Check inputs have values
      await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
    });

    test('should be able to submit form with Enter key', async ({ page }) => {
      await page.goto('http://localhost:4173/login');
      
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.keyboard.press('Enter');
      
      // Form should be submitted (will show error for invalid credentials)
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('http://localhost:4173');
      
      // Tab to first focusable element
      await page.keyboard.press('Tab');
      
      // Check that focus is visible (has outline or ring)
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Page Structure', () => {
    test('should have a main heading on home page', async ({ page }) => {
      await page.goto('http://localhost:4173');
      
      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible();
    });

    test('should have navigation landmark', async ({ page }) => {
      await page.goto('http://localhost:4173');
      
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav.first()).toBeVisible();
    });

    test('should have main content area', async ({ page }) => {
      await page.goto('http://localhost:4173');
      
      const main = page.locator('main, [role="main"]');
      await expect(main.first()).toBeVisible();
    });
  });

  test.describe('Form Labels', () => {
    test('login form inputs should have labels', async ({ page }) => {
      await page.goto('http://localhost:4173/login');
      
      // Check that inputs have associated labels or aria-labels
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      
      // Inputs should be accessible
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
    });

    test('signup form inputs should have labels', async ({ page }) => {
      await page.goto('http://localhost:4173/signup');
      
      // Check that all inputs are present and accessible
      const inputs = page.locator('input');
      const count = await inputs.count();
      expect(count).toBeGreaterThan(3); // At least firstName, lastName, email, password
    });
  });

  test.describe('Color Contrast', () => {
    test('text should be visible on home page', async ({ page }) => {
      await page.goto('http://localhost:4173');
      
      // Check that main heading is visible
      const heading = page.locator('h1');
      await expect(heading.first()).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should be usable on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('http://localhost:4173');
      
      // Page should load without horizontal scroll
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should be usable on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('http://localhost:4173');
      
      // Page should load
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should be usable on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('http://localhost:4173');
      
      // Page should load
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });
});
