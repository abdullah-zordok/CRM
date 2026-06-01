import { expect, test } from "@playwright/test";

test("lead detail exposes assignment controls or denied state", async ({ page }) => {
  await page.goto("/leads/example-lead");
  await expect(page.getByRole("heading", { name: /assignment/i })).toBeVisible();
});
