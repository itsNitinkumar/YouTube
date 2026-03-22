import {z} from "zod";
import { upload } from "../../middlewares/upload.middleware";
export const PlanSchema = z.object({
    name: z.string(),
    price: z.number(),
    features: z.object({
       uploadLimit: z.number(),
       analyticsAccess: z.boolean(),
       adFree: z.boolean(),
       aiTools: z.boolean()

    })
})