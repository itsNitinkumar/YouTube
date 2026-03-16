import { Request, Response } from "express"
import * as subService from "./subscription.service"
import { ApiResponse } from "../../utils/ApiResponse"
import { asyncHandler } from "../../utils/asyncHandler"
import { subscribePlanSchema } from "./subscription.validation"
export const subscribePlan = asyncHandler(
  async (req: Request, res: Response) => {

    const { planId, userId } = req.body
    const parsed = subscribePlanSchema.parse({ planId, userId })
    const sub =

      await subService.subscribePlanService(
        parsed.planId,
        parsed.userId ///req,user._id  checkk 
      )

    res.json(
      new ApiResponse(true, "Subscribed", sub)
    )
  }
)