import { Router } from "express"
import { verifyJWT } from "../../middlewares/auth.middleware"
import * as videoController from "./video.controller"
import { uploadImage, uploadMedia } from "../../middlewares/upload.middleware"

const router = Router()

router.get("/", videoController.getAllVideos)
router.get("/trending", videoController.getTrendingVideos)
router.get("/recommended", verifyJWT, videoController.getRecommendedVideos)
router.get("/:videoId", videoController.getVideoById)

// Upload video and thumbnail - any authenticated user can upload
router.post(
  "/upload",
  verifyJWT,
  uploadMedia.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  videoController.uploadVideo
)

// Publish video (metadata only) - any authenticated user can publish
router.post(
  "/",
  verifyJWT,
  uploadImage.single("thumbnail"),
  videoController.publishVideo
)

// Update/delete only your own videos
router.patch(
  "/:videoId",
  verifyJWT,
  videoController.updateVideo
)

router.delete(
  "/:videoId",
  verifyJWT,
  videoController.deleteVideo
)

router.patch(
  "/:videoId/toggle",
  verifyJWT,
  videoController.togglePublishStatus
)

export default router