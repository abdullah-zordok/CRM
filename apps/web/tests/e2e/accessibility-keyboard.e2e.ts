import { expect, test } from "@playwright/test";

test("core public flow exposes visible keyboard focus", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toContainText("Skip to content");
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeVisible();
});
