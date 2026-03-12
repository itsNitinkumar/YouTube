import { asyncHandler } from "../../utils/asyncHandler"
import { ApiResponse } from "../../utils/ApiResponse"
import * as commentService from "./comment.service"
import { Request, Response } from "express"
import mongoose from "mongoose"
import { ApiError } from "../../utils/ApiError"

export const getVideoComments = asyncHandler(
  async (req: Request, res: Response) => {

    const { videoId } = req.params
    const { cursor, limit } = req.query

    if (!mongoose.isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id")
    }

    const result = await commentService.getVideoCommentsService(
      videoId,
      cursor as string,
      Number(limit) || 10
    )

    res.status(200).json(
      new ApiResponse(true, "Comments fetched successfully", result)
    )
  }
)

export const addComment = asyncHandler(
  async (req: Request, res: Response) => {

    const { videoId } = req.params
    const { content, parentCommentId } = req.body

    if (!mongoose.isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id")
    }

    const comment = await commentService.addCommentService(
      videoId,
      req.user!._id,
      content,
      parentCommentId
    )

    res.status(201).json(
      new ApiResponse(true, "Comment added successfully", comment)
    )
  }
)

export const updateComment = asyncHandler(
  async (req: Request, res: Response) => {

    const { commentId } = req.params
    const { content } = req.body

    if (!mongoose.isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid comment id")
    }

    const comment = await commentService.updateCommentService(
      commentId,
      req.user!._id,
      content
    )

    res.status(200).json(
      new ApiResponse(true, "Comment updated successfully", comment)
    )
  }
)

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {

    const { commentId } = req.params

    if (!mongoose.isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid comment id")
    }

    await commentService.deleteCommentService(
      commentId,
      req.user!._id
    )

    res.status(200).json(
      new ApiResponse(true, "Comment deleted successfully", {})
    )
  }
)