import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("logout clears the session and protects routes again", async ({ page }) => {
  await signupAndLogin(page);
  await expect(page).toHaveURL("/");

  await page.getByRole("button", { name: /logout/i }).click();
  await expect(page).toHaveURL(/\/login/);

  await page.goto("/my-task");
  await expect(page).toHaveURL(/\/login/);
});
