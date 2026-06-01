import { expect, test } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";

test("public and protected layouts remain usable on mobile width", async ({ context, page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Lead tracking/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact Sales" }).first()).toBeVisible();

  await context.addCookies([{ name: "crm_e2e_auth", value: "1", url: webBaseUrl }]);
  await page.goto("/dashboard");
  await expect(page.getByLabel("Workspace")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});
