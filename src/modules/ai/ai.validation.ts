import {z} from "zod";
export const titleSuggestionSchema = z.object({
    description: z.string().min(15);
})