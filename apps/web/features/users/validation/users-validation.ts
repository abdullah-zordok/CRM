import { z } from "zod";

export const createUserFormSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1),
  roles: z.array(z.enum(["ADMIN", "MANAGER", "SALES_REPRESENTATIVE"])).min(1),
  status: z.enum(["PENDING_ACTIVATION", "ACTIVE", "DISABLED"]),
});

export const updateUserFormSchema = z.object({
  displayName: z.string().min(1).optional(),
  status: z.enum(["PENDING_ACTIVATION", "ACTIVE", "DISABLED"]).optional(),
});

export const activationFormSchema = z.object({
  activationToken: z.string().min(32),
  password: z.string().min(12),
});
