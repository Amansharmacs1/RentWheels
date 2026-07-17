import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testEmail = `e2etest_${Date.now()}@rentwheels.com`;
  const testPassword = 'Password123!';

  test('should register a new user, logout, and login', async ({ page }) => {
    // 1. Registration
    await page.goto('/register');
    await page.fill('input[name="name"]', 'E2E Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard upon successful registration
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');

    // 2. Logout
    await page.click('text=Logout');
    await expect(page).toHaveURL(/\//); // Redirects to home or login

    // 3. Login
    await page.goto('/login');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Should redirect to dashboard upon successful login
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
