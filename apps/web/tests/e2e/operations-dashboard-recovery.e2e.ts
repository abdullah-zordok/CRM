import { expect, test } from "@playwright/test";

test("dashboard route exposes operational metric surface", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  await expect(page.locator("body")).toContainText("Total Leads");
  await expect(page.locator("body")).toContainText("Users Overview");
  await expect(page.locator("body")).toContainText("All Leads");
});
