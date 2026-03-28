import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  addToHistoryAPI,
  getHistoryAPI,
} from "./watchHistoryAPI"

interface HistoryState {
  history: any[]
  loading: boolean
}

const initialState: HistoryState = {
  history: [],
  loading: false,
}

// 🔥 ADD HISTORY
export const addToHistory = createAsyncThunk(
  "history/add",
  async (videoId: string) => {
    await addToHistoryAPI(videoId)
    return videoId
  }
)

// 🔥 GET HISTORY
export const fetchHistory = createAsyncThunk(
  "history/get",
  async () => {
    return await getHistoryAPI()
  }
)

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchHistory.pending, (state) => {
        state.loading = true
      })

      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false
        state.history = action.payload
      })
  },
})

export default historySlice.reducer