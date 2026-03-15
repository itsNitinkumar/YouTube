import { asyncHandler } from "../../utils/asyncHandler";
import {Request, Response} from "express";
import { ApiResponse } from "../../utils/ApiResponse";
import { titleSuggestionSchema } from "./ai.validation";
import * as aiService from "./ai.service"

export const titleSuggestion = asyncHandler(async(req:Request,res:Response) => {
    const {description} = req.body;
    const parsed = titleSuggestionSchema.parse(description)
    const titles = await  aiService.generateTitleSuggestions(parsed.description);
    return res.status(200).json((new ApiResponse (true,
        "AI title suggestions generated",
        titles)));
}) 