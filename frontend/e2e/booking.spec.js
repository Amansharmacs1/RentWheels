import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  const testEmail = `booktest_${Date.now()}@rentwheels.com`;
  const testPassword = 'Password123!';

  test('should register, explore vehicles, and book one', async ({ page }) => {
    // 1. Register a user so they can book
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Booking Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);

    // 2. Explore Vehicles
    await page.click('text=Explore');
    await expect(page).toHaveURL(/\/explore/);
    
    // Click on the first vehicle card
    const firstVehicleCard = page.locator('.al-car-card').first();
    await expect(firstVehicleCard).toBeVisible();
    await firstVehicleCard.click();

    // 3. Booking form on Vehicle Details page
    await expect(page.locator('h3:has-text("Book this Vehicle")')).toBeVisible();

    // Fill out dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const pickDateStr = tomorrow.toISOString().split('T')[0];
    const returnDateStr = dayAfter.toISOString().split('T')[0];

    await page.fill('input[name="pickupDate"]', pickDateStr);
    await page.fill('input[name="pickupTime"]', '10:00');
    await page.fill('input[name="returnDate"]', returnDateStr);
    await page.fill('input[name="returnTime"]', '10:00');

    // Submit booking
    await page.click('button:has-text("Request Booking")');

    // Should redirect to my bookings
    await expect(page).toHaveURL(/\/my-bookings/);
    await expect(page.locator('h1')).toContainText('My Bookings');
    
    // Verify a booking card is present
    await expect(page.locator('.booking-card').first()).toBeVisible();
  });
});
