import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { useEffect, useState } from "react"
import {
  fetchComments,
  addComment,
} from "../features/comment/commentSlice"

export default function VideoPage() {

  const { videoId } = useParams()
  const dispatch = useAppDispatch()

  const { videos } = useAppSelector((state) => state.video)
  const { comments } = useAppSelector((state) => state.comment)

  const video = videos.find(v => v._id === videoId)

  const [text, setText] = useState("")

  useEffect(() => {
    if (videoId) {
      dispatch(fetchComments(videoId))
    }
  }, [videoId, dispatch])

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
        <h2 className="font-bold mb-2">
          Comments
        </h2>

        {comments.map((c) => (
          <div key={c._id} className="border-b py-2">

            <p className="font-semibold">
              {c.userId?.name}
            </p>

            <p>{c.content}</p>

          </div>
        ))}
      </div>

    </div>
  )
}