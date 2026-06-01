import { expect, test } from "@playwright/test";

test("teams route exposes team management", async ({ page }) => {
  await page.goto("/teams");
  await expect(page.getByRole("heading", { name: "Teams" })).toBeVisible();
});
