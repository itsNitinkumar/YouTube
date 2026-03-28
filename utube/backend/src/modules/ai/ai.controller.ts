import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { titleSuggestionSchema } from "./ai.validation";
import * as aiService from "./ai.service"

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