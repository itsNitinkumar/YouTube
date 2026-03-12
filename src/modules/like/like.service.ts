import mongoose from "mongoose"
import { Like } from "./like.model"
import { Comment } from "../comment/comment.model"
import { Video } from "../video/video.model"

export const toggleLikeService = async (
  userId: string,
  targetId: string,
  targetType: "video" | "comment"
) => {

  const session = await mongoose.startSession()
  session.startTransaction()

  try {

    const existing = await Like.findOne({
      userId,
      targetId
    }).session(session)

    if (existing) {

      await Like.deleteOne({ _id: existing._id }).session(session)

      if (targetType === "video") {
        await Video.findByIdAndUpdate(
          targetId,
          { $inc: { likesCount: -1, engagementScore: -2 } },
          { session }
        )
      } else {
        await Comment.findByIdAndUpdate(
          targetId,
          { $inc: { likesCount: -1 } },
          { session }
        )
      }

      await session.commitTransaction()

      return { liked: false }
    }

    await Like.create(
      [{ userId, targetId, targetType }],
      { session }
    )

    if (targetType === "video") {
      await Video.findByIdAndUpdate(
        targetId,
        { $inc: { likesCount: 1, engagementScore: 2 } },
        { session }
      )
    } else {
      await Comment.findByIdAndUpdate(
        targetId,
        { $inc: { likesCount: 1 } },
        { session }
      )
    }

    await session.commitTransaction()

    return { liked: true }

  } catch (error) {

    await session.abortTransaction()
    throw error

  } finally {

    session.endSession()

  }
}

  export const getLikedVideosService = async (userId: string) => {
  return Like.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        targetType: "video"
      }
    },

    {
      $lookup: {
        from: "videos",
        localField: "targetId",
        foreignField: "_id",
        as: "video"
      }
    },

    {
      $addFields: {
        video: { $first: "$video" }
      }
    },

    {
      $project: {
        "video.title": 1,
        "video.thumbnailUrl": 1,
        "video.viewsCount": 1
      }
    }
  ])
}