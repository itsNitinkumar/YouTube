import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useEffect, useState } from "react"
import {
  fetchComments,
  addComment,
} from "../features/comment/commentSlice"
import { toggleLike } from "../features/like/likeSlice"
import { addToHistory } from "../features/watchHistory/watchHistorySlice"
import { toggleSubscribe } from "../features/subscription/subscriptionSlice"
export default function VideoPage() {

  const { videoId } = useParams()
  const dispatch = useAppDispatch()

  const { videos } = useAppSelector((state) => state.video)
  const { comments,warning } = useAppSelector((state) => state.comment)

  const video = videos.find(v => v._id === videoId)

  const [text, setText] = useState("")
  const handleLike = () => {
  if (!videoId) return
  dispatch(toggleLike(videoId))
}
  
  useEffect(() => {
    if (videoId) {
      dispatch(fetchComments(videoId))
    }
  }, [videoId, dispatch])
  useEffect(() => {
  if (videoId) {
    dispatch(addToHistory(videoId))
  }
}, [videoId])
const handleSubscribe = () => {
  if (!video?.creatorId?._id) return
  dispatch(toggleSubscribe(video.creatorId._id))
}
  const handleComment = async () => {
    if (!text.trim()) return

    await dispatch(addComment({
      videoId: videoId!,
      content: text,
    }))

    setText("")
  }

  if (!video) return <div>Video not found</div>

  return (
    <div className="p-6">

      <video
        src={video.videoUrl}
        controls
        className="w-full max-w-3xl"
      />

      <h1 className="text-xl font-bold mt-4">
        {video.title}
      </h1>

      <p className="text-gray-500">
        {video.creatorId?.name}
      </p>

      {/* COMMENT INPUT */}
      <div className="mt-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="border p-2 w-full"
        />

        <button
          onClick={handleComment}
          className="bg-blue-500 text-white px-4 py-2 mt-2"
        >
          Comment
        </button>
      </div>
      

      {/* COMMENTS LIST */}
    <div className="mt-6">
  <h2 className="font-bold mb-2">Comments</h2>

  {/* warning */}
  {warning && (
    <div className="bg-yellow-100 text-yellow-800 p-2 mb-2">
      {warning}
    </div>
  )}

  {/* empty */}
  {comments.length === 0 && (
    <p className="text-gray-500">No comments yet</p>
  )}

  {/* list */}
  {comments.map((c) => (
    <div key={c._id} className="border-b py-2">

      <p className="font-semibold">
        {c.userId?.name}
      </p>

      <p>{c.content}</p>

    </div>
  ))}
</div>
<div className="mt-4 flex items-center gap-4">

  <button
    onClick={handleLike}
    className="bg-gray-200 px-4 py-2 rounded"
  >
    {video.isLiked ? "❤️ Liked" : "🤍 Like"}
  </button>

  <span>{video.likesCount} likes</span>

</div>
<button
  onClick={handleSubscribe}
  className="bg-red-500 text-white px-4 py-2 rounded mt-2"
>
  Subscribe
</button>

    </div>
  )
}