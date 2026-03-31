
import { ApiError } from "../utils/ApiError"

import { Request, Response, NextFunction } from "express"

/**
 * Require specific role(s) to access a route
 * @param roles - Single role or array of roles
 * @example requireRole("creator") or requireRole(["creator", "admin"])
 */
export const requireRole = (roles: string | string[]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!req.user) throw new ApiError(401, "Unauthorized")

    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    // Admin has access to everything
    if (req.user.role === "admin") {
      return next()
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden")
    }

    next()
  }
}
