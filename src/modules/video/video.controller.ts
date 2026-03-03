import { asyncHandler } from "../../utils/asyncHandler"
import { ApiResponse } from "../../utils/ApiResponse"
import { publishVideoSchema, updateVideoSchema } from "./video.validation"
import * as videoService from "./video.service"
import { ApiError } from "../../utils/ApiError"

export const publishVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Thumbnail is required")
  }

  const thumbnailUpload = await uploadOnCloudinary(req.file.path)

  if (!thumbnailUpload) {
    throw new ApiError(500, "Thumbnail upload failed")
  }

  const parsed = publishVideoSchema.parse(req.body)

  const video = await videoService.createVideoService({
    ...parsed,
    thumbnailUrl: thumbnailUpload.secure_url,
    thumbnailPublicId: thumbnailUpload.public_id,
    creatorId: req.user._id
  })

  res.status(201).json(
    new ApiResponse("Video published", video)
  )
})

export const getAllVideos = asyncHandler(async (req, res) => {
  const { cursor, category, search } = req.query

  const result = await videoService.getAllVideosService({
    cursor,
    category,
    search
  })

  res.json(new ApiResponse("Videos fetched", result))
})

export const getVideoById = asyncHandler(async (req, res) => {
  const video = await videoService.getVideoByIdService(
    req.params.videoId
  )

  res.json(new ApiResponse("Video fetched", video))
})

export const updateVideo = asyncHandler(async (req, res) => {
  const parsed = updateVideoSchema.parse(req.body)

  const video = await videoService.updateVideoService(
    req.params.videoId,
    req.user._id,
    parsed
  )

  res.json(new ApiResponse("Video updated", video))
})

export const deleteVideo = asyncHandler(async (req, res) => {
  await videoService.deleteVideoService(
    req.params.videoId,
    req.user._id
  )

  res.json(new ApiResponse("Video deleted", {}))
})

export const togglePublishStatus = asyncHandler(async (req, res) => {
  const video = await videoService.togglePublishStatusService(
    req.params.videoId,
    req.user._id
  )

  res.json(new ApiResponse("Visibility toggled", video))
})