import { expect, test } from "@playwright/test";

test("exhibition creation surface includes attendee-compatible owner fields", async ({ page }) => {
  await page.goto("/exhibitions");
  await expect(page.getByRole("form", { name: "Create exhibition" })).toBeVisible();
  await expect(page.getByLabel("Owner")).toBeVisible();
  await expect(page.getByLabel("Team")).toBeVisible();
});
