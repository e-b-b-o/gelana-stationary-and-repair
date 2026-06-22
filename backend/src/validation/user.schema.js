import { z } from "zod";

export const registerUserSchema = z.object({
  first_name: z.string().min(2).max(100),
  last_name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string().min(6), // You will hash this later
  phone: z.string().max(20).optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
