import { Router } from "express"
import * as subController from "./subscription.controller"
import { verifyJWT } from "../../middlewares/auth.middleware"

const router = Router()

router.post(
  "/subscribe",
  verifyJWT,
  subController.subscribePlan
)

export default router