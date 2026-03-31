import {Router}  from "express";
import * as  aiController from "./ai.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/generate-title", aiController.titleSuggestion);
router.post("/generate", verifyJWT, aiController.generateSuggestions);
router.post("/generate-from-video", verifyJWT, aiController.generateFromVideo);
router.post("/summary", aiController.generateSummary);

export default router;
