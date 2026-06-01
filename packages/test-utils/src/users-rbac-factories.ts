export const usersRbacIds = {
  adminId: "00000000-0000-4000-8000-000000000001",
  managerId: "00000000-0000-4000-8000-000000000002",
  salesRepId: "00000000-0000-4000-8000-000000000003",
  teamId: "00000000-0000-4000-8000-000000000010",
};

export function makeUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: usersRbacIds.managerId,
    email: "manager@example.com",
    displayName: "Sales Manager",
    status: "ACTIVE",
    roles: ["MANAGER"],
    hasReviewerAccess: false,
    ...overrides,
  };
}
