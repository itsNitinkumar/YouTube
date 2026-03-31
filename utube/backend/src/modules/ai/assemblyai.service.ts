import axios from "axios"
import { config } from "../../config/env"
import { logger } from "../../utils/logger"

const ASSEMBLYAI_API_URL = "https://api.assemblyai.com/v2"

interface TranscriptionResponse {
  id: string
  status: "queued" | "processing" | "completed" | "error"
  text?: string
  error?: string
}

/**
 * Transcribe video using AssemblyAI
 * @param videoUrl - Public URL of the video (Cloudinary URL)
 * @returns Transcript text
 */
export const transcribeVideo = async (videoUrl: string): Promise<string> => {
  if (!config.ASSEMBLYAI_API_KEY || config.ASSEMBLYAI_API_KEY === "your_assemblyai_api_key_here") {
    logger.warn("AssemblyAI API key not configured")
    throw new Error("Video transcription service not configured")
  }

  try {
    logger.info(`Starting video transcription with AssemblyAI for URL: ${videoUrl}`)
    logger.info(`API Key present: ${config.ASSEMBLYAI_API_KEY.substring(0, 8)}...`)

    // Step 1: Submit video URL for transcription
    const transcriptResponse = await axios.post<TranscriptionResponse>(
      `${ASSEMBLYAI_API_URL}/transcript`,
      {
        audio_url: videoUrl,
        language_code: "en",
        speech_models: ["universal-2"] // Note: speech_models (plural)
      },
      {
        headers: {
          authorization: config.ASSEMBLYAI_API_KEY,
          "content-type": "application/json"
        }
      }
    )

    const transcriptId = transcriptResponse.data.id
    logger.info(`Transcription job created: ${transcriptId}`)

    // Step 2: Poll for completion
    let transcript: TranscriptionResponse
    let attempts = 0
    const maxAttempts = 60 // 5 minutes max (5 second intervals)

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 5000)) // Wait 5 seconds

      const statusResponse = await axios.get<TranscriptionResponse>(
        `${ASSEMBLYAI_API_URL}/transcript/${transcriptId}`,
        {
          headers: {
            authorization: config.ASSEMBLYAI_API_KEY
          }
        }
      )

      transcript = statusResponse.data

      if (transcript.status === "completed") {
        logger.info("Transcription completed successfully")
        logger.info(`Transcript length: ${transcript.text?.length} characters`)
        return transcript.text || ""
      }

      if (transcript.status === "error") {
        logger.error(`Transcription failed: ${transcript.error}`)
        throw new Error(`Transcription failed: ${transcript.error}`)
      }

      attempts++
      logger.info(`Transcription status: ${transcript.status} (attempt ${attempts}/${maxAttempts})`)
    }

    throw new Error("Transcription timeout - video may be too long")
  } catch (error: any) {
    logger.error("AssemblyAI transcription error:", error.message || "Unknown error")
    
    if (error.response) {
      logger.error("AssemblyAI status code:", error.response.status)
      logger.error("AssemblyAI error response:", error.response.data)
      logger.error("AssemblyAI headers:", error.response.headers)
    } else if (error.request) {
      logger.error("No response received from AssemblyAI")
      logger.error("Request details:", error.request)
    } else {
      logger.error("Error setting up request:", error.message)
    }
    
    throw error
  }
}

/**
 * Generate summary from video transcript
 * @param videoUrl - Public URL of the video
 * @returns Video summary based on actual content
 */
export const generateVideoContentSummary = async (
  videoUrl: string
): Promise<string> => {
  try {
    // Get transcript
    const transcript = await transcribeVideo(videoUrl)

    if (!transcript || transcript.length < 50) {
      return "Video content could not be transcribed or is too short."
    }

    // Return the transcript (we'll use Groq to summarize it)
    return transcript
  } catch (error: any) {
    logger.error("Failed to generate video content summary:", error.message)
    throw error
  }
}
