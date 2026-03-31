import Groq from "groq-sdk"
import { config } from "./env"
import { logger } from "../utils/logger"

// Log API key status (first/last 4 chars only for security)
if (config.GROQ_API_KEY) {
  const key = config.GROQ_API_KEY
  logger.info(`Groq API key loaded: ${key.substring(0, 4)}...${key.substring(key.length - 4)}`)
} else {
  logger.warn("Groq API key is missing!")
}

export const groqClient = new Groq({
  apiKey: config.GROQ_API_KEY || ""
})

// Using Llama 3.1 - fast and high quality (updated model)
// Other options: "llama-3.1-70b-versatile", "mixtral-8x7b-32768", "gemma2-9b-it"
export const GROQ_MODEL = "llama-3.1-8b-instant"
