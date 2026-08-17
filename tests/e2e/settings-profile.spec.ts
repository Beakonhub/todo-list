import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("profile form updates name and avatar and persists across reload", async ({ page }) => {
  await signupAndLogin(page, "Original Name");

  await page.goto("/settings");
  await expect(page.getByLabel("Name")).toHaveValue("Original Name");

  await page.getByLabel("Name").fill("Updated Name");
  await page.getByLabel("Avatar URL").fill("https://example.com/avatar.png");
  await page.getByRole("button", { name: /save changes/i }).click();

  await expect(page.getByText("Profile updated")).toBeVisible();

  await page.reload();
  await expect(page.getByLabel("Name")).toHaveValue("Updated Name");
  await expect(page.getByLabel("Avatar URL")).toHaveValue("https://example.com/avatar.png");

  // Confirm the underlying record is genuinely persisted, not just reflected in local form state.
  const meRes = await page.request.get("/api/users/me");
  const me = await meRes.json();
  expect(me.name).toBe("Updated Name");
  expect(me.image).toBe("https://example.com/avatar.png");
});
