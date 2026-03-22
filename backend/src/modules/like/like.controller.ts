import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { ApiResponse } from "../../utils/ApiResponse"
import * as likeService from "./like.service"

export const toggleVideoLike = asyncHandler(
  async (req: Request, res: Response) => {
    const videoId = Array.isArray(req.params.videoId) 
      ? req.params.videoId[0] 
      : req.params.videoId

    const result = await likeService.toggleLikeService(
      req.user!._id.toString(),
      videoId,
      "video"
    )

    res.json(
      new ApiResponse(true, "Video like toggled", result)
    )
  }
)

export const toggleCommentLike = asyncHandler(
  async (req: Request, res: Response) => {
    const commentId = Array.isArray(req.params.commentId) 
      ? req.params.commentId[0] 
      : req.params.commentId

    const result = await likeService.toggleLikeService(
      req.user!._id.toString(),
      commentId,
      "comment"
    )

    res.json(
      new ApiResponse(true, "Comment like toggled", result)
    )
  }
)

export const getLikedVideos = asyncHandler(
  async (req: Request, res: Response) => {

    const videos = await likeService.getLikedVideosService(
      req.user!._id.toString()
    )

    res.json(
      new ApiResponse(true, "Liked videos fetched", videos)
    )
  }
)