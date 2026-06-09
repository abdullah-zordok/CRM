import { expect, test } from "@playwright/test";

test("activities workspace exposes filters", async ({ page }) => {
  await page.context().addCookies([
    {
      name: "crm_e2e_auth",
      value: "1",
      domain: "localhost",
      path: "/",
    },
  ]);

  await page.goto("/activities");
  await expect(page.getByRole("heading", { name: "Activities" })).toBeVisible();
  await expect(page.getByRole("form", { name: "Activity filters" })).toBeVisible();
});
