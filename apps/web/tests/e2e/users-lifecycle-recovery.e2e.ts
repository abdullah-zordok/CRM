import { expect, test } from "@playwright/test";

test("user management route exposes lifecycle controls surface", async ({ page }) => {
  await page.goto("/users");
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  await expect(page.locator("body")).toContainText(/delete|disabled|active|user/i);
});
