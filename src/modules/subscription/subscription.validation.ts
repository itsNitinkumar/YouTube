import {z} from "zod"

export const subscribePlanSchema = z.object({
  planId: z.string(),
  userId: z.string()
})
