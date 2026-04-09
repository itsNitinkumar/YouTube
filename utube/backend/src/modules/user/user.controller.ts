import { asyncHandler } from "../../utils/asyncHandler"
import { Request, Response } from "express"
import { ApiResponse } from "../../utils/ApiResponse"
import { ApiError } from "../../utils/ApiError"
import { User } from "./user.model"
import { registerUser, loginUser } from "./user.service"
import { registerSchema, loginSchema } from "./user.validation"
import { config } from "../../config/env"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../../utils/cloudinary"
import * as userService from "./user.service"
export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.parse(req.body)

  const user = await registerUser(parsed)

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  // Set accessToken as HttpOnly cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // set to false for localhost
    sameSite: "lax",
    maxAge: 1000 * 60 * 60, // 1 hour
  });
  res.status(201).json(
    new ApiResponse(true, "User registered", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      refreshToken,
    })
  );
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.parse(req.body)

  const user = await loginUser(parsed.email, parsed.password)

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  // Set accessToken as HttpOnly cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60, // 1 hour
  });
  res.status(200).json(
    new ApiResponse(true, "Login successful", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      refreshToken,
    })
  );
})
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) throw new ApiError(401, "Unauthorized")

  const decoded: any = jwt.verify(
    refreshToken,
    config.REFRESH_TOKEN_SECRET
  )

  const user = await User.findById(decoded.userId)

  if (!user || user.refreshToken !== refreshToken)
    throw new ApiError(401, "Invalid refresh token")

  const newAccessToken = user.generateAccessToken()

  res.json(
    new ApiResponse(true, "Token refreshed", {
      accessToken: newAccessToken,
    })
  )
})

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  res.json(new ApiResponse(true, "User fetched", req.user))
})

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const updatedUser = await userService.updateUserService(
    req.user!._id.toString(),
    req.body
  )

  res.json(new ApiResponse(true, "Profile updated", updatedUser))
})

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body

  await userService.changePasswordService(
    req.user!._id.toString(),
    oldPassword,
    newPassword
  )

  res.json(new ApiResponse(true, "Password changed", null))
})

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  await userService.softDeleteUserService(req.user!._id.toString())

  res.json(new ApiResponse(true, "Account deleted", null))
})

export const updateAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new ApiError(400, "Avatar required")

  const uploaded = await uploadOnCloudinary(req.file.path)

  if (!uploaded) throw new ApiError(500, "Avatar upload failed")

  const user = await userService.updateUserService(req.user!._id.toString(), {
    avatar: uploaded.secure_url,
    avatarPublicId: uploaded.public_id,
  })

  res.json(new ApiResponse(true, "Avatar updated", user))
})

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsersService()

  res.json(new ApiResponse(true, "Users fetched", users))
})

export const toggleBlockUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = Array.isArray(req.params.userId)
    ? req.params.userId[0]
    : req.params.userId

  const user = await userService.toggleBlockUserService(userId)

  res.json(new ApiResponse(true, "User status updated", user))
})
