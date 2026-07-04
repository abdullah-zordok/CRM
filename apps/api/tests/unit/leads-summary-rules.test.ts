import { describe, expect, it, vi } from "vitest";
import { LeadRepository } from "../../src/modules/leads/leads.repository.js";

describe("lead summary rules", () => {
  it("counts scoped total, current-month new leads, contacted leads, and current-month won leads", async () => {
    const count = vi
      .fn()
      .mockResolvedValueOnce(245)
      .mockResolvedValueOnce(32)
      .mockResolvedValueOnce(86)
      .mockResolvedValueOnce(27);
    const prisma = {
      $transaction: async (items: Promise<unknown>[]) => Promise.all(items),
      lead: { count },
    };
    const repository = new LeadRepository(prisma as never);

    await expect(
      repository.summary({
        scope: { teamId: "team-1" },
        now: new Date("2026-06-04T10:00:00.000Z"),
      }),
    ).resolves.toEqual({
      totalLeads: 245,
      newLeads: 32,
      contacted: 86,
      won: 27,
    });
    expect(count).toHaveBeenCalledWith({ where: { teamId: "team-1" } });
    expect(count).toHaveBeenCalledWith({
      where: {
        AND: [
          { teamId: "team-1" },
          { status: "NEW" },
          {
            createdAt: {
              gte: expect.any(Date),
              lt: expect.any(Date),
            },
          },
        ],
      },
    });
  });
});
