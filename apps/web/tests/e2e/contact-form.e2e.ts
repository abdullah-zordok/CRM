import { expect, test } from "@playwright/test";

test("contact sales form validates locally without persistence", async ({ page }) => {
  await page.goto("/contact");

  await page.getByRole("button", { name: "Contact Sales" }).click();
  await expect(page.getByText("Name is required.")).toBeVisible();
  await expect(page.getByText("Company is required.")).toBeVisible();
  await expect(page.getByText("Email is required.")).toBeVisible();
  await expect(page.getByText("Message is required.")).toBeVisible();

  await page.getByLabel("Name *").fill("Dana");
  await page.getByLabel("Company *").fill("Expo Co");
  await page.getByLabel("Email *").fill("invalid");
  await page.getByLabel("Message *").fill("We need sales visibility.");
  await page.getByRole("button", { name: "Contact Sales" }).click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();

  await page.getByLabel("Email *").fill("dana@example.com");
  await page.getByRole("button", { name: "Contact Sales" }).click();
  await expect(page.getByRole("status")).toContainText("does not create a CRM record");
});
