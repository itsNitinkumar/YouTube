import e from "express"
import mongoose, { Schema,Document } from "mongoose"


export interface ICreatorSubscription extends Document {
  subscriberId: mongoose.Types.ObjectId
  creatorId: mongoose.Types.ObjectId
}

const schema = new Schema(
  {
    subscriberId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true
    }
  },
  { timestamps: true }
)

schema.index(
  { subscriberId: 1, creatorId: 1 },
  { unique: true }
)

export const CreatorSubscription =
  mongoose.model<ICreatorSubscription>("CreatorSubscription", schema)