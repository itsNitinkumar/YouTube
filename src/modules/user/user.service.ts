import { User } from "./user.model"
import { ApiError } from "../../utils/ApiError"

export const registerUser = async (data: any) => {
  const existingUser = await User.findOne({ email: data.email })

  if (existingUser) {
    throw new ApiError(400, "Email already exists")
  }

  const user = await User.create(data)
  return user
}
export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email })

  if (!user) throw new ApiError(404, "User not found")

  const isValid = await user.comparePassword(password)

  if (!isValid) throw new ApiError(401, "Invalid credentials")

  return user
}
