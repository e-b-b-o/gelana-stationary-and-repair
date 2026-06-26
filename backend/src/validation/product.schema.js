import { z } from "zod";

export const createProductSchema = z.object({
  category_id: z.number().int().positive(),
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  stock_quantity: z.number().int().min(0),
  thumbnail_url: z.url(),
  is_active: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
});

export const updateProductSchema = createProductSchema.partial();
