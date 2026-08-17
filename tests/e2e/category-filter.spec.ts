import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("creates a category and filters My Task by it", async ({ page }) => {
  await signupAndLogin(page);

  await page.goto("/task-categories");
  await page.getByRole("button", { name: /new category/i }).click();
  const categoryDialog = page.getByRole("dialog");
  await categoryDialog.getByLabel("Name").fill("Errands");
  await categoryDialog.getByRole("button", { name: /^save$/i }).click();

  const categoryCard = page.getByText("Errands");
  await expect(categoryCard).toBeVisible();

  await page.goto("/my-task");
  await page.getByRole("button", { name: /add task/i }).click();
  const taskDialog = page.getByRole("dialog");
  await taskDialog.getByLabel("Title").fill("Pick up dry cleaning");
  const categorySelect = taskDialog.locator('select[name="categoryId"]');
  await categorySelect.selectOption({ label: "Errands" });
  await taskDialog.getByRole("button", { name: /^add task$/i }).click();

  await expect(page.getByTestId("task-card").filter({ hasText: "Pick up dry cleaning" })).toBeVisible();

  await page.goto("/task-categories");
  await page.getByText("Errands").click();
  await expect(page).toHaveURL(/\/my-task\?categoryId=/);
  await expect(page.getByTestId("task-card").filter({ hasText: "Pick up dry cleaning" })).toBeVisible();
});
