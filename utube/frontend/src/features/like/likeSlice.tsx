import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  toggleLikeAPI,
  toggleCommentLikeAPI,
  getLikedVideosAPI,
} from "./likeAPI";
import type { Video } from "../../types";

interface LikeState {
  likedVideos: Video[];
  loading: boolean;
  error: string | null;
}

const initialState: LikeState = {
  likedVideos: [],
  loading: false,
  error: null,
};

// Toggle video like
export const toggleLike = createAsyncThunk(
  "like/toggle",
  async (videoId: string, thunkAPI) => {
    try {
      return await toggleLikeAPI(videoId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to toggle like");
    }
  }
);

// Toggle comment like
export const toggleCommentLike = createAsyncThunk(
  "like/toggleComment",
  async (commentId: string, thunkAPI) => {
    try {
      return await toggleCommentLikeAPI(commentId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to toggle comment like");
    }
  }
);

// Get liked videos
export const fetchLikedVideos = createAsyncThunk(
  "like/fetchLiked",
  async (_, thunkAPI) => {
    try {
      return await getLikedVideosAPI();
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to fetch liked videos");
    }
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Toggle video like
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleLike.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle comment like
      .addCase(toggleCommentLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleCommentLike.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch liked videos
      .addCase(fetchLikedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.likedVideos = action.payload;
      })
      .addCase(fetchLikedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default likeSlice.reducer;