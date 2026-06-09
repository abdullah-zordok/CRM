import { describe, expect, it } from "vitest";
import {
  isMainWorkspaceUser,
  isSalesRepresentative,
  type ServerCurrentUser,
} from "../../features/foundation/auth/server-session";

function user(roles: string[]): ServerCurrentUser {
  return {
    id: "user-1",
    email: "user@example.com",
    displayName: "User",
    roles,
    hasReviewerAccess: false,
  };
}

describe("server session role rules", () => {
  it("classifies pure Sales Representatives for the sales portal", () => {
    expect(isSalesRepresentative(user(["SALES_REPRESENTATIVE"]))).toBe(true);
    expect(isMainWorkspaceUser(user(["SALES_REPRESENTATIVE"]))).toBe(false);
  });

  it("keeps Admin and Manager roles in the main workspace", () => {
    expect(isSalesRepresentative(user(["ADMIN"]))).toBe(false);
    expect(isMainWorkspaceUser(user(["ADMIN"]))).toBe(true);
    expect(isSalesRepresentative(user(["MANAGER"]))).toBe(false);
    expect(isMainWorkspaceUser(user(["MANAGER"]))).toBe(true);
  });

  it("treats mixed Admin/Sales roles as main-workspace users", () => {
    expect(isSalesRepresentative(user(["ADMIN", "SALES_REPRESENTATIVE"]))).toBe(false);
    expect(isMainWorkspaceUser(user(["ADMIN", "SALES_REPRESENTATIVE"]))).toBe(true);
  });
});
