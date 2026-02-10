const { test, expect } = require('@playwright/test');

// ===========================================
// Home Page Tests
// ===========================================
test.describe('Home Page', () => {
  test('homepage should load', async ({ page }) => {
    await page.goto('http://localhost:4173');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('http://localhost:4173');
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('http://localhost:4173');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('http://localhost:4173');
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('http://localhost:4173');
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*signup/);
  });
});
