import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("Settings shows the empty state when no invites have been sent", async ({ page }) => {
  await signupAndLogin(page);

  await page.goto("/settings");
  await expect(page.getByText("No invites sent yet.")).toBeVisible();
});

test("Settings lists a sent invite and lets the user revoke it", async ({ page }) => {
  await signupAndLogin(page);

  const inviteRes = await page.request.post("/api/invites", {
    headers: { "Content-Type": "application/json" },
    data: { email: "teammate@example.com" },
  });
  expect(inviteRes.status()).toBe(201);
  const invite = await inviteRes.json();
  expect(invite.status).toBe("PENDING");

  await page.goto("/settings");
  const row = page.locator("li").filter({ hasText: "teammate@example.com" });
  await expect(row).toBeVisible();
  await expect(row.getByText("Pending")).toBeVisible();

  await row.getByRole("button", { name: /revoke/i }).click();
  await expect(page.getByText("Invite revoked")).toBeVisible();

  const updatedRow = page.locator("li").filter({ hasText: "teammate@example.com" });
  await expect(updatedRow.getByText("Revoked")).toBeVisible();
  await expect(updatedRow.getByRole("button", { name: /revoke/i })).toHaveCount(0);

  const checkRes = await page.request.get("/api/invites");
  const invites = await checkRes.json();
  expect(invites.find((i: { id: string }) => i.id === invite.id).status).toBe("REVOKED");
});
