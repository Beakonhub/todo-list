import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("search filters My Task by title/description match", async ({ page }) => {
  await signupAndLogin(page);

  await page.request.post("/api/tasks", {
    headers: { "Content-Type": "application/json" },
    data: { title: "Attend Nischal's Birthday Party", description: "Buy gifts and cake" },
  });
  await page.request.post("/api/tasks", {
    headers: { "Content-Type": "application/json" },
    data: { title: "Landing Page Design", description: "Finish for TravelDays client" },
  });

  await page.goto("/my-task?q=birthday");
  await expect(page.getByTestId("task-card").filter({ hasText: "Birthday Party" })).toBeVisible();
  await expect(page.getByTestId("task-card").filter({ hasText: "Landing Page Design" })).toHaveCount(0);

  await page.goto("/my-task?q=traveldays");
  await expect(page.getByTestId("task-card").filter({ hasText: "Landing Page Design" })).toBeVisible();
  await expect(page.getByTestId("task-card").filter({ hasText: "Birthday Party" })).toHaveCount(0);
});

test("header search bar navigates to My Task with the query applied", async ({ page }) => {
  await signupAndLogin(page);

  await page.request.post("/api/tasks", {
    headers: { "Content-Type": "application/json" },
    data: { title: "Attend Nischal's Birthday Party" },
  });
  await page.request.post("/api/tasks", {
    headers: { "Content-Type": "application/json" },
    data: { title: "Landing Page Design" },
  });

  await page.goto("/");
  await page.getByRole("searchbox", { name: /search tasks/i }).fill("birthday");
  await page.getByRole("searchbox", { name: /search tasks/i }).press("Enter");

  await expect(page).toHaveURL(/\/my-task\?q=birthday/);
  await expect(page.getByTestId("task-card").filter({ hasText: "Birthday Party" })).toBeVisible();
  await expect(page.getByTestId("task-card").filter({ hasText: "Landing Page Design" })).toHaveCount(0);
});
