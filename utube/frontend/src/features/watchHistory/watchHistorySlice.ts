import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addToHistoryAPI, getHistoryAPI } from "./watchHistoryAPI";
import type { WatchHistory } from "../../types";

interface HistoryState {
  history: WatchHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  history: [],
  loading: false,
  error: null,
};

// 🔥 ADD HISTORY
export const addToHistory = createAsyncThunk(
  "history/add",
  async (videoId: string, thunkAPI) => {
    try {
      await addToHistoryAPI(videoId);
      return videoId;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to add to history");
    }
  }
);

// 🔥 GET HISTORY
export const fetchHistory = createAsyncThunk(
  "history/get",
  async (_, thunkAPI) => {
    try {
      return await getHistoryAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch history");
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to load history";
      });
  },
});

export default historySlice.reducer;