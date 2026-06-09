import { z } from "zod";
import { LEAD_STATUSES } from "../leads/leads.types.js";

export const operationsDashboardQuerySchema = z
  .object({
    search: z.string().trim().max(120).optional(),
    status: z.enum(LEAD_STATUSES).optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
  })
  .strict();

export type OperationsDashboardQueryInput = z.infer<typeof operationsDashboardQuerySchema>;
