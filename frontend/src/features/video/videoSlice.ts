import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchVideosAPI } from "./videoAPI"

interface Video {
  _id: string
  title: string
  thumbnailUrl: string
  creatorId: {
    name: string
  }
}

interface VideoState {
  videos: Video[]
  loading: boolean
  error: string | null
}

const initialState: VideoState = {
  videos: [],
  loading: false,
  error: null,
}

// 🔥 THUNK
export const fetchVideos = createAsyncThunk(
  "video/fetchVideos",
  async (_, thunkAPI) => {
    try {
      return await fetchVideosAPI()
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch videos")
    }
  }
)

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false
        state.videos = action.payload.videos
      })
      .addCase(fetchVideos.rejected, (state) => {
        state.loading = false
        state.error = "Failed to load videos"
      })
  },
})

export default videoSlice.reducer