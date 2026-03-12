import { z } from "zod"
import mongoose from "mongoose"

export const addCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentCommentId: z.string().optional()
})

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(1000)
})

export const objectIdSchema = z.string().refine(
  (id) => mongoose.isValidObjectId(id),
  { message: "Invalid ObjectId" }
)