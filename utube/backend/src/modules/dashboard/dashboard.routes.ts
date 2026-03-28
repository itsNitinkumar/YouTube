import { Router } from "express"
import * as dashboardController from "./dashboard.controller"
import { verifyJWT } from "../../middlewares/auth.middleware"
import { requireRole } from "../../middlewares/role.middleware"

const router = Router()

router.get(
  "/analytics",
  verifyJWT,
  requireRole("creator"),
  dashboardController.getAnalytics
)

router.get(
  "/video-stats",
  verifyJWT,
  requireRole("creator"),
  dashboardController.getVideoStats
)

export default router