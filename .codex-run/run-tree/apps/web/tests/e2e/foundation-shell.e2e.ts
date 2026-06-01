import { expect, test } from "@playwright/test";

test("renders foundation landing shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Sales Operations CRM" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
});
