import { z } from "zod";

export const createproductImageSchema = z.object({
  image_url: z.url(),
  alt_text: z.string().min(3).max(255),
  display_order: z.number().int().min(1),
});
