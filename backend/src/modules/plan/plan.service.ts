import { Plan } from "./plan.model";
export const createPlanService = async (data: any) => {

  const plan = await Plan.create(data)
}

export const getPlansService = async () => {
  const plans = await Plan.find();
  return plans
}