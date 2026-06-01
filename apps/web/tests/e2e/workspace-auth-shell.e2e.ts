import { expect, test } from "@playwright/test";

const webBaseUrl = process.env.WEB_BASE_URL ?? "http://127.0.0.1:3100";
const dashboardWidgetNames = ["New leads", "Follow-ups due", "Active deals", "Team target"];

test("authorized test user can reach protected dashboard shell", async ({ context, page }) => {
  await context.addCookies([{ name: "crm_e2e_auth", value: "1", url: webBaseUrl }]);
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Workspace navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pipeline Snapshot" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Today Focus" })).toBeVisible();

  for (const widgetName of dashboardWidgetNames) {
    await expect(page.getByText(widgetName)).toBeVisible();
  }
});

test("legacy app workspace routes redirect to dashboard content", async ({ context, page }) => {
  await context.addCookies([{ name: "crm_e2e_auth", value: "1", url: webBaseUrl }]);

  await page.goto("/app");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.goto("/app/dashboard");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Pipeline Snapshot" })).toBeVisible();
});

test("sign-in submit reaches populated dashboard shell", async ({ context, page }) => {
  await context.addCookies([{ name: "crm_e2e_auth", value: "1", url: webBaseUrl }]);
  await page.route("**/auth/login", async (route) => {
    await route.fulfill({ status: 204 });
  });

  await page.goto("/login");
  await page.getByLabel("Email").fill("admin@example.com");
  await page.getByLabel("Password").fill("ChangeThisPassword123!");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByText("No live business records are exposed")).toBeVisible();
});
