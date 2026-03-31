import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { titleSuggestionSchema } from "./ai.validation";
import * as aiService from "./ai.service"
import { logger } from "../../utils/logger";

export const titleSuggestion = asyncHandler(async (req: Request, res: Response) => {
  const parsed = titleSuggestionSchema.parse(req.body);
  const titles = await aiService.generateTitleSuggestions(parsed.description);
  
  if (!titles || titles.length === 0) {
    return res.status(200).json(new ApiResponse(
      true,
      "AI service unavailable - HuggingFace API endpoint has changed. Feature will be updated.",
      {
        titles: [],
        note: "The AI service is temporarily unavailable but the system continues to work normally."
      }
    ));
  }
  
  return res.status(200).json(new ApiResponse(
    true,
    "AI title suggestions generated",
    { titles }
  ));
}) 

export 
const generateSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const { title, description } = req.body

  if (!description || description.length < 10) {
    return res.status(400).json(new ApiResponse(
      false,
      "Description must be at least 10 characters",
      null
    ))
  }

  // Generate all suggestions in parallel
  const [tags, titles, category] = await Promise.all([
    aiService.generateVideoTags(title || "Untitled", description),
    aiService.generateTitleSuggestions(description),
    aiService.generateVideoCategory(title || "Untitled", description)
  ])

  return res.status(200).json(new ApiResponse(
    true,
    "AI suggestions generated",
    {
      tags,
      titles,
      category
    }
  ))
})

export const generateSummary = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, tags, category, videoUrl } = req.body

  // If videoUrl is provided, generate summary from actual video content
  if (videoUrl) {
    try {
      logger.info("Generating summary from video content")
      
      // Transcribe video
      const transcript = await aiService.transcribeVideo(videoUrl)
      
      // Summarize transcript
      const summary = await aiService.summarizeTranscript(transcript)
      
      return res.status(200).json(new ApiResponse(
        true,
        "Video content summary generated successfully",
        { 
          summary,
          source: "video_content"
        }
      ))
    } catch (error: any) {
      logger.error("Video transcription failed, falling back to metadata:", error.message)
      
      // Fall back to metadata-based summary if transcription fails
      if (!description || description.length < 10) {
        return res.status(400).json(new ApiResponse(
          false,
          "Video transcription failed and no description available",
          null
        ))
      }
    }
  }

  // Metadata-based summary
  if (!description || description.length < 10) {
    return res.status(400).json(new ApiResponse(
      false,
      "Description must be at least 10 characters",
      null
    ))
  }

  // If we have full video metadata, generate comprehensive summary
  if (title && tags && category) {
    const summary = await aiService.generateComprehensiveSummary(
      title,
      description,
      Array.isArray(tags) ? tags : [],
      category
    )
    
    return res.status(200).json(new ApiResponse(
      true,
      "Metadata-based summary generated successfully",
      { 
        summary,
        source: "metadata"
      }
    ))
  }

  // Otherwise, generate basic summary from description only
  const summary = await aiService.generateVideoSummary(description)

  return res.status(200).json(new ApiResponse(
    true,
    "Summary generated successfully",
    { 
      summary,
      source: "description"
    }
  ))
})

export const generateFromVideo = asyncHandler(async (req: Request, res: Response) => {
  const { videoUrl, fileName } = req.body

  if (!videoUrl) {
    return res.status(400).json(new ApiResponse(
      false,
      "Video URL is required",
      null
    ))
  }

  try {
    logger.info("Generating suggestions from video")
    
    // Clean up filename to use as context
    const cleanFileName = (fileName || "video")
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[-_]/g, " ") // Replace dashes/underscores with spaces
      .trim()
    
    let context = cleanFileName
    let transcriptionSucceeded = false
    
    // Try to transcribe video for better suggestions (only if AssemblyAI is configured)
    try {
      const transcript = await aiService.transcribeVideo(videoUrl)
      if (transcript && transcript.length > 50) {
        context = transcript.substring(0, 500) // Use first 500 chars of transcript
        transcriptionSucceeded = true
        logger.info("Video transcription successful")
      }
    } catch (error: any) {
      logger.warn("Transcription not available, using filename-based generation")
    }

    // Generate suggestions based on available context
    const [titles, description, tags, category] = await Promise.all([
      aiService.generateTitleSuggestions(context),
      transcriptionSucceeded 
        ? aiService.generateVideoSummary(context)
        : Promise.resolve(`This video covers: ${cleanFileName}. Upload complete! Add more details about what viewers will learn or see in this video.`),
      aiService.generateVideoTags(cleanFileName, context),
      aiService.generateVideoCategory(cleanFileName, context)
    ])

    return res.status(200).json(new ApiResponse(
      true,
      transcriptionSucceeded 
        ? "AI suggestions generated from video content"
        : "AI suggestions generated from video title",
      {
        titles,
        description,
        tags,
        category
      }
    ))
  } catch (error: any) {
    logger.error("Failed to generate from video:", error.message)
    
    // Final fallback with better defaults
    const cleanFileName = (fileName || "video")
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .trim()
    
    return res.status(200).json(new ApiResponse(
      true,
      "AI suggestions generated (basic mode)",
      {
        titles: [
          cleanFileName,
          `Watch: ${cleanFileName}`,
          `${cleanFileName} - Full Video`
        ],
        description: `Check out this video about ${cleanFileName}. Don't forget to like and subscribe!`,
        tags: cleanFileName.toLowerCase().split(" ").filter(word => word.length > 3).slice(0, 5),
        category: "Entertainment"
      }
    ))
  }
})
