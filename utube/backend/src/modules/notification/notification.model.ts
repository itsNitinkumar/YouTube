import mongoose, { Schema, Document } from "mongoose"

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  type: string
  message: string
  videoId?: mongoose.Types.ObjectId
  isRead: boolean
}

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: [
        "NEW_VIDEO",
        "COMMENT",
        "LIKE",
        "SUBSCRIBED",
        "UNSUBSCRIBED",
        "PLAN_PURCHASED",
        "PLAN_EXPIRED",
        "PAYMENT_SUCCESS",
        "PAYMENT_FAILED"
      ],
      required: true
    },

    message: {
      type: String,
      required: true
    },

    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
)