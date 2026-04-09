import {z} from "zod";

export const PlanSchema = z.object({
    name: z.string(),
    price: z.number().positive(),
    duration: z.number().positive().default(30), // days
    features: z.object({
       uploadLimit: z.number().positive(),
       analyticsAccess: z.boolean(),
       adFree: z.boolean(),
       aiTools: z.boolean()
    })
})