import { Router } from "express"
import * as notificationController from "./notification.controller"
import { verifyJWT } from "../../middlewares/auth.middleware"

const router = Router()

router.get(
  "/",
  verifyJWT,
  notificationController.getNotifications
)

router.patch(
  "/:id/read",
  verifyJWT,
  notificationController.markNotificationAsRead
)

export default router