import { describe, expect, it } from "vitest";
import { workspaceDestinations } from "../../features/workspace/navigation/workspace-destinations";

describe("workspace navigation model", () => {
  it("keeps planned protected destinations reachable", () => {
    expect(workspaceDestinations.map((destination) => destination.href)).toEqual([
      "/dashboard",
      "/leads",
      "/activities",
      "/exhibitions",
      "/deals",
      "/targets",
      "/analytics",
      "/notifications",
      "/team",
      "/users",
      "/settings",
    ]);
  });

  it("marks missing modules as placeholders", () => {
    const placeholders = workspaceDestinations
      .filter((destination) => destination.state === "placeholder")
      .map((destination) => destination.href);

    expect(placeholders).toContain("/activities");
    expect(placeholders).toContain("/settings");
    expect(placeholders).not.toContain("/leads");
  });
});
