import { expect, test } from "@playwright/test";

test("lead surfaces pipeline filters and status controls", async ({ page }) => {
  await page.goto("/leads");
  await expect(page.getByRole("form", { name: /lead filters/i })).toBeVisible();
  await page.goto("/leads/example-lead");
  await expect(page.getByRole("heading", { name: /^status$/i })).toBeVisible();
});
