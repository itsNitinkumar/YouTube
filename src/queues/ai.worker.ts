import {Worker} from "bullmq";
import { redisConnection } from "../config/redis";
import * as aiService from "../modules/ai/ai.service";
import {Video} from "../modules/video/video.model"
const worker = new Worker("ai-processing", async job => {
  const { videoId,title,description } = job.data;

 const summary =  await aiService.generateVideoSummary(description);
 const tags = await aiService.generateVideoTags(title, description);
 await Video.findByIdAndUpdate(videoId,{
    aiSummary: summary,
    tags: tags
 })
}, {
  connection: redisConnection
});
