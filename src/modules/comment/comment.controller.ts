import { asyncHandler } from "../../utils/asyncHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import * as commentService from "./comment.service"
import { Request,Response } from "express";
export const getVideoComments = asyncHandler(async (req: Request, res: Response) => {
   const {videoId} = req.params
   const {cursor} =req.query
   const result = await commentService.getVideoCommentsService(videoId, cursor as string)
    res.status(200).json(new ApiResponse(true, "Comments fetched successfully", result))

})
export const addComment = asyncHandler(async(req:Request,res: Response) =>{
    const {videoId} = req.params
    const {content,parentCommentId} = req.body
    const comment = await commentService.addCommentService(videoId, req.user?._id,content, parentCommentId)
    res.status(201).json(new ApiResponse(true, "Comment added successfully", comment))
})
export const updateComment =asyncHandler(async(req:Request, res: Response)=>{
    const {commentId} = req.params
    const {content} = req.body
    const comment = await commentService.updateCommentService(
        commentId,
        req.user?._id,
        content
    )
    res.status(200).json(new ApiResponse(true,"Comment updated successfully", comment))
})
export const deleteComment = asyncHandler(async(req:Request,res:Response)=>{
    const{commentId} = req.params
    await commentService.deleteCommentService(commentId, req.user?._id)
    res.status(200).json(new ApiResponse(true,"Comment deleted successfully",{}))      
})