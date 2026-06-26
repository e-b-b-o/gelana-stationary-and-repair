import { z } from "zod";

export const createProductImageSchema = z.object({
  alt_text: z.string().min(3).max(255).optional(),
  display_order: z.union([z.string(), z.number()]).optional().transform(val => Number(val) || 0),
});

export const updateProductImageSchema = createProductImageSchema.partial();
