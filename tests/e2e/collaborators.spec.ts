import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("accepted invite's collaborator avatar renders on the Welcome banner", async ({ page, browser }) => {
  await signupAndLogin(page, "Inviter User");

  const otherContext = await browser.newContext();
  const otherPage = await otherContext.newPage();
  const collaboratorEmail = await signupAndLogin(otherPage, "Collaborator User");
  await otherContext.close();

  const inviteRes = await page.request.post("/api/invites", {
    headers: { "Content-Type": "application/json" },
    data: { email: collaboratorEmail },
  });
  const invite = await inviteRes.json();

  await page.goto("/");
  await expect(page.locator('[title="Collaborator User"]')).toHaveCount(0);

  const acceptRes = await page.request.patch(`/api/invites/${invite.id}`, {
    headers: { "Content-Type": "application/json" },
    data: { status: "ACCEPTED" },
  });
  expect(acceptRes.ok()).toBe(true);

  await page.reload();
  await expect(page.locator('[title="Collaborator User"]')).toBeVisible();
  await expect(page.locator('[title="Collaborator User"]')).toContainText("CU");
});
