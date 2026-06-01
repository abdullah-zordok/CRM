import { describe, expect, it } from "vitest";
import { publicNavigation } from "../../features/marketing/content/product-content";
import { workspaceDestinations } from "../../features/workspace/navigation/workspace-destinations";

describe("RTL readiness", () => {
  it("keeps navigation labels independent from directional words", () => {
    const labels = [...publicNavigation, ...workspaceDestinations].map((item) => item.label);

    for (const label of labels) {
      expect(label.toLowerCase()).not.toMatch(/\bleft\b|\bright\b/);
    }
  });
});
