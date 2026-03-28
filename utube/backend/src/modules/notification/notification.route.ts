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
router.get(
  "/unread-count",
  verifyJWT,
  notificationController.getUnreadCount
)

router.patch(
  "/read-all",
  verifyJWT,
  notificationController.markAllAsRead
)

export default router