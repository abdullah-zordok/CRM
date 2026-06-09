import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SalesLeadPortal } from "../../features/sales/components/sales-lead-portal";
import { renderWithProviders } from "../support/render";

const mocks = vi.hoisted(() => ({
  confirmLeadImport: vi.fn(),
  createLead: vi.fn(),
  downloadLeadImportTemplate: vi.fn(),
  exportLeads: vi.fn(),
  fileToBase64: vi.fn(),
  listLeads: vi.fn(),
  listLeadSources: vi.fn(),
  previewLeadImport: vi.fn(),
}));

vi.mock("../../features/leads/api/leads-client", () => ({
  confirmLeadImport: mocks.confirmLeadImport,
  createLead: mocks.createLead,
  downloadLeadImportTemplate: mocks.downloadLeadImportTemplate,
  exportLeads: mocks.exportLeads,
  fileToBase64: mocks.fileToBase64,
  listLeads: mocks.listLeads,
  listLeadSources: mocks.listLeadSources,
  previewLeadImport: mocks.previewLeadImport,
}));

describe("SalesLeadPortal", () => {
  beforeEach(() => {
    mocks.confirmLeadImport.mockReset();
    mocks.createLead.mockReset();
    mocks.downloadLeadImportTemplate.mockReset();
    mocks.exportLeads.mockReset();
    mocks.fileToBase64.mockReset();
    mocks.listLeads.mockReset();
    mocks.listLeadSources.mockReset();
    mocks.previewLeadImport.mockReset();
    mocks.listLeadSources.mockResolvedValue({
      items: [{ code: "MANUAL_ENTRY", name: "Manual Entry", status: "ACTIVE" }],
    });
    mocks.listLeads.mockResolvedValue({
      items: [
        {
          id: "lead-1",
          displayName: "Acme Buyer",
          company: "Acme",
          phone: "+15551234567",
          email: "buyer@example.com",
          sourceCode: "MANUAL_ENTRY",
          status: "NEW",
          priority: "MEDIUM",
          ownerUserId: "rep-1",
          version: 1,
          createdAt: "2026-06-03T10:00:00.000Z",
          updatedAt: "2026-06-03T10:00:00.000Z",
        },
      ],
      total: 1,
      page: 1,
      pageSize: 25,
    });
    mocks.createLead.mockResolvedValue({});
  });

  it("renders a restricted sales form and owned lead list", async () => {
    const { container } = renderWithProviders(<SalesLeadPortal />);

    await waitFor(() => expect(container.textContent).toContain("Acme Buyer"));
    expect(container.textContent).toContain("My Leads");
    expect(container.textContent).toContain("+15551234567");
    expect(container.textContent).not.toContain("Owner");
    expect(container.textContent).not.toContain("Team");
    expect(container.textContent).not.toContain("Apply filters");
    expect(container.textContent).toContain("Import Leads");
    expect(container.textContent).toContain("Export My Leads");
    expect(container.textContent).toContain("Download Template");
    expect(container.textContent).toContain("Search");
    expect(container.querySelector('a[href="/sales/leads/lead-1"]')).not.toBeNull();
  });

  it("searches only through the scoped sales lead list API", async () => {
    const { getByLabelText, getByRole } = renderWithProviders(<SalesLeadPortal />);

    await waitFor(() => expect(mocks.listLeads).toHaveBeenCalled());
    fireEvent.change(getByLabelText("Search"), { target: { value: "Acme" } });
    fireEvent.click(getByRole("button", { name: "Search" }));

    await waitFor(() =>
      expect(mocks.listLeads).toHaveBeenCalledWith({ pageSize: 25, search: "Acme" }),
    );
  });

  it("creates a sales lead without owner assignment fields", async () => {
    const { getByLabelText, getByRole } = renderWithProviders(<SalesLeadPortal />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "New Buyer" } });
    fireEvent.change(getByLabelText("Company"), { target: { value: "New Co" } });
    fireEvent.change(getByLabelText("Email"), { target: { value: "new@example.com" } });
    fireEvent.click(getByRole("button", { name: "Add lead" }));

    await waitFor(() => expect(mocks.createLead).toHaveBeenCalled());
    expect(mocks.createLead).toHaveBeenCalledWith(
      expect.not.objectContaining({ ownerUserId: expect.anything() }),
    );
    expect(mocks.createLead).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: "New Buyer",
        company: "New Co",
        email: "new@example.com",
        priority: "MEDIUM",
      }),
    );
  });
});
