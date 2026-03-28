import mongoose from "mongoose"
import { Video } from "./video/video.model"
import { WatchHistory, IWatchHistory } from "./watchHistory.model"
import { ApiError } from "../utils/ApiError"
import { User } from "./user/user.model"

export interface TrackWatchParams {
  userId: string
  videoId: string
  watchDuration: number
}

export const trackWatchService = async ({
  userId,
  videoId,
  watchDuration,
}: TrackWatchParams): Promise<IWatchHistory> => {
  if (!userId || !videoId) {
    throw new ApiError(400, "Missing userId or videoId")
  }

  const session = await mongoose.startSession()
  try {
    let result: IWatchHistory | null = null

    await session.withTransaction(async () => {
      // find existing record for this user/video
      let record = await WatchHistory.findOne({ userId, videoId }).session(session)

      if (!record) {
        // create new watch history record
        const newRecord = new WatchHistory({
          userId,
          videoId,
          watchedDuration: watchDuration,
          completed: false,
        })

        await newRecord.save({ session })

        // increment video views once per first watch
        await Video.findByIdAndUpdate(
          videoId,
          { $inc: { viewsCount: 1 ,engagementScore: 1} },
          { session }
        )

        record = newRecord
      } else {
        // update watched duration if the new value is greater
        record.watchedDuration = Math.max(record.watchedDuration, watchDuration)
      }

      // mark completed when watchDuration reaches or exceeds recorded watchedDuration
      if (record && watchDuration >= record.watchedDuration) {
        record.completed = true
      }

      // save the record inside transaction
      await record.save({ session })

      result = record
    })

    if (!result) throw new ApiError(500, "Failed to create or update watch record")

    return result
  } catch (err) {
    // Rethrow ApiError or wrap other errors
    if (err instanceof ApiError) throw err
    throw new ApiError(500, "Failed to track watch history")
  } finally {
    session.endSession()
  }
}

export const getWatchHistoryService = async(userId: string)=>{
   
    const history = await WatchHistory.find({userId})
    .sort({ createdAt: -1 })
    .populate("videoId", "title thumbnailUrl viewsCount")

    return history
}

export const deleteWatchHistoryService = async(userId: string, videoId: string)=>{
if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id")
  }
    const result = await WatchHistory.findOneAndDelete({userId, videoId});
    if(!result) throw new ApiError(404, "Watch history not found");
    return result;
}

export const clearWatchHistoryService = async(userId: string)=>{
    const result = await WatchHistory.deleteMany({userId});
    if(!result) throw new ApiError(404, "Watch history not found");
    return result;
}
export const resumePlaybackService = async (
  userId: string,
  videoId: string
) => {

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id")
  }

  const record = await WatchHistory.findOne({
    userId,
    videoId
  })

  if (!record) {
    return { resumeTime: 0 }   
  }

  return {
    resumeTime: record.watchedDuration
  }
}
