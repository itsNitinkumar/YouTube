import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { ApiResponse } from "../../utils/ApiResponse"
import { publishVideoSchema, updateVideoSchema } from "./video.validation"
import * as videoService from "./video.service"
import { ApiError } from "../../utils/ApiError"
//import { uploadOnCloudinary } from "../../utils/cloudinary"
import mongoose from "mongoose"
import { uploadOnCloudinary } from "../../utils/cloudinary"

 interface MulterRequest extends Request {
  file?: Express.Multer.File
}

function getStringParam(param: string | string[] | undefined): string | undefined {
  if (!param) return undefined
  return Array.isArray(param) ? param[0] : param
}

export const publishVideo = asyncHandler(async (req: MulterRequest, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized")
  }

  const parsed = publishVideoSchema.parse(req.body)

  // Optional: Upload thumbnail to Cloudinary if file is provided
  let thumbnailData = {
    thumbnailUrl: parsed.thumbnailUrl,
    thumbnailPublicId: parsed.thumbnailPublicId
  }

  if (req.file) {
    const thumbnailUpload = await uploadOnCloudinary(req.file.path)
    if (thumbnailUpload) {
      thumbnailData = {
        thumbnailUrl: thumbnailUpload.secure_url,
        thumbnailPublicId: thumbnailUpload.public_id
      }
    }
  }

  const video = await videoService.createVideoService({
    ...parsed,
    ...thumbnailData,
    creatorId: req.user._id.toString()
  })

  res.status(201).json(new ApiResponse(true, "Video published", video))
})

export const getAllVideos = asyncHandler(async (req: Request, res: Response) => {
  const { cursor, category, search } = req.query

  const result = await videoService.getAllVideosService({
    cursor,
    category,
    search
  })

  res.json(new ApiResponse(true, "Videos fetched", result))
})

export const getVideoById = asyncHandler(async (req: Request, res: Response) => {
  const videoId = getStringParam(req.params.videoId)
  if (!videoId) throw new ApiError(400, "Missing videoId")
  const video = await videoService.getVideoByIdService(videoId)
  res.json(new ApiResponse(true, "Video fetched", video))
})

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized")
  }
  const videoId = getStringParam(req.params.videoId)
  if (!videoId) throw new ApiError(400, "Missing videoId")
  const parsed = updateVideoSchema.parse(req.body)
  const video = await videoService.updateVideoService(
    videoId,
    req.user._id.toString(),
    parsed
  )
  res.json(new ApiResponse(true, "Video updated", video))
})

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized")
  }
  const videoId = getStringParam(req.params.videoId)
  if (!videoId) throw new ApiError(400, "Missing videoId")
  await videoService.deleteVideoService(videoId, req.user._id.toString())
  res.json(new ApiResponse(true, "Video deleted", null))
})

export const togglePublishStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized")
  }
  const videoId = getStringParam(req.params.videoId)
  if (!videoId) throw new ApiError(400, "Missing videoId")
  const video = await videoService.togglePublishStatusService(
    videoId,
    req.user._id.toString()
  )
  res.json(new ApiResponse(true, "Video publish status toggled", video))
})

export const getTrendingVideos = asyncHandler(async (req: Request, res: Response) => {
  const videos = await videoService.getTrendingVideosService()
  res.json(new ApiResponse(true, "Trending videos fetched", videos))
})

export const getRecommendedVideos = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized")
  }
  const videos = await videoService.getRecommendedVideosService(req.user._id.toString())
  res.json(new ApiResponse(true, "Recommended videos fetched", videos))
})


