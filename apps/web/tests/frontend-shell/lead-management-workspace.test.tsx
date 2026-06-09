import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LeadList } from "../../features/leads/components/lead-list";
import { renderWithProviders } from "../support/render";

const mocks = vi.hoisted(() => ({
  confirmLeadImport: vi.fn(),
  createLead: vi.fn(),
  downloadLeadImportTemplate: vi.fn(),
  exportLeads: vi.fn(),
  fileToBase64: vi.fn(),
  getLead: vi.fn(),
  getLeadHistory: vi.fn(),
  getLeadSummary: vi.fn(),
  listLeads: vi.fn(),
  listLeadSources: vi.fn(),
  previewLeadImport: vi.fn(),
  listUsers: vi.fn(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("../../features/foundation/auth/use-session", () => ({
  useSession: () => ({
    user: { id: "admin-1", roles: ["ADMIN"] },
    loading: false,
  }),
}));

vi.mock("../../features/leads/api/leads-client", () => ({
  confirmLeadImport: mocks.confirmLeadImport,
  createLead: mocks.createLead,
  downloadLeadImportTemplate: mocks.downloadLeadImportTemplate,
  exportLeads: mocks.exportLeads,
  fileToBase64: mocks.fileToBase64,
  getLead: mocks.getLead,
  getLeadHistory: mocks.getLeadHistory,
  getLeadSummary: mocks.getLeadSummary,
  listLeads: mocks.listLeads,
  listLeadSources: mocks.listLeadSources,
  previewLeadImport: mocks.previewLeadImport,
}));

vi.mock("../../features/users/api/users-client", () => ({
  listUsers: mocks.listUsers,
}));

const lead = {
  id: "lead-1",
  displayName: "Mohamed Sayed",
  company: "Initrode",
  phone: "+966 55 987 6543",
  email: "mohamed.s@initrode.com",
  sourceCode: "WEBSITE",
  status: "CONTACTED",
  priority: "HIGH",
  ownerUserId: "owner-1",
  ownerDisplayName: "David Davis",
  version: 1,
  createdAt: "2026-06-03T10:30:00.000Z",
  updatedAt: "2026-06-03T14:15:00.000Z",
};

describe("LeadList CRM workspace", () => {
  beforeEach(() => {
    mocks.confirmLeadImport.mockReset();
    mocks.createLead.mockReset();
    mocks.downloadLeadImportTemplate.mockReset();
    mocks.exportLeads.mockReset();
    mocks.fileToBase64.mockReset();
    mocks.getLead.mockReset();
    mocks.getLeadHistory.mockReset();
    mocks.getLeadSummary.mockReset();
    mocks.listLeads.mockReset();
    mocks.listLeadSources.mockReset();
    mocks.previewLeadImport.mockReset();
    mocks.listUsers.mockReset();
    mocks.push.mockReset();

    mocks.getLeadSummary.mockResolvedValue({
      totalLeads: 245,
      newLeads: 32,
      contacted: 86,
      won: 27,
      correlationId: "test",
    });
    mocks.listLeadSources.mockResolvedValue({
      items: [{ code: "WEBSITE", name: "Website", status: "ACTIVE" }],
    });
    mocks.listUsers.mockResolvedValue({
      items: [
        {
          id: "owner-1",
          email: "owner@example.com",
          displayName: "David Davis",
          status: "ACTIVE",
          roles: ["SALES_REPRESENTATIVE"],
          hasReviewerAccess: false,
        },
      ],
    });
    mocks.listLeads.mockResolvedValue({
      items: [lead],
      total: 245,
      page: 1,
      pageSize: 10,
    });
    mocks.getLead.mockResolvedValue({
      ...lead,
      assignmentHistory: [],
      statusHistory: [],
      notes: [
        {
          id: "note-1",
          leadId: "lead-1",
          authorUserId: "admin-1",
          body: "Interested in our CRM solution.",
          createdAt: "2026-06-03T10:35:00.000Z",
          correlationId: "test",
        },
      ],
      permissions: {
        canUpdate: true,
        canAssign: true,
        canChangeStatus: true,
        canAddNote: true,
        canViewHistory: true,
      },
    });
    mocks.getLeadHistory.mockResolvedValue({
      items: [
        {
          id: "history-1",
          leadId: "lead-1",
          entryType: "NOTE_ADDED",
          summary: "Note added",
          metadata: {},
          createdAt: "2026-06-03T14:15:00.000Z",
          correlationId: "test",
        },
      ],
      total: 1,
      page: 1,
      pageSize: 1,
    });
    mocks.createLead.mockResolvedValue({});
  });

  it("renders KPI cards, filters, table columns, and selected lead preview", async () => {
    const { container } = renderWithProviders(<LeadList />);

    await waitFor(() => expect(container.textContent).toContain("Mohamed Sayed"));
    expect(container.textContent).toContain("Track and manage all your leads in one place");
    expect(container.textContent).toContain("Total Leads");
    expect(container.textContent).toContain("245");
    expect(container.textContent).toContain("New Leads");
    expect(container.textContent).toContain("32");
    expect(container.textContent).toContain("Contacted");
    expect(container.textContent).toContain("86");
    expect(container.textContent).toContain("Won");
    expect(container.textContent).toContain("27");
    expect(container.textContent).toContain("Lead");
    expect(container.textContent).toContain("Company");
    expect(container.textContent).toContain("Owner");
    expect(container.textContent).toContain("Priority");
    expect(container.textContent).toContain("Import");
    expect(container.textContent).toContain("Export");
    expect(container.textContent).toContain("Download Template");
    expect(container.textContent).toContain("View Full Details");

    await waitFor(() => expect(container.textContent).toContain("Interested in our CRM solution."));
  });

  it("filters, paginates, opens create modal, and navigates to details", async () => {
    const { container, getByRole } = renderWithProviders(<LeadList />);

    await waitFor(() => expect(mocks.listLeads).toHaveBeenCalledWith({ page: 1, pageSize: 10 }));
    fireEvent.change(container.querySelector('input[placeholder="Search leads..."]') as Element, {
      target: { value: "Mohamed" },
    });
    fireEvent.change(container.querySelector("select") as Element, {
      target: { value: "CONTACTED" },
    });
    fireEvent.click(getByRole("button", { name: "Filters" }));

    await waitFor(() =>
      expect(mocks.listLeads).toHaveBeenCalledWith(
        expect.objectContaining({
          search: "Mohamed",
          status: "CONTACTED",
          page: 1,
          pageSize: 10,
        }),
      ),
    );

    fireEvent.doubleClick(container.querySelector("tbody tr") as Element);
    expect(mocks.push).toHaveBeenCalledWith("/leads/lead-1");

    fireEvent.click(getByRole("button", { name: /new lead/i }));
    expect(getByRole("dialog", { name: "New Lead" })).not.toBeNull();
    await waitFor(() => expect(container.textContent).toContain("David Davis"));
  });
});
