import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchNotificationsAPI } from "./notificationAPI"

interface Notification {
  _id: string
  message: string
}

interface NotificationState {
  notifications: Notification[]
}

const initialState: NotificationState = {
  notifications: [],
}

export const fetchNotifications = createAsyncThunk(
  "notification/get",
  async () => {
    return await fetchNotificationsAPI()
  }
)

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload
    })
  },
})

export const { addNotification } = notificationSlice.actions
export default notificationSlice.reducer