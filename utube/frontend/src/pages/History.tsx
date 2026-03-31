import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { fetchHistory } from "../features/watchHistory/watchHistorySlice"
import { Card, CardContent } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import { Clock, Eye, History as HistoryIcon } from "lucide-react"

export default function History() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { history, loading } = useAppSelector((state) => state.history)

  useEffect(() => {
    dispatch(fetchHistory())
  }, [dispatch])

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <HistoryIcon className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Watch History</h1>
          </div>
          <p className="text-muted-foreground">
            Keep track of videos you've watched
          </p>
        </div>

        {history.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <HistoryIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No watch history</h3>
              <p className="text-sm text-muted-foreground text-center">
                Videos you watch will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((h: any) => {
              const video = h.videoId
              if (!video) return null

              const watchProgress = h.watchedDuration
                ? (h.watchedDuration / video.duration) * 100
                : 0

              return (
                <Card
                  key={h._id}
                  className="hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => navigate(`/video/${video._id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-60 aspect-video object-cover rounded"
                        />
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-black/80 text-white hover:bg-black/90">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDuration(video.duration)}
                          </Badge>
                        </div>
                        {/* Progress overlay */}
                        {watchProgress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                            <div
                              className="h-full bg-red-600"
                              style={{ width: `${watchProgress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                            {video.title}
                          </h3>

                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={video.creatorId?.avatar} />
                              <AvatarFallback className="bg-secondary text-xs">
                                {video.creatorId?.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {video.creatorId?.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {formatViews(video.viewsCount)} views
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Watch Progress */}
                          {watchProgress > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                  {h.completed ? "Completed" : "In Progress"}
                                </span>
                                <span>{Math.round(watchProgress)}%</span>
                              </div>
                              <Progress value={watchProgress} className="h-1" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            Watched {new Date(h.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}