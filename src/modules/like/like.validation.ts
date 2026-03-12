import { z } from "zod"

export const toggleLikeSchema = z.object({
  targetType: z.enum(["video", "comment"]),
  targetId: z.string()
})