import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Upload, Video, Image, X, CheckCircle2, AlertCircle } from "lucide-react"
import api from "../services/api"

export default function UploadVideo() {
  const navigate = useNavigate()

  const [step, setStep] = useState<"upload" | "details">("upload")
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Files
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>("")
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")

  // Upload response
  const [uploadedData, setUploadedData] = useState<any>(null)

  // Video details
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private" | "unlisted">("public")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<{
    titles?: string[]
    description?: string
    tags?: string[]
    category?: string
  }>({})

  const [error, setError] = useState("")

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file must be less than 100MB")
        return
      }
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
      setError("")
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Thumbnail must be less than 5MB")
        return
      }
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
      setError("")
    }
  }

  const handleUploadFiles = async () => {
    if (!videoFile) {
      setError("Please select a video file")
      return
    }

    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("video", videoFile)
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile)
      }

      const response = await api.post("/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0
          setUploadProgress(progress)
        }
      })

      setUploadedData(response.data.data)
      setStep("details")

      // Auto-generate AI suggestions after upload
      handleGenerateInitialSuggestions(response.data.data.videoUrl)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload video")
    } finally {
      setUploading(false)
    }
  }

  const handleGenerateInitialSuggestions = async (videoUrl: string) => {
    setAiLoading(true)

    try {
      // Generate suggestions from video filename as initial prompt
      const fileName = videoFile?.name.replace(/\.[^/.]+$/, "") || "video"
      const response = await api.post("/ai/generate-from-video", {
        videoUrl,
        fileName
      })

      const suggestions = response.data.data

      // Auto-fill all suggestions
      if (suggestions.titles && suggestions.titles.length > 0) {
        setTitle(suggestions.titles[0])
      }
      if (suggestions.description) {
        setDescription(suggestions.description)
      }
      if (suggestions.tags) {
        setTags(suggestions.tags.join(", "))
      }
      if (suggestions.category) {
        setCategory(suggestions.category)
      }

      setAiSuggestions(suggestions)
    } catch (err: any) {
      console.error("Failed to generate initial suggestions:", err)
      // Don't show error, just skip AI suggestions
    } finally {
      setAiLoading(false)
    }
  }

  const handlePublishVideo = async () => {
    if (!uploadedData) return

    setUploading(true)
    setError("")

    try {
      const videoData = {
        title,
        description,
        videoUrl: uploadedData.videoUrl,
        videoPublicId: uploadedData.videoPublicId,
        thumbnailUrl: uploadedData.thumbnailUrl,
        thumbnailPublicId: uploadedData.thumbnailPublicId,
        duration: uploadedData.duration,
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        visibility
      }

      await api.post("/videos", videoData)

      navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to publish video")
    } finally {
      setUploading(false)
    }
  }

  const handleGenerateAI = async () => {
    if (!description || description.length < 10) {
      setError("Please add a description first to generate AI suggestions")
      return
    }

    setAiLoading(true)
    setError("")

    try {
      const response = await api.post("/ai/generate", {
        title: title || "Untitled Video",
        description
      })

      setAiSuggestions(response.data.data)

      // Auto-fill suggestions if empty
      if (!tags && response.data.data.tags) {
        setTags(response.data.data.tags.join(", "))
      }
      if (!category && response.data.data.category) {
        setCategory(response.data.data.category)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate AI suggestions")
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Video</h1>
          <p className="text-muted-foreground">
            Share your content with the world
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${step === "upload"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                  }`}
              >
                {uploadedData ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span>1</span>
                )}
              </div>
              <span className="font-medium">Upload Files</span>
            </div>
            <div className="w-16 h-0.5 bg-border" />
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${step === "details"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                  }`}
              >
                2
              </div>
              <span className="font-medium">Video Details</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Step 1: Upload Files */}
        {step === "upload" && (
          <div className="space-y-6">
            {/* Video Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Video File</CardTitle>
                <CardDescription>
                  Upload your video (Max 100MB, MP4, MOV, AVI)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!videoFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Video className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        MP4, MOV, AVI (MAX. 100MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      onChange={handleVideoChange}
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full"
                      />
                      <button
                        onClick={() => {
                          setVideoFile(null)
                          setVideoPreview("")
                        }}
                        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{videoFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Badge>Selected</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thumbnail Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Thumbnail (Optional)</CardTitle>
                <CardDescription>
                  Upload a custom thumbnail or we'll generate one from your video
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!thumbnailFile ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Image className="h-10 w-10 text-muted-foreground mb-3" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setThumbnailFile(null)
                          setThumbnailPreview("")
                        }}
                        className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{thumbnailFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(thumbnailFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <Badge>Selected</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upload Progress */}
            {uploading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upload Button */}
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button
                onClick={handleUploadFiles}
                disabled={!videoFile || uploading}
                size="lg"
              >
                {uploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Files
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Video Details */}
        {step === "details" && uploadedData && (
          <Card>
            <CardHeader>
              <CardTitle>Video Details</CardTitle>
              <CardDescription>
                Add information about your video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  {description && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateAI}
                      disabled={aiLoading}
                    >
                      {aiLoading ? (
                        <>
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          ✨ Regenerate Suggestions
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <Textarea
                  id="description"
                  placeholder="Tell viewers about your video"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
                {aiLoading && !description && (
                  <p className="text-xs text-muted-foreground animate-pulse">
                    🤖 AI is generating suggestions...
                  </p>
                )}
                {!aiLoading && !description && (
                  <p className="text-xs text-muted-foreground">
                    AI will auto-generate title, description, tags, and category
                  </p>
                )}
              </div>

              {/* AI Suggestions */}
              {(aiSuggestions.titles || aiSuggestions.description || aiSuggestions.tags || aiSuggestions.category) && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤖</span>
                      <h4 className="font-semibold">AI Suggestions</h4>
                    </div>

                    {aiSuggestions.description && (
                      <div>
                        <p className="text-sm font-medium mb-1">Suggested Description:</p>
                        <button
                          type="button"
                          onClick={() => setDescription(aiSuggestions.description!)}
                          className="block w-full text-left text-sm p-2 rounded bg-white hover:bg-blue-50 transition-colors border"
                        >
                          {aiSuggestions.description}
                        </button>
                      </div>
                    )}

                    {aiSuggestions.category && (
                      <div>
                        <p className="text-sm font-medium mb-1">Suggested Category:</p>
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => setCategory(aiSuggestions.category!)}
                        >
                          {aiSuggestions.category}
                        </Badge>
                      </div>
                    )}

                    {aiSuggestions.tags && aiSuggestions.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Suggested Tags:</p>
                        <div className="flex flex-wrap gap-2">
                          {aiSuggestions.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {aiSuggestions.titles && aiSuggestions.titles.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Title Ideas:</p>
                        <div className="space-y-1">
                          {aiSuggestions.titles.slice(0, 3).map((titleIdea, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setTitle(titleIdea)}
                              className="block w-full text-left text-sm p-2 rounded hover:bg-blue-100 transition-colors"
                            >
                              {titleIdea}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Education, Entertainment, Gaming"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Separate tags with commas"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Example: tutorial, coding, javascript
                </p>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="flex gap-4">
                  {(["public", "private", "unlisted"] as const).map((vis) => (
                    <label
                      key={vis}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={vis}
                        checked={visibility === vis}
                        onChange={(e) =>
                          setVisibility(
                            e.target.value as "public" | "private" | "unlisted"
                          )
                        }
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{vis}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("upload")}
                  disabled={uploading}
                >
                  Back
                </Button>
                <Button
                  onClick={handlePublishVideo}
                  disabled={!title || uploading}
                  size="lg"
                >
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Video"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
