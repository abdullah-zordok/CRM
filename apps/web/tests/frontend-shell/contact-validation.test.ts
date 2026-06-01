import { describe, expect, it } from "vitest";
import { validateContactSales } from "../../features/marketing/validation/contact-sales-validation";

describe("validateContactSales", () => {
  it("rejects missing required fields", () => {
    const result = validateContactSales({
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "",
    });

    expect(result.ok).toBe(false);
    expect(result.errors.name).toBe("Name is required.");
    expect(result.errors.company).toBe("Company is required.");
    expect(result.errors.email).toBe("Email is required.");
    expect(result.errors.message).toBe("Message is required.");
  });

  it("rejects malformed email input", () => {
    const result = validateContactSales({
      name: "Dana",
      company: "Expo Co",
      email: "not-an-email",
      phone: "",
      message: "We need sales visibility.",
    });

    expect(result.ok).toBe(false);
    expect(result.errors.email).toBe("Enter a valid email address.");
  });

  it("accepts valid-looking contact details", () => {
    const result = validateContactSales({
      name: "Dana",
      company: "Expo Co",
      email: "dana@example.com",
      phone: "+966500000000",
      message: "We need sales visibility.",
    });

    expect(result).toEqual({ ok: true, errors: {} });
  });
});
