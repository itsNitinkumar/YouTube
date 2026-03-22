import { z } from "zod"

export const publishVideoSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  videoUrl: z.string().url(),
  videoPublicId: z.string(),
  thumbnailUrl: z.string().url(),
  thumbnailPublicId: z.string(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional()
})

export const updateVideoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  thumbnailPublicId: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  visibility: z.enum(["public", "private", "unlisted"]).optional()
})