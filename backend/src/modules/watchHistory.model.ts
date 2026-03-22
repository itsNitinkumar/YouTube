import mongoose ,{Schema,Document} from "mongoose";
import { userInfo } from "node:os";
export interface IWatchHistory extends Document{
     userId: mongoose.Types.ObjectId
  videoId: mongoose.Types.ObjectId
  watchedDuration: number
  completed: boolean
}

const watchHistorySchema =new Schema<IWatchHistory>({
    userId: {
        type: Schema.Types.ObjectId,
        ref : "User",
        required: true,
        index: true
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref : "Video",
        required : true,
        index: true
    },
    watchedDuration: {
        type: Number,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

watchHistorySchema.index({userId: 1, videoId: 1}, {unique: true})
export const WatchHistory = mongoose.model<IWatchHistory>("watchHistory", watchHistorySchema)
