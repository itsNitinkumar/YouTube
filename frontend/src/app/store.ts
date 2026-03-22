import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import videoReducer from "../features/slices/videoSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
    },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

