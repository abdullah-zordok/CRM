import { expect, test } from "@playwright/test";

test("user creation and login forms expose login-ready credential fields", async ({ page }) => {
  await page.goto("/users");
  await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
  await expect(page.getByLabel("Create user").getByLabel("Password")).toBeVisible();

  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});
