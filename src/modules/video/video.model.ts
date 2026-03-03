import mongoose, { Schema, Document } from "mongoose"

export interface IVideo extends Document {
  title: string
  description?: string
  videoUrl: string
  videoPublicId: string
  thumbnailUrl: string
  thumbnailPublicId: string
  creatorId: mongoose.Types.ObjectId
  tags: string[]
  category?: string
  duration?: number
  viewsCount: number
  likesCount: number
  commentsCount: number
  visibility: "public" | "private" | "unlisted"
  status: "processing" | "published"
  aiSummary?: string
  engagementScore?: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: String,

    videoUrl: { type: String, required: true },
    videoPublicId: { type: String, required: true },

    thumbnailUrl: { type: String, required: true },
    thumbnailPublicId: { type: String, required: true },

    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    tags: [{ type: String }],
    category: { type: String, index: true },
    duration: Number,

    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public"
    },

    status: {
      type: String,
      enum: ["processing", "published"],
      default: "published"
    },

    aiSummary: String,
    engagementScore: Number,

    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
)

videoSchema.index({ createdAt: -1 })
videoSchema.index({ title: "text", description: "text" })

export const Video = mongoose.model<IVideo>("Video", videoSchema)