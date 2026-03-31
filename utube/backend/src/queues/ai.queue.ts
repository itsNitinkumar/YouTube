import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";
import { logger } from "../utils/logger";

export const aiQueue = new Queue("ai-processing", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // Retry failed jobs 3 times
    backoff: {
      type: "exponential",
      delay: 2000 // Start with 2 second delay
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

// Queue event handlers
aiQueue.on("error", (err) => {
  logger.error("AI Queue error:", err);
});

aiQueue.on("waiting", (jobId) => {
  logger.info(`Job ${jobId} is waiting`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("Closing AI queue...");
  await aiQueue.close();
});