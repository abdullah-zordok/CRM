import { expect, test } from "@playwright/test";

test("lead creation surface supports representative-owned workflow", async ({ page }) => {
  await page.goto("/leads");
  await expect(page.getByRole("heading", { name: "Leads" })).toBeVisible();
  await expect(page.getByText(/owner|owned/i)).toBeVisible();
});
