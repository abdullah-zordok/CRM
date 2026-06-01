import { expect, test } from "@playwright/test";

test("users route exposes access controls", async ({ page }) => {
  await page.goto("/users");
  await expect(page.getByText("Create user")).toBeVisible();
});
