import { z } from "zod";
import { BUSINESS_ROLES } from "./permissions/permission-codes.js";

export const businessRoleSchema = z.enum(BUSINESS_ROLES);
export const userStatusSchema = z.enum(["PENDING_ACTIVATION", "ACTIVE", "DISABLED"]);

export const createUserSchema = z.object({
  email: z
    .string()
    .email()
    .max(320)
    .transform((email) => email.toLowerCase()),
  displayName: z.string().trim().min(1).max(120),
  roles: z.array(businessRoleSchema).min(1),
  status: userStatusSchema.default("PENDING_ACTIVATION"),
  teamId: z.string().uuid().optional(),
  reviewerAccess: z.boolean().default(false),
});

export const updateUserSchema = z.object({
  displayName: z.string().trim().min(1).max(120).optional(),
  status: userStatusSchema.optional(),
});

export const completeActivationSchema = z.object({
  activationToken: z.string().min(32),
  password: z.string().min(12).max(128),
});

export const replaceRolesSchema = z.object({
  roles: z.array(businessRoleSchema).min(1),
});

export const reviewerAccessSchema = z.object({
  enabled: z.boolean(),
});

export const createTeamSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export const updateTeamSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const replaceTeamMembersSchema = z.object({
  members: z.array(
    z.object({
      userId: z.string().uuid(),
      membershipType: z.enum(["MEMBER", "MANAGER"]),
    }),
  ),
});

export const auditSearchSchema = z.object({
  actorUserId: z.string().uuid().optional(),
  targetUserId: z.string().uuid().optional(),
  eventType: z.string().optional(),
  outcome: z.enum(["SUCCESS", "FAILURE", "DENIED"]).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CompleteActivationInput = z.infer<typeof completeActivationSchema>;
export type ReplaceRolesInput = z.infer<typeof replaceRolesSchema>;
export type ReviewerAccessInput = z.infer<typeof reviewerAccessSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type ReplaceTeamMembersInput = z.infer<typeof replaceTeamMembersSchema>;
export type AuditSearchInput = z.infer<typeof auditSearchSchema>;
