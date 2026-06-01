import { z } from "zod";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "./leads.types.js";

const uuid = z.string().uuid();
const optionalText = (max: number) => z.string().trim().min(1).max(max).optional();

export const exhibitionReferenceSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .nullable(),
    location: z.string().trim().min(1).max(160).optional().nullable(),
  })
  .strict();

const createLeadObjectSchema = z
  .object({
    displayName: optionalText(160),
    company: optionalText(160),
    email: z.string().trim().email().max(320).optional(),
    phone: z.string().trim().min(3).max(40).optional(),
    sourceCode: z.string().trim().min(1).max(80),
    priority: z.enum(LEAD_PRIORITIES),
    ownerUserId: uuid,
    budgetAmount: z.number().nonnegative().optional(),
    budgetCurrency: z.string().trim().length(3).optional(),
    exhibitionReference: exhibitionReferenceSchema.optional(),
    initialNote: z.string().trim().min(1).max(4000).optional(),
  })
  .strict();

export const createLeadSchema = createLeadObjectSchema.superRefine((value, ctx) => {
  if (!value.displayName && !value.company) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["displayName"],
      message: "Display name or company is required",
    });
  }
  if (!value.email && !value.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["email"],
      message: "Email or phone is required",
    });
  }
});

export const updateLeadSchema = createLeadObjectSchema
  .partial()
  .extend({
    version: z.number().int().positive(),
  })
  .strict();

export const assignLeadSchema = z
  .object({
    ownerUserId: uuid,
    reason: z.string().trim().max(500).optional(),
    version: z.number().int().positive(),
  })
  .strict();

export const changeLeadStatusSchema = z
  .object({
    status: z.enum(LEAD_STATUSES),
    reason: z.string().trim().max(500).optional(),
    version: z.number().int().positive(),
  })
  .strict();

export const addLeadNoteSchema = z
  .object({
    body: z.string().trim().min(1).max(4000),
    version: z.number().int().positive(),
  })
  .strict();

export const leadSearchSchema = z
  .object({
    search: z.string().trim().max(120).optional(),
    status: z.enum(LEAD_STATUSES).optional(),
    sourceCode: z.string().trim().max(80).optional(),
    priority: z.enum(LEAD_PRIORITIES).optional(),
    ownerUserId: uuid.optional(),
    teamId: uuid.optional(),
    exhibition: z.string().trim().max(120).optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(25),
  })
  .strict();

export const leadHistoryQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(25),
  })
  .strict();

export function normalizeEmail(email: string | undefined): string | undefined {
  return email?.trim().toLowerCase();
}

export function normalizePhone(phone: string | undefined): string | undefined {
  return phone?.replace(/[^\d+]/g, "");
}

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type AssignLeadInput = z.infer<typeof assignLeadSchema>;
export type ChangeLeadStatusInput = z.infer<typeof changeLeadStatusSchema>;
export type AddLeadNoteInput = z.infer<typeof addLeadNoteSchema>;
export type LeadSearchInput = z.infer<typeof leadSearchSchema>;
export type LeadHistoryQueryInput = z.infer<typeof leadHistoryQuerySchema>;
