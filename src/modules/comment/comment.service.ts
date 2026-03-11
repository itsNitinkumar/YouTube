import mongoose from "mongoose";
import { Comment } from "./comment.model";
import { Video } from "../video/video.model";
import { ApiError } from "../../utils/ApiError";
import { throwDeprecation } from "node:process";
import { fa } from "zod/v4/locales";
export const  addCommentService = async (
    videoId:string,
    userId: string,
    content:string,
    parentCommentId?:string
)=>{
   const session = await mongoose.startSession()
   session.startTransaction()

   try{
    const comment = await Comment.create(
        [{
           videoId,
           userId,
           content,
           parentCommentId: parentCommentId || null 
        }],
        {session}

    )
    await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {commentsCount: 1}
        },
        {session}
    )
    await session.commitTransaction()
    return comment[0]
   }catch(error){
    await session.abortTransaction()
    throw error
   }finally{
    session.endSession()
   }
}

export const getVideoCommentsService = async(
    videoId :string,
    cursor?: string,
    limit: number =10

) =>{
 const filter: any= {
    videoId,
    parentCommentId: null,
    isDeleted: false,
 }
 if(cursor){
    filter.createdAt ={$lt: new Date(cursor)}
 }
 const comments =await Comment.aggregate([
    {$match: filter},
    {$sort: {createdAt: -1}},
    {$limit: limit},
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $addFields: {
            user: {$first: "$user"}
        }
    },
    {
        $lookup: {
            from : "comments",
            localField: "_id",
            foreignField: "parentCommentId",
            as: "replies"
        }
    },
    {
        $project: {
            content: 1,
            createdAt: 1,
            likesCount: 1,
            repliesCount: 1,
            "user.name":1,
            "user.avatar": 1
        }
    }
 ])
 const nextCursor = 
 comments.length>0? comments[comments.length -1].createdAt: null
 
 return {comments,nextCursor}

}
export const updateCommentService = async (
  commentId: string,
  userId: string,
  content: string
) => {
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, userId },
    { content },
    { new: true }
  )

  if (!comment) throw new ApiError(404, "Comment not found")

  return comment
}

export const deleteCommentService =async(
    commentId:string,
    userId:string
)=>{
    const comment =await Comment.findOneAndUpdate(
        {_id: commentId,userId},
        {
            isDeleted:true
        },
        {new: true}
    )
    if(!comment) throw new ApiError(404,"Comment not found")
        return comment
}