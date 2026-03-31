import api from "../../services/api";

export interface DashboardAnalytics {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  totalSubscribers: number;
  recentVideos: any[];
}

export interface VideoStats {
  videoId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  watchTime: number;
}

// Get creator analytics
export const getAnalyticsAPI = async () => {
  const res = await api.get("/dashboard/analytics", {
    withCredentials: true,
  });
  return res.data.data;
};

// Get video statistics
export const getVideoStatsAPI = async () => {
  const res = await api.get("/dashboard/video-stats", {
    withCredentials: true,
  });
  return res.data.data;
};
