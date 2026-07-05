import { expect, test } from "@playwright/test";

const routes = [
  {
    path: "/register",
    heading: "Registration is not available yet",
    detail: "For now, account access is created and managed by the CRM administration team.",
  },
  {
    path: "/forgot-password",
    heading: "Password recovery is not available yet",
    detail: "does not create users",
  },
  {
    path: "/reset-password",
    heading: "Password reset is not available yet",
    detail: "does not create users",
  },
];

for (const route of routes) {
  test(`${route.path} is an account lifecycle placeholder`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
    await expect(page.getByText(route.detail)).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to sign in" })).toBeVisible();
  });
}
