import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("Vital Task shows empty-state message when no vital tasks exist", async ({ page }) => {
  await signupAndLogin(page);

  await page.goto("/vital-task");
  await expect(page.getByText("No vital tasks yet — star a task from My Task to pin it here.")).toBeVisible();
  await expect(page.getByTestId("task-card")).toHaveCount(0);
});

test("starring a task in My Task surfaces it on Vital Task", async ({ page }) => {
  await signupAndLogin(page);

  const createRes = await page.request.post("/api/tasks", {
    headers: { "Content-Type": "application/json" },
    data: { title: "Renew passport" },
  });
  const created = await createRes.json();

  await page.goto("/vital-task");
  await expect(page.getByText("No vital tasks yet — star a task from My Task to pin it here.")).toBeVisible();

  await page.request.patch(`/api/tasks/${created.id}`, {
    headers: { "Content-Type": "application/json" },
    data: { isVital: true },
  });

  await page.reload();
  await expect(page.getByTestId("task-card").filter({ hasText: "Renew passport" })).toBeVisible();
  await expect(page.getByText("No vital tasks yet — star a task from My Task to pin it here.")).toHaveCount(0);
});
