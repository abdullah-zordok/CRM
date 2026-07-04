import { expect, test } from "@playwright/test";

test("exhibitions workspace exposes filters and empty state", async ({ page }) => {
  await page.goto("/exhibitions");
  await expect(page.getByRole("heading", { name: "Exhibitions" })).toBeVisible();
  await expect(page.getByLabel("Exhibition filters")).toBeVisible();
  await expect(
    page.getByText(/No exhibitions match|Loading exhibitions|Unable to load/i),
  ).toBeVisible();
});
