import api from "../../services/api";
import type { Video } from "../../types";

// Get all videos with pagination
export const fetchVideosAPI = async (params?: {
  cursor?: string;
  category?: string;
  search?: string;
}) => {
  const res = await api.get("/videos", { params });
  return res.data.data;
};

// Get single video by ID
export const getVideoByIdAPI = async (videoId: string) => {
  const res = await api.get(`/videos/${videoId}`);
  return res.data.data;
};

// Get trending videos
export const getTrendingVideosAPI = async () => {
  const res = await api.get("/videos/trending");
  return res.data.data;
};

// Get recommended videos
export const getRecommendedVideosAPI = async () => {
  const res = await api.get("/videos/recommended", {
    withCredentials: true,
  });
  return res.data.data;
};

// Upload/publish video
export const publishVideoAPI = async (formData: FormData) => {
  const res = await api.post("/videos", formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};

// Update video
export const updateVideoAPI = async (
  videoId: string,
  data: Partial<Video>
) => {
  const res = await api.patch(`/videos/${videoId}`, data, {
    withCredentials: true,
  });
  return res.data.data;
};

// Delete video
export const deleteVideoAPI = async (videoId: string) => {
  const res = await api.delete(`/videos/${videoId}`, {
    withCredentials: true,
  });
  return res.data.data;
};

// Toggle publish status
export const togglePublishStatusAPI = async (videoId: string) => {
  const res = await api.patch(
    `/videos/${videoId}/toggle`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};