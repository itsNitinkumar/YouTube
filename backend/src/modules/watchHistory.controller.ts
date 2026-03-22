import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import * as watchHistoryService from "./watchHistory.service";



export const trackWatch = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized");
  }
  const { videoId, watchDuration } = req.body;
  if (!videoId || typeof watchDuration !== "number") {
    throw new ApiError(400, "Missing videoId or watchDuration");
  }
  const result = await watchHistoryService.trackWatchService({
    userId: req.user._id.toString(),
    videoId,
    watchDuration,
  });
  res.status(201).json(new ApiResponse(true, "Video tracked", result));
});

export const getWatchHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized");
  }
  const history = await watchHistoryService.getWatchHistoryService(req.user._id.toString());
  res.status(200).json(new ApiResponse(true, "Watch history fetched", history));
});

export const clearWatchHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized");
  }
  await watchHistoryService.clearWatchHistoryService(req.user._id.toString());
  res.status(200).json(new ApiResponse(true, "Watch history cleared", null));
});

export const deleteWatchHistory = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized");
  }
  let { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Missing videoId param");
  }
  if (Array.isArray(videoId)) videoId = videoId[0];
  const result = await watchHistoryService.deleteWatchHistoryService(req.user._id.toString(), videoId);
  res.status(200).json(new ApiResponse(true, "Watch history entry deleted", result));
});

export const resumePlayback = asyncHandler(
  async (req: Request<{ videoId: string }>, res: Response) => {

    const { videoId } = req.params

    const result = await watchHistoryService.resumePlaybackService(
      req.user!._id.toString(),
      videoId
    )

    res.status(200).json(
      new ApiResponse(true, "Resume playback fetched", result)
    )
  }
)