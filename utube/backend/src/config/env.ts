import dotenv from "dotenv"
dotenv.config()

const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "NODE_ENV",
  "JWT_SECRET",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET"
]

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
})

export const config = {
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI as string,
  NODE_ENV: process.env.NODE_ENV as "development" | "production",
  JWT_SECRET: process.env.JWT_SECRET as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  HF_API_KEY: process.env.HF_API_KEY as string,
  HF_MODEL: process.env.HF_MODEL as string,
  GROQ_API_KEY: process.env.GROQ_API_KEY as string,
  ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY as string,
  CLOUD_NAME: process.env.CLOUD_NAME as string,
  CLOUD_API_KEY: process.env.CLOUD_API_KEY as string,
  CLOUD_API_SECRET: process.env.CLOUD_API_SECRET as string,
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379
}