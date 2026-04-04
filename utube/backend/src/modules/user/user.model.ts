import mongoose, {Schema,Document} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {config} from "../../config/env"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "viewer" | "creator" | "admin"
  avatar?: string
  avatarPublicId?: string
  planId?: string
  isVerified: boolean
  isBlocked: boolean
  isDeleted: boolean
  refreshToken?: string
  comparePassword(password: string): Promise<boolean>
  generateAccessToken(): string
  generateRefreshToken(): string
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["viewer", "creator", "admin"],
      default: "viewer",
    },

    avatar: { type: String },
    avatarPublicId: { type: String },

    planId: { type: String },

    isVerified: { type: Boolean, default: false },

    isBlocked: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },

    refreshToken: { type: String },
  },
  
  { timestamps: true }
)


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return 

  this.password = await bcrypt.hash(this.password, 10)
  
})


userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { userId: this._id },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  )
}




export const User = mongoose.model<IUser>("User", userSchema)
