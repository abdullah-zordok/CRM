import { z } from "zod";

export const ExhibitionFormSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(160),
    startsAt: z.string().min(1, "Start date is required"),
    endsAt: z.string().min(1, "End date is required"),
    location: z.string().min(1, "Location is required").max(160),
    status: z.enum(["PLANNED", "ACTIVE", "COMPLETED", "CANCELED", "ARCHIVED"]),
    ownerUserId: z.string().uuid("Valid owner is required"),
    teamId: z.string().uuid().optional().nullable(),
    notes: z.string().max(4000).optional(),
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return new Date(data.startsAt) < new Date(data.endsAt);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endsAt"],
    },
  );

export type ExhibitionFormData = z.infer<typeof ExhibitionFormSchema>;
