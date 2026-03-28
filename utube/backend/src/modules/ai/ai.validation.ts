import { z } from "zod"


export const titleSuggestionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000)
})


