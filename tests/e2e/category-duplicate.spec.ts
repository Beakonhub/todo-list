import { test, expect } from "@playwright/test";
import { signupAndLogin } from "./helpers";

test("duplicate category name for the same user is rejected with 409", async ({ page }) => {
  await signupAndLogin(page);

  const firstRes = await page.request.post("/api/categories", {
    headers: { "Content-Type": "application/json" },
    data: { name: "Work", color: "#3B7DDD" },
  });
  expect(firstRes.status()).toBe(201);

  const dupeRes = await page.request.post("/api/categories", {
    headers: { "Content-Type": "application/json" },
    data: { name: "Work", color: "#EE6B5C" },
  });
  expect(dupeRes.status()).toBe(409);
});

test("the same category name is allowed across different users", async ({ page, browser }) => {
  await signupAndLogin(page);
  const firstRes = await page.request.post("/api/categories", {
    headers: { "Content-Type": "application/json" },
    data: { name: "Work" },
  });
  expect(firstRes.status()).toBe(201);

  const otherContext = await browser.newContext();
  const otherPage = await otherContext.newPage();
  await signupAndLogin(otherPage);
  const secondRes = await otherPage.request.post("/api/categories", {
    headers: { "Content-Type": "application/json" },
    data: { name: "Work" },
  });
  expect(secondRes.status()).toBe(201);
  await otherContext.close();
});
