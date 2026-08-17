import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("deleting a category nulls categoryId on its tasks instead of deleting them", async ({ page }) => {
  await signupAndLogin(page);

  const categoryRes = await page.request.post("/api/categories", {
    headers: { "Content-Type": "application/json" },
    data: { name: "Errands", color: "#3B7DDD" },
  });
  const category = await categoryRes.json();

  const taskRes = await page.request.post("/api/tasks", {
    headers: { "Content-Type": "application/json" },
    data: { title: "Pick up dry cleaning", categoryId: category.id },
  });
  const task = await taskRes.json();
  expect(task.categoryId).toBe(category.id);

  const deleteRes = await page.request.delete(`/api/categories/${category.id}`);
  expect(deleteRes.status()).toBe(204);

  const taskCheck = await page.request.get(`/api/tasks/${task.id}`);
  expect(taskCheck.ok()).toBe(true);
  const taskAfter = await taskCheck.json();
  expect(taskAfter.id).toBe(task.id);
  expect(taskAfter.categoryId).toBeNull();

  await page.goto("/my-task");
  await expect(page.getByTestId("task-card").filter({ hasText: "Pick up dry cleaning" })).toBeVisible();
});
