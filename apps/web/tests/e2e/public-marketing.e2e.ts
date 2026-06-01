import { expect, test } from "@playwright/test";

test("public website exposes product value and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Lead tracking and sales visibility/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact Sales" }).first()).toBeVisible();

  await page.getByRole("link", { name: "Features" }).click();
  await expect(page).toHaveURL(/\/features$/);
  await expect(page.getByRole("heading", { name: /Built around operational/i })).toBeVisible();

  await page.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: /quieter operating system/i })).toBeVisible();

  await page.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { name: /Talk through/i })).toBeVisible();

  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/login$/);
});
