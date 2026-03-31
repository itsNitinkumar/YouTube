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
import { Card, CardContent } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Separator } from "../components/ui/separator"
import { Badge } from "../components/ui/badge"
import { ThumbsUp, Eye, Calendar, Bell, Sparkles } from "lucide-react"
import api from "../services/api"

export default function VideoPage() {
  const { videoId } = useParams()
  const dispatch = useAppDispatch()

  const { videos } = useAppSelector((state) => state.video)
  const { comments, warning } = useAppSelector((state) => state.comment)

  const video = videos.find((v) => v._id === videoId)

  const [text, setText] = useState("")
  const [summary, setSummary] = useState<string | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  const handleLike = () => {
    if (!videoId) return
    dispatch(toggleLike(videoId))
  }

  useEffect(() => {
    if (videoId) {
      dispatch(fetchComments(videoId))
      dispatch(addToHistory(videoId))
    }
  }, [videoId, dispatch])

  const handleSubscribe = () => {
    if (!video?.creatorId?._id) return
    dispatch(toggleSubscribe(video.creatorId._id))
  }

  const handleComment = async () => {
    if (!text.trim()) return

    await dispatch(
      addComment({
        videoId: videoId!,
        content: text,
      })
    )

    setText("")
  }

  const handleGenerateSummary = async () => {
    if (!video) return
    
    setLoadingSummary(true)
    try {
      const response = await api.post("/ai/summary", {
        videoUrl: video.videoUrl, // Send video URL for transcription
        title: video.title,
        description: video.description,
        tags: video.tags || [],
        category: video.category || ""
      })
      setSummary(response.data.data.summary)
      setShowSummary(true)
    } catch (error) {
      console.error("Failed to generate summary:", error)
      setSummary("Failed to generate summary. Please try again.")
      setShowSummary(true)
    } finally {
      setLoadingSummary(false)
    }
  }

  if (!video) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Video not found</p>
      </div>
    )
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <video
                src={video.videoUrl}
                controls
                className="w-full aspect-video bg-black"
              />
            </Card>

            {/* Video Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {formatViews(video.viewsCount)} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                  {video.category && (
                    <Badge variant="secondary">{video.category}</Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* Creator Info & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={video.creatorId?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {video.creatorId?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{video.creatorId?.name}</p>
                    <p className="text-sm text-muted-foreground">Creator</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleLike}
                    variant={video.isLiked ? "default" : "outline"}
                    className="gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {video.likesCount}
                  </Button>
                  <Button onClick={handleSubscribe} variant="destructive">
                    <Bell className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Description */}
              {video.description && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Description</h3>
                      <Button
                        onClick={handleGenerateSummary}
                        disabled={loadingSummary}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        {loadingSummary ? "Generating..." : "AI Summary"}
                      </Button>
                    </div>
                    
                    {showSummary && summary && (
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-primary mb-1">
                                AI-Generated Summary
                              </p>
                              <p className="text-sm">{summary}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    <p className="text-sm whitespace-pre-wrap">
                      {video.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Separator />

              {/* Comments Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">
                  {comments.length} Comments
                </h2>

                {/* Comment Input */}
                <div className="space-y-2">
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setText("")}
                      disabled={!text.trim()}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleComment} disabled={!text.trim()}>
                      Comment
                    </Button>
                  </div>
                </div>

                {warning && (
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-yellow-800">{warning}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div key={c._id} className="flex gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={c.userId?.avatar} />
                          <AvatarFallback className="bg-secondary">
                            {c.userId?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">
                              {c.userId?.name}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{c.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="space-y-4">
            <h3 className="font-bold">Related Videos</h3>
            {videos
              .filter((v) => v._id !== videoId)
              .slice(0, 10)
              .map((v) => (
                <Card
                  key={v._id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => (window.location.href = `/video/${v._id}`)}
                >
                  <CardContent className="p-2">
                    <div className="flex gap-2">
                      <img
                        src={v.thumbnailUrl}
                        alt={v.title}
                        className="w-40 aspect-video object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                          {v.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {v.creatorId?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatViews(v.viewsCount)} views
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}