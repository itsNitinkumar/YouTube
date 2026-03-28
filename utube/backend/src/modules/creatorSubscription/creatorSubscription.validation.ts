import { z } from "zod"

export const creatorSubscriptionSchema = z.object({
  creatorId: z.string().min(1)
})