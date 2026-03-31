import { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/ApiError"
import { logger } from "../utils/logger"
import { config } from "../config/env"
import { ZodError } from "zod"

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const zodErrors = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`)
    error = new ApiError(400, "Validation failed", zodErrors, true)
  }
  // Handle other non-ApiError errors
  else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500
    const message = error.message || "Something went wrong"
    error = new ApiError(statusCode, message, [], false)
  }

  logger.error(error.message, {
    stack: error.stack,
    path: req.path,
    method: req.method,
    body: req.body,
  })

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(config.NODE_ENV === "development" && { stack: error.stack }),
  })
}
