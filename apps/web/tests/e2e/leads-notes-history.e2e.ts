import { expect, test } from "@playwright/test";

test("lead detail exposes notes, source context, and history timeline", async ({ page }) => {
  await page.goto("/leads/example-lead");
  await expect(page.getByRole("heading", { name: /notes/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /history/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /source/i })).toBeVisible();
});
