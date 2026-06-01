import { expect, test } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "crm_e2e_auth", value: "1", url: webBaseUrl }]);
});

test("existing protected module routes remain available", async ({ page }) => {
  await page.goto("/leads");
  await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();

  await page.goto("/users");
  await expect(page.getByRole("heading", { name: /Users|User Management/i })).toBeVisible();

  await page.goto("/teams");
  await expect(page.getByRole("heading", { name: /Teams|Team/i })).toBeVisible();

  await page.goto("/audit");
  await expect(page.getByRole("heading", { name: /Audit|Security/i })).toBeVisible();

  await page.goto("/foundation");
  await expect(page.getByRole("heading", { name: /Foundation/i })).toBeVisible();
});
