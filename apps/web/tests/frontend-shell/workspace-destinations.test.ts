import { describe, expect, it } from "vitest";
import {
  getWorkspaceDestination,
  isPreservedWorkingDestination,
  workspaceDestinations,
} from "../../features/workspace/navigation/workspace-destinations";

describe("workspaceDestinations", () => {
  it("lists every required workspace destination in order", () => {
    expect(workspaceDestinations.map((destination) => destination.label)).toEqual([
      "Dashboard",
      "Leads",
      "Activities",
      "Exhibitions",
      "Deals",
      "Targets",
      "Analytics",
      "Notifications",
      "Team",
      "Users",
      "Settings",
    ]);
  });

  it("preserves existing working destinations", () => {
    expect(isPreservedWorkingDestination("/leads")).toBe(true);
    expect(isPreservedWorkingDestination("/team")).toBe(true);
    expect(isPreservedWorkingDestination("/users")).toBe(true);
    expect(isPreservedWorkingDestination("/deals")).toBe(false);
  });

  it("can resolve destinations by label", () => {
    expect(getWorkspaceDestination("analytics")?.href).toBe("/analytics");
  });
});
