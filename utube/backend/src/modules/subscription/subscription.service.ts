import { UserSubscription } from "./subscription.model"
import { Plan } from "../plan/plan.model"
import { ApiError } from "../../utils/ApiError"

export const subscribePlanService = async (
  userId: string,
  planId: string
) => {
  // Fetch the plan to get duration
  const plan = await Plan.findById(planId)
  
  if (!plan) {
    throw new ApiError(404, "Plan not found")
  }

  // Check if user already has an active subscription
  const existingSubscription = await UserSubscription.findOne({
    userId,
    endDate: { $gt: new Date() }
  })

  if (existingSubscription) {
    throw new ApiError(400, "You already have an active subscription")
  }

  // Calculate end date based on plan duration
  const startDate = new Date()
  const endDate = new Date(
    startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000
  )

  return UserSubscription.create({
    userId,
    planId,
    paymentStatus: "success",
    startDate,
    endDate
  })
}