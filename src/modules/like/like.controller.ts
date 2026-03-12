import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { ApiResponse } from "../../utils/ApiResponse"
import * as likeService from "./like.service"

export const toggleVideoLike = asyncHandler(
  async (req: Request, res: Response) => {

    const { videoId } = req.params

    const result = await likeService.toggleLikeService(
      req.user!._id,
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

    const { commentId } = req.params

    const result = await likeService.toggleLikeService(
      req.user!._id,
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
      req.user!._id
    )

    res.json(
      new ApiResponse(true, "Liked videos fetched", videos)
    )
  }
)