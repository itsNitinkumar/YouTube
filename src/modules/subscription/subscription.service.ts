import { UserSubscription } from "./subscription.model"

export const subscribePlanService = async (
  userId: string,
  planId: string
) => {

  return UserSubscription.create({
    userId,
    planId,
    paymentStatus: "success",
    startDate: new Date(),
    endDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    )
  })
}