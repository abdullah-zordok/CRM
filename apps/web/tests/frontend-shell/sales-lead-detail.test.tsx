import React from "react";
import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SalesLeadDetail } from "../../features/sales/components/sales-lead-detail";
import { renderWithProviders } from "../support/render";

const mocks = vi.hoisted(() => ({
  listLeadSources: vi.fn(),
  updateLead: vi.fn(),
  changeLeadStatus: vi.fn(),
  addLeadNote: vi.fn(),
  getLeadHistory: vi.fn(),
  listLeadActivities: vi.fn(),
  createActivity: vi.fn(),
  updateFollowUpStatus: vi.fn(),
  reassignActivity: vi.fn(),
}));

vi.mock("../../features/leads/api/leads-client", async () => {
  const actual = await vi.importActual<object>("../../features/leads/api/leads-client");
  return {
    ...actual,
    listLeadSources: mocks.listLeadSources,
    updateLead: mocks.updateLead,
    changeLeadStatus: mocks.changeLeadStatus,
    addLeadNote: mocks.addLeadNote,
    getLeadHistory: mocks.getLeadHistory,
  };
});

vi.mock("../../features/activities/api/activities-client", () => ({
  listLeadActivities: mocks.listLeadActivities,
  createActivity: mocks.createActivity,
  updateFollowUpStatus: mocks.updateFollowUpStatus,
  reassignActivity: mocks.reassignActivity,
}));

describe("SalesLeadDetail", () => {
  beforeEach(() => {
    mocks.listLeadSources.mockReset();
    mocks.getLeadHistory.mockReset();
    mocks.listLeadActivities.mockReset();
    mocks.listLeadSources.mockResolvedValue({
      items: [{ code: "MANUAL_ENTRY", name: "Manual Entry", status: "ACTIVE" }],
    });
    mocks.getLeadHistory.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 25 });
    mocks.listLeadActivities.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 25 });
  });

  it("shows the sales lifecycle workspace without assignment controls", async () => {
    const { container } = renderWithProviders(
      <SalesLeadDetail
        lead={{
          id: "lead-1",
          displayName: "Acme Buyer",
          company: "Acme",
          phone: "+15551234567",
          email: "buyer@example.com",
          sourceCode: "MANUAL_ENTRY",
          status: "QUALIFIED",
          priority: "MEDIUM",
          ownerUserId: "rep-1",
          ownerDisplayName: "Ali Ahmed",
          createdByUserId: "rep-1",
          createdByDisplayName: "Ali Ahmed",
          version: 1,
          createdAt: "2026-06-03T10:00:00.000Z",
          updatedAt: "2026-06-03T11:00:00.000Z",
          notes: [],
          assignmentHistory: [],
          statusHistory: [],
          permissions: {
            canUpdate: true,
            canAssign: false,
            canChangeStatus: true,
            canAddNote: true,
            canViewHistory: true,
          },
        }}
      />,
    );

    await waitFor(() => expect(container.textContent).toContain("Lead Information"));
    expect(container.textContent).toContain("Current Owner");
    expect(container.textContent).toContain("PROPOSAL_SENT");
    expect(container.textContent).toContain("Activities");
    expect(container.textContent).toContain("Follow-ups");
    expect(container.textContent).toContain("Notes");
    expect(container.textContent).toContain("Audit History");
    expect(container.textContent).not.toContain("Assign lead");
    expect(container.textContent).not.toContain("Owner ID");
    expect(container.textContent).not.toContain("Reassign");
  });
});
