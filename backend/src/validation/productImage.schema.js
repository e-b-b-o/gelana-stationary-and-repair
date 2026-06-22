import { z } from "zod";

export const createProductImageSchema = z.object({
  image_url: z.string().url(),
  alt_text: z.string().min(3).max(255).optional(),
  display_order: z.number().int().min(0).optional(),
});

export const updateProductImageSchema = createProductImageSchema.partial();
