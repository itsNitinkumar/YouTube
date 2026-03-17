import { Video } from "../video/video.model"
import { Comment } from "../comment/comment.model"
import { Like } from "../like/like.model"
import { CreatorSubscription } from "../creatorSubscription/creatorSubscription.model"

export const getAnalyticsService = async (
  creatorId: string
) => {

  const videos =
    await Video.find({ creatorId })

  const videoIds = videos.map(v => v._id)

  const totalViews =
    videos.reduce(
      (sum, v) => sum + v.viewsCount,
      0
    )

  const likes =
    await Like.countDocuments({
      targetId: { $in: videoIds },
      targetType: "Video"
    })

  const comments =
    await Comment.countDocuments({
      videoId: { $in: videoIds }
    })

  const subscribers =
    await CreatorSubscription.countDocuments({
      creatorId
    })

  return {
    totalViews,
    likes,
    comments,
    subscribers,
    videosCount: videos.length
  }
}
export const getVideoStatsService = async (
  creatorId: string
) => {

  const videos = await Video.find({
    creatorId
  })

  const videoIds = videos.map(v => v._id)

  const comments = await Comment.aggregate([
    {
      $match: {
        videoId: { $in: videoIds }
      }
    },
    {
      $group: {
        _id: "$videoId",
        count: { $sum: 1 }
      }
    }
  ])

  const likes = await Like.aggregate([
    {
      $match: {
        targetId: { $in: videoIds },
        targetType: "Video"
      }
    },
    {
      $group: {
        _id: "$targetId",
        count: { $sum: 1 }
      }
    }
  ])

  return videos.map(video => {

    const videoLikes =
      likes.find(l => l._id.toString() === video._id.toString())?.count || 0

    const videoComments =
      comments.find(c => c._id.toString() === video._id.toString())?.count || 0

    const engagementRate =
      (videoLikes + videoComments) / (video.viewsCount || 1)

    return {
      title: video.title,
      views: video.viewsCount,
      likes: videoLikes,
      comments: videoComments,
      engagementRate
    }
  })
}