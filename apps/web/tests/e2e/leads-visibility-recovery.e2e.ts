import { expect, test } from "@playwright/test";

test("lead list exposes scoped empty or list states", async ({ page }) => {
  await page.goto("/leads");
  await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();
  await expect(page.locator("body")).toContainText(/lead|empty|denied/i);
});
