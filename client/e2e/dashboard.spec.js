const { test, expect } = require('@playwright/test');

// ===========================================
// Dashboard E2E Tests
// ===========================================

// Helper to login before tests
async function loginAsTestUser(page) {
  await page.goto('http://localhost:4173/login');
  await page.fill('input[type="email"]', 'demo@hireready.com');
  await page.fill('input[type="password"]', 'Demo123!');
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*dashboard/, { timeout: 10000 });
}

test.describe('Dashboard', () => {
  
  test.describe('Dashboard Layout', () => {
    test.skip('should display sidebar navigation', async ({ page }) => {
      await loginAsTestUser(page);
      
      const sidebar = page.locator('[data-testid="sidebar"], aside, nav').first();
      await expect(sidebar).toBeVisible();
    });

    test.skip('should display user greeting', async ({ page }) => {
      await loginAsTestUser(page);
      
      // Should show welcome message or user name
      await expect(page.locator('text=/welcome|hello|hi/i').first()).toBeVisible();
    });

    test.skip('should display quick stats cards', async ({ page }) => {
      await loginAsTestUser(page);
      
      // Should show stats/metrics cards
      const statsCards = page.locator('[data-testid="stat-card"], .stat-card, .card');
      await expect(statsCards.first()).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test.skip('should navigate to Interview section', async ({ page }) => {
      await loginAsTestUser(page);
      
      await page.click('text=Interview');
      await expect(page).toHaveURL(/.*interview/);
    });

    test.skip('should navigate to Aptitude section', async ({ page }) => {
      await loginAsTestUser(page);
      
      await page.click('text=Aptitude');
      await expect(page).toHaveURL(/.*aptitude/);
    });

    test.skip('should navigate to Analytics section', async ({ page }) => {
      await loginAsTestUser(page);
      
      await page.click('text=Analytics');
      await expect(page).toHaveURL(/.*analytics/);
    });

    test.skip('should navigate to Profile section', async ({ page }) => {
      await loginAsTestUser(page);
      
      await page.click('text=Profile');
      await expect(page).toHaveURL(/.*profile/);
    });
  });

  test.describe('Logout', () => {
    test.skip('should logout successfully', async ({ page }) => {
      await loginAsTestUser(page);
      
      // Click logout button
      await page.click('text=Logout');
      
      // Should redirect to home or login
      await expect(page).toHaveURL(/.*\/(login|$)/, { timeout: 5000 });
    });
  });
});

test.describe('Features', () => {
  
  test.describe('Interview Setup', () => {
    test.skip('should display interview setup options', async ({ page }) => {
      await loginAsTestUser(page);
      await page.goto('http://localhost:4173/interview-setup');
      
      // Should show category selection
      await expect(page.locator('text=/category|topic|type/i').first()).toBeVisible();
    });

    test.skip('should allow selecting interview category', async ({ page }) => {
      await loginAsTestUser(page);
      await page.goto('http://localhost:4173/interview-setup');
      
      // Select a category
      const categoryOption = page.locator('button, [role="option"]').filter({ hasText: /dsa|web|behavioral/i }).first();
      if (await categoryOption.isVisible()) {
        await categoryOption.click();
      }
    });
  });

  test.describe('Aptitude Tests', () => {
    test.skip('should display aptitude test options', async ({ page }) => {
      await loginAsTestUser(page);
      await page.goto('http://localhost:4173/aptitude');
      
      // Should show test categories or options
      await expect(page.locator('text=/test|quiz|practice/i').first()).toBeVisible();
    });
  });

  test.describe('Daily Challenges', () => {
    test.skip('should display daily challenge', async ({ page }) => {
      await loginAsTestUser(page);
      await page.goto('http://localhost:4173/daily-challenge');
      
      // Should show challenge content
      await expect(page.locator('text=/challenge|problem|solve/i').first()).toBeVisible();
    });
  });

  test.describe('Resume Builder', () => {
    test.skip('should display resume builder', async ({ page }) => {
      await loginAsTestUser(page);
      await page.goto('http://localhost:4173/resume-builder');
      
      // Should show resume builder interface
      await expect(page.locator('text=/resume|cv|template/i').first()).toBeVisible();
    });
  });
});
