import { z } from "zod";

export const createSiteSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  managerId: z.number().int().positive(),
});

export const updateSiteSchema = createSiteSchema.partial();

export type CreateSiteInput = z.infer<typeof createSiteSchema>;
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>;