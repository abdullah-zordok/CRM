import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserDetail } from "../../features/users/components/user-detail";
import type { UserSummary } from "../../features/users/api/users-client";
import { renderWithProviders } from "../support/render";

const mocks = vi.hoisted(() => ({
  replaceRoles: vi.fn(),
  setReviewerAccess: vi.fn(),
}));

vi.mock("../../features/users/api/permissions-client", () => ({
  replaceRoles: mocks.replaceRoles,
  setReviewerAccess: mocks.setReviewerAccess,
}));

describe("UserDetail role updates", () => {
  const user: UserSummary = {
    id: "user-1",
    email: "rep@example.com",
    displayName: "Sales Rep",
    status: "ACTIVE",
    roles: ["SALES_REPRESENTATIVE"],
    hasReviewerAccess: false,
  };

  beforeEach(() => {
    mocks.replaceRoles.mockReset();
    mocks.setReviewerAccess.mockReset();
  });

  it("sends the role update payload and surfaces the updated user", async () => {
    const updated = { ...user, roles: ["MANAGER"] };
    mocks.replaceRoles.mockResolvedValue(updated);

    function Harness() {
      const [currentUser, setCurrentUser] = React.useState(user);
      return <UserDetail user={currentUser} onUserUpdated={setCurrentUser} />;
    }

    const { container, getByRole } = renderWithProviders(<Harness />);

    fireEvent.click(getByRole("button", { name: "Manager" }));

    await waitFor(() => expect(container.textContent).toContain("MANAGER"));
    expect(mocks.replaceRoles).toHaveBeenCalledWith("user-1", ["MANAGER"]);
    expect(container.textContent).toContain("Access updated.");
  });
});
