import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNotificationsAPI,
  getUnreadCountAPI,
  markNotificationAsReadAPI,
  markAllAsReadAPI,
} from "./notificationAPI";
import type { Notification } from "../../types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notification/get",
  async (_, thunkAPI) => {
    try {
      return await fetchNotificationsAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch notifications");
    }
  }
);

// Get unread count
export const fetchUnreadCount = createAsyncThunk(
  "notification/unreadCount",
  async (_, thunkAPI) => {
    try {
      return await getUnreadCountAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch unread count");
    }
  }
);

// Mark single as read
export const markAsRead = createAsyncThunk(
  "notification/markRead",
  async (notificationId: string, thunkAPI) => {
    try {
      await markNotificationAsReadAPI(notificationId);
      return notificationId;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to mark as read");
    }
  }
);

// Mark all as read
export const markAllRead = createAsyncThunk(
  "notification/markAllRead",
  async (_, thunkAPI) => {
    try {
      await markAllAsReadAPI();
      return;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to mark all as read");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to load notifications";
      })

      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload
        );
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark all as read
      .addCase(markAllRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;