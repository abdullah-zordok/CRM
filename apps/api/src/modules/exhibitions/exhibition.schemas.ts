import { z } from "zod";

export const ExhibitionStatusSchema = z.enum([
  "PLANNED",
  "ACTIVE",
  "COMPLETED",
  "CANCELED",
  "ARCHIVED",
]);
export const AttendeeStatusSchema = z.enum([
  "PLANNED",
  "CONFIRMED",
  "ABSENT",
  "REMOVED",
  "CORRECTED",
]);
export const AttributionTypeSchema = z.enum(["SOURCE", "INFLUENCE", "CORRECTION"]);
export const AttributionStatusSchema = z.enum(["ACTIVE", "REMOVED", "CORRECTED"]);

const ExhibitionFieldsSchema = z.object({
  name: z.string().min(1).max(160),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  location: z.string().min(1).max(160),
  status: ExhibitionStatusSchema,
  ownerUserId: z.string().uuid(),
  teamId: z.string().uuid().nullable().optional(),
  notes: z.string().max(4000).optional(),
});

function hasValidDateRange(data: { startsAt?: string; endsAt?: string }) {
  if (!data.startsAt || !data.endsAt) return true;
  return new Date(data.startsAt) < new Date(data.endsAt);
}

export const CreateExhibitionSchema = ExhibitionFieldsSchema.refine(hasValidDateRange, {
  message: "endsAt must be after startsAt",
  path: ["endsAt"],
});

export const UpdateExhibitionSchema = ExhibitionFieldsSchema.partial()
  .extend({
    version: z.number().int().min(1),
  })
  .refine(hasValidDateRange, {
    message: "endsAt must be after startsAt",
    path: ["endsAt"],
  });

export const ArchiveExhibitionSchema = z.object({
  reason: z.string().max(500).optional(),
  version: z.number().int().min(1),
});

export const RestoreExhibitionSchema = z.object({
  restoredStatus: ExhibitionStatusSchema,
  version: z.number().int().min(1),
});

export const AssignExhibitionAttendeeSchema = z.object({
  userId: z.string().uuid(),
  plannedRole: z.string().max(120).optional(),
});

export const ConfirmAttendanceSchema = z.object({
  status: AttendeeStatusSchema,
  correctionReason: z.string().max(500).optional(),
  version: z.number().int().min(1),
});

export const AttributeLeadSchema = z.object({
  leadId: z.string().uuid(),
  attributionType: AttributionTypeSchema,
  preserveReference: z.boolean().default(true).optional(),
});

export const CorrectAttributionSchema = z.object({
  status: AttributionStatusSchema,
  correctionReason: z.string().max(500).optional(),
  version: z.number().int().min(1),
});

export const ExhibitionSearchSchema = z.object({
  search: z.string().max(120).optional(),
  status: ExhibitionStatusSchema.optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  location: z.string().max(120).optional(),
  ownerUserId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
  attendeeUserId: z.string().uuid().optional(),
  attributionState: z.enum(["WITH_LEADS", "WITHOUT_LEADS"]).optional(),
  page: z.coerce.number().int().min(1).default(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(25).optional(),
});

export type CreateExhibitionInput = z.infer<typeof CreateExhibitionSchema>;
export type UpdateExhibitionInput = z.infer<typeof UpdateExhibitionSchema>;
export type ArchiveExhibitionInput = z.infer<typeof ArchiveExhibitionSchema>;
export type RestoreExhibitionInput = z.infer<typeof RestoreExhibitionSchema>;
export type AssignExhibitionAttendeeInput = z.infer<typeof AssignExhibitionAttendeeSchema>;
export type ConfirmAttendanceInput = z.infer<typeof ConfirmAttendanceSchema>;
export type AttributeLeadInput = z.infer<typeof AttributeLeadSchema>;
export type CorrectAttributionInput = z.infer<typeof CorrectAttributionSchema>;
export type ExhibitionSearchInput = z.infer<typeof ExhibitionSearchSchema>;
