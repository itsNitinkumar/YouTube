import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toggleSubscribeAPI } from "./subscriptionAPI"

interface SubscriptionState {
  loading: boolean
}

const initialState: SubscriptionState = {
  loading: false,
}

export const toggleSubscribe = createAsyncThunk(
  "subscription/toggle",
  async (creatorId: string) => {
    return await toggleSubscribeAPI(creatorId)
  }
)

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(toggleSubscribe.pending, (state) => {
        state.loading = true
      })
      .addCase(toggleSubscribe.fulfilled, (state) => {
        state.loading = false
      })
  },
})

export default subscriptionSlice.reducer