import { CreatorSubscription } from "./creatorSubscription.model"
import { ApiError } from "../../utils/ApiError"
export const toggleCreatorSubscription = async (
  subscriberId: string,
  creatorId: string
) => {

  if (subscriberId === creatorId) {
    throw new ApiError(400, "You cannot subscribe to yourself")
  }

  const existing = await CreatorSubscription.findOne({
    subscriberId,
    creatorId
  })

  if (existing) {

    await CreatorSubscription.deleteOne({
      _id: existing._id
    })

    return { subscribed: false }
  }

  await CreatorSubscription.create({
    subscriberId,
    creatorId
  })

  return { subscribed: true }
}
export const getSubscribersService = async (
  creatorId: string
) => {

  const subs = await CreatorSubscription
    .find({ creatorId })
    .populate("subscriberId", "name avatar")

  return {
    totalSubscribers: subs.length,
    subscribers: subs
  }
}