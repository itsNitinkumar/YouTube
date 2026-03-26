import api from "../../services/api"

// get comments
export const fetchCommentsAPI = async (videoId: string) => {
  const res = await api.get(`/comments/${videoId}`)
  return res.data.data
}

// add comment
export const addCommentAPI = async (
  videoId: string,
  content: string
) => {
  const res = await api.post(`/comments/${videoId}`, {
    content,
  })
  return res.data.data
}