export const userLeadRecoveryIds = {
  adminId: "00000000-0000-4000-8000-000000000001",
  managerId: "00000000-0000-4000-8000-000000000002",
  salesRepId: "00000000-0000-4000-8000-000000000003",
  teamId: "00000000-0000-4000-8000-000000000010",
  leadId: "00000000-0000-4000-8000-000000000101",
  activityId: "00000000-0000-4000-8000-000000000201",
  followUpId: "00000000-0000-4000-8000-000000000202",
};

type FactoryOverrides = Partial<Record<string, unknown>>;

export function makeLoginReadyUser(overrides: FactoryOverrides = {}) {
  return {
    email: "rep@example.com",
    displayName: "Sales Rep",
    password: "LongEnough123",
    roles: ["SALES_REPRESENTATIVE"],
    status: "ACTIVE",
    ...overrides,
  };
}

export function makeRecoveryTeam(overrides: FactoryOverrides = {}) {
  return {
    id: userLeadRecoveryIds.teamId,
    name: "Recovery Sales Team",
    status: "ACTIVE",
    managerUserId: userLeadRecoveryIds.managerId,
    memberUserIds: [userLeadRecoveryIds.salesRepId],
    ...overrides,
  };
}

export function makeSelfOwnedLead(overrides: FactoryOverrides = {}) {
  return {
    id: userLeadRecoveryIds.leadId,
    displayName: "Acme Buyer",
    email: "buyer@example.com",
    sourceCode: "MANUAL_ENTRY",
    priority: "MEDIUM",
    ownerUserId: userLeadRecoveryIds.salesRepId,
    createdByUserId: userLeadRecoveryIds.salesRepId,
    teamId: userLeadRecoveryIds.teamId,
    ...overrides,
  };
}

export function makeLeadActivity(overrides: FactoryOverrides = {}) {
  return {
    id: userLeadRecoveryIds.activityId,
    leadId: userLeadRecoveryIds.leadId,
    ownerUserId: userLeadRecoveryIds.salesRepId,
    teamId: userLeadRecoveryIds.teamId,
    type: "CALL",
    status: "COMPLETED",
    activityAt: "2026-06-02T09:00:00.000Z",
    completedAt: "2026-06-02T09:10:00.000Z",
    ...overrides,
  };
}

export function makeLeadFollowUp(overrides: FactoryOverrides = {}) {
  return {
    id: userLeadRecoveryIds.followUpId,
    leadId: userLeadRecoveryIds.leadId,
    ownerUserId: userLeadRecoveryIds.salesRepId,
    teamId: userLeadRecoveryIds.teamId,
    type: "FOLLOW_UP",
    status: "OPEN",
    dueAt: "2026-06-03T09:00:00.000Z",
    ...overrides,
  };
}
