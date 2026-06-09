import { z } from "zod";
import {
  ACTIVITY_DUE_STATES,
  ACTIVITY_OUTCOMES,
  ACTIVITY_STATUSES,
  ACTIVITY_TYPES,
  containsSensitiveActivityText,
} from "./activity.types.js";

const uuid = z.string().uuid();
const dateTime = z.string().datetime();
const optionalNote = z
  .string()
  .trim()
  .min(1)
  .max(4000)
  .refine((value) => !containsSensitiveActivityText(value), {
    message: "Activity notes must not include passwords, payment details, or private credentials.",
  })
  .optional();

export const createActivitySchema = z
  .object({
    leadId: uuid,
    type: z.enum(ACTIVITY_TYPES),
    ownerUserId: uuid,
    activityAt: dateTime.optional(),
    dueAt: dateTime.optional(),
    outcome: z.enum(ACTIVITY_OUTCOMES).optional(),
    note: optionalNote,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.activityAt || value.outcome) {
      if (!value.activityAt) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["activityAt"],
          message: "Activity time is required for completed activities.",
        });
      }
      if (!value.outcome) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["outcome"],
          message: "Outcome is required for completed activities.",
        });
      }
      return;
    }

    if (!value.dueAt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dueAt"],
        message: "Due date is required for planned follow-ups.",
      });
    }
  });

export const completeActivitySchema = z
  .object({
    version: z.number().int().positive(),
    outcome: z.enum(ACTIVITY_OUTCOMES),
    completedAt: dateTime,
    note: optionalNote,
  })
  .strict();

export const reassignActivitySchema = z
  .object({
    version: z.number().int().positive(),
    ownerUserId: uuid,
    reason: z.string().trim().max(500).optional(),
  })
  .strict();

export const cancelActivitySchema = z
  .object({
    version: z.number().int().positive(),
    reason: z.string().trim().max(500).optional(),
  })
  .strict();

export const updateFollowUpStatusSchema = z
  .object({
    version: z.number().int().positive(),
    status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED"]),
    outcome: z.enum(ACTIVITY_OUTCOMES).optional(),
    completedAt: dateTime.optional(),
    note: optionalNote,
    reason: z.string().trim().max(500).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.status === "COMPLETED" && !value.outcome) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["outcome"],
        message: "Outcome is required when completing a follow-up.",
      });
    }
  });

export const activitySearchSchema = z
  .object({
    leadId: uuid.optional(),
    ownerUserId: uuid.optional(),
    teamId: uuid.optional(),
    type: z.enum(ACTIVITY_TYPES).optional(),
    status: z.enum(ACTIVITY_STATUSES).optional(),
    dueState: z.enum(ACTIVITY_DUE_STATES).optional(),
    from: dateTime.optional(),
    to: dateTime.optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(25),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.from && value.to && new Date(value.from) > new Date(value.to)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message: "Date range end must be after the start.",
      });
    }
  });

export const activityTimelineQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(25),
  })
  .strict();

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type CompleteActivityInput = z.infer<typeof completeActivitySchema>;
export type ReassignActivityInput = z.infer<typeof reassignActivitySchema>;
export type CancelActivityInput = z.infer<typeof cancelActivitySchema>;
export type UpdateFollowUpStatusInput = z.infer<typeof updateFollowUpStatusSchema>;
export type ActivitySearchInput = z.infer<typeof activitySearchSchema>;
export type ActivityTimelineQueryInput = z.infer<typeof activityTimelineQuerySchema>;
