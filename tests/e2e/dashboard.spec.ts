import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("Completed Task panel shows completed tasks with relative time", async ({ page }) => {
  await signupAndLogin(page);

  const res = await page.request.post("/api/tasks", {
    headers: { "Content-Type": "application/json" },
    data: { title: "Walk the dog", status: "COMPLETED" },
  });
  expect(res.ok()).toBe(true);

  await page.reload();

  await expect(page.getByText("Completed Task")).toBeVisible();

  const walkTheDog = page.getByTestId("completed-task-card").filter({ hasText: "Walk the dog" });
  await expect(walkTheDog).toBeVisible();
  await expect(walkTheDog.getByText("Status: Completed")).toBeVisible();
  await expect(walkTheDog.getByText(/Completed .+ ago/)).toBeVisible();
});
