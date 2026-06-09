import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OperationsDashboard } from "../../features/workspace/components/operations-dashboard";
import { renderWithProviders } from "../support/render";

const mocks = vi.hoisted(() => ({
  getOperationsDashboard: vi.fn(),
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("../../features/workspace/api/operations-dashboard-client", () => ({
  getOperationsDashboard: mocks.getOperationsDashboard,
}));

const dashboardPayload = {
  scope: "MANAGER_TEAM",
  summary: {
    totalLeads: 12,
    totalUsers: 6,
    salesRepresentatives: 4,
  },
  usersOverview: [
    { id: "user-1", displayName: "Ali Ahmed", email: "ali@example.com", leadCount: 35 },
    { id: "user-2", displayName: "Abdullah Zordok", email: "abdullah@example.com", leadCount: 28 },
    { id: "user-3", displayName: "Mohamed Ali", email: "mohamed@example.com", leadCount: 26 },
    { id: "user-4", displayName: "Hassan Mohamed", email: "hassan@example.com", leadCount: 18 },
    { id: "user-5", displayName: "Omar Ibrahim", email: "omar@example.com", leadCount: 15 },
    { id: "user-6", displayName: "Salma Tarek", email: "salma@example.com", leadCount: 11 },
  ],
  leads: [
    {
      id: "lead-1",
      name: "Acme Customer",
      phone: "+15551234567",
      email: "buyer@example.com",
      status: "NEW",
      createdAt: "2026-06-03T10:00:00.000Z",
      createdBy: { id: "creator-1", displayName: "Abdullah" },
      currentOwner: { id: "owner-1", displayName: "Mohamed" },
    },
  ],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 12,
    totalPages: 2,
  },
  generatedAt: "2026-06-03T10:01:00.000Z",
};

describe("OperationsDashboard lead-first view", () => {
  beforeEach(() => {
    mocks.getOperationsDashboard.mockReset();
    mocks.push.mockReset();
  });

  it("renders summary cards, five user cards, all leads, and row navigation", async () => {
    mocks.getOperationsDashboard.mockResolvedValue(dashboardPayload);

    const { container } = renderWithProviders(<OperationsDashboard />);

    await waitFor(() => expect(container.textContent).toContain("All Leads"));
    expect(container.textContent).toContain("Total Leads");
    expect(container.textContent).toContain("12");
    expect(container.textContent).toContain("Total Users");
    expect(container.textContent).toContain("6");
    expect(container.textContent).toContain("Sales Representatives");
    expect(container.textContent).toContain("4");
    expect(container.textContent).toContain("Users Overview");
    expect(container.textContent).toContain("Ali Ahmed");
    expect(container.textContent).not.toContain("Salma Tarek");
    expect(container.textContent).toContain("View all users");
    expect(container.textContent).toContain("Lead Name");
    expect(container.textContent).toContain("Phone");
    expect(container.textContent).toContain("Email");
    expect(container.textContent).toContain("Created By");
    expect(container.textContent).toContain("Current Owner");
    expect(container.textContent).toContain("Acme Customer");
    expect(container.textContent).toContain("Abdullah");
    expect(container.textContent).toContain("Mohamed");
    expect(container.textContent).not.toContain("Activity Statistics");
    expect(container.textContent).not.toContain("Follow-up Statistics");
    expect(container.textContent).not.toContain("Representative Metrics");
    expect(container.textContent).not.toContain("Recent Leads");

    const row = Array.from(container.querySelectorAll("tbody tr")).find((entry) =>
      entry.textContent?.includes("Acme Customer"),
    );
    expect(row).not.toBeNull();
    fireEvent.click(row as Element);

    expect(mocks.push).toHaveBeenCalledWith("/leads/lead-1");
  });

  it("submits filters and paginates through the dashboard API", async () => {
    mocks.getOperationsDashboard.mockResolvedValue(dashboardPayload);
    const { container } = renderWithProviders(<OperationsDashboard />);

    await waitFor(() =>
      expect(mocks.getOperationsDashboard).toHaveBeenCalledWith({ page: 1, pageSize: 10 }),
    );
    fireEvent.change(container.querySelector('input[placeholder="Search leads..."]') as Element, {
      target: { value: "acme" },
    });
    fireEvent.change(container.querySelector("select") as Element, {
      target: { value: "NEW" },
    });
    fireEvent.click(container.querySelector('button[aria-label="Filter leads"]') as Element);

    await waitFor(() =>
      expect(mocks.getOperationsDashboard).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        search: "acme",
        status: "NEW",
      }),
    );
    fireEvent.click(container.querySelector('button[aria-label="Next page"]') as Element);
    await waitFor(() =>
      expect(mocks.getOperationsDashboard).toHaveBeenCalledWith({
        page: 2,
        pageSize: 10,
        search: "acme",
        status: "NEW",
      }),
    );
  });

  it("renders the leads empty state", async () => {
    mocks.getOperationsDashboard.mockResolvedValue({
      ...dashboardPayload,
      summary: { totalLeads: 0, totalUsers: 0, salesRepresentatives: 0 },
      usersOverview: [],
      leads: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 },
    });

    const { container } = renderWithProviders(<OperationsDashboard />);

    await waitFor(() => expect(container.textContent).toContain("No active users in this scope."));
    expect(container.textContent).toContain("No leads match the current filters.");
  });
});
