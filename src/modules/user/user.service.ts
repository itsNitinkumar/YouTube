import { User } from "./user.model"
import { ApiError } from "../../utils/ApiError"
import mongoose from "mongoose"

export const registerUser = async (data: any) => {
  const existingUser = await User.findOne({ email: data.email })

  if (existingUser) {
    throw new ApiError(400, "Email already exists")
  }

  const user = await User.create(data)
  return user
}

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email, isDeleted: false })

  if (!user) throw new ApiError(404, "User not found")

  const isValid = await user.comparePassword(password)

  if (!isValid) throw new ApiError(401, "Invalid credentials")

  return user
}

export const updateUserService = async (
  userId: string,
  data: any
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true }
  ).select("-password -refreshToken")

  return user
}

export const changePasswordService = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId)

  if (!user) throw new ApiError(404, "User not found")

  const isValid = await user.comparePassword(oldPassword)

  if (!isValid) throw new ApiError(401, "Incorrect password")

  user.password = newPassword
  await user.save()

  return true
}

export const softDeleteUserService = async (userId: string) => {
  await User.findByIdAndUpdate(userId, {
    isDeleted: true,
  })
}

export const getAllUsersService = async () => {
  return User.find({ isDeleted: false }).select("-password -refreshToken")
}

export const toggleBlockUserService = async (userId: string) => {
  const user = await User.findById(userId)

  if (!user) throw new ApiError(404, "User not found")

  user.isBlocked = !user.isBlocked
  await user.save()

  return user
}