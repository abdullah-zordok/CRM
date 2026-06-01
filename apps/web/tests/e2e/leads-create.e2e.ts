import { expect, test } from "@playwright/test";

test("leads route exposes lead management surface", async ({ page }) => {
  await page.goto("/leads");
  await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();
});
