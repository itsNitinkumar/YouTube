import api from "../../services/api";
import type { User } from "../../types";

// Get current user
export const getCurrentUserAPI = async () => {
  const res = await api.get("/users/me", {
    withCredentials: true,
  });
  return res.data.data;
};

// Update user profile
export const updateProfileAPI = async (data: {
  name?: string;
  email?: string;
}) => {
  const res = await api.patch("/users/update", data, {
    withCredentials: true,
  });
  return res.data.data;
};

// Update avatar
export const updateAvatarAPI = async (formData: FormData) => {
  const res = await api.patch("/users/avatar", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};

// Change password
export const changePasswordAPI = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  const res = await api.patch("/users/change-password", data, {
    withCredentials: true,
  });
  return res.data.data;
};

// Delete account
export const deleteAccountAPI = async () => {
  const res = await api.delete("/users/delete", {
    withCredentials: true,
  });
  return res.data.data;
};

// Get all users (admin only)
export const getAllUsersAPI = async () => {
  const res = await api.get("/users", {
    withCredentials: true,
  });
  return res.data.data;
};

// Block/unblock user (admin only)
export const toggleBlockUserAPI = async (userId: string) => {
  const res = await api.patch(
    `/users/block/${userId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};

// Refresh token
export const refreshTokenAPI = async () => {
  const res = await api.post("/users/refresh", {}, {
    withCredentials: true,
  });
  return res.data.data;
};
