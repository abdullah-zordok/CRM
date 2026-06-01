import { z } from "zod";

export const leadPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export const leadStatuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "NEGOTIATION",
  "WON",
  "LOST",
  "ARCHIVED",
] as const;

export const exhibitionReferenceSchema = z.object({
  name: z.string().trim().min(1).max(160),
  date: z.string().optional(),
  location: z.string().trim().max(160).optional(),
});

export const leadFormSchema = z
  .object({
    displayName: z.string().trim().max(160).optional(),
    company: z.string().trim().max(160).optional(),
    email: z.string().trim().email().max(320).optional(),
    phone: z.string().trim().max(40).optional(),
    sourceCode: z.string().trim().min(1),
    priority: z.enum(leadPriorities),
    ownerUserId: z.string().uuid(),
    budgetAmount: z.coerce.number().nonnegative().optional(),
    budgetCurrency: z.string().trim().length(3).optional(),
    exhibitionReference: exhibitionReferenceSchema.optional(),
    initialNote: z.string().trim().max(4000).optional(),
  })
  .superRefine((value, ctx) => {
    if (!value.displayName && !value.company) {
      ctx.addIssue({
        code: "custom",
        path: ["displayName"],
        message: "Name or company is required",
      });
    }
    if (!value.email && !value.phone) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "Email or phone is required" });
    }
  });

export type LeadFormInput = z.infer<typeof leadFormSchema>;
