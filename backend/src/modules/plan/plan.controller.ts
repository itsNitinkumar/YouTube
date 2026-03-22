import { Request, Response } from "express"
import * as planService from "./plan.service"
import { PlanSchema } from "./plan.validation"
import { ApiResponse } from "../../utils/ApiResponse"
import { asyncHandler } from "../../utils/asyncHandler"

export const createPlan = asyncHandler(
  async (req: Request, res: Response) => {

    const parsed = PlanSchema.parse(req.body)

    const plan = await planService.createPlanService(parsed)

    res.status(201).json(
      new ApiResponse(true, "Plan created", plan)
    )
  }
)

export const getPlans = asyncHandler(
  async (req: Request, res: Response) => {

    const plans = await planService.getPlansService()

    res.json(
      new ApiResponse(true, "Plans fetched", plans)
    )
  }
)