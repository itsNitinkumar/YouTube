import mongoose, { Schema, Document } from "mongoose";

export interface IWatchHistory extends Document {
  userId: mongoose.Types.ObjectId;
  videoId: mongoose.Types.ObjectId;
  watchedDuration: number; // in seconds
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const watchHistorySchema = new Schema<IWatchHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
      index: true
    },
    watchedDuration: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound index for efficient queries
watchHistorySchema.index({ userId: 1, videoId: 1 }, { unique: true });

export const WatchHistory = mongoose.model<IWatchHistory>(
  "WatchHistory",
  watchHistorySchema
);
