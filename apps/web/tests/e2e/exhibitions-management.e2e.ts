import { expect, test } from "@playwright/test";

test("exhibitions route exposes management surface", async ({ page }) => {
  await page.goto("/exhibitions");
  await expect(page.getByRole("heading", { name: "Exhibitions" })).toBeVisible();
  await expect(page.getByRole("form", { name: "Create exhibition" })).toBeVisible();
  await expect(page.getByRole("form", { name: "Exhibition filters" })).toBeVisible();
});
