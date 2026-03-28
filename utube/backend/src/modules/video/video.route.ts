import { Router } from "express"
import { verifyJWT } from "../../middlewares/auth.middleware"
import { requireRole } from "../../middlewares/role.middleware"
import * as videoController from "./video.controller"
import { upload } from "../../middlewares/upload.middleware"

const router = Router()

router.get("/", videoController.getAllVideos)
router.get("/trending", videoController.getTrendingVideos)
router.get("/recommended", verifyJWT, videoController.getRecommendedVideos)
router.get("/:videoId", videoController.getVideoById)

router.post(
  "/",
  verifyJWT,
  requireRole("creator"),
  upload.single("thumbnail"),
  videoController.publishVideo
)

router.patch(
  "/:videoId",
  verifyJWT,
  requireRole("creator"),
  videoController.updateVideo
)

router.delete(
  "/:videoId",
  verifyJWT,
  requireRole("creator"),
  videoController.deleteVideo
)

router.patch(
  "/:videoId/toggle",
  verifyJWT,
  requireRole("creator"),
  videoController.togglePublishStatus
)

export default router