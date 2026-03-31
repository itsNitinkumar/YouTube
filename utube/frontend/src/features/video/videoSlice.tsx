import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchVideosAPI,
  getVideoByIdAPI,
  getTrendingVideosAPI,
  getRecommendedVideosAPI,
  publishVideoAPI,
  updateVideoAPI,
  deleteVideoAPI,
} from "./videoAPI";
import { toggleLike } from "../like/likeSlice";
import type { Video } from "../../types";

interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  trendingVideos: Video[];
  recommendedVideos: Video[];
  loading: boolean;
  error: string | null;
  uploadSuccess: boolean;
}

const initialState: VideoState = {
  videos: [],
  currentVideo: null,
  trendingVideos: [],
  recommendedVideos: [],
  loading: false,
  error: null,
  uploadSuccess: false,
};

// Fetch all videos
export const fetchVideos = createAsyncThunk(
  "video/fetchVideos",
  async (
    params: { cursor?: string; category?: string; search?: string } = {},
    thunkAPI
  ) => {
    try {
      return await fetchVideosAPI(params);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch videos");
    }
  }
);

// Get single video
export const fetchVideoById = createAsyncThunk(
  "video/fetchById",
  async (videoId: string, thunkAPI) => {
    try {
      return await getVideoByIdAPI(videoId);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch video");
    }
  }
);

// Get trending videos
export const fetchTrendingVideos = createAsyncThunk(
  "video/fetchTrending",
  async (_, thunkAPI) => {
    try {
      return await getTrendingVideosAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch trending videos");
    }
  }
);

// Get recommended videos
export const fetchRecommendedVideos = createAsyncThunk(
  "video/fetchRecommended",
  async (_, thunkAPI) => {
    try {
      return await getRecommendedVideosAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch recommended videos");
    }
  }
);

// Publish video
export const publishVideo = createAsyncThunk(
  "video/publish",
  async (formData: FormData, thunkAPI) => {
    try {
      return await publishVideoAPI(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to publish video");
    }
  }
);

// Update video
export const updateVideo = createAsyncThunk(
  "video/update",
  async (
    { videoId, data }: { videoId: string; data: Partial<Video> },
    thunkAPI
  ) => {
    try {
      return await updateVideoAPI(videoId, data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update video");
    }
  }
);

// Delete video
export const deleteVideo = createAsyncThunk(
  "video/delete",
  async (videoId: string, thunkAPI) => {
    try {
      await deleteVideoAPI(videoId);
      return videoId;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete video");
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    clearUploadSuccess: (state) => {
      state.uploadSuccess = false;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch videos
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload.videos || action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load videos";
      })

      // Fetch single video
      .addCase(fetchVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch trending
      .addCase(fetchTrendingVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingVideos = action.payload;
      })
      .addCase(fetchTrendingVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch recommended
      .addCase(fetchRecommendedVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedVideos = action.payload;
      })
      .addCase(fetchRecommendedVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Publish video
      .addCase(publishVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadSuccess = false;
      })
      .addCase(publishVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.videos.unshift(action.payload);
        state.uploadSuccess = true;
      })
      .addCase(publishVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update video
      .addCase(updateVideo.fulfilled, (state, action) => {
        const index = state.videos.findIndex((v) => v._id === action.payload._id);
        if (index !== -1) {
          state.videos[index] = action.payload;
        }
        if (state.currentVideo?._id === action.payload._id) {
          state.currentVideo = action.payload;
        }
      })

      // Delete video
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v._id !== action.payload);
        if (state.currentVideo?._id === action.payload) {
          state.currentVideo = null;
        }
      })

      // Handle like toggle
      .addCase(toggleLike.fulfilled, (state, action: any) => {
        const { isLiked, likesCount } = action.payload;
        const videoId = action.meta.arg;

        // Update in videos list
        const video = state.videos.find((v) => v._id === videoId);
        if (video) {
          video.isLiked = isLiked;
          video.likesCount = likesCount;
        }

        // Update current video
        if (state.currentVideo && state.currentVideo._id === videoId) {
          state.currentVideo.isLiked = isLiked;
          state.currentVideo.likesCount = likesCount;
        }
      });
  },
});

export const { clearUploadSuccess, clearCurrentVideo } = videoSlice.actions;
export default videoSlice.reducer;