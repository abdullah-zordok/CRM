import { expect, test } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";
const destinations = [
  "Dashboard",
  "Leads",
  "Activities",
  "Exhibitions",
  "Deals",
  "Targets",
  "Analytics",
  "Notifications",
  "Team",
  "Settings",
];

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: "crm_e2e_auth", value: "1", url: webBaseUrl }]);
});

test("workspace navigation exposes all planned destinations", async ({ page }) => {
  await page.goto("/dashboard");

  for (const destination of destinations) {
    await expect(page.getByRole("link", { name: destination })).toBeVisible();
  }
});
