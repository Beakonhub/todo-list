import { test, expect } from "@playwright/test";

test("redirects an anonymous user away from a protected route", async ({ page }) => {
  await page.goto("/my-task");
  await expect(page).toHaveURL(/\/login/);
});

test("signup creates an account and lands on the dashboard", async ({ page }) => {
  const email = `test-${Date.now()}@example.com`;

  await page.goto("/signup");
  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: /sign up/i }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText(/welcome back, test/i)).toBeVisible();
});

test("login rejects an incorrect password", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("sundar@example.com");
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});
