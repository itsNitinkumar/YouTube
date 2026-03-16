import { Queue } from "bullmq"
import { redisConnection } from "../config/redis"

export const aiQueue = new Queue("ai-processing", {
  connection: redisConnection
})