import api from "../../services/api"

// get comments
export const fetchCommentsAPI = async (videoId: string) => {
  const res = await api.get(`/comments/video/${videoId}`, { withCredentials: true })
  return res.data.data?.result || { comments: [], nextCursor: null }
}

// add comment
export const addCommentAPI = async (
  videoId: string,
  content: string
) => {
  const res = await api.post(`/comments/video/${videoId}`, {
    content,
  }, { withCredentials: true })

  return res.data.data
}