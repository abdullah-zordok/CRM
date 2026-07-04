import React from "react";
import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeadAssignmentPanel } from "../../features/leads/components/lead-assignment-panel";
import type { LeadDetail } from "../../features/leads/api/leads-client";
import { renderWithProviders } from "../support/render";

const mocks = vi.hoisted(() => ({
  assignLead: vi.fn(),
  listUsers: vi.fn(),
}));

vi.mock("../../features/leads/api/leads-client", () => ({
  assignLead: mocks.assignLead,
}));

vi.mock("../../features/users/api/users-client", () => ({
  listUsers: mocks.listUsers,
}));

beforeEach(() => {
  mocks.assignLead.mockReset();
  mocks.listUsers.mockReset();
});

function leadWithAssignmentHistory(): LeadDetail {
  return {
    id: "lead-1",
    displayName: "Ahmed Ali",
    company: "Acme",
    email: "ahmed@example.com",
    phone: "555-0100",
    sourceCode: "MANUAL_ENTRY",
    status: "NEW",
    priority: "MEDIUM",
    ownerUserId: "cbe27d78-221e-4968-899a-445e29aeea52",
    ownerDisplayName: "Abdullah Zordok",
    teamId: null,
    teamName: null,
    createdByUserId: "admin-1",
    createdByDisplayName: "Seeded Admin",
    version: 3,
    createdAt: "2026-06-03T10:41:00.000Z",
    updatedAt: "2026-06-03T10:45:00.000Z",
    notes: [],
    statusHistory: [],
    assignmentHistory: [
      {
        previousOwner: {
          id: "c68f008b-522d-4bdd-b311-26a153749a72",
          displayName: "Ali Ahmed",
        },
        newOwner: {
          id: "cbe27d78-221e-4968-899a-445e29aeea52",
          displayName: "Abdullah Zordok",
        },
        assignedBy: { id: "admin-1", displayName: "Seeded Admin" },
        assignedAt: "2026-06-03T10:45:00.000Z",
        reason: "Territory assignment",
      },
    ],
    permissions: {
      canUpdate: true,
      canAssign: true,
      canChangeStatus: true,
      canAddNote: true,
      canViewHistory: true,
    },
  };
}

describe("LeadAssignmentPanel", () => {
  it("renders assignment history as a readable table without raw UUIDs", async () => {
    mocks.listUsers.mockResolvedValue({ items: [] });

    const { container } = renderWithProviders(
      <LeadAssignmentPanel lead={leadWithAssignmentHistory()} />,
    );

    await waitFor(() => expect(mocks.listUsers).toHaveBeenCalled());

    expect(container.textContent).toContain("Ali Ahmed");
    expect(container.textContent).toContain("Abdullah Zordok");
    expect(container.textContent).toContain("Seeded Admin");
    expect(container.textContent).toContain("Territory assignment");
    expect(container.textContent).not.toContain("c68f008b-522d-4bdd-b311-26a153749a72");
    expect(container.textContent).not.toContain("cbe27d78-221e-4968-899a-445e29aeea52");
  });

  it("does not render assignment controls when assignment is not permitted", async () => {
    mocks.listUsers.mockResolvedValue({ items: [] });
    const lead = leadWithAssignmentHistory();
    lead.permissions.canAssign = false;

    const { container } = renderWithProviders(<LeadAssignmentPanel lead={lead} />);

    await waitFor(() => expect(mocks.listUsers).toHaveBeenCalled());

    expect(container.textContent).toBe("");
  });
});
