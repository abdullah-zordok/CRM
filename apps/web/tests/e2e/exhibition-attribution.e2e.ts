import { expect, test } from "@playwright/test";

test("exhibition workspace exposes lead attribution filters", async ({ page }) => {
  await page.goto("/exhibitions");
  await expect(page.getByRole("heading", { name: "Exhibitions" })).toBeVisible();
  await expect(page.getByLabel("Search")).toBeVisible();
  await expect(page.getByLabel("Status")).toBeVisible();
});
