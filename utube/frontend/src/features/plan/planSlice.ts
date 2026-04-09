import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPlansAPI, subscribeToPlanAPI } from "./planAPI";
import type { Plan } from "./planAPI";

interface PlanState {
  plans: Plan[];
  currentPlan: Plan | null;
  loading: boolean;
  error: string | null;
  subscribeSuccess: boolean;
}

const initialState: PlanState = {
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
  subscribeSuccess: false,
};

// Fetch all plans
export const fetchPlans = createAsyncThunk(
  "plan/fetchPlans",
  async (_, thunkAPI) => {
    try {
      return await getPlansAPI();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch plans"
      );
    }
  }
);

// Subscribe to plan
export const subscribeToPlan = createAsyncThunk(
  "plan/subscribe",
  async (planId: string, thunkAPI) => {
    try {
      return await subscribeToPlanAPI(planId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to subscribe to plan"
      );
    }
  }
);

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    clearSubscribeSuccess: (state) => {
      state.subscribeSuccess = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch plans";
      })

      // Subscribe to plan
      .addCase(subscribeToPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.subscribeSuccess = false;
      })
      .addCase(subscribeToPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
        state.subscribeSuccess = true;
      })
      .addCase(subscribeToPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to subscribe to plan";
        state.subscribeSuccess = false;
      });
  },
});

export const { clearSubscribeSuccess, clearError } = planSlice.actions;
export default planSlice.reducer;
