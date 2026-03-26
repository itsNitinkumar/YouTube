import { useEffect } from "react"
import { useNavigate } from "react-router-dom"   // ✅ ADD
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { fetchVideos } from "../features/video/videoSlice"

export default function Home() {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()   // ✅ ADD

  const { videos, loading } = useAppSelector(
    (state) => state.video
  )

  useEffect(() => {
    dispatch(fetchVideos())
  }, [dispatch])

  if (loading) return <div>Loading videos...</div>

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Video Feed
      </h1>

      <div className="grid grid-cols-3 gap-4">

        {videos.map((video) => (
          <div
            key={video._id}
            className="border p-2 cursor-pointer"
            onClick={() => navigate(`/video/${video._id}`)}  // ✅ ADD
          >

            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-40 object-cover"
            />

            <h2 className="font-semibold">
              {video.title}
            </h2>

            <p className="text-sm text-gray-500">
              {video.creatorId?.name}
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}