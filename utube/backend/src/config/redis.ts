import { config } from "./env";
import { logger } from "../utils/logger";

export const redisConnection = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    if (times > 3) {
      logger.error("Redis connection failed after 3 retries");
      return null; // Stop retrying
    }
    const delay = Math.min(times * 1000, 3000);
    logger.warn(`Redis reconnecting in ${delay}ms (attempt ${times})`);
    return delay;
  },
  onError: (err: Error) => {
    logger.error("Redis connection error:", err);
  }
};