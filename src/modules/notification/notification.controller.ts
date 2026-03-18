import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { ApiResponse } from "../../utils/ApiResponse"
import { Notification } from "./notification.model"
import { ApiError } from "../../utils/ApiError"
import mongoose from "mongoose"



export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {

    const userId = req.user!._id

    const notifications = await Notification.find({
      userId
    })
      .sort({ createdAt: -1 })

    res.json(
      new ApiResponse(
        true,
        "Notifications fetched successfully",
        notifications
      )
    )
  }
)



export const markNotificationAsRead = asyncHandler(
  async (req: Request, res: Response) => {

    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      throw new ApiError(400, "Invalid notification id")
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        userId: req.user!._id
      },
      {
        isRead: true
      },
      { new: true }
    )

    if (!notification) {
      throw new ApiError(404, "Notification not found")
    }

    res.json(
      new ApiResponse(
        true,
        "Notification marked as read",
        notification
      )
    )
  }
)