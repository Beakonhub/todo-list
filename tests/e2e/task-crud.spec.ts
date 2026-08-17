import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("create, edit, and delete a task from My Task", async ({ page }) => {
  await signupAndLogin(page);
  await page.goto("/my-task");

  await page.getByRole("button", { name: /add task/i }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Title").fill("Buy groceries");
  await dialog.getByRole("button", { name: /^add task$/i }).click();

  const card = page.getByTestId("task-card").filter({ hasText: "Buy groceries" });
  await expect(card).toBeVisible();

  await card.getByRole("button", { name: /task actions/i }).click();
  await page.getByRole("button", { name: /^edit$/i }).click();
  await page.getByLabel("Title").fill("Buy groceries and cook dinner");
  await page.getByRole("button", { name: /save changes/i }).click();

  const updatedCard = page.getByTestId("task-card").filter({ hasText: "Buy groceries and cook dinner" });
  await expect(updatedCard).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await updatedCard.getByRole("button", { name: /task actions/i }).click();
  await page.getByRole("button", { name: /delete/i }).click();

  await expect(page.getByTestId("task-card").filter({ hasText: "Buy groceries and cook dinner" })).toHaveCount(0);
});
