import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import * as aiService from "../modules/ai/ai.service";
import { Video } from "../modules/video/video.model";
import { logger } from "../utils/logger";

const worker = new Worker(
  "ai-processing",
  async (job) => {
    const { videoId, title, description } = job.data;

    try {
      logger.info(`Processing AI job for video: ${videoId}`);

      // Generate summary and tags in parallel
      const [summary, tags] = await Promise.allSettled([
        aiService.generateVideoSummary(description),
        aiService.generateVideoTags(title, description)
      ]);

      const updateData: any = {};

      // Handle summary result
      if (summary.status === "fulfilled" && summary.value) {
        updateData.aiSummary = summary.value;
      } else {
        logger.warn(`Failed to generate summary for video ${videoId}`);
        updateData.aiSummary = "";
      }

      // Handle tags result
      if (tags.status === "fulfilled" && tags.value) {
        updateData.tags = tags.value;
      } else {
        logger.warn(`Failed to generate tags for video ${videoId}`);
        updateData.tags = [];
      }

      // Update video with AI-generated content
      await Video.findByIdAndUpdate(videoId, updateData);

      logger.info(`AI processing completed for video: ${videoId}`);
    } catch (error) {
      logger.error(`AI worker error for video ${videoId}:`, error);
      throw error; // Re-throw to mark job as failed
    }
  },
  {
    connection: redisConnection,
    autorun: true,
    removeOnComplete: { count: 100 }, // Keep last 100 completed jobs
    removeOnFail: { count: 50 } // Keep last 50 failed jobs
  }
);

// Worker event handlers
worker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  logger.error(`Job ${job?.id} failed:`, err);
});

worker.on("error", (err) => {
  logger.error("Worker error:", err);
});

export default worker;
