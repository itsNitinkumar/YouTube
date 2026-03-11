import { Router } from "express"
import * as commentController from "./comment.controller"
import { verifyJWT } from "../../middlewares/auth.middleware"

const router = Router()

router.get("/video/:videoId", commentController.getVideoComments)


router.post(
  "/video/:videoId",
  verifyJWT,
  commentController.addComment
)


router.patch(
  "/:commentId",
  verifyJWT,
  commentController.updateComment
)


router.delete(
  "/:commentId",
  verifyJWT,
  commentController.deleteComment
)

export default router