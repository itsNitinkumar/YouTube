import api from "../../services/api";

// Toggle like on video
export const toggleLikeAPI = async (videoId: string) => {
  const res = await api.post(
    `/likes/video/${videoId}`,
    {},
    { withCredentials: true }
  );

  return res.data.data;
};

// Toggle like on comment
export const toggleCommentLikeAPI = async (commentId: string) => {
  const res = await api.post(
    `/likes/comment/${commentId}`,
    {},
    { withCredentials: true }
  );

  return res.data.data;
};

// Get liked videos
export const getLikedVideosAPI = async () => {
  const res = await api.get("/likes/videos", {
    withCredentials: true,
  });

  return res.data.data;
};