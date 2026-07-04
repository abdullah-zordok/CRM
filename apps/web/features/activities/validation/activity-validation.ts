import { z } from "zod";

const sensitivePattern =
  /(password|passwd|secret|api[_ -]?key|token|credit card|card number|cvv|iban)/i;

const optionalNote = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || !sensitivePattern.test(value), {
    message: "Do not include passwords, payment details, or private credentials in activity notes.",
  });

export const completedActivityFormSchema = z.object({
  type: z.enum(["CALL", "EMAIL", "MEETING", "EXHIBITION_VISIT", "WHATSAPP", "OTHER"]),
  activityAt: z.string().trim().min(1, "Activity time is required."),
  outcome: z.enum([
    "CONNECTED",
    "NO_ANSWER",
    "QUALIFIED_INTEREST",
    "FOLLOW_UP_REQUIRED",
    "NOT_INTERESTED",
    "OTHER",
  ]),
  note: optionalNote,
});

export const followUpFormSchema = z.object({
  type: z.enum(["CALL", "EMAIL", "MEETING", "EXHIBITION_VISIT", "WHATSAPP", "OTHER"]),
  dueAt: z.string().trim().min(1, "Due date is required."),
  note: optionalNote,
});

export type CompletedActivityFormInput = z.infer<typeof completedActivityFormSchema>;
export type FollowUpFormInput = z.infer<typeof followUpFormSchema>;
