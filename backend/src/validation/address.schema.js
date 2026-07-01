import { z } from "zod";

export const createAddressSchema = z.object({
  title: z.string().min(3).max(255),
  country: z.string().min(3).max(255),
  city: z.string().min(3).max(255),
  address: z.string().min(3).max(255),
  postalCode: z.string().min(3).max(20),
});

export const updateAddressSchema = createAddressSchema.partial();
