import { Request, Response, NextFunction } from "express"
import { Video } from "../modules/video/video.model"
import { UserSubscription } from "../modules/subscription/subscription.model"
import { ApiError } from "../utils/ApiError"
import { IPlan } from "../modules/plan/plan.model"

export const checkUploadLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sub = await UserSubscription.findOne({
    userId: req.user!._id
  }).populate("planId")

  const planId = sub?.planId as any as IPlan
  const limit = planId?.features?.uploadLimit ?? 5

  const count = await Video.countDocuments({
    creatorId: req.user!._id
  })

  if (count >= limit) {
    throw new ApiError(403, "Upload limit reached")
  }

  next()
}