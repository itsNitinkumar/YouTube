import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCurrentUserAPI,
  updateProfileAPI,
  updateAvatarAPI,
  changePasswordAPI,
  deleteAccountAPI,
} from "./userAPI";
import type { User } from "../../types";

interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
  updateSuccess: boolean;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
  updateSuccess: false,
};

// Get current user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, thunkAPI) => {
    try {
      return await getCurrentUserAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch profile");
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (data: { name?: string; email?: string }, thunkAPI) => {
    try {
      return await updateProfileAPI(data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update profile");
    }
  }
);

// Update avatar
export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (formData: FormData, thunkAPI) => {
    try {
      return await updateAvatarAPI(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update avatar");
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (
    data: { oldPassword: string; newPassword: string },
    thunkAPI
  ) => {
    try {
      return await changePasswordAPI(data);
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to change password");
    }
  }
);

// Delete account
export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (_, thunkAPI) => {
    try {
      return await deleteAccountAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to delete account");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update avatar
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
        state.profile = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUpdateSuccess, clearError } = userSlice.actions;
export default userSlice.reducer;
