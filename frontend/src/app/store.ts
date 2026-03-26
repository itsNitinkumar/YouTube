import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import videoReducer from "../features/video/videoSlice";
import commentReducer from "../features/comment/commentSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        comment: commentReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

