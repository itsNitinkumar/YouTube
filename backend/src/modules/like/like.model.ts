import mongoose, {Schema,Document} from "mongoose";
export interface ILike extends Document{
    userId: mongoose.Types.ObjectId
    targetId: mongoose.Types.ObjectId
    targetType: "Video" | "Comment"
}
const likeSchema =new Schema<ILike>(
    {
        userId: {
            type:Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetId: {
            type:Schema.Types.ObjectId,
             // ref ????
            required:true
        },
        targetType: {
            type: String,
            enum: ["Video", "Comment"],
            required: true
        }
    },{
        timestamps: true
    }
)
likeSchema.index({userId:1,targetId:1},{unique:true})
export const Like = mongoose.model<ILike>("Like", likeSchema)
