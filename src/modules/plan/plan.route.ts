import { Router } from "express"
import * as planController from "./plan.controller"
import { verifyJWT } from "../../middlewares/auth.middleware"
import { requireRole } from "../../middlewares/role.middleware"

const router = Router()

router.get("/", planController.getPlans)

router.post(
  "/",
  verifyJWT,
  requireRole("admin"),
  planController.createPlan
)

export default router