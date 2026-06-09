import React from "react";
import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeadActivityTimeline } from "../../features/activities/components/lead-activity-timeline";
import { renderWithProviders } from "../support/render";

const mocks = vi.hoisted(() => ({
  listLeadActivities: vi.fn(),
  createActivity: vi.fn(),
  completeActivity: vi.fn(),
  reassignActivity: vi.fn(),
  cancelActivity: vi.fn(),
  updateFollowUpStatus: vi.fn(),
}));

vi.mock("../../features/activities/api/activities-client", () => ({
  listLeadActivities: mocks.listLeadActivities,
  createActivity: mocks.createActivity,
  completeActivity: mocks.completeActivity,
  reassignActivity: mocks.reassignActivity,
  cancelActivity: mocks.cancelActivity,
  updateFollowUpStatus: mocks.updateFollowUpStatus,
}));

describe("LeadActivityTimeline separation", () => {
  beforeEach(() => {
    mocks.listLeadActivities.mockReset();
  });

  it("renders completed activities and planned follow-ups in separate sections", async () => {
    mocks.listLeadActivities.mockResolvedValue({
      items: [
        {
          id: "activity-1",
          leadId: "lead-1",
          leadDisplayName: "Ali Ahmed",
          type: "CALL",
          status: "COMPLETED",
          kind: "ACTIVITY",
          followUpStatus: null,
          ownerUserId: "owner-1",
          ownerDisplayName: "Ali Ahmed",
          recordedByUserId: "recorder-1",
          recordedByDisplayName: "Abdullah Zordok",
          teamId: null,
          activityAt: "2026-06-12T09:00:00.000Z",
          dueAt: null,
          completedAt: null,
          outcome: "CONNECTED",
          note: "Customer requested product pricing.",
          version: 1,
          recordedAt: "2026-06-12T09:05:00.000Z",
          createdAt: "2026-06-12T09:05:00.000Z",
          updatedAt: "2026-06-12T09:05:00.000Z",
          permissions: {
            canComplete: false,
            canReassign: false,
            canCancel: false,
            canCorrect: true,
          },
        },
        {
          id: "follow-up-1",
          leadId: "lead-1",
          leadDisplayName: "Ali Ahmed",
          type: "EMAIL",
          status: "OPEN",
          kind: "FOLLOW_UP",
          followUpStatus: "PENDING",
          ownerUserId: "owner-1",
          ownerDisplayName: "Ali Ahmed",
          recordedByUserId: "creator-1",
          recordedByDisplayName: "Abdullah Zordok",
          teamId: null,
          activityAt: null,
          dueAt: "2026-06-20T09:00:00.000Z",
          completedAt: null,
          outcome: null,
          note: "Send pricing proposal and product brochure.",
          version: 1,
          recordedAt: "2026-06-12T09:05:00.000Z",
          createdAt: "2026-06-12T09:05:00.000Z",
          updatedAt: "2026-06-12T09:05:00.000Z",
          permissions: {
            canComplete: true,
            canReassign: true,
            canCancel: true,
            canCorrect: false,
          },
        },
      ],
      total: 2,
      page: 1,
      pageSize: 25,
      correlationId: "test",
    });

    const { container } = renderWithProviders(
      <LeadActivityTimeline leadId="lead-1" ownerUserId="owner-1" />,
    );

    await waitFor(() => expect(container.textContent).toContain("Activities"));
    expect(container.textContent).toContain("Follow-ups");
    expect(container.textContent).toContain("Activity Type");
    expect(container.textContent).toContain("Recorded By");
    expect(container.textContent).toContain("Abdullah Zordok");
    expect(container.textContent).toContain("Lead Owner");
    expect(container.textContent).toContain("Follow-Up Type");
    expect(container.textContent).toContain("EMAIL");
    expect(container.textContent).toContain("Assigned To");
    expect(container.textContent).toContain("Created By");
    expect(container.textContent).toContain("Preparation Notes");
  });
});
