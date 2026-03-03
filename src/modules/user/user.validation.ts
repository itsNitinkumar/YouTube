import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
export const updateProfileSchema = z.object({
  name: z.string().optional(),
  avatar: z.string().optional(),
})
export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6),
})
