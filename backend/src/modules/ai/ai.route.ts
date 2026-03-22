import {Router}  from "express";
import * as  aiController from "./ai.controller";

const router = Router();

router.post("/generate-title", aiController.titleSuggestion);

export default router;
