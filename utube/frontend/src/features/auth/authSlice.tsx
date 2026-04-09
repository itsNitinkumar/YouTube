import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { AxiosError } from "axios";
import type { User } from "../../types";

/* ================= TYPES ================= */

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  data: {
    user: User;
  };
}

/* ================= INITIAL STATE ================= */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start as true to wait for checkAuth
  error: null,
};

/* ================= THUNKS ================= */

// 🔐 LOGIN
export const login = createAsyncThunk<
  User,
  LoginPayload,
  { rejectValue: string }
>("users/login", async (credentials, thunkAPI) => {
  try {
    const res = await api.post<AuthResponse>("/users/login", credentials);
    return res.data.data.user;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Login failed"
    );
  }
});


// 📝 REGISTER
export const register = createAsyncThunk<
  User,
  RegisterPayload,
  { rejectValue: string }
>("users/register", async (credentials, thunkAPI) => {
  try {
    const res = await api.post<AuthResponse>("/users/register", credentials);
    return res.data.data.user;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Register failed"
    );
  }
});


// 🚪 LOGOUT
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("users/logout", async (_, thunkAPI) => {
  try {
    await api.post("/users/logout"); // backend clears cookie
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Logout failed"
    );
  }
});


// 🔄 CHECK AUTH (VERY IMPORTANT)
export const checkAuth = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("users/checkAuth", async (_, thunkAPI) => {
  try {
    console.log("Making request to /users/me...");
    const res = await api.get<AuthResponse>("/users/me");
    console.log("Response from /users/me:", res.data);
    return res.data.data.user;
  } catch (error: any) {
    console.error("Error in checkAuth:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Not authenticated"
    );
  }
});


/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Register failed";
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;