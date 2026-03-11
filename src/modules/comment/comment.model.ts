import mongoose, {Schema,Document}from "mongoose";
export interface Icomment extends Document{
    videoId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    parentCommentId?: mongoose.Types.ObjectId
    content: string
    likesCount: number
    isFlaggedByAI: boolean
    isDeleted: boolean
}

const commentSchema =new Schema<Icomment>({
    videoId:{
        type: Schema.Types.ObjectId,
        ref: "Video",
        requires: true,
        index: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,

    },
    parentCommentId:{
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    content: {
        type: String,
        required: true
    },
    likesCount: {
        type: Number,
        default: 0
        
    },
    isFlaggedByAI: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

},
{timestamps: true}
)
commentSchema.index({videoId: 1,createdAt: -1})

export const Comment = mongoose.model<Icomment>
(
    "Comment", commentSchema
)