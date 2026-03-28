import {z} from "zod"
export const watchVideoSchema =z.object({
    videoId : z.string(),
    watchDuration: z .number().min(0)
})