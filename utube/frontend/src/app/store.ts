import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import videoReducer from "../features/video/videoSlice";
import commentReducer from "../features/comment/commentSlice";
import likeReducer from "../features/like/likeSlice";
import historyReducer from "../features/watchHistory/watchHistorySlice"
import  SubscriptionReducer  from "../features/subscription/subscriptionSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        comment: commentReducer,
        like: likeReducer,
        history: historyReducer,
        subscription: SubscriptionReducer
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

