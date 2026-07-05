import { expect, test } from "@playwright/test";

test("public website exposes product value and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "نظّم مبيعاتك، تابع عملاءك، وراقب أداء فريقك من مكان واحد",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "تسجيل الدخول" })).toHaveAttribute("href", "/login");
  await expect(page.getByRole("link", { name: "ابدأ الآن" })).toHaveAttribute("href", "/register");

  await page.getByRole("link", { name: "المميزات" }).click();
  await expect(page).toHaveURL(/#features$/);
  await expect(page.getByRole("heading", { name: "مميزات قوية تساعدك على النجاح" })).toBeVisible();

  await page.getByRole("link", { name: "كيف يعمل" }).click();
  await expect(page).toHaveURL(/#how-it-works$/);
  await expect(page.getByRole("heading", { name: "كيف يعمل النظام؟" })).toBeVisible();

  await page.getByRole("link", { name: "تواصل معنا" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { name: /Talk through/i })).toBeVisible();

  await page.goto("/");
  await page.getByRole("link", { name: "تسجيل الدخول" }).click();
  await expect(page).toHaveURL(/\/login$/);
});
