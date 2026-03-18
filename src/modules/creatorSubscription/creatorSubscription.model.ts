import mongoose, { Schema } from "mongoose"

const schema = new Schema(
  {
    subscriberId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
)

schema.index(
  { subscriberId: 1, creatorId: 1 },
  { unique: true }
)

export const CreatorSubscription =
  mongoose.model("CreatorSubscription", schema)