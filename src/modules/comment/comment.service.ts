import mongoose from "mongoose";
import { Comment } from "./comment.model";
import { Video } from "../video/video.model";
import { detectToxicComment } from "../ai/ai.service";
import { ApiError } from "../../utils/ApiError";

export const addCommentService = async (
  videoId: string,
  userId: string,
  content: string,
  parentCommentId?: string
) => {

  // AI toxic detection BEFORE saving comment
  let isToxic = false;

  try {
    isToxic = await detectToxicComment(content);
  } catch (error) {
    console.error("AI toxicity detection failed:", error);
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  try {

    const comment = await Comment.create(
      [{
        videoId,
        userId,
        content,
        parentCommentId: parentCommentId || null,
        isFlaggedByAI: isToxic
      }],
      { session }
    )

    await Video.findByIdAndUpdate(
      videoId,
      {
        $inc: { commentsCount: 1, engagementScore: 3 }
      },
      { session }
    )

    await session.commitTransaction()

    return comment[0]

  } catch (error) {

    await session.abortTransaction()
    throw error

  } finally {

    session.endSession()

  }

}


export const getVideoCommentsService = async (
  videoId: string,
  cursor?: string,
  limit: number = 10

) => {

  const filter: any = {
    videoId,
    parentCommentId: null,
    isDeleted: false,
    isFlaggedByAI: false
  }

  if (cursor) {
    filter.createdAt = { $lt: new Date(cursor) }
  }

  const comments = await Comment.aggregate([
    { $match: filter },
    { $sort: { createdAt: -1 } },
    { $limit: limit },

    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },

    {
      $addFields: {
        user: { $first: "$user" }
      }
    },

    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "parentCommentId",
        as: "replies"
      }
    },

    {
      $addFields: {
        repliesCount: { $size: "$replies" }
      }
    },

    {
      $project: {
        content: 1,
        createdAt: 1,
        likesCount: 1,
        repliesCount: 1,
        "user.name": 1,
        "user.avatar": 1
      }
    }
  ])

  const nextCursor =
    comments.length > 0 ? comments[comments.length - 1].createdAt : null

  return { comments, nextCursor }

}


export const updateCommentService = async (
  commentId: string,
  userId: string,
  content: string
) => {

  // AI toxicity detection for updated content
  let isToxic = false

  try {
    isToxic = await detectToxicComment(content)
  } catch (error) {
    console.error("AI toxicity detection failed:", error)
  }

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, userId },
    {
      content,
      isFlaggedByAI: isToxic
    },
    { new: true }
  )

  if (!comment) throw new ApiError(404, "Comment not found")

  return comment
}

export const deleteCommentService = async (
  commentId: string,
  userId: string
) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // Find the comment to get videoId
    const comment = await Comment.findOne({ _id: commentId, userId });

    if (!comment) throw new ApiError(404, "Comment not found");

    // Mark as deleted
    comment.isDeleted = true;
    await comment.save({ session });

    // Decrement counts only if top-level comment
    await Video.findByIdAndUpdate(
      comment.videoId,
      { $inc: { commentsCount: -1, engagementScore: -3 } },
      { session }
    );

    await session.commitTransaction();

    return comment;

  } catch (error) {

    await session.abortTransaction();
    throw error;

  } finally {

    session.endSession();

  }

};