import { z } from "zod";

export const contactSalesSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  company: z.string().trim().min(1, "Company is required."),
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email address."),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(1, "Message is required."),
});

export type ContactSalesInput = z.infer<typeof contactSalesSchema>;

export interface ContactValidationResult {
  ok: boolean;
  errors: Partial<Record<keyof ContactSalesInput, string>>;
}

export function validateContactSales(input: FormData | ContactSalesInput): ContactValidationResult {
  const rawInput =
    input instanceof FormData
      ? {
          name: String(input.get("name") ?? ""),
          company: String(input.get("company") ?? ""),
          email: String(input.get("email") ?? ""),
          phone: String(input.get("phone") ?? ""),
          message: String(input.get("message") ?? ""),
        }
      : input;

  const parsed = contactSalesSchema.safeParse(rawInput);
  if (parsed.success) {
    return { ok: true, errors: {} };
  }

  const errors: ContactValidationResult["errors"] = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as keyof ContactSalesInput | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { ok: false, errors };
}
