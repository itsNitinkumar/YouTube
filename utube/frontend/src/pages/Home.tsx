import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { fetchVideos } from "../features/video/videoSlice"
import { Card, CardContent } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Eye, Clock } from "lucide-react"

export default function Home() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { videos, loading } = useAppSelector((state) => state.video)

  useEffect(() => {
    dispatch(fetchVideos({}))
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover</h1>
          <p className="text-muted-foreground">
            Trending videos from creators you love
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Card
              key={video._id}
              className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => navigate(`/video/${video._id}`)}
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-black/80 text-white hover:bg-black/90">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDuration(video.duration)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage src={video.creatorId?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {video.creatorId?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1">
                      {video.creatorId?.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatViews(video.viewsCount)} views
                      </span>
                      <span>•</span>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No videos available</p>
          </div>
        )}
      </div>
    </div>
  )
}