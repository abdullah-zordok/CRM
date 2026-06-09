import { expect, test } from "@playwright/test";

test("lead detail exposes the activities timeline section", async ({ page }) => {
  await page.context().addCookies([
    {
      name: "crm_e2e_auth",
      value: "1",
      domain: "localhost",
      path: "/",
    },
  ]);

  await page.goto("/leads/00000000-0000-4000-8000-000000000101");
  await expect(page.getByRole("heading", { name: "Activities" })).toBeVisible();
  await expect(page.getByRole("form", { name: "Record completed activity" })).toBeVisible();
});
