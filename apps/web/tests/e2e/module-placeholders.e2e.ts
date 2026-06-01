import { expect, test } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";
const placeholders = [
  "/activities",
  "/exhibitions",
  "/deals",
  "/targets",
  "/analytics",
  "/notifications",
  "/settings",
];

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "crm_e2e_auth", value: "1", url: webBaseUrl }]);
});

for (const route of placeholders) {
  test(`${route} shows a safe placeholder`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByText("Not available in this phase")).toBeVisible();
    await expect(page.getByText("does not expose live business records")).toBeVisible();
  });
}
