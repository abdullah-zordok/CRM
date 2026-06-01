import React from "react";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceNavigation } from "../../features/workspace/components/workspace-navigation";
import { renderWithProviders } from "../support/render";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

describe("WorkspaceNavigation", () => {
  it("renders navigation only and leaves workspace tools to the shell header", () => {
    const { container } = renderWithProviders(<WorkspaceNavigation />);

    expect(container.querySelector(".workspace-sidebar")).not.toBeNull();
    expect(container.querySelector(".mobile-workspace-nav")).not.toBeNull();
    expect(container.querySelector(".workspace-tools")).toBeNull();
    expect(container.textContent).toContain("Dashboard");
  });
});
