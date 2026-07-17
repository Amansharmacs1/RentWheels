# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.js >> Booking Flow >> should register, explore vehicles, and book one
- Location: e2e/booking.spec.js:7:3

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
      - code [ref=e10]: "`bom1::lgrvd-1784306835696-0d96c4a1462b`"
  - link "Read our documentation to learn more about this error." [ref=e11] [cursor=pointer]:
    - /url: https://vercel.com/docs/errors/NOT_FOUND
    - generic [ref=e12]: Read our documentation to learn more about this error.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Booking Flow', () => {
  4  |   const testEmail = `booktest_${Date.now()}@rentwheels.com`;
  5  |   const testPassword = 'Password123!';
  6  | 
  7  |   test('should register, explore vehicles, and book one', async ({ page }) => {
  8  |     // 1. Register a user so they can book
  9  |     await page.goto('/register');
> 10 |     await page.fill('input[name="name"]', 'Booking Test User');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  11 |     await page.fill('input[name="email"]', testEmail);
  12 |     await page.fill('input[name="phone"]', '1234567890');
  13 |     await page.fill('input[name="password"]', testPassword);
  14 |     await page.fill('input[name="confirmPassword"]', testPassword);
  15 |     await page.click('button[type="submit"]');
  16 |     await expect(page).toHaveURL(/\/dashboard/);
  17 | 
  18 |     // 2. Explore Vehicles
  19 |     await page.click('text=Explore');
  20 |     await expect(page).toHaveURL(/\/explore/);
  21 |     
  22 |     // Click on the first vehicle card
  23 |     const firstVehicleCard = page.locator('.al-car-card').first();
  24 |     await expect(firstVehicleCard).toBeVisible();
  25 |     await firstVehicleCard.click();
  26 | 
  27 |     // 3. Booking form on Vehicle Details page
  28 |     await expect(page.locator('h3:has-text("Book this Vehicle")')).toBeVisible();
  29 | 
  30 |     // Fill out dates
  31 |     const tomorrow = new Date();
  32 |     tomorrow.setDate(tomorrow.getDate() + 1);
  33 |     const dayAfter = new Date();
  34 |     dayAfter.setDate(dayAfter.getDate() + 2);
  35 | 
  36 |     const pickDateStr = tomorrow.toISOString().split('T')[0];
  37 |     const returnDateStr = dayAfter.toISOString().split('T')[0];
  38 | 
  39 |     await page.fill('input[name="pickupDate"]', pickDateStr);
  40 |     await page.fill('input[name="pickupTime"]', '10:00');
  41 |     await page.fill('input[name="returnDate"]', returnDateStr);
  42 |     await page.fill('input[name="returnTime"]', '10:00');
  43 | 
  44 |     // Submit booking
  45 |     await page.click('button:has-text("Request Booking")');
  46 | 
  47 |     // Should redirect to my bookings
  48 |     await expect(page).toHaveURL(/\/my-bookings/);
  49 |     await expect(page.locator('h1')).toContainText('My Bookings');
  50 |     
  51 |     // Verify a booking card is present
  52 |     await expect(page.locator('.booking-card').first()).toBeVisible();
  53 |   });
  54 | });
  55 | 
```