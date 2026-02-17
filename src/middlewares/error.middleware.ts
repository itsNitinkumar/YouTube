import { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/ApiError"
import { logger } from "../utils/logger"
import { config } from "../config/env"

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err

  if (!(error instanceof ApiError)) {
    error = new ApiError(500, "Something went wrong", [], false)
  }

  logger.error(error.message, {
    stack: error.stack,
    path: req.path,
    method: req.method,
  })

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(config.NODE_ENV === "development" && { stack: error.stack }),
  })
}
