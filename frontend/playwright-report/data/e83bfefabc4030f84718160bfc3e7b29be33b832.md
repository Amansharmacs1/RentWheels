# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.js >> Authentication Flow >> should register a new user, logout, and login
- Location: e2e/auth.spec.js:7:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="name"]')

```

# Page snapshot

```yaml
- main [ref=e3]:
  - paragraph [ref=e4]:
    - generic [ref=e5]:
      - strong [ref=e6]: "404"
      - text: ": NOT_FOUND"
    - generic [ref=e7]:
      - text: "Code:"
      - code [ref=e8]: "`NOT_FOUND`"
    - generic [ref=e9]:
      - text: "ID:"
      - code [ref=e10]: "`bom1::w4msj-1784306837427-39c09e9d99db`"
  - link "Read our documentation to learn more about this error." [ref=e11] [cursor=pointer]:
    - /url: https://vercel.com/docs/errors/NOT_FOUND
    - generic [ref=e12]: Read our documentation to learn more about this error.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Authentication Flow', () => {
  4  |   const testEmail = `e2etest_${Date.now()}@rentwheels.com`;
  5  |   const testPassword = 'Password123!';
  6  | 
  7  |   test('should register a new user, logout, and login', async ({ page }) => {
  8  |     // 1. Registration
  9  |     await page.goto('/register');
> 10 |     await page.fill('input[name="name"]', 'E2E Test User');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  11 |     await page.fill('input[name="email"]', testEmail);
  12 |     await page.fill('input[name="phone"]', '1234567890');
  13 |     await page.fill('input[name="password"]', testPassword);
  14 |     await page.fill('input[name="confirmPassword"]', testPassword);
  15 |     await page.click('button[type="submit"]');
  16 | 
  17 |     // Should redirect to dashboard upon successful registration
  18 |     await expect(page).toHaveURL(/\/dashboard/);
  19 |     await expect(page.locator('h1')).toContainText('Dashboard');
  20 | 
  21 |     // 2. Logout
  22 |     await page.click('text=Logout');
  23 |     await expect(page).toHaveURL(/\//); // Redirects to home or login
  24 | 
  25 |     // 3. Login
  26 |     await page.goto('/login');
  27 |     await page.fill('input[name="email"]', testEmail);
  28 |     await page.fill('input[name="password"]', testPassword);
  29 |     await page.click('button[type="submit"]');
  30 | 
  31 |     // Should redirect to dashboard upon successful login
  32 |     await expect(page).toHaveURL(/\/dashboard/);
  33 |     await expect(page.locator('h1')).toContainText('Dashboard');
  34 |   });
  35 | });
  36 | 
```