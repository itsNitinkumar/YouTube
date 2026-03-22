import mongoose, { Schema, Document } from "mongoose"

export interface IUserSubscription extends Document {
  userId: mongoose.Types.ObjectId
  planId: mongoose.Types.ObjectId
  paymentStatus: string
  startDate: Date
  endDate: Date
}

const subscriptionSchema = new Schema<IUserSubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan"
    },

    paymentStatus: String,

    startDate: Date,

    endDate: Date
  },
  { timestamps: true }
)

export const UserSubscription =
  mongoose.model<IUserSubscription>(
    "UserSubscription",
    subscriptionSchema
  )