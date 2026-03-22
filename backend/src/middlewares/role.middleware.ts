
import { ApiError } from "../utils/ApiError"

import { Request,Response,NextFunction } from "express"


export const requireRole = (role: string) => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!req.user) 
      throw new ApiError(401, "Unauthorized")
      
    if (req.user.role !== role)
      throw new ApiError(403, "Forbidden")

    next()
  }
}
