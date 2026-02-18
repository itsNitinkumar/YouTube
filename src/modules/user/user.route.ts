import { Router } from "express"
import { register, login, refreshToken } from "./user.controller"
import { verifyJWT } from "../../middlewares/auth.middleware"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", refreshToken)
router.get("/me", verifyJWT, (req, res) => {
  res.json(req.user)
})

export default router
