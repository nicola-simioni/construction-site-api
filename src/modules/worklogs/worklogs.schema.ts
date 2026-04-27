import { z } from "zod";

export const createWorkLogSchema = z.object({
  date: z.string().datetime(),
  hoursWorked: z.number().min(0.5).max(24),
  notes: z.string().optional(),
  workerId: z.number().int().positive(),
  siteId: z.number().int().positive(),
});

export const updateWorkLogSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export type CreateWorkLogInput = z.infer<typeof createWorkLogSchema>;
export type UpdateWorkLogInput = z.infer<typeof updateWorkLogSchema>;