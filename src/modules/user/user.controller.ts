import { asyncHandler } from "../../utils/asyncHandler"
import {Request,Response} from "express"
import { ApiResponse } from "../../utils/ApiResponse"
import { ApiError } from "../../utils/ApiError"
import { User } from "./user.model"
import { registerUser, loginUser } from "./user.service"
import { registerSchema, loginSchema } from "./user.validation"
import {config} from "../../config/env"
import jwt from "jsonwebtoken"
export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.parse(req.body)

  const user = await registerUser(parsed)

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  res.status(201).json(
    new ApiResponse(true, "User registered", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    })
  )
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.parse(req.body)

  const user = await loginUser(parsed.email, parsed.password)

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  res.status(200).json(
    new ApiResponse(true, "Login successful", {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    })
  )
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
