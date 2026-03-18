import { Video } from "../modules/video/video.model"
import { UserSubscription } from "../modules/subscription/subscription.model"
import { ApiError } from "../utils/ApiError"

export const checkUploadLimit = async (
 req: any,
 res: any,
 next: any
) => {

 const sub =
   await UserSubscription.findOne({
     userId: req.user._id
   }).populate("planId")

 const limit =
   sub?.planId?.features?.uploadLimit ?? 5

 const count =
   await Video.countDocuments({
     creatorId: req.user._id
   })

 if (count >= limit)
   throw new ApiError(
     403,
     "Upload limit reached"
   )

 next()
}