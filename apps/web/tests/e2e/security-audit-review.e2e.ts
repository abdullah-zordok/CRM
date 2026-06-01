import { expect, test } from "@playwright/test";

test("audit route exposes searchable audit review without export", async ({ page }) => {
  await page.goto("/audit");
  await expect(page.getByRole("heading", { name: "Security audit" })).toBeVisible();
  await expect(page.getByText("Export")).toHaveCount(0);
});
