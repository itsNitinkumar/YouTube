import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/ApiError"
import jwt from "jsonwebtoken"
import { User } from "../modules/user/user.model"
import { Request, Response, NextFunction } from "express"
import { config } from "../config/env"

export const verifyJWT = asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer "))
    throw new ApiError(401, "Unauthorized")

  const token = authHeader.split(" ")[1]

  const decoded: any = jwt.verify(
    token,
    config.ACCESS_TOKEN_SECRET
  )

  const user = await User.findById(decoded.userId).select(
    "-password -refreshToken"
  )

  if (!user) throw new ApiError(401, "Invalid token")

  req.user = user
  next()
})
