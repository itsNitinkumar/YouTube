import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import videoReducer from "../features/video/videoSlice";
import commentReducer from "../features/comment/commentSlice";
import likeReducer from "../features/like/likeSlice";
import historyReducer from "../features/watchHistory/watchHistorySlice";
import subscriptionReducer from "../features/subscription/subscriptionSlice";
import notificationReducer from "../features/notification/notificationSlice";
import userReducer from "../features/user/userSlice";
import planReducer from "../features/plan/planSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import aiReducer from "../features/ai/aiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer,
    comment: commentReducer,
    like: likeReducer,
    history: historyReducer,
    subscription: subscriptionReducer,
    notification: notificationReducer,
    user: userReducer,
    plan: planReducer,
    dashboard: dashboardReducer,
    ai: aiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

