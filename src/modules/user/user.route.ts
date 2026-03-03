import { Router } from "express"
import * as userController from "./user.controller"
import { verifyJWT } from "../../middlewares/auth.middleware"
import { requireRole } from "../../middlewares/role.middleware"
import { upload } from "../../middlewares/upload.middleware"

const router = Router()

router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/refresh", userController.refreshToken)

router.get("/me", verifyJWT, userController.getCurrentUser)

router.patch("/update", verifyJWT, userController.updateProfile)

router.patch(
  "/avatar",
  verifyJWT,
  upload.single("avatar"),
  userController.updateAvatar
)

router.patch(
  "/change-password",
  verifyJWT,
  userController.changePassword
)

router.delete("/delete", verifyJWT, userController.deleteAccount)

router.get(
  "/",
  verifyJWT,
  requireRole("admin"),
  userController.getAllUsers
)

router.patch(
  "/block/:userId",
  verifyJWT,
  requireRole("admin"),
  userController.toggleBlockUser
)

export default router