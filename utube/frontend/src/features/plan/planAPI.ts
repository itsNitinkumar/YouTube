import api from "../../services/api";

export interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: {
    uploadLimit: number;
    analyticsAccess: boolean;
    adFree: boolean;
    aiTools: boolean;
  };
  createdAt: string;
}

// Get all plans
export const getPlansAPI = async () => {
  const res = await api.get("/plans", {
    withCredentials: true,
  });
  return res.data.data;
};

// Create plan (admin only)
export const createPlanAPI = async (data: {
  name: string;
  price: number;
  features: string[];
  duration: number;
}) => {
  const res = await api.post("/plans", data, {
    withCredentials: true,
  });
  return res.data.data;
};

// Subscribe to plan
export const subscribeToPlanAPI = async (planId: string) => {
  const res = await api.post(
    "/subscriptions/subscribe",
    { planId },
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};
