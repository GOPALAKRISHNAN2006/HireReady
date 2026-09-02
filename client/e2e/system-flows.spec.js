const { test, expect } = require('@playwright/test');

// ===========================================
// System Flows E2E Tests
// ===========================================

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:4173';

test.describe('System Pages & Flow Tests', () => {
  test('Test 1 — 404 Not Found Page', async ({ page }) => {
    await page.goto(`${BASE_URL}/random-non-existent-route`);

    // Verify 404 UI heading is visible
    const heading = page
      .locator('h1, h2')
      .filter({ hasText: /404|Lost in Space/i })
      .first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Verify Go to Home button exists
    const homeButton = page.locator('a[href="/"], button:has-text("Home")').first();
    await expect(homeButton).toBeVisible();
  });

  test('Test 2 — Cookie Preferences System', async ({ page }) => {
    await page.goto(`${BASE_URL}/cookie-preferences`);

    // Verify page loads and title is present
    await expect(page.locator('h1').filter({ hasText: /Cookie Preferences/i })).toBeVisible({
      timeout: 10000,
    });

    // Verify Strictly Necessary Cookies indicator is present
    await expect(page.locator('text=/Strictly Necessary/i').first()).toBeVisible();

    // Save preferences
    const saveButton = page
      .locator('button:has-text("Save Preference"), button:has-text("Save")')
      .first();
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Verify localStorage consent entry
    const consent = await page.evaluate(() => localStorage.getItem('hireready_cookie_consent'));
    expect(consent).not.toBeNull();
  });

  test('Test 3 — Access Denied (403)', async ({ page }) => {
    await page.goto(`${BASE_URL}/access-denied`);

    // Verify Access Denied heading and error status
    await expect(page.locator('h1').filter({ hasText: /Access Denied/i })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('text=/403|FORBIDDEN/i').first()).toBeVisible();

    // Verify Navigation controls
    await expect(page.locator('button:has-text("Go Back"), a[href="/"]').first()).toBeVisible();
  });

  test('Test 4 — Maintenance Page', async ({ page }) => {
    await page.goto(`${BASE_URL}/maintenance`);

    // Verify Maintenance UI heading
    await expect(page.locator('h1').filter({ hasText: /We'll Be Right Back/i })).toBeVisible({
      timeout: 10000,
    });

    // Verify retry & home buttons exist
    await expect(
      page.locator('button:has-text("Retry"), button:has-text("Check Status")').first()
    ).toBeVisible();
    await expect(page.locator('a[href="/"], button:has-text("Home")').first()).toBeVisible();
  });

  test('Test 5 — Password Reset Token Resolution', async ({ page }) => {
    // Format A: Path parameter /reset-password/:token
    await page.goto(`${BASE_URL}/reset-password/sample-test-token`);
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: 10000 });

    // Format B: Query parameter /reset-password?token=sample-test-token
    await page.goto(`${BASE_URL}/reset-password?token=sample-test-token`);
    await expect(page.locator('input[type="password"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('Test 6 — Email Verification Token Resolution', async ({ page }) => {
    // Format A: Path parameter /verify-email/:token
    await page.goto(`${BASE_URL}/verify-email/sample-test-token`);
    await expect(
      page.locator('text=/Verifying|Verified|Failed|Verification/i').first()
    ).toBeVisible({ timeout: 10000 });

    // Format B: Query parameter /verify-email?token=sample-test-token
    await page.goto(`${BASE_URL}/verify-email?token=sample-test-token`);
    await expect(
      page.locator('text=/Verifying|Verified|Failed|Verification/i').first()
    ).toBeVisible({ timeout: 10000 });
  });
});
