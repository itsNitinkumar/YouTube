import { z } from "zod"
export const addCommentSchema = z.object({
    content: z.string().min(1).max(1000),
    parentCommentId: z.string().optional()

})
export const updateCommentSchema = z.object({
    content: z.string().min(1).max(1000),
    parentCommentId: z.string().optional()
})