import api from "../../services/api";

// Get comments for a video
export const fetchCommentsAPI = async (videoId: string) => {
  const res = await api.get(`/comments/video/${videoId}`, {
    withCredentials: true,
  });
  return res.data.data?.result || { comments: [], nextCursor: null };
};

// Add comment to video
export const addCommentAPI = async (videoId: string, content: string) => {
  const res = await api.post(
    `/comments/video/${videoId}`,
    {
      content,
    },
    { withCredentials: true }
  );

  return res.data.data;
};

// Update comment
export const updateCommentAPI = async (commentId: string, content: string) => {
  const res = await api.patch(
    `/comments/${commentId}`,
    {
      content,
    },
    { withCredentials: true }
  );

  return res.data.data;
};

// Delete comment
export const deleteCommentAPI = async (commentId: string) => {
  const res = await api.delete(`/comments/${commentId}`, {
    withCredentials: true,
  });

  return res.data.data;
};