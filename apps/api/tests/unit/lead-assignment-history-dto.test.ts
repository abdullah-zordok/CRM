import { describe, expect, it } from "vitest";
import { leadPermissionsForRoles, toLeadDetailDto } from "../../src/modules/leads/leads.dto.js";

function leadWithAssignment() {
  const now = new Date("2026-06-03T10:45:00.000Z");

  return {
    id: "lead-1",
    displayName: "Ahmed Ali",
    company: "Acme",
    email: "ahmed@example.com",
    phone: "555-0100",
    sourceCode: "MANUAL_ENTRY",
    status: "NEW",
    priority: "MEDIUM",
    budgetAmount: null,
    budgetCurrency: null,
    ownerUserId: "owner-2",
    createdByUserId: "admin-1",
    teamId: null,
    version: 3,
    createdAt: now,
    updatedAt: now,
    owner: { id: "owner-2", displayName: "Abdullah Zordok", isDeleted: false },
    creator: { id: "admin-1", displayName: "Seeded Admin", isDeleted: false },
    team: null,
    exhibitionReference: null,
    notes: [],
    statusHistory: [],
    historyEntries: [],
    exhibitionAttributions: [],
    assignments: [
      {
        id: "assignment-1",
        leadId: "lead-1",
        fromUserId: "owner-1",
        toUserId: "owner-2",
        fromTeamId: null,
        toTeamId: null,
        assignedByUserId: "admin-1",
        reason: "Territory assignment",
        createdAt: now,
        correlationId: "test",
      },
    ],
  };
}

describe("lead assignment history DTO", () => {
  it("returns readable assignment audit refs without legacy raw-id fields", () => {
    const detail = toLeadDetailDto(leadWithAssignment() as never, "test", {
      permissions: leadPermissionsForRoles(["ADMIN"]),
      includeAssignmentHistory: true,
      userDisplayNames: {
        "owner-1": "Ali Ahmed",
        "owner-2": "Abdullah Zordok",
        "admin-1": "Seeded Admin",
      },
    });

    expect(detail.assignmentHistory).toEqual([
      {
        previousOwner: { id: "owner-1", displayName: "Ali Ahmed" },
        newOwner: { id: "owner-2", displayName: "Abdullah Zordok" },
        assignedBy: { id: "admin-1", displayName: "Seeded Admin" },
        assignedAt: "2026-06-03T10:45:00.000Z",
        reason: "Territory assignment",
      },
    ]);
    expect(detail.assignmentHistory[0]).not.toHaveProperty("fromUserId");
    expect(detail.assignmentHistory[0]).not.toHaveProperty("toUserId");
    expect(detail.assignmentHistory[0]).not.toHaveProperty("assignedByUserId");
  });

  it("omits assignment history for users without assignment visibility", () => {
    const detail = toLeadDetailDto(leadWithAssignment() as never, "test", {
      permissions: leadPermissionsForRoles(["SALES_REPRESENTATIVE"]),
      includeAssignmentHistory: false,
    });

    expect(detail.assignmentHistory).toEqual([]);
  });
});
