import { expect, test } from "@playwright/test";

test("core public pages expose semantic landmarks and labels", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("navigation", { name: "Public navigation" })).toBeVisible();
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.getByLabel("Name *")).toBeVisible();
  await expect(page.getByLabel("Email *")).toBeVisible();
});
