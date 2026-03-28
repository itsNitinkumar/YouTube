import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { ApiResponse } from "../../utils/ApiResponse"
import * as creatorSubService from "./creatorSubscription.service"

export const subscribeCreator = asyncHandler(
  async (req: Request, res: Response) => {

    const result =
      await creatorSubService.toggleCreatorSubscription(
         req.user!._id.toString(),
         req.params.id.toString()
      )

    res.json(
      new ApiResponse(true, "Creator subscription updated", result)
    )
})

export const getCreatorSubscribers = asyncHandler(
  async (req: Request, res: Response) => {

    const subs =
      await creatorSubService.getSubscribersService(
        req.params.id.toString()
      )

    res.json(
      new ApiResponse(true, "Subscribers fetched", subs)
    )
})