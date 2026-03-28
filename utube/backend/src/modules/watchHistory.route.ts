import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import * as watchHistoryRoute from "./watchHistory.controller"
const router = Router();
router.post("/track", verifyJWT, watchHistoryRoute.trackWatch);
router.get("/", verifyJWT, watchHistoryRoute.getWatchHistory);
router.delete("/:videoId", verifyJWT, watchHistoryRoute.deleteWatchHistory);
router.delete("/clear", verifyJWT, watchHistoryRoute.clearWatchHistory);
router.get("/resume/:videoId", verifyJWT, watchHistoryRoute.resumePlayback);
export default router;