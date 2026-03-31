import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

async function testRedis() {
  console.log("Testing Redis connection...");
  console.log("Config:", redisConnection);

  try {
    const testQueue = new Queue("test-queue", {
      connection: redisConnection
    });

    await testQueue.add("test-job", { message: "Hello Redis!" });
    console.log("✅ Redis connection successful!");
    
    await testQueue.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Redis connection failed:", error);
    process.exit(1);
  }
}

testRedis();
