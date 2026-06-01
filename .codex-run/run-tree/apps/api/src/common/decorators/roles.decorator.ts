import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export type FoundationRole = "ADMIN" | "MANAGER" | "SALES_REPRESENTATIVE";

export const Roles = (...roles: FoundationRole[]) => SetMetadata(ROLES_KEY, roles);
