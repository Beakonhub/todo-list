import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("completedAt is stamped on COMPLETED and cleared when moved off it", async ({ page }) => {
  await signupAndLogin(page);

  const createRes = await page.request.post("/api/tasks", {
    headers: { "Content-Type": "application/json" },
    data: { title: "Ship the release" },
  });
  expect(createRes.ok()).toBe(true);
  const created = await createRes.json();
  expect(created.status).toBe("NOT_STARTED");
  expect(created.completedAt).toBeNull();

  const completeRes = await page.request.patch(`/api/tasks/${created.id}`, {
    headers: { "Content-Type": "application/json" },
    data: { status: "COMPLETED" },
  });
  expect(completeRes.ok()).toBe(true);
  const completed = await completeRes.json();
  expect(completed.status).toBe("COMPLETED");
  expect(completed.completedAt).not.toBeNull();
  const stampedAt = new Date(completed.completedAt).getTime();
  expect(Date.now() - stampedAt).toBeLessThan(60_000);

  const reopenRes = await page.request.patch(`/api/tasks/${created.id}`, {
    headers: { "Content-Type": "application/json" },
    data: { status: "IN_PROGRESS" },
  });
  expect(reopenRes.ok()).toBe(true);
  const reopened = await reopenRes.json();
  expect(reopened.status).toBe("IN_PROGRESS");
  expect(reopened.completedAt).toBeNull();
});
