import { expect, test } from "@playwright/test";

test("users route exposes user management surface", async ({ page }) => {
  await page.goto("/users");
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
});
