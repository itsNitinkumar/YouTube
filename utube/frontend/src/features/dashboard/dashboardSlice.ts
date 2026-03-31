import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnalyticsAPI, getVideoStatsAPI } from "./dashboardAPI";
import type { DashboardAnalytics, VideoStats } from "./dashboardAPI";

interface DashboardState {
  analytics: DashboardAnalytics | null;
  videoStats: VideoStats[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  analytics: null,
  videoStats: [],
  loading: false,
  error: null,
};

// Get analytics
export const fetchAnalytics = createAsyncThunk(
  "dashboard/fetchAnalytics",
  async (_, thunkAPI) => {
    try {
      return await getAnalyticsAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch analytics");
    }
  }
);

// Get video stats
export const fetchVideoStats = createAsyncThunk(
  "dashboard/fetchVideoStats",
  async (_, thunkAPI) => {
    try {
      return await getVideoStatsAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch video stats");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch video stats
      .addCase(fetchVideoStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoStats.fulfilled, (state, action) => {
        state.loading = false;
        state.videoStats = action.payload;
      })
      .addCase(fetchVideoStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
