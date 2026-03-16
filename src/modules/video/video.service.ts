import mongoose from "mongoose"
import { Video } from "./video.model"
import { ApiError } from "../../utils/ApiError"
import { WatchHistory } from "../watchHistory.model"
import { aiQueue } from "../../queues/ai.queue";

export const createVideoService = async (data: any) => {

  const video = await Video.create(data)

try {

    await aiQueue.add("generate-video-ai", {
      videoId: video._id,
      title: video.title,
      description: video.description
    })

  } catch (error) {

    console.error("Queue job failed:", error)

  }

  return video
}



export const getAllVideosService = async ({
  cursor,
  category,
  search,
  limit = 10
}: any) => {

  const filter: any = {
    isDeleted: false,
    visibility: "public"
  }

  if (cursor) {
    filter.createdAt = { $lt: new Date(cursor) }
  }

  if (category) filter.category = category

  if (search) {
    filter.$text = { $search: search }
  }

  const videos = await Video.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("creatorId", "name avatar")

  const nextCursor =
    videos.length > 0
      ? videos[videos.length - 1].createdAt
      : null

  return { videos, nextCursor }
}




export const getVideoByIdService = async (videoId: string) => {

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID")
  }

  const video = await Video.findOne({
    _id: videoId,
    isDeleted: false
  }).populate("creatorId", "name avatar")

  if (!video) {
    throw new ApiError(404, "Video not found")
  }

  return video
}




export const updateVideoService = async (
  videoId: string,
  userId: string,
  updateData: any
) => {

  const video = await Video.findOne({
    _id: videoId,
    creatorId: userId,
    isDeleted: false
  })

  if (!video) {
    throw new ApiError(403, "Not authorized")
  }

  Object.assign(video, updateData)

  await video.save()

  return video
}




export const deleteVideoService = async (
  videoId: string,
  userId: string
) => {

  const video = await Video.findOneAndUpdate(
    { _id: videoId, creatorId: userId },
    { isDeleted: true },
    { new: true }
  )

  if (!video) {
    throw new ApiError(403, "Not authorized")
  }

  return video
}




export const togglePublishStatusService = async (
  videoId: string,
  userId: string
) => {

  const video = await Video.findOne({
    _id: videoId,
    creatorId: userId
  })

  if (!video) {
    throw new ApiError(403, "Not authorized")
  }

  video.visibility =
    video.visibility === "public"
      ? "private"
      : "public"

  await video.save()

  return video
}




export const getTrendingVideosService = async () => {

  return Video.find({
    isDeleted: false,
    visibility: "public"
  })
    .sort({ engagementScore: -1 })
    .limit(20)

}




export const getRecommendedVideosService = async (
  userId: string
) => {

  const history = await WatchHistory
    .find({ userId })
    .populate("videoId", "tags")

  const watchedTags = history
    .flatMap((h: any) => h.videoId.tags)

  return Video.find({
    tags: { $in: watchedTags },
    isDeleted: false,
    visibility: "public"
  })
  .sort({ engagementScore: -1 })
    .limit(20)

}
