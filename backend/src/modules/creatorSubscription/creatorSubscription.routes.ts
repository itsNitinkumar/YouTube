import { Router } from "express"
import * as creatorController from "./creatorSubscription.controller"
import { verifyJWT } from "../../middlewares/auth.middleware"

const router = Router()

router.post(
  "/:id/subscribe",
  verifyJWT,
  creatorController.subscribeCreator
)

router.get(
  "/:id/subscribers",
  creatorController.getCreatorSubscribers
)

export default router