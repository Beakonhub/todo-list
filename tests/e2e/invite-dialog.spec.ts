import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("+ Invite button opens a dialog that creates a PENDING invite", async ({ page }) => {
  await signupAndLogin(page);

  await page.getByRole("button", { name: /^invite$/i }).click();
  await expect(page.getByRole("dialog", { name: /invite a collaborator/i })).toBeVisible();

  await page.getByLabel("Email address").fill("newteammate@example.com");
  await page.getByRole("button", { name: /send invite/i }).click();

  await expect(page.getByText("Invite sent")).toBeVisible();

  const invitesRes = await page.request.get("/api/invites");
  const invites = await invitesRes.json();
  const invite = invites.find((i: { email: string }) => i.email === "newteammate@example.com");
  expect(invite).toBeTruthy();
  expect(invite.status).toBe("PENDING");
});
