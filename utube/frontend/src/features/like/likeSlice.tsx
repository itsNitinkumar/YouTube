import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toggleLikeAPI } from "./likeAPI"

interface LikeState {
  loading: boolean
  error: string | null
}

const initialState: LikeState = {
  loading: false,
  error: null,
}

// 🔥 thunk
export const toggleLike = createAsyncThunk(
  "like/toggle",
  async (videoId: string, thunkAPI) => {
    try {
      return await toggleLikeAPI(videoId)
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Failed to toggle like")
    }
  }
)

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.pending, (state) => {
        state.loading = true
      })
      .addCase(toggleLike.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default likeSlice.reducer