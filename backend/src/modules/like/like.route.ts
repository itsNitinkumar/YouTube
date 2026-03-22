import { Router } from "express"
import * as likeController from "./like.controller"
import { verifyJWT } from "../../middlewares/auth.middleware"

const router = Router()

router.post(
  "/video/:videoId",
  verifyJWT,
  likeController.toggleVideoLike
)

router.post(
  "/comment/:commentId",
  verifyJWT,
  likeController.toggleCommentLike
)

router.get(
  "/videos",
  verifyJWT,
  likeController.getLikedVideos
)

export default router