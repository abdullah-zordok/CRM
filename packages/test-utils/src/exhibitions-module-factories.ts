export type ExhibitionStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELED" | "ARCHIVED";

export interface ExhibitionFactoryInput {
  name?: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  status?: ExhibitionStatus;
  ownerUserId?: string;
  teamId?: string;
  notes?: string;
}

export const SEEDED_ADMIN_ID = "00000000-0000-4000-8000-000000000001";

export function createExhibitionFactoryInput(
  input: ExhibitionFactoryInput = {},
): Required<
  Pick<
    ExhibitionFactoryInput,
    "name" | "startsAt" | "endsAt" | "location" | "status" | "ownerUserId"
  >
> &
  Pick<ExhibitionFactoryInput, "teamId" | "notes"> {
  const startsAt = new Date();
  startsAt.setDate(startsAt.getDate() + 1);
  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + 3);

  return {
    name: input.name ?? "Test Exhibition",
    startsAt: input.startsAt ?? startsAt.toISOString(),
    endsAt: input.endsAt ?? endsAt.toISOString(),
    location: input.location ?? "Test Location",
    status: input.status ?? "PLANNED",
    ownerUserId: input.ownerUserId ?? SEEDED_ADMIN_ID,
    teamId: input.teamId,
    notes: input.notes,
  };
}
